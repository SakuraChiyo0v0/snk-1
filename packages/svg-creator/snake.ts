import { getSnakeLength, snakeToCells } from "@snk/types/snake";
import type { Snake } from "@snk/types/snake";
import type { Point } from "@snk/types/point";
import { h } from "./xml-utils";
import { createAnimation } from "./css-utils";

export type SnakeHeadPixels = {
  size: number;
  /** row-major; null = outside circular crop */
  colors: (string | null)[];
};

export type Options = {
  colorSnake: string;
  sizeCell: number;
  sizeDot: number;
  /**
   * Pixel mosaic for snake head. Used instead of <image> because GitHub README
   * loads SVG via <img>, and browsers block nested images inside SVG-as-img.
   */
  snakeHeadPixels?: SnakeHeadPixels;
};

const lerp = (k: number, a: number, b: number) => (1 - k) * a + k * b;

const createHeadMosaic = (
  pixels: SnakeHeadPixels,
  m: number,
  s: number,
  className: string,
) => {
  const n = pixels.size;
  const pw = s / n;
  const rects: string[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const color = pixels.colors[y * n + x];
      if (!color) continue;
      rects.push(
        h("rect", {
          x: (m + x * pw).toFixed(2),
          y: (m + y * pw).toFixed(2),
          width: (pw + 0.05).toFixed(2),
          height: (pw + 0.05).toFixed(2),
          fill: color,
        }),
      );
    }
  }
  return `<g class="${className}">${rects.join("")}</g>`;
};

export const createSnake = (
  chain: Snake[],
  { sizeCell, sizeDot, snakeHeadPixels }: Options,
  duration: number,
) => {
  const snakeN = chain[0] ? getSnakeLength(chain[0]) : 0;

  const snakeParts: Point[][] = Array.from({ length: snakeN }, () => []);

  for (const snake of chain) {
    const cells = snakeToCells(snake);
    for (let i = cells.length; i--; ) snakeParts[i].push(cells[i]);
  }

  const svgElements = snakeParts.map((_, i, { length }) => {
    // compute snake part size
    const dMin = sizeDot * 0.8;
    const dMax = sizeCell * 0.9;
    const iMax = Math.min(4, length);
    const u = (1 - Math.min(i, iMax) / iMax) ** 2;
    const s = lerp(u, dMin, dMax);

    const m = (sizeCell - s) / 2;

    const r = Math.min(4.5, (4 * s) / sizeDot);

    // head = index 0
    if (i === 0 && snakeHeadPixels) {
      return createHeadMosaic(snakeHeadPixels, m, s, `s s${i}`);
    }

    return h("rect", {
      class: `s s${i}`,
      x: m.toFixed(1),
      y: m.toFixed(1),
      width: s.toFixed(1),
      height: s.toFixed(1),
      rx: r.toFixed(1),
      ry: r.toFixed(1),
    });
  });

  const transform = ({ x, y }: Point) =>
    `transform:translate(${x * sizeCell}px,${y * sizeCell}px)`;

  const styles = [
    `.s{
      shape-rendering: geometricPrecision;
      animation: none linear ${duration}ms infinite
    }`,
    // only body segments (rect.s) use snake color; head mosaic keeps pixel fills
    `rect.s{ fill: var(--cs) }`,

    ...snakeParts.map((positions, i) => {
      const id = `s${i}`;
      const animationName = id;

      const keyframes = removeInterpolatedPositions(
        positions.map((tr, i, { length }) => ({ ...tr, t: i / length })),
      ).map(({ t, ...p }) => ({ t, style: transform(p) }));

      return [
        createAnimation(animationName, keyframes),

        `.s.${id}{
          ${transform(positions[0])};
          animation-name: ${animationName}
        }`,
      ];
    }),
  ].flat();

  return { svgElements, styles };
};

const removeInterpolatedPositions = <T extends Point>(arr: T[]) =>
  arr.filter((u, i, arr) => {
    if (i - 1 < 0 || i + 1 >= arr.length) return true;

    const a = arr[i - 1];
    const b = arr[i + 1];

    const ex = (a.x + b.x) / 2;
    const ey = (a.y + b.y) / 2;

    // return true;
    return !(Math.abs(ex - u.x) < 0.01 && Math.abs(ey - u.y) < 0.01);
  });
