import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import type { SnakeHeadPixels } from "@snk/svg-creator/snake";

const decodeImage = (buf: Buffer, contentType: string) => {
  if (contentType.includes("png")) {
    const png = PNG.sync.read(buf);
    return { width: png.width, height: png.height, data: png.data };
  }
  // GitHub avatars are usually jpeg; also try jpeg for octet-stream
  const decoded = jpeg.decode(buf, { useTArray: true, maxMemoryUsageInMB: 50 });
  if (!decoded?.data) throw new Error("failed to decode avatar image");
  return {
    width: decoded.width,
    height: decoded.height,
    data: Buffer.from(decoded.data),
  };
};

/** Sample avatar into a circular pixel mosaic embeddable as SVG rects. */
export const bufferToSnakeHeadPixels = (
  buf: Buffer,
  contentType: string,
  outSize = 24,
): SnakeHeadPixels => {
  const { width, height, data } = decodeImage(buf, contentType);
  const colors: (string | null)[] = [];
  const r2 = (outSize / 2) * (outSize / 2);

  for (let y = 0; y < outSize; y++) {
    for (let x = 0; x < outSize; x++) {
      const dx = x + 0.5 - outSize / 2;
      const dy = y + 0.5 - outSize / 2;
      if (dx * dx + dy * dy > r2) {
        colors.push(null);
        continue;
      }
      const sx = Math.min(width - 1, Math.floor(((x + 0.5) / outSize) * width));
      const sy = Math.min(
        height - 1,
        Math.floor(((y + 0.5) / outSize) * height),
      );
      const i = (sy * width + sx) * 4;
      colors.push(`rgb(${data[i]},${data[i + 1]},${data[i + 2]})`);
    }
  }

  return { size: outSize, colors };
};
