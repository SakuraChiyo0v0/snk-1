import * as fs from "node:fs";
import * as path from "node:path";
import { generateSnakeAnimation } from "generate-snake-animation/generateSnakeAnimation";
import { parseOutputsOption } from "generate-snake-animation/outputsOptions";
import * as githubAction from "./github-action";
import { bufferToSnakeHeadPixels } from "./avatarPixels";

const fetchAvatarPixels = async (username: string, token?: string) => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "snk-avatar-head",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });
  if (!userRes.ok) {
    throw new Error(`failed to fetch user ${username}: ${userRes.status}`);
  }
  const user = (await userRes.json()) as { avatar_url?: string };
  if (!user.avatar_url) {
    throw new Error(`no avatar_url for ${username}`);
  }

  const avatarUrl = `${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}s=64`;
  const imgRes = await fetch(avatarUrl, {
    headers: { "User-Agent": "snk-avatar-head" },
  });
  if (!imgRes.ok) {
    throw new Error(`failed to fetch avatar image: ${imgRes.status}`);
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";
  return bufferToSnakeHeadPixels(buf, contentType, 24);
};

(async () => {
  try {
    const userName = githubAction.getInput("github_user_name");
    const githubToken =
      process.env.GITHUB_TOKEN ?? githubAction.getInput("github_token");

    const outputsRaw = [
      ...githubAction.getInput("outputs").split("\n"),
      //
      // legacy
      githubAction.getInput("gif_out_path"),
      githubAction.getInput("svg_out_path"),
    ]
      .map((x) => x.trim())
      .filter(Boolean);

    const outputs = parseOutputsOption(outputsRaw);

    console.log(`🖼️  fetching GitHub avatar pixels for ${userName}`);
    const snakeHeadPixels = await fetchAvatarPixels(userName, githubToken);
    for (const out of outputs) {
      if (out) out.drawOptions.snakeHeadPixels = snakeHeadPixels;
    }

    const results = await generateSnakeAnimation(
      { platform: "github", username: userName, githubToken },
      outputs,
    );

    outputs.forEach((out, i) => {
      const result = results[i];
      if (out?.filename && result) {
        console.log(`💾 writing to ${out?.filename}`);
        fs.mkdirSync(path.dirname(out?.filename), { recursive: true });
        fs.writeFileSync(out?.filename, result);
      }
    });
  } catch (e: any) {
    githubAction.setFailed(`Action failed with "${e.message}"`);
  }
})();
