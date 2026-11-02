var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  if (mod && typeof mod === "object" || typeof mod === "function") {
    for (let key of __getOwnPropNames(mod))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: __accessProp.bind(mod, key),
          enumerable: true
        });
  }
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __esm = (fn, res, err) => () => {
  if (fn)
    try {
      res = fn(fn = 0);
    } catch (e) {
      err = [e];
    }
  if (err)
    throw err[0];
  return res;
};

// ../types/grid.ts
var isInside = (grid, x, y) => x >= 0 && y >= 0 && x < grid.width && y < grid.height, isInsideLarge = (grid, m, x, y) => x >= -m && y >= -m && x < grid.width + m && y < grid.height + m, copyGrid = ({ width, height, data }) => ({
  width,
  height,
  data: Uint8Array.from(data)
}), getIndex = (grid, x, y) => x * grid.height + y, getColor = (grid, x, y) => grid.data[getIndex(grid, x, y)], isEmpty = (color) => color === 0, setColor = (grid, x, y, color) => {
  grid.data[getIndex(grid, x, y)] = color || 0;
}, setColorEmpty = (grid, x, y) => {
  setColor(grid, x, y, 0);
}, createEmptyGrid = (width, height) => ({
  width,
  height,
  data: new Uint8Array(width * height)
});

// ../types/snake.ts
var getHeadX = (snake) => snake[0] - 2, getHeadY = (snake) => snake[1] - 2, getSnakeLength = (snake) => snake.length / 2, snakeEquals = (a, b) => {
  for (let i = 0;i < a.length; i++)
    if (a[i] !== b[i])
      return false;
  return true;
}, nextSnake = (snake, dx, dy) => {
  const copy = new Uint8Array(snake.length);
  for (let i = 2;i < snake.length; i++)
    copy[i] = snake[i - 2];
  copy[0] = snake[0] + dx;
  copy[1] = snake[1] + dy;
  return copy;
}, snakeWillSelfCollide = (snake, dx, dy) => {
  const nx = snake[0] + dx;
  const ny = snake[1] + dy;
  for (let i = 2;i < snake.length - 2; i += 2)
    if (snake[i + 0] === nx && snake[i + 1] === ny)
      return true;
  return false;
}, snakeToCells = (snake) => Array.from({ length: snake.length / 2 }, (_, i) => ({
  x: snake[i * 2 + 0] - 2,
  y: snake[i * 2 + 1] - 2
})), createSnakeFromCells = (points) => {
  const snake = new Uint8Array(points.length * 2);
  for (let i = points.length;i--; ) {
    snake[i * 2 + 0] = points[i].x + 2;
    snake[i * 2 + 1] = points[i].y + 2;
  }
  return snake;
};

// ../svg-creator/xml-utils.ts
var h = (element, attributes) => `<${element} ${toAttribute(attributes)}/>`, toAttribute = (o) => Object.entries(o).filter(([, value]) => value !== null).map(([name, value]) => `${name}="${value}"`).join(" ");

// ../svg-creator/css-utils.ts
var percent = (x) => parseFloat((x * 100).toFixed(2)).toString() + "%", mergeKeyFrames = (keyframes) => {
  const s = new Map;
  for (const { t, style } of keyframes) {
    s.set(style, [...s.get(style) ?? [], t]);
  }
  return Array.from(s.entries()).map(([style, ts]) => ({ style, ts })).sort((a, b) => a.ts[0] - b.ts[0]);
}, createAnimation = (name, keyframes) => `@keyframes ${name}{` + mergeKeyFrames(keyframes).map(({ style, ts }) => ts.map(percent).join(",") + `{${style}}`).join("") + "}", minifyCss = (css) => css.replace(/\s+/g, " ").replace(/.\s+[,;:{}()]/g, (a) => a.replace(/\s+/g, "")).replace(/[,;:{}()]\s+./g, (a) => a.replace(/\s+/g, "")).replace(/.\s+[,;:{}()]/g, (a) => a.replace(/\s+/g, "")).replace(/[,;:{}()]\s+./g, (a) => a.replace(/\s+/g, "")).replace(/\;\s*\}/g, "}").trim();

// ../svg-creator/snake.ts
var lerp = (k, a, b) => (1 - k) * a + k * b, createHeadMosaic = (pixels, m, s, className) => {
  const n = pixels.size;
  const pw = s / n;
  const rects = [];
  for (let y = 0;y < n; y++) {
    for (let x = 0;x < n; x++) {
      const color = pixels.colors[y * n + x];
      if (!color)
        continue;
      rects.push(h("rect", {
        x: (m + x * pw).toFixed(2),
        y: (m + y * pw).toFixed(2),
        width: (pw + 0.05).toFixed(2),
        height: (pw + 0.05).toFixed(2),
        fill: color
      }));
    }
  }
  return `<g class="${className}">${rects.join("")}</g>`;
}, createSnake = (chain, { sizeCell, sizeDot, snakeHeadPixels }, duration) => {
  const snakeN = chain[0] ? getSnakeLength(chain[0]) : 0;
  const snakeParts = Array.from({ length: snakeN }, () => []);
  for (const snake of chain) {
    const cells = snakeToCells(snake);
    for (let i = cells.length;i--; )
      snakeParts[i].push(cells[i]);
  }
  const svgElements = snakeParts.map((_, i, { length }) => {
    const dMin = sizeDot * 0.8;
    const dMax = sizeCell * 0.9;
    const iMax = Math.min(4, length);
    const u = (1 - Math.min(i, iMax) / iMax) ** 2;
    const s = lerp(u, dMin, dMax);
    const m = (sizeCell - s) / 2;
    const r = Math.min(4.5, 4 * s / sizeDot);
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
      ry: r.toFixed(1)
    });
  });
  const transform = ({ x, y }) => `transform:translate(${x * sizeCell}px,${y * sizeCell}px)`;
  const styles = [
    `.s{
      shape-rendering: geometricPrecision;
      animation: none linear ${duration}ms infinite
    }`,
    `rect.s{ fill: var(--cs) }`,
    ...snakeParts.map((positions, i) => {
      const id = `s${i}`;
      const animationName = id;
      const keyframes = removeInterpolatedPositions(positions.map((tr, i, { length }) => ({ ...tr, t: i / length }))).map(({ t, ...p }) => ({ t, style: transform(p) }));
      return [
        createAnimation(animationName, keyframes),
        `.s.${id}{
          ${transform(positions[0])};
          animation-name: ${animationName}
        }`
      ];
    })
  ].flat();
  return { svgElements, styles };
}, removeInterpolatedPositions = (arr) => arr.filter((u, i, arr) => {
  if (i - 1 < 0 || i + 1 >= arr.length)
    return true;
  const a = arr[i - 1];
  const b = arr[i + 1];
  const ex = (a.x + b.x) / 2;
  const ey = (a.y + b.y) / 2;
  return !(Math.abs(ex - u.x) < 0.01 && Math.abs(ey - u.y) < 0.01);
});
var init_snake = () => {};

// ../svg-creator/grid.ts
var createGrid = (cells, { sizeDotBorderRadius, sizeDot, sizeCell }, duration) => {
  const svgElements = [];
  const styles = [
    `.c{
      shape-rendering: geometricPrecision;
      fill: var(--ce);
      stroke-width: 1px;
      stroke: var(--cb);
      animation: none ${duration}ms linear infinite;
      width: ${sizeDot}px;
      height: ${sizeDot}px;
    }`
  ];
  let i = 0;
  for (const { x, y, color, t } of cells) {
    const id = t && "c" + (i++).toString(36);
    const m = (sizeCell - sizeDot) / 2;
    if (t !== null && id) {
      const animationName = id;
      styles.push(createAnimation(animationName, [
        { t: t - 0.0001, style: `fill:var(--c${color})` },
        { t: t + 0.0001, style: `fill:var(--ce)` },
        { t: 1, style: `fill:var(--ce)` }
      ]), `.c.${id}{
          fill: var(--c${color});
          animation-name: ${animationName}
        }`);
    }
    svgElements.push(h("rect", {
      class: ["c", id].filter(Boolean).join(" "),
      x: x * sizeCell + m,
      y: y * sizeCell + m,
      rx: sizeDotBorderRadius,
      ry: sizeDotBorderRadius
    }));
  }
  return { svgElements, styles };
};
var init_grid = () => {};

// ../svg-creator/stack.ts
var createStack = (cells, { sizeDot }, width, y, duration) => {
  const svgElements = [];
  const styles = [
    `.u{ 
      transform-origin: 0 0;
      transform: scale(0,1);
      animation: none linear ${duration}ms infinite;
    }`
  ];
  const stack = cells.slice().filter((a) => a.t !== null).sort((a, b) => a.t - b.t);
  const blocks = [];
  stack.forEach(({ color, t }) => {
    const latest = blocks[blocks.length - 1];
    if (latest?.color === color)
      latest.ts.push(t);
    else
      blocks.push({ color, ts: [t] });
  });
  const m = width / stack.length;
  let i = 0;
  let nx = 0;
  for (const { color, ts } of blocks) {
    const id = "u" + (i++).toString(36);
    const animationName = id;
    const x = (nx * m).toFixed(1);
    nx += ts.length;
    svgElements.push(h("rect", {
      class: `u ${id}`,
      height: sizeDot,
      width: (ts.length * m + 0.6).toFixed(1),
      x,
      y
    }));
    styles.push(createAnimation(animationName, [
      ...ts.map((t, i, { length }) => [
        { scale: i / length, t: t - 0.0001 },
        { scale: (i + 1) / length, t: t + 0.0001 }
      ]).flat(),
      { scale: 1, t: 1 }
    ].map(({ scale, t }) => ({
      t,
      style: `transform:scale(${scale.toFixed(3)},1)`
    }))), `.u.${id} {
        fill: var(--c${color});
        animation-name: ${animationName};
        transform-origin: ${x}px 0
      }
      `);
  }
  return { svgElements, styles };
};
var init_stack = () => {};

// ../svg-creator/index.ts
var getCellsFromGrid = ({ width, height }) => Array.from({ length: width }, (_, x) => Array.from({ length: height }, (_, y) => ({ x, y }))).flat(), createLivingCells = (grid0, chain, cells) => {
  const livingCells = (cells ?? getCellsFromGrid(grid0)).map(({ x, y }) => ({
    x,
    y,
    t: null,
    color: getColor(grid0, x, y)
  }));
  const grid = copyGrid(grid0);
  for (let i = 0;i < chain.length; i++) {
    const snake = chain[i];
    const x = getHeadX(snake);
    const y = getHeadY(snake);
    if (isInside(grid, x, y) && !isEmpty(getColor(grid, x, y))) {
      setColorEmpty(grid, x, y);
      const cell = livingCells.find((c) => c.x === x && c.y === y);
      cell.t = i / chain.length;
    }
  }
  return livingCells;
}, createSvg = (grid, cells, chain, drawOptions, animationOptions) => {
  const width = (grid.width + 2) * drawOptions.sizeCell;
  const height = (grid.height + 5) * drawOptions.sizeCell;
  const duration = animationOptions.stepDurationMs * chain.length;
  const livingCells = createLivingCells(grid, chain, cells);
  const elements = [
    createGrid(livingCells, drawOptions, duration),
    createStack(livingCells, drawOptions, grid.width * drawOptions.sizeCell, (grid.height + 2) * drawOptions.sizeCell, duration),
    createSnake(chain, drawOptions, duration)
  ];
  const viewBox = [
    -drawOptions.sizeCell,
    -drawOptions.sizeCell * 2,
    width,
    height
  ].join(" ");
  const style = generateColorVar(drawOptions) + elements.map((e) => e.styles).flat().join(`
`);
  const svg = [
    h("svg", {
      viewBox,
      width,
      height,
      xmlns: "http://www.w3.org/2000/svg"
    }).replace("/>", ">"),
    "<desc>",
    "Generated with https://github.com/Platane/snk",
    "</desc>",
    "<style>",
    optimizeCss(style),
    "</style>",
    ...elements.map((e) => e.svgElements).flat(),
    "</svg>"
  ].join("");
  return optimizeSvg(svg);
}, optimizeCss = (css) => minifyCss(css), optimizeSvg = (svg) => svg, generateColorVar = (drawOptions) => `
    :root {
    --cb: ${drawOptions.colorDotBorder};
    --cs: ${drawOptions.colorSnake};
    --ce: ${drawOptions.colorEmpty};
    ${Object.entries(drawOptions.colorDots).map(([i, color]) => `--c${i}:${color};`).join("")}
    }
    ` + (drawOptions.dark ? `
    @media (prefers-color-scheme: dark) {
      :root {
        --cb: ${drawOptions.dark.colorDotBorder || drawOptions.colorDotBorder};
        --cs: ${drawOptions.dark.colorSnake || drawOptions.colorSnake};
        --ce: ${drawOptions.dark.colorEmpty};
        ${Object.entries(drawOptions.dark.colorDots).map(([i, color]) => `--c${i}:${color};`).join("")}
      }
    }
` : "");
var init_svg_creator = __esm(() => {
  init_snake();
  init_grid();
  init_stack();
});

// ../draw/pathRoundedRect.ts
var pathRoundedRect = (ctx, width, height, borderRadius) => {
  ctx.moveTo(borderRadius, 0);
  ctx.arcTo(width, 0, width, height, borderRadius);
  ctx.arcTo(width, height, 0, height, borderRadius);
  ctx.arcTo(0, height, 0, 0, borderRadius);
  ctx.arcTo(0, 0, width, 0, borderRadius);
};

// ../draw/drawGrid.ts
var drawGrid = (ctx, grid, cells, o) => {
  for (let x = grid.width;x--; )
    for (let y = grid.height;y--; ) {
      if (!cells || cells.some((c) => c.x === x && c.y === y)) {
        const c = getColor(grid, x, y);
        const color = !c ? o.colorEmpty : o.colorDots[c];
        ctx.save();
        ctx.translate(x * o.sizeCell + (o.sizeCell - o.sizeDot) / 2, y * o.sizeCell + (o.sizeCell - o.sizeDot) / 2);
        ctx.fillStyle = color;
        ctx.strokeStyle = o.colorDotBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        pathRoundedRect(ctx, o.sizeDot, o.sizeDot, o.sizeDotBorderRadius);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    }
};
var init_drawGrid = () => {};

// ../draw/drawSnake.ts
var lerp2 = (k, a, b) => (1 - k) * a + k * b, clamp = (x, a, b) => Math.max(a, Math.min(b, x)), drawSnakeLerp = (ctx, snake0, snake1, k, o) => {
  const m = 0.8;
  const n = snake0.length / 2;
  for (let i = 0;i < n; i++) {
    const u = (i + 1) * 0.6 * (o.sizeCell / 16);
    const a = (1 - m) * (i / Math.max(n - 1, 1));
    const ki = clamp((k - a) / m, 0, 1);
    const x = lerp2(ki, snake0[i * 2 + 0], snake1[i * 2 + 0]) - 2;
    const y = lerp2(ki, snake0[i * 2 + 1], snake1[i * 2 + 1]) - 2;
    ctx.save();
    ctx.fillStyle = o.colorSnake;
    ctx.translate(x * o.sizeCell + u, y * o.sizeCell + u);
    ctx.beginPath();
    pathRoundedRect(ctx, o.sizeCell - u * 2, o.sizeCell - u * 2, (o.sizeCell - u * 2) * 0.25);
    ctx.fill();
    ctx.restore();
  }
};
var init_drawSnake = () => {};

// ../draw/drawWorld.ts
var drawStack = (ctx, stack, max, width, o) => {
  ctx.save();
  const m = width / max;
  for (let i = 0;i < stack.length; i++) {
    ctx.fillStyle = o.colorDots[stack[i]];
    ctx.fillRect(i * m, 0, m + width * 0.005, 10);
  }
  ctx.restore();
}, drawLerpWorld = (ctx, grid, cells, snake0, snake1, stack, k, o) => {
  ctx.save();
  if (o.colorBackground) {
    ctx.fillStyle = o.colorBackground;
    ctx.fillRect(0, 0, 99999, 99999);
  }
  ctx.translate(1 * o.sizeCell, 2 * o.sizeCell);
  drawGrid(ctx, grid, cells, o);
  drawSnakeLerp(ctx, snake0, snake1, k, o);
  ctx.translate(0, (grid.height + 2) * o.sizeCell);
  const max = grid.data.reduce((sum, x) => sum + +!!x, stack.length);
  drawStack(ctx, stack, max, grid.width * o.sizeCell, o);
  ctx.restore();
}, getCanvasWorldSize = (grid, o) => {
  const width = o.sizeCell * (grid.width + 2);
  const height = o.sizeCell * (grid.height + 4) + 30;
  return { width, height };
};
var init_drawWorld = __esm(() => {
  init_drawGrid();
  init_drawSnake();
});

// ../solver/step.ts
var step = (grid, stack, snake) => {
  const x = getHeadX(snake);
  const y = getHeadY(snake);
  const color = getColor(grid, x, y);
  if (isInside(grid, x, y) && !isEmpty(color)) {
    stack.push(color);
    setColorEmpty(grid, x, y);
  }
};
var init_step = () => {};

// ../../node_modules/gif-encoder-2/src/LZWEncoder.js
var require_LZWEncoder = __commonJS(function(exports2, module2) {
  var EOF = -1;
  var BITS = 12;
  var HSIZE = 5003;
  var masks = [
    0,
    1,
    3,
    7,
    15,
    31,
    63,
    127,
    255,
    511,
    1023,
    2047,
    4095,
    8191,
    16383,
    32767,
    65535
  ];
  function LZWEncoder(width, height, pixels, colorDepth) {
    var initCodeSize = Math.max(2, colorDepth);
    var accum = new Uint8Array(256);
    var htab = new Int32Array(HSIZE);
    var codetab = new Int32Array(HSIZE);
    var cur_accum, cur_bits = 0;
    var a_count;
    var free_ent = 0;
    var maxcode;
    var clear_flg = false;
    var g_init_bits, ClearCode, EOFCode;
    function char_out(c, outs) {
      accum[a_count++] = c;
      if (a_count >= 254)
        flush_char(outs);
    }
    function cl_block(outs) {
      cl_hash(HSIZE);
      free_ent = ClearCode + 2;
      clear_flg = true;
      output(ClearCode, outs);
    }
    function cl_hash(hsize) {
      for (var i = 0;i < hsize; ++i)
        htab[i] = -1;
    }
    function compress(init_bits, outs) {
      var fcode, c, i, ent, disp, hsize_reg, hshift;
      g_init_bits = init_bits;
      clear_flg = false;
      n_bits = g_init_bits;
      maxcode = MAXCODE(n_bits);
      ClearCode = 1 << init_bits - 1;
      EOFCode = ClearCode + 1;
      free_ent = ClearCode + 2;
      a_count = 0;
      ent = nextPixel();
      hshift = 0;
      for (fcode = HSIZE;fcode < 65536; fcode *= 2)
        ++hshift;
      hshift = 8 - hshift;
      hsize_reg = HSIZE;
      cl_hash(hsize_reg);
      output(ClearCode, outs);
      outer_loop:
        while ((c = nextPixel()) != EOF) {
          fcode = (c << BITS) + ent;
          i = c << hshift ^ ent;
          if (htab[i] === fcode) {
            ent = codetab[i];
            continue;
          } else if (htab[i] >= 0) {
            disp = hsize_reg - i;
            if (i === 0)
              disp = 1;
            do {
              if ((i -= disp) < 0)
                i += hsize_reg;
              if (htab[i] === fcode) {
                ent = codetab[i];
                continue outer_loop;
              }
            } while (htab[i] >= 0);
          }
          output(ent, outs);
          ent = c;
          if (free_ent < 1 << BITS) {
            codetab[i] = free_ent++;
            htab[i] = fcode;
          } else {
            cl_block(outs);
          }
        }
      output(ent, outs);
      output(EOFCode, outs);
    }
    function encode(outs) {
      outs.writeByte(initCodeSize);
      remaining = width * height;
      curPixel = 0;
      compress(initCodeSize + 1, outs);
      outs.writeByte(0);
    }
    function flush_char(outs) {
      if (a_count > 0) {
        outs.writeByte(a_count);
        outs.writeBytes(accum, 0, a_count);
        a_count = 0;
      }
    }
    function MAXCODE(n_bits2) {
      return (1 << n_bits2) - 1;
    }
    function nextPixel() {
      if (remaining === 0)
        return EOF;
      --remaining;
      var pix = pixels[curPixel++];
      return pix & 255;
    }
    function output(code, outs) {
      cur_accum &= masks[cur_bits];
      if (cur_bits > 0)
        cur_accum |= code << cur_bits;
      else
        cur_accum = code;
      cur_bits += n_bits;
      while (cur_bits >= 8) {
        char_out(cur_accum & 255, outs);
        cur_accum >>= 8;
        cur_bits -= 8;
      }
      if (free_ent > maxcode || clear_flg) {
        if (clear_flg) {
          maxcode = MAXCODE(n_bits = g_init_bits);
          clear_flg = false;
        } else {
          ++n_bits;
          if (n_bits == BITS)
            maxcode = 1 << BITS;
          else
            maxcode = MAXCODE(n_bits);
        }
      }
      if (code == EOFCode) {
        while (cur_bits > 0) {
          char_out(cur_accum & 255, outs);
          cur_accum >>= 8;
          cur_bits -= 8;
        }
        flush_char(outs);
      }
    }
    this.encode = encode;
  }
  module2.exports = LZWEncoder;
});

// ../../node_modules/gif-encoder-2/src/TypedNeuQuant.js
var require_TypedNeuQuant = __commonJS(function(exports2, module2) {
  var ncycles = 100;
  var netsize = 256;
  var maxnetpos = netsize - 1;
  var netbiasshift = 4;
  var intbiasshift = 16;
  var intbias = 1 << intbiasshift;
  var gammashift = 10;
  var gamma = 1 << gammashift;
  var betashift = 10;
  var beta = intbias >> betashift;
  var betagamma = intbias << gammashift - betashift;
  var initrad = netsize >> 3;
  var radiusbiasshift = 6;
  var radiusbias = 1 << radiusbiasshift;
  var initradius = initrad * radiusbias;
  var radiusdec = 30;
  var alphabiasshift = 10;
  var initalpha = 1 << alphabiasshift;
  var radbiasshift = 8;
  var radbias = 1 << radbiasshift;
  var alpharadbshift = alphabiasshift + radbiasshift;
  var alpharadbias = 1 << alpharadbshift;
  var prime1 = 499;
  var prime2 = 491;
  var prime3 = 487;
  var prime4 = 503;
  var minpicturebytes = 3 * prime4;
  function NeuQuant(pixels, samplefac) {
    var network;
    var netindex;
    var bias;
    var freq;
    var radpower;
    function init() {
      network = [];
      netindex = new Int32Array(256);
      bias = new Int32Array(netsize);
      freq = new Int32Array(netsize);
      radpower = new Int32Array(netsize >> 3);
      var i, v;
      for (i = 0;i < netsize; i++) {
        v = (i << netbiasshift + 8) / netsize;
        network[i] = new Float64Array([v, v, v, 0]);
        freq[i] = intbias / netsize;
        bias[i] = 0;
      }
    }
    function unbiasnet() {
      for (var i = 0;i < netsize; i++) {
        network[i][0] >>= netbiasshift;
        network[i][1] >>= netbiasshift;
        network[i][2] >>= netbiasshift;
        network[i][3] = i;
      }
    }
    function altersingle(alpha, i, b, g, r) {
      network[i][0] -= alpha * (network[i][0] - b) / initalpha;
      network[i][1] -= alpha * (network[i][1] - g) / initalpha;
      network[i][2] -= alpha * (network[i][2] - r) / initalpha;
    }
    function alterneigh(radius, i, b, g, r) {
      var lo = Math.abs(i - radius);
      var hi = Math.min(i + radius, netsize);
      var j = i + 1;
      var k = i - 1;
      var m = 1;
      var p, a;
      while (j < hi || k > lo) {
        a = radpower[m++];
        if (j < hi) {
          p = network[j++];
          p[0] -= a * (p[0] - b) / alpharadbias;
          p[1] -= a * (p[1] - g) / alpharadbias;
          p[2] -= a * (p[2] - r) / alpharadbias;
        }
        if (k > lo) {
          p = network[k--];
          p[0] -= a * (p[0] - b) / alpharadbias;
          p[1] -= a * (p[1] - g) / alpharadbias;
          p[2] -= a * (p[2] - r) / alpharadbias;
        }
      }
    }
    function contest(b, g, r) {
      var bestd = ~(1 << 31);
      var bestbiasd = bestd;
      var bestpos = -1;
      var bestbiaspos = bestpos;
      var i, n, dist, biasdist, betafreq;
      for (i = 0;i < netsize; i++) {
        n = network[i];
        dist = Math.abs(n[0] - b) + Math.abs(n[1] - g) + Math.abs(n[2] - r);
        if (dist < bestd) {
          bestd = dist;
          bestpos = i;
        }
        biasdist = dist - (bias[i] >> intbiasshift - netbiasshift);
        if (biasdist < bestbiasd) {
          bestbiasd = biasdist;
          bestbiaspos = i;
        }
        betafreq = freq[i] >> betashift;
        freq[i] -= betafreq;
        bias[i] += betafreq << gammashift;
      }
      freq[bestpos] += beta;
      bias[bestpos] -= betagamma;
      return bestbiaspos;
    }
    function inxbuild() {
      var i, j, p, q, smallpos, smallval, previouscol = 0, startpos = 0;
      for (i = 0;i < netsize; i++) {
        p = network[i];
        smallpos = i;
        smallval = p[1];
        for (j = i + 1;j < netsize; j++) {
          q = network[j];
          if (q[1] < smallval) {
            smallpos = j;
            smallval = q[1];
          }
        }
        q = network[smallpos];
        if (i != smallpos) {
          j = q[0];
          q[0] = p[0];
          p[0] = j;
          j = q[1];
          q[1] = p[1];
          p[1] = j;
          j = q[2];
          q[2] = p[2];
          p[2] = j;
          j = q[3];
          q[3] = p[3];
          p[3] = j;
        }
        if (smallval != previouscol) {
          netindex[previouscol] = startpos + i >> 1;
          for (j = previouscol + 1;j < smallval; j++)
            netindex[j] = i;
          previouscol = smallval;
          startpos = i;
        }
      }
      netindex[previouscol] = startpos + maxnetpos >> 1;
      for (j = previouscol + 1;j < 256; j++)
        netindex[j] = maxnetpos;
    }
    function inxsearch(b, g, r) {
      var a, p, dist;
      var bestd = 1000;
      var best = -1;
      var i = netindex[g];
      var j = i - 1;
      while (i < netsize || j >= 0) {
        if (i < netsize) {
          p = network[i];
          dist = p[1] - g;
          if (dist >= bestd)
            i = netsize;
          else {
            i++;
            if (dist < 0)
              dist = -dist;
            a = p[0] - b;
            if (a < 0)
              a = -a;
            dist += a;
            if (dist < bestd) {
              a = p[2] - r;
              if (a < 0)
                a = -a;
              dist += a;
              if (dist < bestd) {
                bestd = dist;
                best = p[3];
              }
            }
          }
        }
        if (j >= 0) {
          p = network[j];
          dist = g - p[1];
          if (dist >= bestd)
            j = -1;
          else {
            j--;
            if (dist < 0)
              dist = -dist;
            a = p[0] - b;
            if (a < 0)
              a = -a;
            dist += a;
            if (dist < bestd) {
              a = p[2] - r;
              if (a < 0)
                a = -a;
              dist += a;
              if (dist < bestd) {
                bestd = dist;
                best = p[3];
              }
            }
          }
        }
      }
      return best;
    }
    function learn() {
      var i;
      var lengthcount = pixels.length;
      var alphadec = 30 + (samplefac - 1) / 3;
      var samplepixels = lengthcount / (3 * samplefac);
      var delta = ~~(samplepixels / ncycles);
      var alpha = initalpha;
      var radius = initradius;
      var rad = radius >> radiusbiasshift;
      if (rad <= 1)
        rad = 0;
      for (i = 0;i < rad; i++)
        radpower[i] = alpha * ((rad * rad - i * i) * radbias / (rad * rad));
      var step;
      if (lengthcount < minpicturebytes) {
        samplefac = 1;
        step = 3;
      } else if (lengthcount % prime1 !== 0) {
        step = 3 * prime1;
      } else if (lengthcount % prime2 !== 0) {
        step = 3 * prime2;
      } else if (lengthcount % prime3 !== 0) {
        step = 3 * prime3;
      } else {
        step = 3 * prime4;
      }
      var b, g, r, j;
      var pix = 0;
      i = 0;
      while (i < samplepixels) {
        b = (pixels[pix] & 255) << netbiasshift;
        g = (pixels[pix + 1] & 255) << netbiasshift;
        r = (pixels[pix + 2] & 255) << netbiasshift;
        j = contest(b, g, r);
        altersingle(alpha, j, b, g, r);
        if (rad !== 0)
          alterneigh(rad, j, b, g, r);
        pix += step;
        if (pix >= lengthcount)
          pix -= lengthcount;
        i++;
        if (delta === 0)
          delta = 1;
        if (i % delta === 0) {
          alpha -= alpha / alphadec;
          radius -= radius / radiusdec;
          rad = radius >> radiusbiasshift;
          if (rad <= 1)
            rad = 0;
          for (j = 0;j < rad; j++)
            radpower[j] = alpha * ((rad * rad - j * j) * radbias / (rad * rad));
        }
      }
    }
    function buildColormap() {
      init();
      learn();
      unbiasnet();
      inxbuild();
    }
    this.buildColormap = buildColormap;
    function getColormap() {
      var map = [];
      var index = [];
      for (var i = 0;i < netsize; i++)
        index[network[i][3]] = i;
      var k = 0;
      for (var l = 0;l < netsize; l++) {
        var j = index[l];
        map[k++] = network[j][0];
        map[k++] = network[j][1];
        map[k++] = network[j][2];
      }
      return map;
    }
    this.getColormap = getColormap;
    this.lookupRGB = inxsearch;
  }
  module2.exports = NeuQuant;
});

// ../../node_modules/gif-encoder-2/src/OctreeQuant.js
var require_OctreeQuant = __commonJS(function(exports2, module2) {
  var MAX_DEPTH = 8;

  class OctreeQuant {
    constructor() {
      this.levels = Array.from({ length: MAX_DEPTH }, () => []);
      this.root = new Node(0, this);
    }
    addColor(color) {
      this.root.addColor(color, 0, this);
    }
    makePalette(colorCount) {
      let palette = [];
      let paletteIndex = 0;
      let leafCount = this.leafNodes.length;
      for (let level = MAX_DEPTH - 1;level > -1; level -= 1) {
        if (this.levels[level]) {
          for (let node of this.levels[level]) {
            leafCount -= node.removeLeaves();
            if (leafCount <= colorCount)
              break;
          }
          if (leafCount <= colorCount)
            break;
          this.levels[level] = [];
        }
      }
      for (let node of this.leafNodes) {
        if (paletteIndex >= colorCount)
          break;
        if (node.isLeaf)
          palette.push(node.color);
        node.paletteIndex = paletteIndex;
        paletteIndex++;
      }
      return palette;
    }
    *makePaletteIncremental(colorCount) {
      let palette = [];
      let paletteIndex = 0;
      let leafCount = this.leafNodes.length;
      for (let level = MAX_DEPTH - 1;level > -1; level -= 1) {
        if (this.levels[level]) {
          for (let node of this.levels[level]) {
            leafCount -= node.removeLeaves();
            if (leafCount <= colorCount)
              break;
          }
          if (leafCount <= colorCount)
            break;
          this.levels[level] = [];
        }
        yield;
      }
      for (let node of this.leafNodes) {
        if (paletteIndex >= colorCount)
          break;
        if (node.isLeaf)
          palette.push(node.color);
        node.paletteIndex = paletteIndex;
        paletteIndex++;
      }
      yield;
      return palette;
    }
    get leafNodes() {
      return this.root.leafNodes;
    }
    addLevelNode(level, node) {
      this.levels[level].push(node);
    }
    getPaletteIndex(color) {
      return this.root.getPaletteIndex(color, 0);
    }
  }

  class Node {
    constructor(level, parent) {
      this._color = new Color(0, 0, 0);
      this.pixelCount = 0;
      this.paletteIndex = 0;
      this.children = [];
      this._debugColor;
      if (level < MAX_DEPTH - 1)
        parent.addLevelNode(level, this);
    }
    get isLeaf() {
      return this.pixelCount > 0;
    }
    get leafNodes() {
      let leafNodes = [];
      for (let node of this.children) {
        if (!node)
          continue;
        if (node.isLeaf) {
          leafNodes.push(node);
        } else {
          leafNodes.push(...node.leafNodes);
        }
      }
      return leafNodes;
    }
    addColor(color, level, parent) {
      if (level >= MAX_DEPTH) {
        this._color.add(color);
        this.pixelCount++;
        return;
      }
      let index = getColorIndex(color, level);
      if (!this.children[index]) {
        this.children[index] = new Node(level, parent);
      }
      this.children[index].addColor(color, level + 1, parent);
    }
    getPaletteIndex(color, level) {
      if (this.isLeaf) {
        return this.paletteIndex;
      }
      let index = getColorIndex(color, level);
      if (this.children[index]) {
        return this.children[index].getPaletteIndex(color, level + 1);
      } else {
        for (let node of this.children) {
          if (node) {
            return node.getPaletteIndex(color, level + 1);
          }
        }
      }
    }
    removeLeaves() {
      let result = 0;
      for (let node of this.children) {
        if (!node)
          continue;
        this._color.add(node._color);
        this.pixelCount += node.pixelCount;
        result++;
      }
      this.children = [];
      return result - 1;
    }
    get debugColor() {
      if (this._debugColor)
        return this._debugColor;
      if (this.isLeaf)
        return this.color;
      let c = new Color;
      let count = 0;
      function traverse(node) {
        for (let child of node.children) {
          if (child.isLeaf) {
            c.add(child._color);
            count++;
          } else {
            traverse(child);
          }
        }
      }
      traverse(this);
      return c.normalized(count);
    }
    get color() {
      return this._color.normalized(this.pixelCount);
    }
  }

  class Color {
    constructor(red = 0, green = 0, blue = 0) {
      this.red = red;
      this.green = green;
      this.blue = blue;
    }
    clone() {
      return new Color(this.red, this.green, this.blue);
    }
    get array() {
      return [this.red, this.green, this.blue, this.red + this.green + this.blue];
    }
    toString() {
      return [this.red, this.green, this.blue].join(",");
    }
    toCSS() {
      return `rgb(${[this.red, this.green, this.blue].map((n) => Math.floor(n)).join(",")})`;
    }
    normalized(pixelCount) {
      return new Color(this.red / pixelCount, this.green / pixelCount, this.blue / pixelCount);
    }
    add(color) {
      this.red += color.red;
      this.green += color.green;
      this.blue += color.blue;
    }
  }
  function getColorIndex(color, level) {
    let index = 0;
    let mask = 128 >> level;
    if (color.red & mask)
      index |= 4;
    if (color.green & mask)
      index |= 2;
    if (color.blue & mask)
      index |= 1;
    return index;
  }
  module2.exports = { OctreeQuant, Node, Color };
});

// ../../node_modules/gif-encoder-2/src/GIFEncoder.js
var require_GIFEncoder = __commonJS(function(exports2, module2) {
  var stream = require("stream");
  var EventEmitter = require("events");
  var LZWEncoder = require_LZWEncoder();
  var NeuQuant = require_TypedNeuQuant();
  var { OctreeQuant, Color } = require_OctreeQuant();

  class ByteArray {
    constructor() {
      this.data = [];
    }
    getData() {
      return Buffer.from(this.data);
    }
    writeByte(val) {
      this.data.push(val);
    }
    writeUTFBytes(str) {
      for (var len = str.length, i = 0;i < len; i++) {
        this.writeByte(str.charCodeAt(i));
      }
    }
    writeBytes(array, offset, length) {
      for (var len = length || array.length, i = offset || 0;i < len; i++) {
        this.writeByte(array[i]);
      }
    }
  }

  class GIFEncoder extends EventEmitter {
    constructor(width, height, algorithm = "neuquant", useOptimizer = false, totalFrames = 0) {
      super();
      this.width = ~~width;
      this.height = ~~height;
      this.algorithm = algorithm;
      this.useOptimizer = useOptimizer;
      this.totalFrames = totalFrames;
      this.frames = 1;
      this.threshold = 90;
      this.indexedPixels = null;
      this.palSizeNeu = 7;
      this.palSizeOct = 7;
      this.sample = 10;
      this.colorTab = null;
      this.reuseTab = null;
      this.colorDepth = null;
      this.usedEntry = new Array;
      this.firstFrame = true;
      this.started = false;
      this.image = null;
      this.prevImage = null;
      this.dispose = -1;
      this.repeat = 0;
      this.delay = 0;
      this.transparent = null;
      this.transIndex = 0;
      this.readStreams = [];
      this.out = new ByteArray;
    }
    createReadStream(rs) {
      if (!rs) {
        rs = new stream.Readable;
        rs._read = function() {};
      }
      this.readStreams.push(rs);
      return rs;
    }
    emitData() {
      if (this.readStreams.length === 0) {
        return;
      }
      if (this.out.data.length) {
        this.readStreams.forEach((rs) => {
          rs.push(Buffer.from(this.out.data));
        });
        this.out.data = [];
      }
    }
    start() {
      this.out.writeUTFBytes("GIF89a");
      this.started = true;
      this.emitData();
    }
    end() {
      if (this.readStreams.length === null) {
        return;
      }
      this.emitData();
      this.readStreams.forEach((rs) => rs.push(null));
      this.readStreams = [];
    }
    addFrame(input) {
      if (input && input.getImageData) {
        this.image = input.getImageData(0, 0, this.width, this.height).data;
      } else {
        this.image = input;
      }
      this.analyzePixels();
      if (this.firstFrame) {
        this.writeLSD();
        this.writePalette();
        if (this.repeat >= 0) {
          this.writeNetscapeExt();
        }
      }
      this.writeGraphicCtrlExt();
      this.writeImageDesc();
      if (!this.firstFrame) {
        this.writePalette();
      }
      this.writePixels();
      this.firstFrame = false;
      this.emitData();
      if (this.totalFrames) {
        this.emit("progress", Math.floor(this.frames++ / this.totalFrames * 100));
      }
    }
    analyzePixels() {
      const w = this.width;
      const h = this.height;
      var data = this.image;
      if (this.useOptimizer && this.prevImage) {
        var delta = 0;
        for (var len = data.length, i = 0;i < len; i += 4) {
          if (data[i] !== this.prevImage[i] || data[i + 1] !== this.prevImage[i + 1] || data[i + 2] !== this.prevImage[i + 2]) {
            delta++;
          }
        }
        const match = 100 - Math.ceil(delta / (data.length / 4) * 100);
        this.reuseTab = match >= this.threshold;
      }
      this.prevImage = data;
      if (this.algorithm === "neuquant") {
        var count = 0;
        this.pixels = new Uint8Array(w * h * 3);
        for (var i = 0;i < h; i++) {
          for (var j = 0;j < w; j++) {
            var b = i * w * 4 + j * 4;
            this.pixels[count++] = data[b];
            this.pixels[count++] = data[b + 1];
            this.pixels[count++] = data[b + 2];
          }
        }
        var nPix = this.pixels.length / 3;
        this.indexedPixels = new Uint8Array(nPix);
        if (!this.reuseTab) {
          this.quantizer = new NeuQuant(this.pixels, this.sample);
          this.quantizer.buildColormap();
          this.colorTab = this.quantizer.getColormap();
        }
        var k = 0;
        for (var j = 0;j < nPix; j++) {
          var index = this.quantizer.lookupRGB(this.pixels[k++] & 255, this.pixels[k++] & 255, this.pixels[k++] & 255);
          this.usedEntry[index] = true;
          this.indexedPixels[j] = index;
        }
        this.colorDepth = 8;
        this.palSizeNeu = 7;
        this.pixels = null;
      } else if (this.algorithm === "octree") {
        this.colors = [];
        if (!this.reuseTab) {
          this.quantizer = new OctreeQuant;
        }
        for (var i = 0;i < h; i++) {
          for (var j = 0;j < w; j++) {
            var b = i * w * 4 + j * 4;
            const color = new Color(data[b], data[b + 1], data[b + 2]);
            this.colors.push(color);
            if (!this.reuseTab) {
              this.quantizer.addColor(color);
            }
          }
        }
        const nPix = this.colors.length;
        this.indexedPixels = new Uint8Array(nPix);
        if (!this.reuseTab) {
          this.colorTab = [];
          const palette = this.quantizer.makePalette(Math.pow(2, this.palSizeOct + 1));
          for (const p of palette) {
            this.colorTab.push(p.red, p.green, p.blue);
          }
        }
        for (var i = 0;i < nPix; i++) {
          this.indexedPixels[i] = this.quantizer.getPaletteIndex(this.colors[i]);
        }
        this.colorDepth = this.palSizeOct + 1;
      }
      if (this.transparent !== null) {
        this.transIndex = this.findClosest(this.transparent);
        for (var pixelIndex = 0;pixelIndex < nPix; pixelIndex++) {
          if (this.image[pixelIndex * 4 + 3] == 0) {
            this.indexedPixels[pixelIndex] = this.transIndex;
          }
        }
      }
    }
    findClosest(c) {
      if (this.colorTab === null) {
        return -1;
      }
      var r = (c & 16711680) >> 16;
      var g = (c & 65280) >> 8;
      var b = c & 255;
      var minpos = 0;
      var dmin = 256 * 256 * 256;
      var len = this.colorTab.length;
      for (var i = 0;i < len; ) {
        var index = i / 3;
        var dr = r - (this.colorTab[i++] & 255);
        var dg = g - (this.colorTab[i++] & 255);
        var db = b - (this.colorTab[i++] & 255);
        var d = dr * dr + dg * dg + db * db;
        if (this.usedEntry[index] && d < dmin) {
          dmin = d;
          minpos = index;
        }
      }
      return minpos;
    }
    setFrameRate(fps) {
      this.delay = Math.round(100 / fps);
    }
    setDelay(ms) {
      this.delay = Math.round(ms / 10);
    }
    setDispose(code) {
      if (code >= 0) {
        this.dispose = code;
      }
    }
    setRepeat(repeat) {
      this.repeat = repeat;
    }
    setTransparent(color) {
      this.transparent = color;
    }
    setQuality(quality) {
      if (quality < 1) {
        quality = 1;
      }
      this.quality = quality;
    }
    setThreshold(threshold) {
      if (threshold > 100) {
        threshold = 100;
      } else if (threshold < 0) {
        threshold = 0;
      }
      this.threshold = threshold;
    }
    setPaletteSize(size) {
      if (size > 7) {
        size = 7;
      } else if (size < 4) {
        size = 4;
      }
      this.palSizeOct = size;
    }
    writeLSD() {
      this.writeShort(this.width);
      this.writeShort(this.height);
      this.out.writeByte(128 | 112 | 0 | this.palSizeNeu);
      this.out.writeByte(0);
      this.out.writeByte(0);
    }
    writeGraphicCtrlExt() {
      this.out.writeByte(33);
      this.out.writeByte(249);
      this.out.writeByte(4);
      var transp, disp;
      if (this.transparent === null) {
        transp = 0;
        disp = 0;
      } else {
        transp = 1;
        disp = 2;
      }
      if (this.dispose >= 0) {
        disp = this.dispose & 7;
      }
      disp <<= 2;
      this.out.writeByte(0 | disp | 0 | transp);
      this.writeShort(this.delay);
      this.out.writeByte(this.transIndex);
      this.out.writeByte(0);
    }
    writeNetscapeExt() {
      this.out.writeByte(33);
      this.out.writeByte(255);
      this.out.writeByte(11);
      this.out.writeUTFBytes("NETSCAPE2.0");
      this.out.writeByte(3);
      this.out.writeByte(1);
      this.writeShort(this.repeat);
      this.out.writeByte(0);
    }
    writeImageDesc() {
      this.out.writeByte(44);
      this.writeShort(0);
      this.writeShort(0);
      this.writeShort(this.width);
      this.writeShort(this.height);
      if (this.firstFrame) {
        this.out.writeByte(0);
      } else {
        this.out.writeByte(128 | 0 | 0 | 0 | this.palSizeNeu);
      }
    }
    writePalette() {
      this.out.writeBytes(this.colorTab);
      var n = 3 * 256 - this.colorTab.length;
      for (var i = 0;i < n; i++) {
        this.out.writeByte(0);
      }
    }
    writeShort(pValue) {
      this.out.writeByte(pValue & 255);
      this.out.writeByte(pValue >> 8 & 255);
    }
    writePixels() {
      var enc = new LZWEncoder(this.width, this.height, this.indexedPixels, this.colorDepth);
      enc.encode(this.out);
    }
    finish() {
      this.out.writeByte(59);
      this.end();
    }
  }
  module2.exports = GIFEncoder;
});

// ../../node_modules/gif-encoder-2/index.js
var require_gif_encoder_2 = __commonJS(function(exports2, module2) {
  module2.exports = require_GIFEncoder();
});

// ../gif-creator/index.ts
var import_node_child_process, import_node_fs, import_node_os, import_node_path, createGif = async (grid0, cells, chain, drawOptions, animationOptions) => withTmpDir(async (dir) => {
  const { createCanvas } = await import("canvas");
  const { default: gifsicle } = await import("gifsicle");
  const { default: GIFEncoder } = await Promise.resolve().then(() => __toESM(require_gif_encoder_2()));
  const { width, height } = getCanvasWorldSize(grid0, drawOptions);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d", {
    alpha: true
  });
  const grid = copyGrid(grid0);
  const stack = [];
  const encoder = new GIFEncoder(width, height, "neuquant", true, chain.length * animationOptions.frameByStep);
  encoder.setRepeat(0);
  encoder.setDelay(animationOptions.stepDurationMs / animationOptions.frameByStep);
  encoder.start();
  for (let i = 0;i < chain.length; i += 1) {
    const snake0 = chain[i];
    const snake1 = chain[Math.min(chain.length - 1, i + 1)];
    step(grid, stack, snake0);
    for (let k = 0;k < animationOptions.frameByStep; k++) {
      ctx.clearRect(0, 0, width, height);
      drawLerpWorld(ctx, grid, cells, snake0, snake1, stack, k / animationOptions.frameByStep, drawOptions);
      encoder.addFrame(ctx);
    }
  }
  const outFileName = import_node_path.default.join(dir, "out.gif");
  const optimizedFileName = import_node_path.default.join(dir, "out.optimized.gif");
  const paletteFileName = import_node_path.default.join(dir, "palette.txt");
  {
    const colors = [
      drawOptions.colorBackground,
      drawOptions.colorEmpty,
      drawOptions.colorSnake,
      drawOptions.colorDotBorder,
      ...Object.values(drawOptions.colorDots)
    ].filter(Boolean);
    const canvas = createCanvas(colors.length, 1);
    const ctx = canvas.getContext("2d");
    for (let i = colors.length;i--; ) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(i, 0, 1, 1);
    }
    const imgData = ctx.getImageData(0, 0, colors.length, 1);
    import_node_fs.default.writeFileSync(paletteFileName, Array.from({ length: colors.length }, (_, i) => [
      imgData.data[i * 4 + 0],
      imgData.data[i * 4 + 1],
      imgData.data[i * 4 + 2]
    ].join(" ")).join(`
`));
  }
  encoder.finish();
  import_node_fs.default.writeFileSync(outFileName, encoder.out.getData());
  import_node_child_process.execFileSync(gifsicle, [
    "--optimize=3",
    "--color-method=diversity",
    `--use-colormap=${paletteFileName}`,
    outFileName,
    ["--output", optimizedFileName]
  ].flat());
  return new Uint8Array(import_node_fs.default.readFileSync(optimizedFileName));
}), withTmpDir = async (handler) => {
  const dir = import_node_path.default.join(import_node_os.tmpdir(), Math.random().toString(16).slice(2));
  import_node_fs.default.mkdirSync(dir, { recursive: true });
  try {
    return await handler(dir);
  } finally {
    import_node_fs.default.rmdirSync(dir, { recursive: true });
  }
};
var init_gif_creator = __esm(() => {
  init_drawWorld();
  init_step();
  import_node_child_process = require("node:child_process");
  import_node_fs = __toESM(require("node:fs"));
  import_node_os = require("node:os");
  import_node_path = __toESM(require("node:path"));
});

// ../../node_modules/jpeg-js/lib/encoder.js
var require_encoder = __commonJS(function(exports2, module2) {
  var btoa = btoa || function(buf) {
    return Buffer.from(buf).toString("base64");
  };
  function JPEGEncoder(quality) {
    var self = this;
    var fround = Math.round;
    var ffloor = Math.floor;
    var YTable = new Array(64);
    var UVTable = new Array(64);
    var fdtbl_Y = new Array(64);
    var fdtbl_UV = new Array(64);
    var YDC_HT;
    var UVDC_HT;
    var YAC_HT;
    var UVAC_HT;
    var bitcode = new Array(65535);
    var category = new Array(65535);
    var outputfDCTQuant = new Array(64);
    var DU = new Array(64);
    var byteout = [];
    var bytenew = 0;
    var bytepos = 7;
    var YDU = new Array(64);
    var UDU = new Array(64);
    var VDU = new Array(64);
    var clt = new Array(256);
    var RGB_YUV_TABLE = new Array(2048);
    var currentQuality;
    var ZigZag = [
      0,
      1,
      5,
      6,
      14,
      15,
      27,
      28,
      2,
      4,
      7,
      13,
      16,
      26,
      29,
      42,
      3,
      8,
      12,
      17,
      25,
      30,
      41,
      43,
      9,
      11,
      18,
      24,
      31,
      40,
      44,
      53,
      10,
      19,
      23,
      32,
      39,
      45,
      52,
      54,
      20,
      22,
      33,
      38,
      46,
      51,
      55,
      60,
      21,
      34,
      37,
      47,
      50,
      56,
      59,
      61,
      35,
      36,
      48,
      49,
      57,
      58,
      62,
      63
    ];
    var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
    var std_ac_luminance_values = [
      1,
      2,
      3,
      0,
      4,
      17,
      5,
      18,
      33,
      49,
      65,
      6,
      19,
      81,
      97,
      7,
      34,
      113,
      20,
      50,
      129,
      145,
      161,
      8,
      35,
      66,
      177,
      193,
      21,
      82,
      209,
      240,
      36,
      51,
      98,
      114,
      130,
      9,
      10,
      22,
      23,
      24,
      25,
      26,
      37,
      38,
      39,
      40,
      41,
      42,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      67,
      68,
      69,
      70,
      71,
      72,
      73,
      74,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      99,
      100,
      101,
      102,
      103,
      104,
      105,
      106,
      115,
      116,
      117,
      118,
      119,
      120,
      121,
      122,
      131,
      132,
      133,
      134,
      135,
      136,
      137,
      138,
      146,
      147,
      148,
      149,
      150,
      151,
      152,
      153,
      154,
      162,
      163,
      164,
      165,
      166,
      167,
      168,
      169,
      170,
      178,
      179,
      180,
      181,
      182,
      183,
      184,
      185,
      186,
      194,
      195,
      196,
      197,
      198,
      199,
      200,
      201,
      202,
      210,
      211,
      212,
      213,
      214,
      215,
      216,
      217,
      218,
      225,
      226,
      227,
      228,
      229,
      230,
      231,
      232,
      233,
      234,
      241,
      242,
      243,
      244,
      245,
      246,
      247,
      248,
      249,
      250
    ];
    var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
    var std_ac_chrominance_values = [
      0,
      1,
      2,
      3,
      17,
      4,
      5,
      33,
      49,
      6,
      18,
      65,
      81,
      7,
      97,
      113,
      19,
      34,
      50,
      129,
      8,
      20,
      66,
      145,
      161,
      177,
      193,
      9,
      35,
      51,
      82,
      240,
      21,
      98,
      114,
      209,
      10,
      22,
      36,
      52,
      225,
      37,
      241,
      23,
      24,
      25,
      26,
      38,
      39,
      40,
      41,
      42,
      53,
      54,
      55,
      56,
      57,
      58,
      67,
      68,
      69,
      70,
      71,
      72,
      73,
      74,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      99,
      100,
      101,
      102,
      103,
      104,
      105,
      106,
      115,
      116,
      117,
      118,
      119,
      120,
      121,
      122,
      130,
      131,
      132,
      133,
      134,
      135,
      136,
      137,
      138,
      146,
      147,
      148,
      149,
      150,
      151,
      152,
      153,
      154,
      162,
      163,
      164,
      165,
      166,
      167,
      168,
      169,
      170,
      178,
      179,
      180,
      181,
      182,
      183,
      184,
      185,
      186,
      194,
      195,
      196,
      197,
      198,
      199,
      200,
      201,
      202,
      210,
      211,
      212,
      213,
      214,
      215,
      216,
      217,
      218,
      226,
      227,
      228,
      229,
      230,
      231,
      232,
      233,
      234,
      242,
      243,
      244,
      245,
      246,
      247,
      248,
      249,
      250
    ];
    function initQuantTables(sf) {
      var YQT = [
        16,
        11,
        10,
        16,
        24,
        40,
        51,
        61,
        12,
        12,
        14,
        19,
        26,
        58,
        60,
        55,
        14,
        13,
        16,
        24,
        40,
        57,
        69,
        56,
        14,
        17,
        22,
        29,
        51,
        87,
        80,
        62,
        18,
        22,
        37,
        56,
        68,
        109,
        103,
        77,
        24,
        35,
        55,
        64,
        81,
        104,
        113,
        92,
        49,
        64,
        78,
        87,
        103,
        121,
        120,
        101,
        72,
        92,
        95,
        98,
        112,
        100,
        103,
        99
      ];
      for (var i = 0;i < 64; i++) {
        var t = ffloor((YQT[i] * sf + 50) / 100);
        if (t < 1) {
          t = 1;
        } else if (t > 255) {
          t = 255;
        }
        YTable[ZigZag[i]] = t;
      }
      var UVQT = [
        17,
        18,
        24,
        47,
        99,
        99,
        99,
        99,
        18,
        21,
        26,
        66,
        99,
        99,
        99,
        99,
        24,
        26,
        56,
        99,
        99,
        99,
        99,
        99,
        47,
        66,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99
      ];
      for (var j = 0;j < 64; j++) {
        var u = ffloor((UVQT[j] * sf + 50) / 100);
        if (u < 1) {
          u = 1;
        } else if (u > 255) {
          u = 255;
        }
        UVTable[ZigZag[j]] = u;
      }
      var aasf = [
        1,
        1.387039845,
        1.306562965,
        1.175875602,
        1,
        0.785694958,
        0.5411961,
        0.275899379
      ];
      var k = 0;
      for (var row = 0;row < 8; row++) {
        for (var col = 0;col < 8; col++) {
          fdtbl_Y[k] = 1 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8);
          fdtbl_UV[k] = 1 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8);
          k++;
        }
      }
    }
    function computeHuffmanTbl(nrcodes, std_table) {
      var codevalue = 0;
      var pos_in_table = 0;
      var HT = new Array;
      for (var k = 1;k <= 16; k++) {
        for (var j = 1;j <= nrcodes[k]; j++) {
          HT[std_table[pos_in_table]] = [];
          HT[std_table[pos_in_table]][0] = codevalue;
          HT[std_table[pos_in_table]][1] = k;
          pos_in_table++;
          codevalue++;
        }
        codevalue *= 2;
      }
      return HT;
    }
    function initHuffmanTbl() {
      YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
      UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
      YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
      UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
    }
    function initCategoryNumber() {
      var nrlower = 1;
      var nrupper = 2;
      for (var cat = 1;cat <= 15; cat++) {
        for (var nr = nrlower;nr < nrupper; nr++) {
          category[32767 + nr] = cat;
          bitcode[32767 + nr] = [];
          bitcode[32767 + nr][1] = cat;
          bitcode[32767 + nr][0] = nr;
        }
        for (var nrneg = -(nrupper - 1);nrneg <= -nrlower; nrneg++) {
          category[32767 + nrneg] = cat;
          bitcode[32767 + nrneg] = [];
          bitcode[32767 + nrneg][1] = cat;
          bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
        }
        nrlower <<= 1;
        nrupper <<= 1;
      }
    }
    function initRGBYUVTable() {
      for (var i = 0;i < 256; i++) {
        RGB_YUV_TABLE[i] = 19595 * i;
        RGB_YUV_TABLE[i + 256 >> 0] = 38470 * i;
        RGB_YUV_TABLE[i + 512 >> 0] = 7471 * i + 32768;
        RGB_YUV_TABLE[i + 768 >> 0] = -11059 * i;
        RGB_YUV_TABLE[i + 1024 >> 0] = -21709 * i;
        RGB_YUV_TABLE[i + 1280 >> 0] = 32768 * i + 8421375;
        RGB_YUV_TABLE[i + 1536 >> 0] = -27439 * i;
        RGB_YUV_TABLE[i + 1792 >> 0] = -5329 * i;
      }
    }
    function writeBits(bs) {
      var value = bs[0];
      var posval = bs[1] - 1;
      while (posval >= 0) {
        if (value & 1 << posval) {
          bytenew |= 1 << bytepos;
        }
        posval--;
        bytepos--;
        if (bytepos < 0) {
          if (bytenew == 255) {
            writeByte(255);
            writeByte(0);
          } else {
            writeByte(bytenew);
          }
          bytepos = 7;
          bytenew = 0;
        }
      }
    }
    function writeByte(value) {
      byteout.push(value);
    }
    function writeWord(value) {
      writeByte(value >> 8 & 255);
      writeByte(value & 255);
    }
    function fDCTQuant(data, fdtbl) {
      var d0, d1, d2, d3, d4, d5, d6, d7;
      var dataOff = 0;
      var i;
      var I8 = 8;
      var I64 = 64;
      for (i = 0;i < I8; ++i) {
        d0 = data[dataOff];
        d1 = data[dataOff + 1];
        d2 = data[dataOff + 2];
        d3 = data[dataOff + 3];
        d4 = data[dataOff + 4];
        d5 = data[dataOff + 5];
        d6 = data[dataOff + 6];
        d7 = data[dataOff + 7];
        var tmp0 = d0 + d7;
        var tmp7 = d0 - d7;
        var tmp1 = d1 + d6;
        var tmp6 = d1 - d6;
        var tmp2 = d2 + d5;
        var tmp5 = d2 - d5;
        var tmp3 = d3 + d4;
        var tmp4 = d3 - d4;
        var tmp10 = tmp0 + tmp3;
        var tmp13 = tmp0 - tmp3;
        var tmp11 = tmp1 + tmp2;
        var tmp12 = tmp1 - tmp2;
        data[dataOff] = tmp10 + tmp11;
        data[dataOff + 4] = tmp10 - tmp11;
        var z1 = (tmp12 + tmp13) * 0.707106781;
        data[dataOff + 2] = tmp13 + z1;
        data[dataOff + 6] = tmp13 - z1;
        tmp10 = tmp4 + tmp5;
        tmp11 = tmp5 + tmp6;
        tmp12 = tmp6 + tmp7;
        var z5 = (tmp10 - tmp12) * 0.382683433;
        var z2 = 0.5411961 * tmp10 + z5;
        var z4 = 1.306562965 * tmp12 + z5;
        var z3 = tmp11 * 0.707106781;
        var z11 = tmp7 + z3;
        var z13 = tmp7 - z3;
        data[dataOff + 5] = z13 + z2;
        data[dataOff + 3] = z13 - z2;
        data[dataOff + 1] = z11 + z4;
        data[dataOff + 7] = z11 - z4;
        dataOff += 8;
      }
      dataOff = 0;
      for (i = 0;i < I8; ++i) {
        d0 = data[dataOff];
        d1 = data[dataOff + 8];
        d2 = data[dataOff + 16];
        d3 = data[dataOff + 24];
        d4 = data[dataOff + 32];
        d5 = data[dataOff + 40];
        d6 = data[dataOff + 48];
        d7 = data[dataOff + 56];
        var tmp0p2 = d0 + d7;
        var tmp7p2 = d0 - d7;
        var tmp1p2 = d1 + d6;
        var tmp6p2 = d1 - d6;
        var tmp2p2 = d2 + d5;
        var tmp5p2 = d2 - d5;
        var tmp3p2 = d3 + d4;
        var tmp4p2 = d3 - d4;
        var tmp10p2 = tmp0p2 + tmp3p2;
        var tmp13p2 = tmp0p2 - tmp3p2;
        var tmp11p2 = tmp1p2 + tmp2p2;
        var tmp12p2 = tmp1p2 - tmp2p2;
        data[dataOff] = tmp10p2 + tmp11p2;
        data[dataOff + 32] = tmp10p2 - tmp11p2;
        var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781;
        data[dataOff + 16] = tmp13p2 + z1p2;
        data[dataOff + 48] = tmp13p2 - z1p2;
        tmp10p2 = tmp4p2 + tmp5p2;
        tmp11p2 = tmp5p2 + tmp6p2;
        tmp12p2 = tmp6p2 + tmp7p2;
        var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433;
        var z2p2 = 0.5411961 * tmp10p2 + z5p2;
        var z4p2 = 1.306562965 * tmp12p2 + z5p2;
        var z3p2 = tmp11p2 * 0.707106781;
        var z11p2 = tmp7p2 + z3p2;
        var z13p2 = tmp7p2 - z3p2;
        data[dataOff + 40] = z13p2 + z2p2;
        data[dataOff + 24] = z13p2 - z2p2;
        data[dataOff + 8] = z11p2 + z4p2;
        data[dataOff + 56] = z11p2 - z4p2;
        dataOff++;
      }
      var fDCTQuant;
      for (i = 0;i < I64; ++i) {
        fDCTQuant = data[i] * fdtbl[i];
        outputfDCTQuant[i] = fDCTQuant > 0 ? fDCTQuant + 0.5 | 0 : fDCTQuant - 0.5 | 0;
      }
      return outputfDCTQuant;
    }
    function writeAPP0() {
      writeWord(65504);
      writeWord(16);
      writeByte(74);
      writeByte(70);
      writeByte(73);
      writeByte(70);
      writeByte(0);
      writeByte(1);
      writeByte(1);
      writeByte(0);
      writeWord(1);
      writeWord(1);
      writeByte(0);
      writeByte(0);
    }
    function writeAPP1(exifBuffer) {
      if (!exifBuffer)
        return;
      writeWord(65505);
      if (exifBuffer[0] === 69 && exifBuffer[1] === 120 && exifBuffer[2] === 105 && exifBuffer[3] === 102) {
        writeWord(exifBuffer.length + 2);
      } else {
        writeWord(exifBuffer.length + 5 + 2);
        writeByte(69);
        writeByte(120);
        writeByte(105);
        writeByte(102);
        writeByte(0);
      }
      for (var i = 0;i < exifBuffer.length; i++) {
        writeByte(exifBuffer[i]);
      }
    }
    function writeSOF0(width, height) {
      writeWord(65472);
      writeWord(17);
      writeByte(8);
      writeWord(height);
      writeWord(width);
      writeByte(3);
      writeByte(1);
      writeByte(17);
      writeByte(0);
      writeByte(2);
      writeByte(17);
      writeByte(1);
      writeByte(3);
      writeByte(17);
      writeByte(1);
    }
    function writeDQT() {
      writeWord(65499);
      writeWord(132);
      writeByte(0);
      for (var i = 0;i < 64; i++) {
        writeByte(YTable[i]);
      }
      writeByte(1);
      for (var j = 0;j < 64; j++) {
        writeByte(UVTable[j]);
      }
    }
    function writeDHT() {
      writeWord(65476);
      writeWord(418);
      writeByte(0);
      for (var i = 0;i < 16; i++) {
        writeByte(std_dc_luminance_nrcodes[i + 1]);
      }
      for (var j = 0;j <= 11; j++) {
        writeByte(std_dc_luminance_values[j]);
      }
      writeByte(16);
      for (var k = 0;k < 16; k++) {
        writeByte(std_ac_luminance_nrcodes[k + 1]);
      }
      for (var l = 0;l <= 161; l++) {
        writeByte(std_ac_luminance_values[l]);
      }
      writeByte(1);
      for (var m = 0;m < 16; m++) {
        writeByte(std_dc_chrominance_nrcodes[m + 1]);
      }
      for (var n = 0;n <= 11; n++) {
        writeByte(std_dc_chrominance_values[n]);
      }
      writeByte(17);
      for (var o = 0;o < 16; o++) {
        writeByte(std_ac_chrominance_nrcodes[o + 1]);
      }
      for (var p = 0;p <= 161; p++) {
        writeByte(std_ac_chrominance_values[p]);
      }
    }
    function writeCOM(comments) {
      if (typeof comments === "undefined" || comments.constructor !== Array)
        return;
      comments.forEach((e) => {
        if (typeof e !== "string")
          return;
        writeWord(65534);
        var l = e.length;
        writeWord(l + 2);
        var i;
        for (i = 0;i < l; i++)
          writeByte(e.charCodeAt(i));
      });
    }
    function writeSOS() {
      writeWord(65498);
      writeWord(12);
      writeByte(3);
      writeByte(1);
      writeByte(0);
      writeByte(2);
      writeByte(17);
      writeByte(3);
      writeByte(17);
      writeByte(0);
      writeByte(63);
      writeByte(0);
    }
    function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
      var EOB = HTAC[0];
      var M16zeroes = HTAC[240];
      var pos;
      var I16 = 16;
      var I63 = 63;
      var I64 = 64;
      var DU_DCT = fDCTQuant(CDU, fdtbl);
      for (var j = 0;j < I64; ++j) {
        DU[ZigZag[j]] = DU_DCT[j];
      }
      var Diff = DU[0] - DC;
      DC = DU[0];
      if (Diff == 0) {
        writeBits(HTDC[0]);
      } else {
        pos = 32767 + Diff;
        writeBits(HTDC[category[pos]]);
        writeBits(bitcode[pos]);
      }
      var end0pos = 63;
      for (;end0pos > 0 && DU[end0pos] == 0; end0pos--) {}
      if (end0pos == 0) {
        writeBits(EOB);
        return DC;
      }
      var i = 1;
      var lng;
      while (i <= end0pos) {
        var startpos = i;
        for (;DU[i] == 0 && i <= end0pos; ++i) {}
        var nrzeroes = i - startpos;
        if (nrzeroes >= I16) {
          lng = nrzeroes >> 4;
          for (var nrmarker = 1;nrmarker <= lng; ++nrmarker)
            writeBits(M16zeroes);
          nrzeroes = nrzeroes & 15;
        }
        pos = 32767 + DU[i];
        writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
        writeBits(bitcode[pos]);
        i++;
      }
      if (end0pos != I63) {
        writeBits(EOB);
      }
      return DC;
    }
    function initCharLookupTable() {
      var sfcc = String.fromCharCode;
      for (var i = 0;i < 256; i++) {
        clt[i] = sfcc(i);
      }
    }
    this.encode = function(image, quality) {
      var time_start = new Date().getTime();
      if (quality)
        setQuality(quality);
      byteout = new Array;
      bytenew = 0;
      bytepos = 7;
      writeWord(65496);
      writeAPP0();
      writeCOM(image.comments);
      writeAPP1(image.exifBuffer);
      writeDQT();
      writeSOF0(image.width, image.height);
      writeDHT();
      writeSOS();
      var DCY = 0;
      var DCU = 0;
      var DCV = 0;
      bytenew = 0;
      bytepos = 7;
      this.encode.displayName = "_encode_";
      var imageData = image.data;
      var width = image.width;
      var height = image.height;
      var quadWidth = width * 4;
      var tripleWidth = width * 3;
      var x, y = 0;
      var r, g, b;
      var start, p, col, row, pos;
      while (y < height) {
        x = 0;
        while (x < quadWidth) {
          start = quadWidth * y + x;
          p = start;
          col = -1;
          row = 0;
          for (pos = 0;pos < 64; pos++) {
            row = pos >> 3;
            col = (pos & 7) * 4;
            p = start + row * quadWidth + col;
            if (y + row >= height) {
              p -= quadWidth * (y + 1 + row - height);
            }
            if (x + col >= quadWidth) {
              p -= x + col - quadWidth + 4;
            }
            r = imageData[p++];
            g = imageData[p++];
            b = imageData[p++];
            YDU[pos] = (RGB_YUV_TABLE[r] + RGB_YUV_TABLE[g + 256 >> 0] + RGB_YUV_TABLE[b + 512 >> 0] >> 16) - 128;
            UDU[pos] = (RGB_YUV_TABLE[r + 768 >> 0] + RGB_YUV_TABLE[g + 1024 >> 0] + RGB_YUV_TABLE[b + 1280 >> 0] >> 16) - 128;
            VDU[pos] = (RGB_YUV_TABLE[r + 1280 >> 0] + RGB_YUV_TABLE[g + 1536 >> 0] + RGB_YUV_TABLE[b + 1792 >> 0] >> 16) - 128;
          }
          DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
          DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
          DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
          x += 32;
        }
        y += 8;
      }
      if (bytepos >= 0) {
        var fillbits = [];
        fillbits[1] = bytepos + 1;
        fillbits[0] = (1 << bytepos + 1) - 1;
        writeBits(fillbits);
      }
      writeWord(65497);
      if (typeof module2 === "undefined")
        return new Uint8Array(byteout);
      return Buffer.from(byteout);
      var jpegDataUri = "data:image/jpeg;base64," + btoa(byteout.join(""));
      byteout = [];
      var duration = new Date().getTime() - time_start;
      return jpegDataUri;
    };
    function setQuality(quality) {
      if (quality <= 0) {
        quality = 1;
      }
      if (quality > 100) {
        quality = 100;
      }
      if (currentQuality == quality)
        return;
      var sf = 0;
      if (quality < 50) {
        sf = Math.floor(5000 / quality);
      } else {
        sf = Math.floor(200 - quality * 2);
      }
      initQuantTables(sf);
      currentQuality = quality;
    }
    function init() {
      var time_start = new Date().getTime();
      if (!quality)
        quality = 50;
      initCharLookupTable();
      initHuffmanTbl();
      initCategoryNumber();
      initRGBYUVTable();
      setQuality(quality);
      var duration = new Date().getTime() - time_start;
    }
    init();
  }
  if (typeof module2 !== "undefined") {
    module2.exports = encode;
  } else if (typeof window !== "undefined") {
    window["jpeg-js"] = window["jpeg-js"] || {};
    window["jpeg-js"].encode = encode;
  }
  function encode(imgData, qu) {
    if (typeof qu === "undefined")
      qu = 50;
    var encoder = new JPEGEncoder(qu);
    var data = encoder.encode(imgData, qu);
    return {
      data,
      width: imgData.width,
      height: imgData.height
    };
  }
});

// ../../node_modules/jpeg-js/lib/decoder.js
var require_decoder = __commonJS(function(exports2, module2) {
  var JpegImage = function jpegImage() {
    var dctZigZag = new Int32Array([
      0,
      1,
      8,
      16,
      9,
      2,
      3,
      10,
      17,
      24,
      32,
      25,
      18,
      11,
      4,
      5,
      12,
      19,
      26,
      33,
      40,
      48,
      41,
      34,
      27,
      20,
      13,
      6,
      7,
      14,
      21,
      28,
      35,
      42,
      49,
      56,
      57,
      50,
      43,
      36,
      29,
      22,
      15,
      23,
      30,
      37,
      44,
      51,
      58,
      59,
      52,
      45,
      38,
      31,
      39,
      46,
      53,
      60,
      61,
      54,
      47,
      55,
      62,
      63
    ]);
    var dctCos1 = 4017;
    var dctSin1 = 799;
    var dctCos3 = 3406;
    var dctSin3 = 2276;
    var dctCos6 = 1567;
    var dctSin6 = 3784;
    var dctSqrt2 = 5793;
    var dctSqrt1d2 = 2896;
    function constructor() {}
    function buildHuffmanTable(codeLengths, values) {
      var k = 0, code = [], i, j, length = 16;
      while (length > 0 && !codeLengths[length - 1])
        length--;
      code.push({ children: [], index: 0 });
      var p = code[0], q;
      for (i = 0;i < length; i++) {
        for (j = 0;j < codeLengths[i]; j++) {
          p = code.pop();
          p.children[p.index] = values[k];
          while (p.index > 0) {
            if (code.length === 0)
              throw new Error("Could not recreate Huffman Table");
            p = code.pop();
          }
          p.index++;
          code.push(p);
          while (code.length <= i) {
            code.push(q = { children: [], index: 0 });
            p.children[p.index] = q.children;
            p = q;
          }
          k++;
        }
        if (i + 1 < length) {
          code.push(q = { children: [], index: 0 });
          p.children[p.index] = q.children;
          p = q;
        }
      }
      return code[0].children;
    }
    function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive, opts) {
      var precision = frame.precision;
      var samplesPerLine = frame.samplesPerLine;
      var scanLines = frame.scanLines;
      var mcusPerLine = frame.mcusPerLine;
      var progressive = frame.progressive;
      var { maxH, maxV } = frame;
      var startOffset = offset, bitsData = 0, bitsCount = 0;
      function readBit() {
        if (bitsCount > 0) {
          bitsCount--;
          return bitsData >> bitsCount & 1;
        }
        bitsData = data[offset++];
        if (bitsData == 255) {
          var nextByte = data[offset++];
          if (nextByte) {
            throw new Error("unexpected marker: " + (bitsData << 8 | nextByte).toString(16));
          }
        }
        bitsCount = 7;
        return bitsData >>> 7;
      }
      function decodeHuffman(tree) {
        var node = tree, bit;
        while ((bit = readBit()) !== null) {
          node = node[bit];
          if (typeof node === "number")
            return node;
          if (typeof node !== "object")
            throw new Error("invalid huffman sequence");
        }
        return null;
      }
      function receive(length) {
        var n = 0;
        while (length > 0) {
          var bit = readBit();
          if (bit === null)
            return;
          n = n << 1 | bit;
          length--;
        }
        return n;
      }
      function receiveAndExtend(length) {
        var n = receive(length);
        if (n >= 1 << length - 1)
          return n;
        return n + (-1 << length) + 1;
      }
      function decodeBaseline(component, zz) {
        var t = decodeHuffman(component.huffmanTableDC);
        var diff = t === 0 ? 0 : receiveAndExtend(t);
        zz[0] = component.pred += diff;
        var k = 1;
        while (k < 64) {
          var rs = decodeHuffman(component.huffmanTableAC);
          var s = rs & 15, r = rs >> 4;
          if (s === 0) {
            if (r < 15)
              break;
            k += 16;
            continue;
          }
          k += r;
          var z = dctZigZag[k];
          zz[z] = receiveAndExtend(s);
          k++;
        }
      }
      function decodeDCFirst(component, zz) {
        var t = decodeHuffman(component.huffmanTableDC);
        var diff = t === 0 ? 0 : receiveAndExtend(t) << successive;
        zz[0] = component.pred += diff;
      }
      function decodeDCSuccessive(component, zz) {
        zz[0] |= readBit() << successive;
      }
      var eobrun = 0;
      function decodeACFirst(component, zz) {
        if (eobrun > 0) {
          eobrun--;
          return;
        }
        var k = spectralStart, e = spectralEnd;
        while (k <= e) {
          var rs = decodeHuffman(component.huffmanTableAC);
          var s = rs & 15, r = rs >> 4;
          if (s === 0) {
            if (r < 15) {
              eobrun = receive(r) + (1 << r) - 1;
              break;
            }
            k += 16;
            continue;
          }
          k += r;
          var z = dctZigZag[k];
          zz[z] = receiveAndExtend(s) * (1 << successive);
          k++;
        }
      }
      var successiveACState = 0, successiveACNextValue;
      function decodeACSuccessive(component, zz) {
        var k = spectralStart, e = spectralEnd, r = 0;
        while (k <= e) {
          var z = dctZigZag[k];
          var direction = zz[z] < 0 ? -1 : 1;
          switch (successiveACState) {
            case 0:
              var rs = decodeHuffman(component.huffmanTableAC);
              var s = rs & 15, r = rs >> 4;
              if (s === 0) {
                if (r < 15) {
                  eobrun = receive(r) + (1 << r);
                  successiveACState = 4;
                } else {
                  r = 16;
                  successiveACState = 1;
                }
              } else {
                if (s !== 1)
                  throw new Error("invalid ACn encoding");
                successiveACNextValue = receiveAndExtend(s);
                successiveACState = r ? 2 : 3;
              }
              continue;
            case 1:
            case 2:
              if (zz[z])
                zz[z] += (readBit() << successive) * direction;
              else {
                r--;
                if (r === 0)
                  successiveACState = successiveACState == 2 ? 3 : 0;
              }
              break;
            case 3:
              if (zz[z])
                zz[z] += (readBit() << successive) * direction;
              else {
                zz[z] = successiveACNextValue << successive;
                successiveACState = 0;
              }
              break;
            case 4:
              if (zz[z])
                zz[z] += (readBit() << successive) * direction;
              break;
          }
          k++;
        }
        if (successiveACState === 4) {
          eobrun--;
          if (eobrun === 0)
            successiveACState = 0;
        }
      }
      function decodeMcu(component, decode, mcu, row, col) {
        var mcuRow = mcu / mcusPerLine | 0;
        var mcuCol = mcu % mcusPerLine;
        var blockRow = mcuRow * component.v + row;
        var blockCol = mcuCol * component.h + col;
        if (component.blocks[blockRow] === undefined && opts.tolerantDecoding)
          return;
        decode(component, component.blocks[blockRow][blockCol]);
      }
      function decodeBlock(component, decode, mcu) {
        var blockRow = mcu / component.blocksPerLine | 0;
        var blockCol = mcu % component.blocksPerLine;
        if (component.blocks[blockRow] === undefined && opts.tolerantDecoding)
          return;
        decode(component, component.blocks[blockRow][blockCol]);
      }
      var componentsLength = components.length;
      var component, i, j, k, n;
      var decodeFn;
      if (progressive) {
        if (spectralStart === 0)
          decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
        else
          decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
      } else {
        decodeFn = decodeBaseline;
      }
      var mcu = 0, marker;
      var mcuExpected;
      if (componentsLength == 1) {
        mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
      } else {
        mcuExpected = mcusPerLine * frame.mcusPerColumn;
      }
      if (!resetInterval)
        resetInterval = mcuExpected;
      var h, v;
      while (mcu < mcuExpected) {
        for (i = 0;i < componentsLength; i++)
          components[i].pred = 0;
        eobrun = 0;
        if (componentsLength == 1) {
          component = components[0];
          for (n = 0;n < resetInterval; n++) {
            decodeBlock(component, decodeFn, mcu);
            mcu++;
          }
        } else {
          for (n = 0;n < resetInterval; n++) {
            for (i = 0;i < componentsLength; i++) {
              component = components[i];
              h = component.h;
              v = component.v;
              for (j = 0;j < v; j++) {
                for (k = 0;k < h; k++) {
                  decodeMcu(component, decodeFn, mcu, j, k);
                }
              }
            }
            mcu++;
            if (mcu === mcuExpected)
              break;
          }
        }
        if (mcu === mcuExpected) {
          do {
            if (data[offset] === 255) {
              if (data[offset + 1] !== 0) {
                break;
              }
            }
            offset += 1;
          } while (offset < data.length - 2);
        }
        bitsCount = 0;
        marker = data[offset] << 8 | data[offset + 1];
        if (marker < 65280) {
          throw new Error("marker was not found");
        }
        if (marker >= 65488 && marker <= 65495) {
          offset += 2;
        } else
          break;
      }
      return offset - startOffset;
    }
    function buildComponentData(frame, component) {
      var lines = [];
      var blocksPerLine = component.blocksPerLine;
      var blocksPerColumn = component.blocksPerColumn;
      var samplesPerLine = blocksPerLine << 3;
      var R = new Int32Array(64), r = new Uint8Array(64);
      function quantizeAndInverse(zz, dataOut, dataIn) {
        var qt = component.quantizationTable;
        var v0, v1, v2, v3, v4, v5, v6, v7, t;
        var p = dataIn;
        var i;
        for (i = 0;i < 64; i++)
          p[i] = zz[i] * qt[i];
        for (i = 0;i < 8; ++i) {
          var row = 8 * i;
          if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 && p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 && p[7 + row] == 0) {
            t = dctSqrt2 * p[0 + row] + 512 >> 10;
            p[0 + row] = t;
            p[1 + row] = t;
            p[2 + row] = t;
            p[3 + row] = t;
            p[4 + row] = t;
            p[5 + row] = t;
            p[6 + row] = t;
            p[7 + row] = t;
            continue;
          }
          v0 = dctSqrt2 * p[0 + row] + 128 >> 8;
          v1 = dctSqrt2 * p[4 + row] + 128 >> 8;
          v2 = p[2 + row];
          v3 = p[6 + row];
          v4 = dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128 >> 8;
          v7 = dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128 >> 8;
          v5 = p[3 + row] << 4;
          v6 = p[5 + row] << 4;
          t = v0 - v1 + 1 >> 1;
          v0 = v0 + v1 + 1 >> 1;
          v1 = t;
          t = v2 * dctSin6 + v3 * dctCos6 + 128 >> 8;
          v2 = v2 * dctCos6 - v3 * dctSin6 + 128 >> 8;
          v3 = t;
          t = v4 - v6 + 1 >> 1;
          v4 = v4 + v6 + 1 >> 1;
          v6 = t;
          t = v7 + v5 + 1 >> 1;
          v5 = v7 - v5 + 1 >> 1;
          v7 = t;
          t = v0 - v3 + 1 >> 1;
          v0 = v0 + v3 + 1 >> 1;
          v3 = t;
          t = v1 - v2 + 1 >> 1;
          v1 = v1 + v2 + 1 >> 1;
          v2 = t;
          t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
          v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
          v7 = t;
          t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
          v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
          v6 = t;
          p[0 + row] = v0 + v7;
          p[7 + row] = v0 - v7;
          p[1 + row] = v1 + v6;
          p[6 + row] = v1 - v6;
          p[2 + row] = v2 + v5;
          p[5 + row] = v2 - v5;
          p[3 + row] = v3 + v4;
          p[4 + row] = v3 - v4;
        }
        for (i = 0;i < 8; ++i) {
          var col = i;
          if (p[1 * 8 + col] == 0 && p[2 * 8 + col] == 0 && p[3 * 8 + col] == 0 && p[4 * 8 + col] == 0 && p[5 * 8 + col] == 0 && p[6 * 8 + col] == 0 && p[7 * 8 + col] == 0) {
            t = dctSqrt2 * dataIn[i + 0] + 8192 >> 14;
            p[0 * 8 + col] = t;
            p[1 * 8 + col] = t;
            p[2 * 8 + col] = t;
            p[3 * 8 + col] = t;
            p[4 * 8 + col] = t;
            p[5 * 8 + col] = t;
            p[6 * 8 + col] = t;
            p[7 * 8 + col] = t;
            continue;
          }
          v0 = dctSqrt2 * p[0 * 8 + col] + 2048 >> 12;
          v1 = dctSqrt2 * p[4 * 8 + col] + 2048 >> 12;
          v2 = p[2 * 8 + col];
          v3 = p[6 * 8 + col];
          v4 = dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048 >> 12;
          v7 = dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048 >> 12;
          v5 = p[3 * 8 + col];
          v6 = p[5 * 8 + col];
          t = v0 - v1 + 1 >> 1;
          v0 = v0 + v1 + 1 >> 1;
          v1 = t;
          t = v2 * dctSin6 + v3 * dctCos6 + 2048 >> 12;
          v2 = v2 * dctCos6 - v3 * dctSin6 + 2048 >> 12;
          v3 = t;
          t = v4 - v6 + 1 >> 1;
          v4 = v4 + v6 + 1 >> 1;
          v6 = t;
          t = v7 + v5 + 1 >> 1;
          v5 = v7 - v5 + 1 >> 1;
          v7 = t;
          t = v0 - v3 + 1 >> 1;
          v0 = v0 + v3 + 1 >> 1;
          v3 = t;
          t = v1 - v2 + 1 >> 1;
          v1 = v1 + v2 + 1 >> 1;
          v2 = t;
          t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
          v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
          v7 = t;
          t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
          v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
          v6 = t;
          p[0 * 8 + col] = v0 + v7;
          p[7 * 8 + col] = v0 - v7;
          p[1 * 8 + col] = v1 + v6;
          p[6 * 8 + col] = v1 - v6;
          p[2 * 8 + col] = v2 + v5;
          p[5 * 8 + col] = v2 - v5;
          p[3 * 8 + col] = v3 + v4;
          p[4 * 8 + col] = v3 - v4;
        }
        for (i = 0;i < 64; ++i) {
          var sample = 128 + (p[i] + 8 >> 4);
          dataOut[i] = sample < 0 ? 0 : sample > 255 ? 255 : sample;
        }
      }
      requestMemoryAllocation(samplesPerLine * blocksPerColumn * 8);
      var i, j;
      for (var blockRow = 0;blockRow < blocksPerColumn; blockRow++) {
        var scanLine = blockRow << 3;
        for (i = 0;i < 8; i++)
          lines.push(new Uint8Array(samplesPerLine));
        for (var blockCol = 0;blockCol < blocksPerLine; blockCol++) {
          quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);
          var offset = 0, sample = blockCol << 3;
          for (j = 0;j < 8; j++) {
            var line = lines[scanLine + j];
            for (i = 0;i < 8; i++)
              line[sample + i] = r[offset++];
          }
        }
      }
      return lines;
    }
    function clampTo8bit(a) {
      return a < 0 ? 0 : a > 255 ? 255 : a;
    }
    constructor.prototype = {
      load: function load(path) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", path, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
          var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
          this.parse(data);
          if (this.onload)
            this.onload();
        }.bind(this);
        xhr.send(null);
      },
      parse: function parse(data) {
        var maxResolutionInPixels = this.opts.maxResolutionInMP * 1000 * 1000;
        var offset = 0, length = data.length;
        function readUint16() {
          var value = data[offset] << 8 | data[offset + 1];
          offset += 2;
          return value;
        }
        function readDataBlock() {
          var length = readUint16();
          var array = data.subarray(offset, offset + length - 2);
          offset += array.length;
          return array;
        }
        function prepareComponents(frame) {
          var maxH = 1, maxV = 1;
          var component, componentId;
          for (componentId in frame.components) {
            if (frame.components.hasOwnProperty(componentId)) {
              component = frame.components[componentId];
              if (maxH < component.h)
                maxH = component.h;
              if (maxV < component.v)
                maxV = component.v;
            }
          }
          var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
          var mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
          for (componentId in frame.components) {
            if (frame.components.hasOwnProperty(componentId)) {
              component = frame.components[componentId];
              var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
              var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / maxV);
              var blocksPerLineForMcu = mcusPerLine * component.h;
              var blocksPerColumnForMcu = mcusPerColumn * component.v;
              var blocksToAllocate = blocksPerColumnForMcu * blocksPerLineForMcu;
              var blocks = [];
              requestMemoryAllocation(blocksToAllocate * 256);
              for (var i = 0;i < blocksPerColumnForMcu; i++) {
                var row = [];
                for (var j = 0;j < blocksPerLineForMcu; j++)
                  row.push(new Int32Array(64));
                blocks.push(row);
              }
              component.blocksPerLine = blocksPerLine;
              component.blocksPerColumn = blocksPerColumn;
              component.blocks = blocks;
            }
          }
          frame.maxH = maxH;
          frame.maxV = maxV;
          frame.mcusPerLine = mcusPerLine;
          frame.mcusPerColumn = mcusPerColumn;
        }
        var jfif = null;
        var adobe = null;
        var pixels = null;
        var frame, resetInterval;
        var quantizationTables = [], frames = [];
        var huffmanTablesAC = [], huffmanTablesDC = [];
        var fileMarker = readUint16();
        var malformedDataOffset = -1;
        this.comments = [];
        if (fileMarker != 65496) {
          throw new Error("SOI not found");
        }
        fileMarker = readUint16();
        while (fileMarker != 65497) {
          var i, j, l;
          switch (fileMarker) {
            case 65280:
              break;
            case 65504:
            case 65505:
            case 65506:
            case 65507:
            case 65508:
            case 65509:
            case 65510:
            case 65511:
            case 65512:
            case 65513:
            case 65514:
            case 65515:
            case 65516:
            case 65517:
            case 65518:
            case 65519:
            case 65534:
              var appData = readDataBlock();
              if (fileMarker === 65534) {
                var comment = String.fromCharCode.apply(null, appData);
                this.comments.push(comment);
              }
              if (fileMarker === 65504) {
                if (appData[0] === 74 && appData[1] === 70 && appData[2] === 73 && appData[3] === 70 && appData[4] === 0) {
                  jfif = {
                    version: { major: appData[5], minor: appData[6] },
                    densityUnits: appData[7],
                    xDensity: appData[8] << 8 | appData[9],
                    yDensity: appData[10] << 8 | appData[11],
                    thumbWidth: appData[12],
                    thumbHeight: appData[13],
                    thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                  };
                }
              }
              if (fileMarker === 65505) {
                if (appData[0] === 69 && appData[1] === 120 && appData[2] === 105 && appData[3] === 102 && appData[4] === 0) {
                  this.exifBuffer = appData.subarray(5, appData.length);
                }
              }
              if (fileMarker === 65518) {
                if (appData[0] === 65 && appData[1] === 100 && appData[2] === 111 && appData[3] === 98 && appData[4] === 101 && appData[5] === 0) {
                  adobe = {
                    version: appData[6],
                    flags0: appData[7] << 8 | appData[8],
                    flags1: appData[9] << 8 | appData[10],
                    transformCode: appData[11]
                  };
                }
              }
              break;
            case 65499:
              var quantizationTablesLength = readUint16();
              var quantizationTablesEnd = quantizationTablesLength + offset - 2;
              while (offset < quantizationTablesEnd) {
                var quantizationTableSpec = data[offset++];
                requestMemoryAllocation(64 * 4);
                var tableData = new Int32Array(64);
                if (quantizationTableSpec >> 4 === 0) {
                  for (j = 0;j < 64; j++) {
                    var z = dctZigZag[j];
                    tableData[z] = data[offset++];
                  }
                } else if (quantizationTableSpec >> 4 === 1) {
                  for (j = 0;j < 64; j++) {
                    var z = dctZigZag[j];
                    tableData[z] = readUint16();
                  }
                } else
                  throw new Error("DQT: invalid table spec");
                quantizationTables[quantizationTableSpec & 15] = tableData;
              }
              break;
            case 65472:
            case 65473:
            case 65474:
              readUint16();
              frame = {};
              frame.extended = fileMarker === 65473;
              frame.progressive = fileMarker === 65474;
              frame.precision = data[offset++];
              frame.scanLines = readUint16();
              frame.samplesPerLine = readUint16();
              frame.components = {};
              frame.componentsOrder = [];
              var pixelsInFrame = frame.scanLines * frame.samplesPerLine;
              if (pixelsInFrame > maxResolutionInPixels) {
                var exceededAmount = Math.ceil((pixelsInFrame - maxResolutionInPixels) / 1e6);
                throw new Error(`maxResolutionInMP limit exceeded by ${exceededAmount}MP`);
              }
              var componentsCount = data[offset++], componentId;
              var maxH = 0, maxV = 0;
              for (i = 0;i < componentsCount; i++) {
                componentId = data[offset];
                var h = data[offset + 1] >> 4;
                var v = data[offset + 1] & 15;
                var qId = data[offset + 2];
                if (h <= 0 || v <= 0) {
                  throw new Error("Invalid sampling factor, expected values above 0");
                }
                frame.componentsOrder.push(componentId);
                frame.components[componentId] = {
                  h,
                  v,
                  quantizationIdx: qId
                };
                offset += 3;
              }
              prepareComponents(frame);
              frames.push(frame);
              break;
            case 65476:
              var huffmanLength = readUint16();
              for (i = 2;i < huffmanLength; ) {
                var huffmanTableSpec = data[offset++];
                var codeLengths = new Uint8Array(16);
                var codeLengthSum = 0;
                for (j = 0;j < 16; j++, offset++) {
                  codeLengthSum += codeLengths[j] = data[offset];
                }
                requestMemoryAllocation(16 + codeLengthSum);
                var huffmanValues = new Uint8Array(codeLengthSum);
                for (j = 0;j < codeLengthSum; j++, offset++)
                  huffmanValues[j] = data[offset];
                i += 17 + codeLengthSum;
                (huffmanTableSpec >> 4 === 0 ? huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
              }
              break;
            case 65501:
              readUint16();
              resetInterval = readUint16();
              break;
            case 65500:
              readUint16();
              readUint16();
              break;
            case 65498:
              var scanLength = readUint16();
              var selectorsCount = data[offset++];
              var components = [], component;
              for (i = 0;i < selectorsCount; i++) {
                component = frame.components[data[offset++]];
                var tableSpec = data[offset++];
                component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                components.push(component);
              }
              var spectralStart = data[offset++];
              var spectralEnd = data[offset++];
              var successiveApproximation = data[offset++];
              var processed = decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successiveApproximation >> 4, successiveApproximation & 15, this.opts);
              offset += processed;
              break;
            case 65535:
              if (data[offset] !== 255) {
                offset--;
              }
              break;
            default:
              if (data[offset - 3] == 255 && data[offset - 2] >= 192 && data[offset - 2] <= 254) {
                offset -= 3;
                break;
              } else if (fileMarker === 224 || fileMarker == 225) {
                if (malformedDataOffset !== -1) {
                  throw new Error(`first unknown JPEG marker at offset ${malformedDataOffset.toString(16)}, second unknown JPEG marker ${fileMarker.toString(16)} at offset ${(offset - 1).toString(16)}`);
                }
                malformedDataOffset = offset - 1;
                const nextOffset = readUint16();
                if (data[offset + nextOffset - 2] === 255) {
                  offset += nextOffset - 2;
                  break;
                }
              }
              throw new Error("unknown JPEG marker " + fileMarker.toString(16));
          }
          fileMarker = readUint16();
        }
        if (frames.length != 1)
          throw new Error("only single frame JPEGs supported");
        for (var i = 0;i < frames.length; i++) {
          var cp = frames[i].components;
          for (var j in cp) {
            cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
            delete cp[j].quantizationIdx;
          }
        }
        this.width = frame.samplesPerLine;
        this.height = frame.scanLines;
        this.jfif = jfif;
        this.adobe = adobe;
        this.components = [];
        for (var i = 0;i < frame.componentsOrder.length; i++) {
          var component = frame.components[frame.componentsOrder[i]];
          this.components.push({
            lines: buildComponentData(frame, component),
            scaleX: component.h / frame.maxH,
            scaleY: component.v / frame.maxV
          });
        }
      },
      getData: function getData(width, height) {
        var scaleX = this.width / width, scaleY = this.height / height;
        var component1, component2, component3, component4;
        var component1Line, component2Line, component3Line, component4Line;
        var x, y;
        var offset = 0;
        var Y, Cb, Cr, K, C, M, Ye, R, G, B;
        var colorTransform;
        var dataLength = width * height * this.components.length;
        requestMemoryAllocation(dataLength);
        var data = new Uint8Array(dataLength);
        switch (this.components.length) {
          case 1:
            component1 = this.components[0];
            for (y = 0;y < height; y++) {
              component1Line = component1.lines[0 | y * component1.scaleY * scaleY];
              for (x = 0;x < width; x++) {
                Y = component1Line[0 | x * component1.scaleX * scaleX];
                data[offset++] = Y;
              }
            }
            break;
          case 2:
            component1 = this.components[0];
            component2 = this.components[1];
            for (y = 0;y < height; y++) {
              component1Line = component1.lines[0 | y * component1.scaleY * scaleY];
              component2Line = component2.lines[0 | y * component2.scaleY * scaleY];
              for (x = 0;x < width; x++) {
                Y = component1Line[0 | x * component1.scaleX * scaleX];
                data[offset++] = Y;
                Y = component2Line[0 | x * component2.scaleX * scaleX];
                data[offset++] = Y;
              }
            }
            break;
          case 3:
            colorTransform = true;
            if (this.adobe && this.adobe.transformCode)
              colorTransform = true;
            else if (typeof this.opts.colorTransform !== "undefined")
              colorTransform = !!this.opts.colorTransform;
            component1 = this.components[0];
            component2 = this.components[1];
            component3 = this.components[2];
            for (y = 0;y < height; y++) {
              component1Line = component1.lines[0 | y * component1.scaleY * scaleY];
              component2Line = component2.lines[0 | y * component2.scaleY * scaleY];
              component3Line = component3.lines[0 | y * component3.scaleY * scaleY];
              for (x = 0;x < width; x++) {
                if (!colorTransform) {
                  R = component1Line[0 | x * component1.scaleX * scaleX];
                  G = component2Line[0 | x * component2.scaleX * scaleX];
                  B = component3Line[0 | x * component3.scaleX * scaleX];
                } else {
                  Y = component1Line[0 | x * component1.scaleX * scaleX];
                  Cb = component2Line[0 | x * component2.scaleX * scaleX];
                  Cr = component3Line[0 | x * component3.scaleX * scaleX];
                  R = clampTo8bit(Y + 1.402 * (Cr - 128));
                  G = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                  B = clampTo8bit(Y + 1.772 * (Cb - 128));
                }
                data[offset++] = R;
                data[offset++] = G;
                data[offset++] = B;
              }
            }
            break;
          case 4:
            if (!this.adobe)
              throw new Error("Unsupported color mode (4 components)");
            colorTransform = false;
            if (this.adobe && this.adobe.transformCode)
              colorTransform = true;
            else if (typeof this.opts.colorTransform !== "undefined")
              colorTransform = !!this.opts.colorTransform;
            component1 = this.components[0];
            component2 = this.components[1];
            component3 = this.components[2];
            component4 = this.components[3];
            for (y = 0;y < height; y++) {
              component1Line = component1.lines[0 | y * component1.scaleY * scaleY];
              component2Line = component2.lines[0 | y * component2.scaleY * scaleY];
              component3Line = component3.lines[0 | y * component3.scaleY * scaleY];
              component4Line = component4.lines[0 | y * component4.scaleY * scaleY];
              for (x = 0;x < width; x++) {
                if (!colorTransform) {
                  C = component1Line[0 | x * component1.scaleX * scaleX];
                  M = component2Line[0 | x * component2.scaleX * scaleX];
                  Ye = component3Line[0 | x * component3.scaleX * scaleX];
                  K = component4Line[0 | x * component4.scaleX * scaleX];
                } else {
                  Y = component1Line[0 | x * component1.scaleX * scaleX];
                  Cb = component2Line[0 | x * component2.scaleX * scaleX];
                  Cr = component3Line[0 | x * component3.scaleX * scaleX];
                  K = component4Line[0 | x * component4.scaleX * scaleX];
                  C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                  M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                  Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
                }
                data[offset++] = 255 - C;
                data[offset++] = 255 - M;
                data[offset++] = 255 - Ye;
                data[offset++] = 255 - K;
              }
            }
            break;
          default:
            throw new Error("Unsupported color mode");
        }
        return data;
      },
      copyToImageData: function copyToImageData(imageData, formatAsRGBA) {
        var { width, height } = imageData;
        var imageDataArray = imageData.data;
        var data = this.getData(width, height);
        var i = 0, j = 0, x, y;
        var Y, K, C, M, R, G, B;
        switch (this.components.length) {
          case 1:
            for (y = 0;y < height; y++) {
              for (x = 0;x < width; x++) {
                Y = data[i++];
                imageDataArray[j++] = Y;
                imageDataArray[j++] = Y;
                imageDataArray[j++] = Y;
                if (formatAsRGBA) {
                  imageDataArray[j++] = 255;
                }
              }
            }
            break;
          case 3:
            for (y = 0;y < height; y++) {
              for (x = 0;x < width; x++) {
                R = data[i++];
                G = data[i++];
                B = data[i++];
                imageDataArray[j++] = R;
                imageDataArray[j++] = G;
                imageDataArray[j++] = B;
                if (formatAsRGBA) {
                  imageDataArray[j++] = 255;
                }
              }
            }
            break;
          case 4:
            for (y = 0;y < height; y++) {
              for (x = 0;x < width; x++) {
                C = data[i++];
                M = data[i++];
                Y = data[i++];
                K = data[i++];
                R = 255 - clampTo8bit(C * (1 - K / 255) + K);
                G = 255 - clampTo8bit(M * (1 - K / 255) + K);
                B = 255 - clampTo8bit(Y * (1 - K / 255) + K);
                imageDataArray[j++] = R;
                imageDataArray[j++] = G;
                imageDataArray[j++] = B;
                if (formatAsRGBA) {
                  imageDataArray[j++] = 255;
                }
              }
            }
            break;
          default:
            throw new Error("Unsupported color mode");
        }
      }
    };
    var totalBytesAllocated = 0;
    var maxMemoryUsageBytes = 0;
    function requestMemoryAllocation(increaseAmount = 0) {
      var totalMemoryImpactBytes = totalBytesAllocated + increaseAmount;
      if (totalMemoryImpactBytes > maxMemoryUsageBytes) {
        var exceededAmount = Math.ceil((totalMemoryImpactBytes - maxMemoryUsageBytes) / 1024 / 1024);
        throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${exceededAmount}MB`);
      }
      totalBytesAllocated = totalMemoryImpactBytes;
    }
    constructor.resetMaxMemoryUsage = function(maxMemoryUsageBytes_) {
      totalBytesAllocated = 0;
      maxMemoryUsageBytes = maxMemoryUsageBytes_;
    };
    constructor.getBytesAllocated = function() {
      return totalBytesAllocated;
    };
    constructor.requestMemoryAllocation = requestMemoryAllocation;
    return constructor;
  }();
  if (typeof module2 !== "undefined") {
    module2.exports = decode;
  } else if (typeof window !== "undefined") {
    window["jpeg-js"] = window["jpeg-js"] || {};
    window["jpeg-js"].decode = decode;
  }
  function decode(jpegData, userOpts = {}) {
    var defaultOpts = {
      colorTransform: undefined,
      useTArray: false,
      formatAsRGBA: true,
      tolerantDecoding: true,
      maxResolutionInMP: 100,
      maxMemoryUsageInMB: 512
    };
    var opts = { ...defaultOpts, ...userOpts };
    var arr = new Uint8Array(jpegData);
    var decoder = new JpegImage;
    decoder.opts = opts;
    JpegImage.resetMaxMemoryUsage(opts.maxMemoryUsageInMB * 1024 * 1024);
    decoder.parse(arr);
    var channels = opts.formatAsRGBA ? 4 : 3;
    var bytesNeeded = decoder.width * decoder.height * channels;
    try {
      JpegImage.requestMemoryAllocation(bytesNeeded);
      var image = {
        width: decoder.width,
        height: decoder.height,
        exifBuffer: decoder.exifBuffer,
        data: opts.useTArray ? new Uint8Array(bytesNeeded) : Buffer.alloc(bytesNeeded)
      };
      if (decoder.comments.length > 0) {
        image["comments"] = decoder.comments;
      }
    } catch (err) {
      if (err instanceof RangeError) {
        throw new Error("Could not allocate enough memory for the image. " + "Required: " + bytesNeeded);
      }
      if (err instanceof ReferenceError) {
        if (err.message === "Buffer is not defined") {
          throw new Error("Buffer is not globally defined in this environment. " + "Consider setting useTArray to true");
        }
      }
      throw err;
    }
    decoder.copyToImageData(image, opts.formatAsRGBA);
    return image;
  }
});

// ../../node_modules/jpeg-js/index.js
var require_jpeg_js = __commonJS(function(exports2, module2) {
  var encode = require_encoder();
  var decode = require_decoder();
  module2.exports = {
    encode,
    decode
  };
});

// ../../node_modules/pngjs/lib/chunkstream.js
var require_chunkstream = __commonJS(function(exports2, module2) {
  var util = require("util");
  var Stream = require("stream");
  var ChunkStream = module2.exports = function() {
    Stream.call(this);
    this._buffers = [];
    this._buffered = 0;
    this._reads = [];
    this._paused = false;
    this._encoding = "utf8";
    this.writable = true;
  };
  util.inherits(ChunkStream, Stream);
  ChunkStream.prototype.read = function(length, callback) {
    this._reads.push({
      length: Math.abs(length),
      allowLess: length < 0,
      func: callback
    });
    process.nextTick(function() {
      this._process();
      if (this._paused && this._reads && this._reads.length > 0) {
        this._paused = false;
        this.emit("drain");
      }
    }.bind(this));
  };
  ChunkStream.prototype.write = function(data, encoding) {
    if (!this.writable) {
      this.emit("error", new Error("Stream not writable"));
      return false;
    }
    let dataBuffer;
    if (Buffer.isBuffer(data)) {
      dataBuffer = data;
    } else {
      dataBuffer = Buffer.from(data, encoding || this._encoding);
    }
    this._buffers.push(dataBuffer);
    this._buffered += dataBuffer.length;
    this._process();
    if (this._reads && this._reads.length === 0) {
      this._paused = true;
    }
    return this.writable && !this._paused;
  };
  ChunkStream.prototype.end = function(data, encoding) {
    if (data) {
      this.write(data, encoding);
    }
    this.writable = false;
    if (!this._buffers) {
      return;
    }
    if (this._buffers.length === 0) {
      this._end();
    } else {
      this._buffers.push(null);
      this._process();
    }
  };
  ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
  ChunkStream.prototype._end = function() {
    if (this._reads.length > 0) {
      this.emit("error", new Error("Unexpected end of input"));
    }
    this.destroy();
  };
  ChunkStream.prototype.destroy = function() {
    if (!this._buffers) {
      return;
    }
    this.writable = false;
    this._reads = null;
    this._buffers = null;
    this.emit("close");
  };
  ChunkStream.prototype._processReadAllowingLess = function(read) {
    this._reads.shift();
    let smallerBuf = this._buffers[0];
    if (smallerBuf.length > read.length) {
      this._buffered -= read.length;
      this._buffers[0] = smallerBuf.slice(read.length);
      read.func.call(this, smallerBuf.slice(0, read.length));
    } else {
      this._buffered -= smallerBuf.length;
      this._buffers.shift();
      read.func.call(this, smallerBuf);
    }
  };
  ChunkStream.prototype._processRead = function(read) {
    this._reads.shift();
    let pos = 0;
    let count = 0;
    let data = Buffer.alloc(read.length);
    while (pos < read.length) {
      let buf = this._buffers[count++];
      let len = Math.min(buf.length, read.length - pos);
      buf.copy(data, pos, 0, len);
      pos += len;
      if (len !== buf.length) {
        this._buffers[--count] = buf.slice(len);
      }
    }
    if (count > 0) {
      this._buffers.splice(0, count);
    }
    this._buffered -= read.length;
    read.func.call(this, data);
  };
  ChunkStream.prototype._process = function() {
    try {
      while (this._buffered > 0 && this._reads && this._reads.length > 0) {
        let read = this._reads[0];
        if (read.allowLess) {
          this._processReadAllowingLess(read);
        } else if (this._buffered >= read.length) {
          this._processRead(read);
        } else {
          break;
        }
      }
      if (this._buffers && !this.writable) {
        this._end();
      }
    } catch (ex) {
      this.emit("error", ex);
    }
  };
});

// ../../node_modules/pngjs/lib/interlace.js
var require_interlace = __commonJS(function(exports2) {
  var imagePasses = [
    {
      x: [0],
      y: [0]
    },
    {
      x: [4],
      y: [0]
    },
    {
      x: [0, 4],
      y: [4]
    },
    {
      x: [2, 6],
      y: [0, 4]
    },
    {
      x: [0, 2, 4, 6],
      y: [2, 6]
    },
    {
      x: [1, 3, 5, 7],
      y: [0, 2, 4, 6]
    },
    {
      x: [0, 1, 2, 3, 4, 5, 6, 7],
      y: [1, 3, 5, 7]
    }
  ];
  exports2.getImagePasses = function(width, height) {
    let images = [];
    let xLeftOver = width % 8;
    let yLeftOver = height % 8;
    let xRepeats = (width - xLeftOver) / 8;
    let yRepeats = (height - yLeftOver) / 8;
    for (let i = 0;i < imagePasses.length; i++) {
      let pass = imagePasses[i];
      let passWidth = xRepeats * pass.x.length;
      let passHeight = yRepeats * pass.y.length;
      for (let j = 0;j < pass.x.length; j++) {
        if (pass.x[j] < xLeftOver) {
          passWidth++;
        } else {
          break;
        }
      }
      for (let j = 0;j < pass.y.length; j++) {
        if (pass.y[j] < yLeftOver) {
          passHeight++;
        } else {
          break;
        }
      }
      if (passWidth > 0 && passHeight > 0) {
        images.push({ width: passWidth, height: passHeight, index: i });
      }
    }
    return images;
  };
  exports2.getInterlaceIterator = function(width) {
    return function(x, y, pass) {
      let outerXLeftOver = x % imagePasses[pass].x.length;
      let outerX = (x - outerXLeftOver) / imagePasses[pass].x.length * 8 + imagePasses[pass].x[outerXLeftOver];
      let outerYLeftOver = y % imagePasses[pass].y.length;
      let outerY = (y - outerYLeftOver) / imagePasses[pass].y.length * 8 + imagePasses[pass].y[outerYLeftOver];
      return outerX * 4 + outerY * width * 4;
    };
  };
});

// ../../node_modules/pngjs/lib/paeth-predictor.js
var require_paeth_predictor = __commonJS(function(exports2, module2) {
  module2.exports = function paethPredictor(left, above, upLeft) {
    let paeth = left + above - upLeft;
    let pLeft = Math.abs(paeth - left);
    let pAbove = Math.abs(paeth - above);
    let pUpLeft = Math.abs(paeth - upLeft);
    if (pLeft <= pAbove && pLeft <= pUpLeft) {
      return left;
    }
    if (pAbove <= pUpLeft) {
      return above;
    }
    return upLeft;
  };
});

// ../../node_modules/pngjs/lib/filter-parse.js
var require_filter_parse = __commonJS(function(exports2, module2) {
  var interlaceUtils = require_interlace();
  var paethPredictor = require_paeth_predictor();
  function getByteWidth(width, bpp, depth) {
    let byteWidth = width * bpp;
    if (depth !== 8) {
      byteWidth = Math.ceil(byteWidth / (8 / depth));
    }
    return byteWidth;
  }
  var Filter = module2.exports = function(bitmapInfo, dependencies) {
    let width = bitmapInfo.width;
    let height = bitmapInfo.height;
    let interlace = bitmapInfo.interlace;
    let bpp = bitmapInfo.bpp;
    let depth = bitmapInfo.depth;
    this.read = dependencies.read;
    this.write = dependencies.write;
    this.complete = dependencies.complete;
    this._imageIndex = 0;
    this._images = [];
    if (interlace) {
      let passes = interlaceUtils.getImagePasses(width, height);
      for (let i = 0;i < passes.length; i++) {
        this._images.push({
          byteWidth: getByteWidth(passes[i].width, bpp, depth),
          height: passes[i].height,
          lineIndex: 0
        });
      }
    } else {
      this._images.push({
        byteWidth: getByteWidth(width, bpp, depth),
        height,
        lineIndex: 0
      });
    }
    if (depth === 8) {
      this._xComparison = bpp;
    } else if (depth === 16) {
      this._xComparison = bpp * 2;
    } else {
      this._xComparison = 1;
    }
  };
  Filter.prototype.start = function() {
    this.read(this._images[this._imageIndex].byteWidth + 1, this._reverseFilterLine.bind(this));
  };
  Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison;
    let xBiggerThan = xComparison - 1;
    for (let x = 0;x < byteWidth; x++) {
      let rawByte = rawData[1 + x];
      let f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
      unfilteredLine[x] = rawByte + f1Left;
    }
  };
  Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
    let lastLine = this._lastLine;
    for (let x = 0;x < byteWidth; x++) {
      let rawByte = rawData[1 + x];
      let f2Up = lastLine ? lastLine[x] : 0;
      unfilteredLine[x] = rawByte + f2Up;
    }
  };
  Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison;
    let xBiggerThan = xComparison - 1;
    let lastLine = this._lastLine;
    for (let x = 0;x < byteWidth; x++) {
      let rawByte = rawData[1 + x];
      let f3Up = lastLine ? lastLine[x] : 0;
      let f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
      let f3Add = Math.floor((f3Left + f3Up) / 2);
      unfilteredLine[x] = rawByte + f3Add;
    }
  };
  Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison;
    let xBiggerThan = xComparison - 1;
    let lastLine = this._lastLine;
    for (let x = 0;x < byteWidth; x++) {
      let rawByte = rawData[1 + x];
      let f4Up = lastLine ? lastLine[x] : 0;
      let f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
      let f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
      let f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
      unfilteredLine[x] = rawByte + f4Add;
    }
  };
  Filter.prototype._reverseFilterLine = function(rawData) {
    let filter = rawData[0];
    let unfilteredLine;
    let currentImage = this._images[this._imageIndex];
    let byteWidth = currentImage.byteWidth;
    if (filter === 0) {
      unfilteredLine = rawData.slice(1, byteWidth + 1);
    } else {
      unfilteredLine = Buffer.alloc(byteWidth);
      switch (filter) {
        case 1:
          this._unFilterType1(rawData, unfilteredLine, byteWidth);
          break;
        case 2:
          this._unFilterType2(rawData, unfilteredLine, byteWidth);
          break;
        case 3:
          this._unFilterType3(rawData, unfilteredLine, byteWidth);
          break;
        case 4:
          this._unFilterType4(rawData, unfilteredLine, byteWidth);
          break;
        default:
          throw new Error("Unrecognised filter type - " + filter);
      }
    }
    this.write(unfilteredLine);
    currentImage.lineIndex++;
    if (currentImage.lineIndex >= currentImage.height) {
      this._lastLine = null;
      this._imageIndex++;
      currentImage = this._images[this._imageIndex];
    } else {
      this._lastLine = unfilteredLine;
    }
    if (currentImage) {
      this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
    } else {
      this._lastLine = null;
      this.complete();
    }
  };
});

// ../../node_modules/pngjs/lib/filter-parse-async.js
var require_filter_parse_async = __commonJS(function(exports2, module2) {
  var util = require("util");
  var ChunkStream = require_chunkstream();
  var Filter = require_filter_parse();
  var FilterAsync = module2.exports = function(bitmapInfo) {
    ChunkStream.call(this);
    let buffers = [];
    let that = this;
    this._filter = new Filter(bitmapInfo, {
      read: this.read.bind(this),
      write: function(buffer) {
        buffers.push(buffer);
      },
      complete: function() {
        that.emit("complete", Buffer.concat(buffers));
      }
    });
    this._filter.start();
  };
  util.inherits(FilterAsync, ChunkStream);
});

// ../../node_modules/pngjs/lib/constants.js
var require_constants = __commonJS(function(exports2, module2) {
  module2.exports = {
    PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
    TYPE_IHDR: 1229472850,
    TYPE_IEND: 1229278788,
    TYPE_IDAT: 1229209940,
    TYPE_PLTE: 1347179589,
    TYPE_tRNS: 1951551059,
    TYPE_gAMA: 1732332865,
    COLORTYPE_GRAYSCALE: 0,
    COLORTYPE_PALETTE: 1,
    COLORTYPE_COLOR: 2,
    COLORTYPE_ALPHA: 4,
    COLORTYPE_PALETTE_COLOR: 3,
    COLORTYPE_COLOR_ALPHA: 6,
    COLORTYPE_TO_BPP_MAP: {
      0: 1,
      2: 3,
      3: 1,
      4: 2,
      6: 4
    },
    GAMMA_DIVISION: 1e5
  };
});

// ../../node_modules/pngjs/lib/crc.js
var require_crc = __commonJS(function(exports2, module2) {
  var crcTable = [];
  (function() {
    for (let i = 0;i < 256; i++) {
      let currentCrc = i;
      for (let j = 0;j < 8; j++) {
        if (currentCrc & 1) {
          currentCrc = 3988292384 ^ currentCrc >>> 1;
        } else {
          currentCrc = currentCrc >>> 1;
        }
      }
      crcTable[i] = currentCrc;
    }
  })();
  var CrcCalculator = module2.exports = function() {
    this._crc = -1;
  };
  CrcCalculator.prototype.write = function(data) {
    for (let i = 0;i < data.length; i++) {
      this._crc = crcTable[(this._crc ^ data[i]) & 255] ^ this._crc >>> 8;
    }
    return true;
  };
  CrcCalculator.prototype.crc32 = function() {
    return this._crc ^ -1;
  };
  CrcCalculator.crc32 = function(buf) {
    let crc = -1;
    for (let i = 0;i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 255] ^ crc >>> 8;
    }
    return crc ^ -1;
  };
});

// ../../node_modules/pngjs/lib/parser.js
var require_parser = __commonJS(function(exports2, module2) {
  var constants = require_constants();
  var CrcCalculator = require_crc();
  var Parser = module2.exports = function(options, dependencies) {
    this._options = options;
    options.checkCRC = options.checkCRC !== false;
    this._hasIHDR = false;
    this._hasIEND = false;
    this._emittedHeadersFinished = false;
    this._palette = [];
    this._colorType = 0;
    this._chunks = {};
    this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
    this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
    this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);
    this._chunks[constants.TYPE_PLTE] = this._handlePLTE.bind(this);
    this._chunks[constants.TYPE_tRNS] = this._handleTRNS.bind(this);
    this._chunks[constants.TYPE_gAMA] = this._handleGAMA.bind(this);
    this.read = dependencies.read;
    this.error = dependencies.error;
    this.metadata = dependencies.metadata;
    this.gamma = dependencies.gamma;
    this.transColor = dependencies.transColor;
    this.palette = dependencies.palette;
    this.parsed = dependencies.parsed;
    this.inflateData = dependencies.inflateData;
    this.finished = dependencies.finished;
    this.simpleTransparency = dependencies.simpleTransparency;
    this.headersFinished = dependencies.headersFinished || function() {};
  };
  Parser.prototype.start = function() {
    this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this));
  };
  Parser.prototype._parseSignature = function(data) {
    let signature = constants.PNG_SIGNATURE;
    for (let i = 0;i < signature.length; i++) {
      if (data[i] !== signature[i]) {
        this.error(new Error("Invalid file signature"));
        return;
      }
    }
    this.read(8, this._parseChunkBegin.bind(this));
  };
  Parser.prototype._parseChunkBegin = function(data) {
    let length = data.readUInt32BE(0);
    let type = data.readUInt32BE(4);
    let name = "";
    for (let i = 4;i < 8; i++) {
      name += String.fromCharCode(data[i]);
    }
    let ancillary = Boolean(data[4] & 32);
    if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
      this.error(new Error("Expected IHDR on beggining"));
      return;
    }
    this._crc = new CrcCalculator;
    this._crc.write(Buffer.from(name));
    if (this._chunks[type]) {
      return this._chunks[type](length);
    }
    if (!ancillary) {
      this.error(new Error("Unsupported critical chunk type " + name));
      return;
    }
    this.read(length + 4, this._skipChunk.bind(this));
  };
  Parser.prototype._skipChunk = function() {
    this.read(8, this._parseChunkBegin.bind(this));
  };
  Parser.prototype._handleChunkEnd = function() {
    this.read(4, this._parseChunkEnd.bind(this));
  };
  Parser.prototype._parseChunkEnd = function(data) {
    let fileCrc = data.readInt32BE(0);
    let calcCrc = this._crc.crc32();
    if (this._options.checkCRC && calcCrc !== fileCrc) {
      this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
      return;
    }
    if (!this._hasIEND) {
      this.read(8, this._parseChunkBegin.bind(this));
    }
  };
  Parser.prototype._handleIHDR = function(length) {
    this.read(length, this._parseIHDR.bind(this));
  };
  Parser.prototype._parseIHDR = function(data) {
    this._crc.write(data);
    let width = data.readUInt32BE(0);
    let height = data.readUInt32BE(4);
    let depth = data[8];
    let colorType = data[9];
    let compr = data[10];
    let filter = data[11];
    let interlace = data[12];
    if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
      this.error(new Error("Unsupported bit depth " + depth));
      return;
    }
    if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
      this.error(new Error("Unsupported color type"));
      return;
    }
    if (compr !== 0) {
      this.error(new Error("Unsupported compression method"));
      return;
    }
    if (filter !== 0) {
      this.error(new Error("Unsupported filter method"));
      return;
    }
    if (interlace !== 0 && interlace !== 1) {
      this.error(new Error("Unsupported interlace method"));
      return;
    }
    this._colorType = colorType;
    let bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];
    this._hasIHDR = true;
    this.metadata({
      width,
      height,
      depth,
      interlace: Boolean(interlace),
      palette: Boolean(colorType & constants.COLORTYPE_PALETTE),
      color: Boolean(colorType & constants.COLORTYPE_COLOR),
      alpha: Boolean(colorType & constants.COLORTYPE_ALPHA),
      bpp,
      colorType
    });
    this._handleChunkEnd();
  };
  Parser.prototype._handlePLTE = function(length) {
    this.read(length, this._parsePLTE.bind(this));
  };
  Parser.prototype._parsePLTE = function(data) {
    this._crc.write(data);
    let entries = Math.floor(data.length / 3);
    for (let i = 0;i < entries; i++) {
      this._palette.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 255]);
    }
    this.palette(this._palette);
    this._handleChunkEnd();
  };
  Parser.prototype._handleTRNS = function(length) {
    this.simpleTransparency();
    this.read(length, this._parseTRNS.bind(this));
  };
  Parser.prototype._parseTRNS = function(data) {
    this._crc.write(data);
    if (this._colorType === constants.COLORTYPE_PALETTE_COLOR) {
      if (this._palette.length === 0) {
        this.error(new Error("Transparency chunk must be after palette"));
        return;
      }
      if (data.length > this._palette.length) {
        this.error(new Error("More transparent colors than palette size"));
        return;
      }
      for (let i = 0;i < data.length; i++) {
        this._palette[i][3] = data[i];
      }
      this.palette(this._palette);
    }
    if (this._colorType === constants.COLORTYPE_GRAYSCALE) {
      this.transColor([data.readUInt16BE(0)]);
    }
    if (this._colorType === constants.COLORTYPE_COLOR) {
      this.transColor([
        data.readUInt16BE(0),
        data.readUInt16BE(2),
        data.readUInt16BE(4)
      ]);
    }
    this._handleChunkEnd();
  };
  Parser.prototype._handleGAMA = function(length) {
    this.read(length, this._parseGAMA.bind(this));
  };
  Parser.prototype._parseGAMA = function(data) {
    this._crc.write(data);
    this.gamma(data.readUInt32BE(0) / constants.GAMMA_DIVISION);
    this._handleChunkEnd();
  };
  Parser.prototype._handleIDAT = function(length) {
    if (!this._emittedHeadersFinished) {
      this._emittedHeadersFinished = true;
      this.headersFinished();
    }
    this.read(-length, this._parseIDAT.bind(this, length));
  };
  Parser.prototype._parseIDAT = function(length, data) {
    this._crc.write(data);
    if (this._colorType === constants.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) {
      throw new Error("Expected palette not found");
    }
    this.inflateData(data);
    let leftOverLength = length - data.length;
    if (leftOverLength > 0) {
      this._handleIDAT(leftOverLength);
    } else {
      this._handleChunkEnd();
    }
  };
  Parser.prototype._handleIEND = function(length) {
    this.read(length, this._parseIEND.bind(this));
  };
  Parser.prototype._parseIEND = function(data) {
    this._crc.write(data);
    this._hasIEND = true;
    this._handleChunkEnd();
    if (this.finished) {
      this.finished();
    }
  };
});

// ../../node_modules/pngjs/lib/bitmapper.js
var require_bitmapper = __commonJS(function(exports2) {
  var interlaceUtils = require_interlace();
  var pixelBppMapper = [
    function() {},
    function(pxData, data, pxPos, rawPos) {
      if (rawPos === data.length) {
        throw new Error("Ran out of data");
      }
      let pixel = data[rawPos];
      pxData[pxPos] = pixel;
      pxData[pxPos + 1] = pixel;
      pxData[pxPos + 2] = pixel;
      pxData[pxPos + 3] = 255;
    },
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 1 >= data.length) {
        throw new Error("Ran out of data");
      }
      let pixel = data[rawPos];
      pxData[pxPos] = pixel;
      pxData[pxPos + 1] = pixel;
      pxData[pxPos + 2] = pixel;
      pxData[pxPos + 3] = data[rawPos + 1];
    },
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 2 >= data.length) {
        throw new Error("Ran out of data");
      }
      pxData[pxPos] = data[rawPos];
      pxData[pxPos + 1] = data[rawPos + 1];
      pxData[pxPos + 2] = data[rawPos + 2];
      pxData[pxPos + 3] = 255;
    },
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 3 >= data.length) {
        throw new Error("Ran out of data");
      }
      pxData[pxPos] = data[rawPos];
      pxData[pxPos + 1] = data[rawPos + 1];
      pxData[pxPos + 2] = data[rawPos + 2];
      pxData[pxPos + 3] = data[rawPos + 3];
    }
  ];
  var pixelBppCustomMapper = [
    function() {},
    function(pxData, pixelData, pxPos, maxBit) {
      let pixel = pixelData[0];
      pxData[pxPos] = pixel;
      pxData[pxPos + 1] = pixel;
      pxData[pxPos + 2] = pixel;
      pxData[pxPos + 3] = maxBit;
    },
    function(pxData, pixelData, pxPos) {
      let pixel = pixelData[0];
      pxData[pxPos] = pixel;
      pxData[pxPos + 1] = pixel;
      pxData[pxPos + 2] = pixel;
      pxData[pxPos + 3] = pixelData[1];
    },
    function(pxData, pixelData, pxPos, maxBit) {
      pxData[pxPos] = pixelData[0];
      pxData[pxPos + 1] = pixelData[1];
      pxData[pxPos + 2] = pixelData[2];
      pxData[pxPos + 3] = maxBit;
    },
    function(pxData, pixelData, pxPos) {
      pxData[pxPos] = pixelData[0];
      pxData[pxPos + 1] = pixelData[1];
      pxData[pxPos + 2] = pixelData[2];
      pxData[pxPos + 3] = pixelData[3];
    }
  ];
  function bitRetriever(data, depth) {
    let leftOver = [];
    let i = 0;
    function split() {
      if (i === data.length) {
        throw new Error("Ran out of data");
      }
      let byte = data[i];
      i++;
      let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
      switch (depth) {
        default:
          throw new Error("unrecognised depth");
        case 16:
          byte2 = data[i];
          i++;
          leftOver.push((byte << 8) + byte2);
          break;
        case 4:
          byte2 = byte & 15;
          byte1 = byte >> 4;
          leftOver.push(byte1, byte2);
          break;
        case 2:
          byte4 = byte & 3;
          byte3 = byte >> 2 & 3;
          byte2 = byte >> 4 & 3;
          byte1 = byte >> 6 & 3;
          leftOver.push(byte1, byte2, byte3, byte4);
          break;
        case 1:
          byte8 = byte & 1;
          byte7 = byte >> 1 & 1;
          byte6 = byte >> 2 & 1;
          byte5 = byte >> 3 & 1;
          byte4 = byte >> 4 & 1;
          byte3 = byte >> 5 & 1;
          byte2 = byte >> 6 & 1;
          byte1 = byte >> 7 & 1;
          leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
          break;
      }
    }
    return {
      get: function(count) {
        while (leftOver.length < count) {
          split();
        }
        let returner = leftOver.slice(0, count);
        leftOver = leftOver.slice(count);
        return returner;
      },
      resetAfterLine: function() {
        leftOver.length = 0;
      },
      end: function() {
        if (i !== data.length) {
          throw new Error("extra data found");
        }
      }
    };
  }
  function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
    let imageWidth = image.width;
    let imageHeight = image.height;
    let imagePass = image.index;
    for (let y = 0;y < imageHeight; y++) {
      for (let x = 0;x < imageWidth; x++) {
        let pxPos = getPxPos(x, y, imagePass);
        pixelBppMapper[bpp](pxData, data, pxPos, rawPos);
        rawPos += bpp;
      }
    }
    return rawPos;
  }
  function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
    let imageWidth = image.width;
    let imageHeight = image.height;
    let imagePass = image.index;
    for (let y = 0;y < imageHeight; y++) {
      for (let x = 0;x < imageWidth; x++) {
        let pixelData = bits.get(bpp);
        let pxPos = getPxPos(x, y, imagePass);
        pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
      }
      bits.resetAfterLine();
    }
  }
  exports2.dataToBitMap = function(data, bitmapInfo) {
    let width = bitmapInfo.width;
    let height = bitmapInfo.height;
    let depth = bitmapInfo.depth;
    let bpp = bitmapInfo.bpp;
    let interlace = bitmapInfo.interlace;
    let bits;
    if (depth !== 8) {
      bits = bitRetriever(data, depth);
    }
    let pxData;
    if (depth <= 8) {
      pxData = Buffer.alloc(width * height * 4);
    } else {
      pxData = new Uint16Array(width * height * 4);
    }
    let maxBit = Math.pow(2, depth) - 1;
    let rawPos = 0;
    let images;
    let getPxPos;
    if (interlace) {
      images = interlaceUtils.getImagePasses(width, height);
      getPxPos = interlaceUtils.getInterlaceIterator(width, height);
    } else {
      let nonInterlacedPxPos = 0;
      getPxPos = function() {
        let returner = nonInterlacedPxPos;
        nonInterlacedPxPos += 4;
        return returner;
      };
      images = [{ width, height }];
    }
    for (let imageIndex = 0;imageIndex < images.length; imageIndex++) {
      if (depth === 8) {
        rawPos = mapImage8Bit(images[imageIndex], pxData, getPxPos, bpp, data, rawPos);
      } else {
        mapImageCustomBit(images[imageIndex], pxData, getPxPos, bpp, bits, maxBit);
      }
    }
    if (depth === 8) {
      if (rawPos !== data.length) {
        throw new Error("extra data found");
      }
    } else {
      bits.end();
    }
    return pxData;
  };
});

// ../../node_modules/pngjs/lib/format-normaliser.js
var require_format_normaliser = __commonJS(function(exports2, module2) {
  function dePalette(indata, outdata, width, height, palette) {
    let pxPos = 0;
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        let color = palette[indata[pxPos]];
        if (!color) {
          throw new Error("index " + indata[pxPos] + " not in palette");
        }
        for (let i = 0;i < 4; i++) {
          outdata[pxPos + i] = color[i];
        }
        pxPos += 4;
      }
    }
  }
  function replaceTransparentColor(indata, outdata, width, height, transColor) {
    let pxPos = 0;
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        let makeTrans = false;
        if (transColor.length === 1) {
          if (transColor[0] === indata[pxPos]) {
            makeTrans = true;
          }
        } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2]) {
          makeTrans = true;
        }
        if (makeTrans) {
          for (let i = 0;i < 4; i++) {
            outdata[pxPos + i] = 0;
          }
        }
        pxPos += 4;
      }
    }
  }
  function scaleDepth(indata, outdata, width, height, depth) {
    let maxOutSample = 255;
    let maxInSample = Math.pow(2, depth) - 1;
    let pxPos = 0;
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        for (let i = 0;i < 4; i++) {
          outdata[pxPos + i] = Math.floor(indata[pxPos + i] * maxOutSample / maxInSample + 0.5);
        }
        pxPos += 4;
      }
    }
  }
  module2.exports = function(indata, imageData, skipRescale = false) {
    let depth = imageData.depth;
    let width = imageData.width;
    let height = imageData.height;
    let colorType = imageData.colorType;
    let transColor = imageData.transColor;
    let palette = imageData.palette;
    let outdata = indata;
    if (colorType === 3) {
      dePalette(indata, outdata, width, height, palette);
    } else {
      if (transColor) {
        replaceTransparentColor(indata, outdata, width, height, transColor);
      }
      if (depth !== 8 && !skipRescale) {
        if (depth === 16) {
          outdata = Buffer.alloc(width * height * 4);
        }
        scaleDepth(indata, outdata, width, height, depth);
      }
    }
    return outdata;
  };
});

// ../../node_modules/pngjs/lib/parser-async.js
var require_parser_async = __commonJS(function(exports2, module2) {
  var util = require("util");
  var zlib = require("zlib");
  var ChunkStream = require_chunkstream();
  var FilterAsync = require_filter_parse_async();
  var Parser = require_parser();
  var bitmapper = require_bitmapper();
  var formatNormaliser = require_format_normaliser();
  var ParserAsync = module2.exports = function(options) {
    ChunkStream.call(this);
    this._parser = new Parser(options, {
      read: this.read.bind(this),
      error: this._handleError.bind(this),
      metadata: this._handleMetaData.bind(this),
      gamma: this.emit.bind(this, "gamma"),
      palette: this._handlePalette.bind(this),
      transColor: this._handleTransColor.bind(this),
      finished: this._finished.bind(this),
      inflateData: this._inflateData.bind(this),
      simpleTransparency: this._simpleTransparency.bind(this),
      headersFinished: this._headersFinished.bind(this)
    });
    this._options = options;
    this.writable = true;
    this._parser.start();
  };
  util.inherits(ParserAsync, ChunkStream);
  ParserAsync.prototype._handleError = function(err) {
    this.emit("error", err);
    this.writable = false;
    this.destroy();
    if (this._inflate && this._inflate.destroy) {
      this._inflate.destroy();
    }
    if (this._filter) {
      this._filter.destroy();
      this._filter.on("error", function() {});
    }
    this.errord = true;
  };
  ParserAsync.prototype._inflateData = function(data) {
    if (!this._inflate) {
      if (this._bitmapInfo.interlace) {
        this._inflate = zlib.createInflate();
        this._inflate.on("error", this.emit.bind(this, "error"));
        this._filter.on("complete", this._complete.bind(this));
        this._inflate.pipe(this._filter);
      } else {
        let rowSize = (this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1;
        let imageSize = rowSize * this._bitmapInfo.height;
        let chunkSize = Math.max(imageSize, zlib.Z_MIN_CHUNK);
        this._inflate = zlib.createInflate({ chunkSize });
        let leftToInflate = imageSize;
        let emitError = this.emit.bind(this, "error");
        this._inflate.on("error", function(err) {
          if (!leftToInflate) {
            return;
          }
          emitError(err);
        });
        this._filter.on("complete", this._complete.bind(this));
        let filterWrite = this._filter.write.bind(this._filter);
        this._inflate.on("data", function(chunk) {
          if (!leftToInflate) {
            return;
          }
          if (chunk.length > leftToInflate) {
            chunk = chunk.slice(0, leftToInflate);
          }
          leftToInflate -= chunk.length;
          filterWrite(chunk);
        });
        this._inflate.on("end", this._filter.end.bind(this._filter));
      }
    }
    this._inflate.write(data);
  };
  ParserAsync.prototype._handleMetaData = function(metaData) {
    this._metaData = metaData;
    this._bitmapInfo = Object.create(metaData);
    this._filter = new FilterAsync(this._bitmapInfo);
  };
  ParserAsync.prototype._handleTransColor = function(transColor) {
    this._bitmapInfo.transColor = transColor;
  };
  ParserAsync.prototype._handlePalette = function(palette) {
    this._bitmapInfo.palette = palette;
  };
  ParserAsync.prototype._simpleTransparency = function() {
    this._metaData.alpha = true;
  };
  ParserAsync.prototype._headersFinished = function() {
    this.emit("metadata", this._metaData);
  };
  ParserAsync.prototype._finished = function() {
    if (this.errord) {
      return;
    }
    if (!this._inflate) {
      this.emit("error", "No Inflate block");
    } else {
      this._inflate.end();
    }
  };
  ParserAsync.prototype._complete = function(filteredData) {
    if (this.errord) {
      return;
    }
    let normalisedBitmapData;
    try {
      let bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);
      normalisedBitmapData = formatNormaliser(bitmapData, this._bitmapInfo, this._options.skipRescale);
      bitmapData = null;
    } catch (ex) {
      this._handleError(ex);
      return;
    }
    this.emit("parsed", normalisedBitmapData);
  };
});

// ../../node_modules/pngjs/lib/bitpacker.js
var require_bitpacker = __commonJS(function(exports2, module2) {
  var constants = require_constants();
  module2.exports = function(dataIn, width, height, options) {
    let outHasAlpha = [constants.COLORTYPE_COLOR_ALPHA, constants.COLORTYPE_ALPHA].indexOf(options.colorType) !== -1;
    if (options.colorType === options.inputColorType) {
      let bigEndian = function() {
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true);
        return new Int16Array(buffer)[0] !== 256;
      }();
      if (options.bitDepth === 8 || options.bitDepth === 16 && bigEndian) {
        return dataIn;
      }
    }
    let data = options.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer);
    let maxValue = 255;
    let inBpp = constants.COLORTYPE_TO_BPP_MAP[options.inputColorType];
    if (inBpp === 4 && !options.inputHasAlpha) {
      inBpp = 3;
    }
    let outBpp = constants.COLORTYPE_TO_BPP_MAP[options.colorType];
    if (options.bitDepth === 16) {
      maxValue = 65535;
      outBpp *= 2;
    }
    let outData = Buffer.alloc(width * height * outBpp);
    let inIndex = 0;
    let outIndex = 0;
    let bgColor = options.bgColor || {};
    if (bgColor.red === undefined) {
      bgColor.red = maxValue;
    }
    if (bgColor.green === undefined) {
      bgColor.green = maxValue;
    }
    if (bgColor.blue === undefined) {
      bgColor.blue = maxValue;
    }
    function getRGBA() {
      let red;
      let green;
      let blue;
      let alpha = maxValue;
      switch (options.inputColorType) {
        case constants.COLORTYPE_COLOR_ALPHA:
          alpha = data[inIndex + 3];
          red = data[inIndex];
          green = data[inIndex + 1];
          blue = data[inIndex + 2];
          break;
        case constants.COLORTYPE_COLOR:
          red = data[inIndex];
          green = data[inIndex + 1];
          blue = data[inIndex + 2];
          break;
        case constants.COLORTYPE_ALPHA:
          alpha = data[inIndex + 1];
          red = data[inIndex];
          green = red;
          blue = red;
          break;
        case constants.COLORTYPE_GRAYSCALE:
          red = data[inIndex];
          green = red;
          blue = red;
          break;
        default:
          throw new Error("input color type:" + options.inputColorType + " is not supported at present");
      }
      if (options.inputHasAlpha) {
        if (!outHasAlpha) {
          alpha /= maxValue;
          red = Math.min(Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0), maxValue);
          green = Math.min(Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0), maxValue);
          blue = Math.min(Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0), maxValue);
        }
      }
      return { red, green, blue, alpha };
    }
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        let rgba = getRGBA(data, inIndex);
        switch (options.colorType) {
          case constants.COLORTYPE_COLOR_ALPHA:
          case constants.COLORTYPE_COLOR:
            if (options.bitDepth === 8) {
              outData[outIndex] = rgba.red;
              outData[outIndex + 1] = rgba.green;
              outData[outIndex + 2] = rgba.blue;
              if (outHasAlpha) {
                outData[outIndex + 3] = rgba.alpha;
              }
            } else {
              outData.writeUInt16BE(rgba.red, outIndex);
              outData.writeUInt16BE(rgba.green, outIndex + 2);
              outData.writeUInt16BE(rgba.blue, outIndex + 4);
              if (outHasAlpha) {
                outData.writeUInt16BE(rgba.alpha, outIndex + 6);
              }
            }
            break;
          case constants.COLORTYPE_ALPHA:
          case constants.COLORTYPE_GRAYSCALE: {
            let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
            if (options.bitDepth === 8) {
              outData[outIndex] = grayscale;
              if (outHasAlpha) {
                outData[outIndex + 1] = rgba.alpha;
              }
            } else {
              outData.writeUInt16BE(grayscale, outIndex);
              if (outHasAlpha) {
                outData.writeUInt16BE(rgba.alpha, outIndex + 2);
              }
            }
            break;
          }
          default:
            throw new Error("unrecognised color Type " + options.colorType);
        }
        inIndex += inBpp;
        outIndex += outBpp;
      }
    }
    return outData;
  };
});

// ../../node_modules/pngjs/lib/filter-pack.js
var require_filter_pack = __commonJS(function(exports2, module2) {
  var paethPredictor = require_paeth_predictor();
  function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
    for (let x = 0;x < byteWidth; x++) {
      rawData[rawPos + x] = pxData[pxPos + x];
    }
  }
  function filterSumNone(pxData, pxPos, byteWidth) {
    let sum = 0;
    let length = pxPos + byteWidth;
    for (let i = pxPos;i < length; i++) {
      sum += Math.abs(pxData[i]);
    }
    return sum;
  }
  function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x = 0;x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let val = pxData[pxPos + x] - left;
      rawData[rawPos + x] = val;
    }
  }
  function filterSumSub(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x = 0;x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let val = pxData[pxPos + x] - left;
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
    for (let x = 0;x < byteWidth; x++) {
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let val = pxData[pxPos + x] - up;
      rawData[rawPos + x] = val;
    }
  }
  function filterSumUp(pxData, pxPos, byteWidth) {
    let sum = 0;
    let length = pxPos + byteWidth;
    for (let x = pxPos;x < length; x++) {
      let up = pxPos > 0 ? pxData[x - byteWidth] : 0;
      let val = pxData[x] - up;
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x = 0;x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let val = pxData[pxPos + x] - (left + up >> 1);
      rawData[rawPos + x] = val;
    }
  }
  function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x = 0;x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let val = pxData[pxPos + x] - (left + up >> 1);
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x = 0;x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
      let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
      rawData[rawPos + x] = val;
    }
  }
  function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x = 0;x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
      let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
      sum += Math.abs(val);
    }
    return sum;
  }
  var filters = {
    0: filterNone,
    1: filterSub,
    2: filterUp,
    3: filterAvg,
    4: filterPaeth
  };
  var filterSums = {
    0: filterSumNone,
    1: filterSumSub,
    2: filterSumUp,
    3: filterSumAvg,
    4: filterSumPaeth
  };
  module2.exports = function(pxData, width, height, options, bpp) {
    let filterTypes;
    if (!("filterType" in options) || options.filterType === -1) {
      filterTypes = [0, 1, 2, 3, 4];
    } else if (typeof options.filterType === "number") {
      filterTypes = [options.filterType];
    } else {
      throw new Error("unrecognised filter types");
    }
    if (options.bitDepth === 16) {
      bpp *= 2;
    }
    let byteWidth = width * bpp;
    let rawPos = 0;
    let pxPos = 0;
    let rawData = Buffer.alloc((byteWidth + 1) * height);
    let sel = filterTypes[0];
    for (let y = 0;y < height; y++) {
      if (filterTypes.length > 1) {
        let min = Infinity;
        for (let i = 0;i < filterTypes.length; i++) {
          let sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
          if (sum < min) {
            sel = filterTypes[i];
            min = sum;
          }
        }
      }
      rawData[rawPos] = sel;
      rawPos++;
      filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
      rawPos += byteWidth;
      pxPos += byteWidth;
    }
    return rawData;
  };
});

// ../../node_modules/pngjs/lib/packer.js
var require_packer = __commonJS(function(exports2, module2) {
  var constants = require_constants();
  var CrcStream = require_crc();
  var bitPacker = require_bitpacker();
  var filter = require_filter_pack();
  var zlib = require("zlib");
  var Packer = module2.exports = function(options) {
    this._options = options;
    options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
    options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
    options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
    options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
    options.deflateFactory = options.deflateFactory || zlib.createDeflate;
    options.bitDepth = options.bitDepth || 8;
    options.colorType = typeof options.colorType === "number" ? options.colorType : constants.COLORTYPE_COLOR_ALPHA;
    options.inputColorType = typeof options.inputColorType === "number" ? options.inputColorType : constants.COLORTYPE_COLOR_ALPHA;
    if ([
      constants.COLORTYPE_GRAYSCALE,
      constants.COLORTYPE_COLOR,
      constants.COLORTYPE_COLOR_ALPHA,
      constants.COLORTYPE_ALPHA
    ].indexOf(options.colorType) === -1) {
      throw new Error("option color type:" + options.colorType + " is not supported at present");
    }
    if ([
      constants.COLORTYPE_GRAYSCALE,
      constants.COLORTYPE_COLOR,
      constants.COLORTYPE_COLOR_ALPHA,
      constants.COLORTYPE_ALPHA
    ].indexOf(options.inputColorType) === -1) {
      throw new Error("option input color type:" + options.inputColorType + " is not supported at present");
    }
    if (options.bitDepth !== 8 && options.bitDepth !== 16) {
      throw new Error("option bit depth:" + options.bitDepth + " is not supported at present");
    }
  };
  Packer.prototype.getDeflateOptions = function() {
    return {
      chunkSize: this._options.deflateChunkSize,
      level: this._options.deflateLevel,
      strategy: this._options.deflateStrategy
    };
  };
  Packer.prototype.createDeflate = function() {
    return this._options.deflateFactory(this.getDeflateOptions());
  };
  Packer.prototype.filterData = function(data, width, height) {
    let packedData = bitPacker(data, width, height, this._options);
    let bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
    let filteredData = filter(packedData, width, height, this._options, bpp);
    return filteredData;
  };
  Packer.prototype._packChunk = function(type, data) {
    let len = data ? data.length : 0;
    let buf = Buffer.alloc(len + 12);
    buf.writeUInt32BE(len, 0);
    buf.writeUInt32BE(type, 4);
    if (data) {
      data.copy(buf, 8);
    }
    buf.writeInt32BE(CrcStream.crc32(buf.slice(4, buf.length - 4)), buf.length - 4);
    return buf;
  };
  Packer.prototype.packGAMA = function(gamma) {
    let buf = Buffer.alloc(4);
    buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
    return this._packChunk(constants.TYPE_gAMA, buf);
  };
  Packer.prototype.packIHDR = function(width, height) {
    let buf = Buffer.alloc(13);
    buf.writeUInt32BE(width, 0);
    buf.writeUInt32BE(height, 4);
    buf[8] = this._options.bitDepth;
    buf[9] = this._options.colorType;
    buf[10] = 0;
    buf[11] = 0;
    buf[12] = 0;
    return this._packChunk(constants.TYPE_IHDR, buf);
  };
  Packer.prototype.packIDAT = function(data) {
    return this._packChunk(constants.TYPE_IDAT, data);
  };
  Packer.prototype.packIEND = function() {
    return this._packChunk(constants.TYPE_IEND, null);
  };
});

// ../../node_modules/pngjs/lib/packer-async.js
var require_packer_async = __commonJS(function(exports2, module2) {
  var util = require("util");
  var Stream = require("stream");
  var constants = require_constants();
  var Packer = require_packer();
  var PackerAsync = module2.exports = function(opt) {
    Stream.call(this);
    let options = opt || {};
    this._packer = new Packer(options);
    this._deflate = this._packer.createDeflate();
    this.readable = true;
  };
  util.inherits(PackerAsync, Stream);
  PackerAsync.prototype.pack = function(data, width, height, gamma) {
    this.emit("data", Buffer.from(constants.PNG_SIGNATURE));
    this.emit("data", this._packer.packIHDR(width, height));
    if (gamma) {
      this.emit("data", this._packer.packGAMA(gamma));
    }
    let filteredData = this._packer.filterData(data, width, height);
    this._deflate.on("error", this.emit.bind(this, "error"));
    this._deflate.on("data", function(compressedData) {
      this.emit("data", this._packer.packIDAT(compressedData));
    }.bind(this));
    this._deflate.on("end", function() {
      this.emit("data", this._packer.packIEND());
      this.emit("end");
    }.bind(this));
    this._deflate.end(filteredData);
  };
});

// ../../node_modules/pngjs/lib/sync-inflate.js
var require_sync_inflate = __commonJS(function(exports2, module2) {
  var assert = require("assert").ok;
  var zlib = require("zlib");
  var util = require("util");
  var kMaxLength = require("buffer").kMaxLength;
  function Inflate(opts) {
    if (!(this instanceof Inflate)) {
      return new Inflate(opts);
    }
    if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
      opts.chunkSize = zlib.Z_MIN_CHUNK;
    }
    zlib.Inflate.call(this, opts);
    this._offset = this._offset === undefined ? this._outOffset : this._offset;
    this._buffer = this._buffer || this._outBuffer;
    if (opts && opts.maxLength != null) {
      this._maxLength = opts.maxLength;
    }
  }
  function createInflate(opts) {
    return new Inflate(opts);
  }
  function _close(engine, callback) {
    if (callback) {
      process.nextTick(callback);
    }
    if (!engine._handle) {
      return;
    }
    engine._handle.close();
    engine._handle = null;
  }
  Inflate.prototype._processChunk = function(chunk, flushFlag, asyncCb) {
    if (typeof asyncCb === "function") {
      return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
    }
    let self = this;
    let availInBefore = chunk && chunk.length;
    let availOutBefore = this._chunkSize - this._offset;
    let leftToInflate = this._maxLength;
    let inOff = 0;
    let buffers = [];
    let nread = 0;
    let error;
    this.on("error", function(err) {
      error = err;
    });
    function handleChunk(availInAfter, availOutAfter) {
      if (self._hadError) {
        return;
      }
      let have = availOutBefore - availOutAfter;
      assert(have >= 0, "have should not go down");
      if (have > 0) {
        let out = self._buffer.slice(self._offset, self._offset + have);
        self._offset += have;
        if (out.length > leftToInflate) {
          out = out.slice(0, leftToInflate);
        }
        buffers.push(out);
        nread += out.length;
        leftToInflate -= out.length;
        if (leftToInflate === 0) {
          return false;
        }
      }
      if (availOutAfter === 0 || self._offset >= self._chunkSize) {
        availOutBefore = self._chunkSize;
        self._offset = 0;
        self._buffer = Buffer.allocUnsafe(self._chunkSize);
      }
      if (availOutAfter === 0) {
        inOff += availInBefore - availInAfter;
        availInBefore = availInAfter;
        return true;
      }
      return false;
    }
    assert(this._handle, "zlib binding closed");
    let res;
    do {
      res = this._handle.writeSync(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore);
      res = res || this._writeState;
    } while (!this._hadError && handleChunk(res[0], res[1]));
    if (this._hadError) {
      throw error;
    }
    if (nread >= kMaxLength) {
      _close(this);
      throw new RangeError("Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes");
    }
    let buf = Buffer.concat(buffers, nread);
    _close(this);
    return buf;
  };
  util.inherits(Inflate, zlib.Inflate);
  function zlibBufferSync(engine, buffer) {
    if (typeof buffer === "string") {
      buffer = Buffer.from(buffer);
    }
    if (!(buffer instanceof Buffer)) {
      throw new TypeError("Not a string or buffer");
    }
    let flushFlag = engine._finishFlushFlag;
    if (flushFlag == null) {
      flushFlag = zlib.Z_FINISH;
    }
    return engine._processChunk(buffer, flushFlag);
  }
  function inflateSync(buffer, opts) {
    return zlibBufferSync(new Inflate(opts), buffer);
  }
  module2.exports = exports2 = inflateSync;
  exports2.Inflate = Inflate;
  exports2.createInflate = createInflate;
  exports2.inflateSync = inflateSync;
});

// ../../node_modules/pngjs/lib/sync-reader.js
var require_sync_reader = __commonJS(function(exports2, module2) {
  var SyncReader = module2.exports = function(buffer) {
    this._buffer = buffer;
    this._reads = [];
  };
  SyncReader.prototype.read = function(length, callback) {
    this._reads.push({
      length: Math.abs(length),
      allowLess: length < 0,
      func: callback
    });
  };
  SyncReader.prototype.process = function() {
    while (this._reads.length > 0 && this._buffer.length) {
      let read = this._reads[0];
      if (this._buffer.length && (this._buffer.length >= read.length || read.allowLess)) {
        this._reads.shift();
        let buf = this._buffer;
        this._buffer = buf.slice(read.length);
        read.func.call(this, buf.slice(0, read.length));
      } else {
        break;
      }
    }
    if (this._reads.length > 0) {
      throw new Error("There are some read requests waitng on finished stream");
    }
    if (this._buffer.length > 0) {
      throw new Error("unrecognised content at end of stream");
    }
  };
});

// ../../node_modules/pngjs/lib/filter-parse-sync.js
var require_filter_parse_sync = __commonJS(function(exports2) {
  var SyncReader = require_sync_reader();
  var Filter = require_filter_parse();
  exports2.process = function(inBuffer, bitmapInfo) {
    let outBuffers = [];
    let reader = new SyncReader(inBuffer);
    let filter = new Filter(bitmapInfo, {
      read: reader.read.bind(reader),
      write: function(bufferPart) {
        outBuffers.push(bufferPart);
      },
      complete: function() {}
    });
    filter.start();
    reader.process();
    return Buffer.concat(outBuffers);
  };
});

// ../../node_modules/pngjs/lib/parser-sync.js
var require_parser_sync = __commonJS(function(exports2, module2) {
  var hasSyncZlib = true;
  var zlib = require("zlib");
  var inflateSync = require_sync_inflate();
  if (!zlib.deflateSync) {
    hasSyncZlib = false;
  }
  var SyncReader = require_sync_reader();
  var FilterSync = require_filter_parse_sync();
  var Parser = require_parser();
  var bitmapper = require_bitmapper();
  var formatNormaliser = require_format_normaliser();
  module2.exports = function(buffer, options) {
    if (!hasSyncZlib) {
      throw new Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
    }
    let err;
    function handleError(_err_) {
      err = _err_;
    }
    let metaData;
    function handleMetaData(_metaData_) {
      metaData = _metaData_;
    }
    function handleTransColor(transColor) {
      metaData.transColor = transColor;
    }
    function handlePalette(palette) {
      metaData.palette = palette;
    }
    function handleSimpleTransparency() {
      metaData.alpha = true;
    }
    let gamma;
    function handleGamma(_gamma_) {
      gamma = _gamma_;
    }
    let inflateDataList = [];
    function handleInflateData(inflatedData) {
      inflateDataList.push(inflatedData);
    }
    let reader = new SyncReader(buffer);
    let parser = new Parser(options, {
      read: reader.read.bind(reader),
      error: handleError,
      metadata: handleMetaData,
      gamma: handleGamma,
      palette: handlePalette,
      transColor: handleTransColor,
      inflateData: handleInflateData,
      simpleTransparency: handleSimpleTransparency
    });
    parser.start();
    reader.process();
    if (err) {
      throw err;
    }
    let inflateData = Buffer.concat(inflateDataList);
    inflateDataList.length = 0;
    let inflatedData;
    if (metaData.interlace) {
      inflatedData = zlib.inflateSync(inflateData);
    } else {
      let rowSize = (metaData.width * metaData.bpp * metaData.depth + 7 >> 3) + 1;
      let imageSize = rowSize * metaData.height;
      inflatedData = inflateSync(inflateData, {
        chunkSize: imageSize,
        maxLength: imageSize
      });
    }
    inflateData = null;
    if (!inflatedData || !inflatedData.length) {
      throw new Error("bad png - invalid inflate data response");
    }
    let unfilteredData = FilterSync.process(inflatedData, metaData);
    inflateData = null;
    let bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
    unfilteredData = null;
    let normalisedBitmapData = formatNormaliser(bitmapData, metaData, options.skipRescale);
    metaData.data = normalisedBitmapData;
    metaData.gamma = gamma || 0;
    return metaData;
  };
});

// ../../node_modules/pngjs/lib/packer-sync.js
var require_packer_sync = __commonJS(function(exports2, module2) {
  var hasSyncZlib = true;
  var zlib = require("zlib");
  if (!zlib.deflateSync) {
    hasSyncZlib = false;
  }
  var constants = require_constants();
  var Packer = require_packer();
  module2.exports = function(metaData, opt) {
    if (!hasSyncZlib) {
      throw new Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
    }
    let options = opt || {};
    let packer = new Packer(options);
    let chunks = [];
    chunks.push(Buffer.from(constants.PNG_SIGNATURE));
    chunks.push(packer.packIHDR(metaData.width, metaData.height));
    if (metaData.gamma) {
      chunks.push(packer.packGAMA(metaData.gamma));
    }
    let filteredData = packer.filterData(metaData.data, metaData.width, metaData.height);
    let compressedData = zlib.deflateSync(filteredData, packer.getDeflateOptions());
    filteredData = null;
    if (!compressedData || !compressedData.length) {
      throw new Error("bad png - invalid compressed data response");
    }
    chunks.push(packer.packIDAT(compressedData));
    chunks.push(packer.packIEND());
    return Buffer.concat(chunks);
  };
});

// ../../node_modules/pngjs/lib/png-sync.js
var require_png_sync = __commonJS(function(exports2) {
  var parse = require_parser_sync();
  var pack = require_packer_sync();
  exports2.read = function(buffer, options) {
    return parse(buffer, options || {});
  };
  exports2.write = function(png, options) {
    return pack(png, options);
  };
});

// ../../node_modules/pngjs/lib/png.js
var require_png = __commonJS(function(exports2) {
  var util = require("util");
  var Stream = require("stream");
  var Parser = require_parser_async();
  var Packer = require_packer_async();
  var PNGSync = require_png_sync();
  var PNG = exports2.PNG = function(options) {
    Stream.call(this);
    options = options || {};
    this.width = options.width | 0;
    this.height = options.height | 0;
    this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null;
    if (options.fill && this.data) {
      this.data.fill(0);
    }
    this.gamma = 0;
    this.readable = this.writable = true;
    this._parser = new Parser(options);
    this._parser.on("error", this.emit.bind(this, "error"));
    this._parser.on("close", this._handleClose.bind(this));
    this._parser.on("metadata", this._metadata.bind(this));
    this._parser.on("gamma", this._gamma.bind(this));
    this._parser.on("parsed", function(data) {
      this.data = data;
      this.emit("parsed", data);
    }.bind(this));
    this._packer = new Packer(options);
    this._packer.on("data", this.emit.bind(this, "data"));
    this._packer.on("end", this.emit.bind(this, "end"));
    this._parser.on("close", this._handleClose.bind(this));
    this._packer.on("error", this.emit.bind(this, "error"));
  };
  util.inherits(PNG, Stream);
  PNG.sync = PNGSync;
  PNG.prototype.pack = function() {
    if (!this.data || !this.data.length) {
      this.emit("error", "No data provided");
      return this;
    }
    process.nextTick(function() {
      this._packer.pack(this.data, this.width, this.height, this.gamma);
    }.bind(this));
    return this;
  };
  PNG.prototype.parse = function(data, callback) {
    if (callback) {
      let onParsed, onError;
      onParsed = function(parsedData) {
        this.removeListener("error", onError);
        this.data = parsedData;
        callback(null, this);
      }.bind(this);
      onError = function(err) {
        this.removeListener("parsed", onParsed);
        callback(err, null);
      }.bind(this);
      this.once("parsed", onParsed);
      this.once("error", onError);
    }
    this.end(data);
    return this;
  };
  PNG.prototype.write = function(data) {
    this._parser.write(data);
    return true;
  };
  PNG.prototype.end = function(data) {
    this._parser.end(data);
  };
  PNG.prototype._metadata = function(metadata) {
    this.width = metadata.width;
    this.height = metadata.height;
    this.emit("metadata", metadata);
  };
  PNG.prototype._gamma = function(gamma) {
    this.gamma = gamma;
  };
  PNG.prototype._handleClose = function() {
    if (!this._parser.writable && !this._packer.readable) {
      this.emit("close");
    }
  };
  PNG.bitblt = function(src, dst, srcX, srcY, width, height, deltaX, deltaY) {
    srcX |= 0;
    srcY |= 0;
    width |= 0;
    height |= 0;
    deltaX |= 0;
    deltaY |= 0;
    if (srcX > src.width || srcY > src.height || srcX + width > src.width || srcY + height > src.height) {
      throw new Error("bitblt reading outside image");
    }
    if (deltaX > dst.width || deltaY > dst.height || deltaX + width > dst.width || deltaY + height > dst.height) {
      throw new Error("bitblt writing outside image");
    }
    for (let y = 0;y < height; y++) {
      src.data.copy(dst.data, (deltaY + y) * dst.width + deltaX << 2, (srcY + y) * src.width + srcX << 2, (srcY + y) * src.width + srcX + width << 2);
    }
  };
  PNG.prototype.bitblt = function(dst, srcX, srcY, width, height, deltaX, deltaY) {
    PNG.bitblt(this, dst, srcX, srcY, width, height, deltaX, deltaY);
    return this;
  };
  PNG.adjustGamma = function(src) {
    if (src.gamma) {
      for (let y = 0;y < src.height; y++) {
        for (let x = 0;x < src.width; x++) {
          let idx = src.width * y + x << 2;
          for (let i = 0;i < 3; i++) {
            let sample = src.data[idx + i] / 255;
            sample = Math.pow(sample, 1 / 2.2 / src.gamma);
            src.data[idx + i] = Math.round(sample * 255);
          }
        }
      }
      src.gamma = 0;
    }
  };
  PNG.prototype.adjustGamma = function() {
    PNG.adjustGamma(this);
  };
});

// index.ts
var fs2 = __toESM(require("node:fs"));
var path2 = __toESM(require("node:path"));

// ../forgejo-user-contribution/index.ts
var getForgejoUserContribution = async (userName, o = {}) => {
  const baseUrl = o.baseUrl ?? "https://codeberg.org";
  const res = await fetch(`${baseUrl}/api/v1/users/${userName}/heatmap`, {
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok)
    throw new Error(await res.text().catch(() => res.statusText));
  const heatmapData = await res.json();
  const countsByDate = new Map;
  for (const { timestamp, contributions } of heatmapData) {
    const date = new Date(timestamp * 1000).toLocaleDateString("en-CA");
    countsByDate.set(date, (countsByDate.get(date) ?? 0) + contributions);
  }
  const max = Math.max(0, ...countsByDate.values());
  const levelForCount = (count) => count <= 0 || max === 0 ? 0 : count >= max ? 4 : Math.ceil(count / max * 3);
  const today = new Date;
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 365);
  start.setDate(start.getDate() - start.getDay());
  const cells = [];
  const cursor = new Date(start);
  let x = 0;
  while (cursor <= today) {
    const y = cursor.getDay();
    const date = cursor.toLocaleDateString("en-CA");
    const count = countsByDate.get(date) ?? 0;
    cells.push({ x, y, date, count, level: levelForCount(count) });
    cursor.setDate(cursor.getDate() + 1);
    if (y === 6)
      x++;
  }
  return cells;
};

// ../github-user-contribution/index.ts
var getGithubUserContribution = async (userName, o) => {
  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                weekday
                date
              }
            }
          }
        }
      }
    }
  `;
  const variables = { login: userName };
  const apiUrl = o.baseUrl ? `${o.baseUrl}/api/graphql` : "https://api.github.com/graphql";
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `bearer ${o.githubToken}`,
      "Content-Type": "application/json",
      "User-Agent": "me@platane.me"
    },
    method: "POST",
    body: JSON.stringify({ variables, query })
  });
  if (!res.ok)
    throw new Error(await res.text().catch(() => res.statusText));
  const { data, errors } = await res.json();
  if (errors?.[0])
    throw errors[0];
  return data.user.contributionsCollection.contributionCalendar.weeks.flatMap(({ contributionDays }, x) => contributionDays.map((d) => ({
    x,
    y: d.weekday,
    date: d.date,
    count: d.contributionCount,
    level: d.contributionLevel === "FOURTH_QUARTILE" && 4 || d.contributionLevel === "THIRD_QUARTILE" && 3 || d.contributionLevel === "SECOND_QUARTILE" && 2 || d.contributionLevel === "FIRST_QUARTILE" && 1 || 0
  })));
};

// ../gitlab-user-contribution/index.ts
var getGitlabUserContribution = async (userName, o = {}) => {
  const baseUrl = o.baseUrl ?? "https://gitlab.com";
  const res = await fetch(`${baseUrl}/users/${userName}/calendar.json`, {
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok)
    throw new Error(await res.text().catch(() => res.statusText));
  const countsByDate = await res.json();
  const max = Math.max(0, ...Object.values(countsByDate));
  const levelForCount = (count) => count <= 0 || max === 0 ? 0 : count >= max ? 4 : Math.ceil(count / max * 3);
  const today = new Date;
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 365);
  start.setDate(start.getDate() - start.getDay());
  const cells = [];
  const cursor = new Date(start);
  let x = 0;
  while (cursor <= today) {
    const y = cursor.getDay();
    const date = cursor.toLocaleDateString("en-CA");
    const count = countsByDate[date] ?? 0;
    cells.push({ x, y, date, count, level: levelForCount(count) });
    cursor.setDate(cursor.getDate() + 1);
    if (y === 6)
      x++;
  }
  return cells;
};
// ../types/point.ts
var around4 = [
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 1 }
];

// ../solver/outside.ts
var createOutside = (grid, color = 0) => {
  const outside = createEmptyGrid(grid.width, grid.height);
  for (let x = outside.width;x--; )
    for (let y = outside.height;y--; )
      setColor(outside, x, y, 1);
  fillOutside(outside, grid, color);
  return outside;
};
var fillOutside = (outside, grid, color = 0) => {
  let changed = true;
  while (changed) {
    changed = false;
    for (let x = outside.width;x--; )
      for (let y = outside.height;y--; )
        if (getColor(grid, x, y) <= color && !isOutside(outside, x, y) && around4.some((a) => isOutside(outside, x + a.x, y + a.y))) {
          changed = true;
          setColorEmpty(outside, x, y);
        }
  }
  return outside;
};
var isOutside = (outside, x, y) => !isInside(outside, x, y) || isEmpty(getColor(outside, x, y));
// ../solver/utils/sortPush.ts
var sortPush = (arr, x, sortFn) => {
  let a = 0;
  let b = arr.length;
  if (arr.length === 0 || sortFn(x, arr[a]) <= 0) {
    arr.unshift(x);
    return;
  }
  while (b - a > 1) {
    const e = Math.ceil((a + b) / 2);
    const s = sortFn(x, arr[e]);
    if (s === 0)
      a = b = e;
    else if (s > 0)
      a = e;
    else
      b = e;
  }
  const e = Math.ceil((a + b) / 2);
  arr.splice(e, 0, x);
};
// ../solver/tunnel.ts
var getTunnelPath = (snake0, tunnel) => {
  const chain = [];
  let snake = snake0;
  for (let i = 1;i < tunnel.length; i++) {
    const dx = tunnel[i].x - getHeadX(snake);
    const dy = tunnel[i].y - getHeadY(snake);
    snake = nextSnake(snake, dx, dy);
    chain.unshift(snake);
  }
  return chain;
};
var isEmptySafe = (grid, x, y) => !isInside(grid, x, y) || isEmpty(getColor(grid, x, y));
var trimTunnelStart = (grid, tunnel) => {
  while (tunnel.length) {
    const { x, y } = tunnel[0];
    if (isEmptySafe(grid, x, y))
      tunnel.shift();
    else
      break;
  }
};
var trimTunnelEnd = (grid, tunnel) => {
  while (tunnel.length) {
    const i = tunnel.length - 1;
    const { x, y } = tunnel[i];
    if (isEmptySafe(grid, x, y) || tunnel.findIndex((p) => p.x === x && p.y === y) < i)
      tunnel.pop();
    else
      break;
  }
};

// ../solver/getBestTunnel.ts
var getColorSafe = (grid, x, y) => isInside(grid, x, y) ? getColor(grid, x, y) : 0;
var setEmptySafe = (grid, x, y) => {
  if (isInside(grid, x, y))
    setColorEmpty(grid, x, y);
};
var unwrap = (m) => !m ? [] : [...unwrap(m.parent), { x: getHeadX(m.snake), y: getHeadY(m.snake) }];
var getSnakeEscapePath = (grid, outside, snake0, color) => {
  const openList = [{ snake: snake0, w: 0 }];
  const closeList = [];
  while (openList[0]) {
    const o = openList.shift();
    const x = getHeadX(o.snake);
    const y = getHeadY(o.snake);
    if (isOutside(outside, x, y))
      return unwrap(o);
    for (const a of around4) {
      const c = getColorSafe(grid, x + a.x, y + a.y);
      if (c <= color && !snakeWillSelfCollide(o.snake, a.x, a.y)) {
        const snake = nextSnake(o.snake, a.x, a.y);
        if (!closeList.some((s0) => snakeEquals(s0, snake))) {
          const w = o.w + 1 + +(c === color) * 1000;
          sortPush(openList, { snake, w, parent: o }, (a, b) => a.w - b.w);
          closeList.push(snake);
        }
      }
    }
  }
  return null;
};
var getBestTunnel = (grid, outside, x, y, color, snakeN) => {
  const c = { x, y };
  const snake0 = createSnakeFromCells(Array.from({ length: snakeN }, () => c));
  const one = getSnakeEscapePath(grid, outside, snake0, color);
  if (!one)
    return null;
  const snakeICells = one.slice(0, snakeN);
  while (snakeICells.length < snakeN)
    snakeICells.push(snakeICells[snakeICells.length - 1]);
  const snakeI = createSnakeFromCells(snakeICells);
  const gridI = copyGrid(grid);
  for (const { x, y } of one)
    setEmptySafe(gridI, x, y);
  const two = getSnakeEscapePath(gridI, outside, snakeI, color);
  if (!two)
    return null;
  one.shift();
  one.reverse();
  one.push(...two);
  trimTunnelStart(grid, one);
  trimTunnelEnd(grid, one);
  return one;
};
// ../solver/getPathTo.ts
var getPathTo = (grid, snake0, x, y) => {
  const openList = [{ snake: snake0, w: 0 }];
  const closeList = [];
  while (openList.length) {
    const c = openList.shift();
    const cx = getHeadX(c.snake);
    const cy = getHeadY(c.snake);
    for (let i = 0;i < around4.length; i++) {
      const { x: dx, y: dy } = around4[i];
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx === x && ny === y) {
        const path = [nextSnake(c.snake, dx, dy)];
        let e = c;
        while (e.parent) {
          path.push(e.snake);
          e = e.parent;
        }
        return path;
      }
      if (isInsideLarge(grid, 2, nx, ny) && !snakeWillSelfCollide(c.snake, dx, dy) && (!isInside(grid, nx, ny) || isEmpty(getColor(grid, nx, ny)))) {
        const nsnake = nextSnake(c.snake, dx, dy);
        if (!closeList.some((s) => snakeEquals(nsnake, s))) {
          const w = c.w + 1;
          const h = Math.abs(nx - x) + Math.abs(ny - y);
          const f = w + h;
          const o = { snake: nsnake, parent: c, w, h, f };
          sortPush(openList, o, (a, b) => a.f - b.f);
          closeList.push(nsnake);
        }
      }
    }
  }
};

// ../solver/clearResidualColoredLayer.ts
var clearResidualColoredLayer = (grid, outside, snake0, color) => {
  const snakeN = getSnakeLength(snake0);
  const tunnels = getTunnellablePoints(grid, outside, snakeN, color);
  tunnels.sort((a, b) => b.priority - a.priority);
  const chain = [snake0];
  while (tunnels.length) {
    let t = getNextTunnel(tunnels, chain[0]);
    chain.unshift(...getPathTo(grid, chain[0], t[0].x, t[0].y));
    chain.unshift(...getTunnelPath(chain[0], t));
    for (const { x, y } of t)
      setEmptySafe2(grid, x, y);
    fillOutside(outside, grid);
    for (let i = tunnels.length;i--; )
      if (isEmpty(getColor(grid, tunnels[i].x, tunnels[i].y)))
        tunnels.splice(i, 1);
      else {
        const t = tunnels[i];
        const tunnel = getBestTunnel(grid, outside, t.x, t.y, color, snakeN);
        if (!tunnel)
          tunnels.splice(i, 1);
        else {
          t.tunnel = tunnel;
          t.priority = getPriority(grid, color, tunnel);
        }
      }
    tunnels.sort((a, b) => b.priority - a.priority);
  }
  chain.pop();
  return chain;
};
var getNextTunnel = (ts, snake) => {
  let minDistance = Infinity;
  let closestTunnel = null;
  const x = getHeadX(snake);
  const y = getHeadY(snake);
  const priority = ts[0].priority;
  for (let i = 0;ts[i] && ts[i].priority === priority; i++) {
    const t = ts[i].tunnel;
    const d = distanceSq(t[0].x, t[0].y, x, y);
    if (d < minDistance) {
      minDistance = d;
      closestTunnel = t;
    }
  }
  return closestTunnel;
};
var getTunnellablePoints = (grid, outside, snakeN, color) => {
  const points = [];
  for (let x = grid.width;x--; )
    for (let y = grid.height;y--; ) {
      const c = getColor(grid, x, y);
      if (!isEmpty(c) && c < color) {
        const tunnel = getBestTunnel(grid, outside, x, y, color, snakeN);
        if (tunnel) {
          const priority = getPriority(grid, color, tunnel);
          points.push({ x, y, priority, tunnel });
        }
      }
    }
  return points;
};
var getPriority = (grid, color, tunnel) => {
  let nColor = 0;
  let nLess = 0;
  for (let i = 0;i < tunnel.length; i++) {
    const { x, y } = tunnel[i];
    const c = getColorSafe2(grid, x, y);
    if (!isEmpty(c) && i === tunnel.findIndex((p) => p.x === x && p.y === y)) {
      if (c === color)
        nColor += 1;
      else
        nLess += color - c;
    }
  }
  if (nColor === 0)
    return 99999;
  return nLess / nColor;
};
var distanceSq = (ax, ay, bx, by) => (ax - bx) ** 2 + (ay - by) ** 2;
var getColorSafe2 = (grid, x, y) => isInside(grid, x, y) ? getColor(grid, x, y) : 0;
var setEmptySafe2 = (grid, x, y) => {
  if (isInside(grid, x, y))
    setColorEmpty(grid, x, y);
};
// ../solver/clearCleanColoredLayer.ts
var clearCleanColoredLayer = (grid, outside, snake0, color) => {
  const snakeN = getSnakeLength(snake0);
  const points = getTunnellablePoints2(grid, outside, snakeN, color);
  const chain = [snake0];
  while (points.length) {
    const path = getPathToNextPoint(grid, chain[0], color, points);
    path.pop();
    for (const snake of path)
      setEmptySafe3(grid, getHeadX(snake), getHeadY(snake));
    chain.unshift(...path);
  }
  fillOutside(outside, grid);
  chain.pop();
  return chain;
};
var unwrap2 = (m) => !m ? [] : [m.snake, ...unwrap2(m.parent)];
var getPathToNextPoint = (grid, snake0, color, points) => {
  const closeList = [];
  const openList = [{ snake: snake0 }];
  while (openList.length) {
    const o = openList.shift();
    const x = getHeadX(o.snake);
    const y = getHeadY(o.snake);
    const i = points.findIndex((p) => p.x === x && p.y === y);
    if (i >= 0) {
      points.splice(i, 1);
      return unwrap2(o);
    }
    for (const { x: dx, y: dy } of around4) {
      if (isInsideLarge(grid, 2, x + dx, y + dy) && !snakeWillSelfCollide(o.snake, dx, dy) && getColorSafe3(grid, x + dx, y + dy) <= color) {
        const snake = nextSnake(o.snake, dx, dy);
        if (!closeList.some((s0) => snakeEquals(s0, snake))) {
          closeList.push(snake);
          openList.push({ snake, parent: o });
        }
      }
    }
  }
};
var getTunnellablePoints2 = (grid, outside, snakeN, color) => {
  const points = [];
  for (let x = grid.width;x--; )
    for (let y = grid.height;y--; ) {
      const c = getColor(grid, x, y);
      if (!isEmpty(c) && c <= color && !points.some((p) => p.x === x && p.y === y)) {
        const tunnel = getBestTunnel(grid, outside, x, y, color, snakeN);
        if (tunnel) {
          for (const p of tunnel)
            if (!isEmptySafe2(grid, p.x, p.y))
              points.push(p);
        }
      }
    }
  return points;
};
var getColorSafe3 = (grid, x, y) => isInside(grid, x, y) ? getColor(grid, x, y) : 0;
var setEmptySafe3 = (grid, x, y) => {
  if (isInside(grid, x, y))
    setColorEmpty(grid, x, y);
};
var isEmptySafe2 = (grid, x, y) => !isInside(grid, x, y) && isEmpty(getColor(grid, x, y));

// ../solver/getBestRoute.ts
var getBestRoute = (grid0, snake0) => {
  const grid = copyGrid(grid0);
  const outside = createOutside(grid);
  const chain = [snake0];
  for (const color of extractColors(grid)) {
    if (color > 1)
      chain.unshift(...clearResidualColoredLayer(grid, outside, chain[0], color));
    chain.unshift(...clearCleanColoredLayer(grid, outside, chain[0], color));
  }
  return chain.reverse();
};
var extractColors = (grid) => {
  let maxColor = Math.max(...grid.data);
  return Array.from({ length: maxColor }, (_, i) => i + 1);
};
// ../solver/getPathToPose.ts
var isEmptySafe3 = (grid, x, y) => !isInside(grid, x, y) || isEmpty(getColor(grid, x, y));
var getPathToPose = (snake0, target, grid) => {
  if (snakeEquals(snake0, target))
    return [];
  const targetCells = snakeToCells(target).reverse();
  const snakeN = getSnakeLength(snake0);
  const box = {
    min: {
      x: Math.min(getHeadX(snake0), getHeadX(target)) - snakeN - 1,
      y: Math.min(getHeadY(snake0), getHeadY(target)) - snakeN - 1
    },
    max: {
      x: Math.max(getHeadX(snake0), getHeadX(target)) + snakeN + 1,
      y: Math.max(getHeadY(snake0), getHeadY(target)) + snakeN + 1
    }
  };
  const [t0, ...forbidden] = targetCells;
  forbidden.slice(0, 3);
  const openList = [{ snake: snake0, w: 0 }];
  const closeList = [];
  while (openList.length) {
    const o = openList.shift();
    const x = getHeadX(o.snake);
    const y = getHeadY(o.snake);
    if (x === t0.x && y === t0.y) {
      const path = [];
      let e = o;
      while (e) {
        path.push(e.snake);
        e = e.parent;
      }
      path.unshift(...getTunnelPath(path[0], targetCells));
      path.pop();
      path.reverse();
      return path;
    }
    for (let i = 0;i < around4.length; i++) {
      const { x: dx, y: dy } = around4[i];
      const nx = x + dx;
      const ny = y + dy;
      if (!snakeWillSelfCollide(o.snake, dx, dy) && (!grid || isEmptySafe3(grid, nx, ny)) && (grid ? isInsideLarge(grid, 2, nx, ny) : box.min.x <= nx && nx <= box.max.x && box.min.y <= ny && ny <= box.max.y) && !forbidden.some((p) => p.x === nx && p.y === ny)) {
        const snake = nextSnake(o.snake, dx, dy);
        if (!closeList.some((s) => snakeEquals(snake, s))) {
          const w = o.w + 1;
          const h = Math.abs(nx - x) + Math.abs(ny - y);
          const f = w + h;
          sortPush(openList, { f, w, snake, parent: o }, (a, b) => a.f - b.f);
          closeList.push(snake);
        }
      }
    }
  }
};

// ../types/__fixtures__/snake.ts
var create = (length) => createSnakeFromCells(Array.from({ length }, (_, i) => ({ x: i, y: -1 })));
var snake1 = create(1);
var snake3 = create(3);
var snake4 = create(4);
var snake5 = create(5);
var snake9 = create(9);

// ../generate-snake-animation/cellsToGrid.ts
var cellsToGrid = (cells) => {
  const width = Math.max(0, ...cells.map((c) => c.x)) + 1;
  const height = Math.max(0, ...cells.map((c) => c.y)) + 1;
  const grid = createEmptyGrid(width, height);
  for (const c of cells) {
    if (c.level > 0)
      setColor(grid, c.x, c.y, c.level);
    else
      setColorEmpty(grid, c.x, c.y);
  }
  return grid;
};

// ../generate-snake-animation/palettes.ts
var basePalettes = {
  "github-light": {
    colorBackground: "#ffffff",
    colorDotBorder: "#1b1f230a",
    colorDots: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    colorEmpty: "#ebedf0",
    colorSnake: "purple"
  },
  "github-dark": {
    colorBackground: "#0c1116",
    colorDotBorder: "#1b1f230a",
    colorEmpty: "#161b22",
    colorDots: ["#161b22", "#01311f", "#034525", "#0f6d31", "#00c647"],
    colorSnake: "purple"
  },
  "forgejo-light": {
    colorBackground: "#ffffff",
    colorDotBorder: "#00000010",
    colorEmpty: "#d4d4d8",
    colorDots: ["#d4d4d8", "#fdba74", "#f97316", "#c2410c", "#7c2d12"],
    colorSnake: "#7c2d12"
  },
  "forgejo-dark": {
    colorBackground: "#1f2937",
    colorDotBorder: "#ffffff10",
    colorEmpty: "#2b3642",
    colorDots: ["#2b3642", "#9a3412", "#ea580c", "#fb923c", "#fed7aa"],
    colorSnake: "#fed7aa"
  },
  "codeberg-light": {
    colorBackground: "#ffffff",
    colorDotBorder: "#00000010",
    colorEmpty: "#d0d7de",
    colorDots: ["#d0d7de", "#8db5dc", "#679cd0", "#4183c4", "#254f77"],
    colorSnake: "#254f77"
  },
  "codeberg-dark": {
    colorBackground: "#161b22",
    colorDotBorder: "#ffffff10",
    colorEmpty: "#3b444a",
    colorDots: ["#3b444a", "#254f77", "#31699f", "#4183c4", "#8db5dc"],
    colorSnake: "#8db5dc"
  },
  "gitlab-light": {
    colorBackground: "#ffffff",
    colorDotBorder: "#00000010",
    colorEmpty: "#edebe6",
    colorDots: ["#edebe6", "#9dc7f1", "#428fdc", "#2f68b4", "#284779"],
    colorSnake: "#284779"
  },
  "gitlab-dark": {
    colorBackground: "#1f1e24",
    colorDotBorder: "#ffffff10",
    colorEmpty: "#2a2a36",
    colorDots: ["#2a2a36", "#284779", "#2f68b4", "#428fdc", "#9dc7f1"],
    colorSnake: "#9dc7f1"
  }
};
var palettes = {
  ...basePalettes,
  github: basePalettes["github-light"],
  forgejo: basePalettes["forgejo-light"],
  codeberg: basePalettes["codeberg-light"],
  gitlab: basePalettes["gitlab-light"],
  default: basePalettes["github-light"]
};

// ../generate-snake-animation/generateSnakeAnimation.ts
var getUserContribution = async (source) => {
  switch (source.platform) {
    case "github":
      return getGithubUserContribution(source.username, {
        githubToken: source.githubToken,
        baseUrl: source.baseUrl
      });
    case "gitlab":
      return getGitlabUserContribution(source.username, {
        baseUrl: source.baseUrl
      });
    case "forgejo":
      return getForgejoUserContribution(source.username, {
        baseUrl: source.baseUrl
      });
  }
};
var generateSnakeAnimation = async (source, outputs) => {
  console.log(`\uD83C\uDFA3 fetching user contribution from ${source.platform}`);
  const cells = await getUserContribution(source);
  const grid = cellsToGrid(cells);
  const snake = snake4;
  console.log("\uD83D\uDCE1 computing best route");
  const chain = getBestRoute(grid, snake);
  chain.push(...getPathToPose(chain.slice(-1)[0], snake));
  return Promise.all(outputs.map(async (out, i) => {
    if (!out)
      return;
    const { format, drawOptions, animationOptions } = out;
    switch (format) {
      case "svg": {
        console.log(`\uD83D\uDD8C creating svg (outputs[${i}])`);
        await Promise.resolve().then(() => init_svg_creator());
        return createSvg(grid, cells, chain, drawOptions, animationOptions);
      }
      case "gif": {
        console.log(`\uD83D\uDCF9 creating gif (outputs[${i}])`);
        await Promise.resolve().then(() => init_gif_creator());
        return createGif(grid, cells, chain, drawOptions, animationOptions);
      }
    }
  }));
};

// ../generate-snake-animation/outputsOptions.ts
var parseOutputsOption = (lines) => lines.map(parseEntry);
var parseEntry = (entry) => {
  const m = entry.trim().match(/^(.+\.(svg|gif))(\?(.*)|\s*({.*}))?$/);
  if (!m)
    return null;
  const [, filename, format, _, q1, q2] = m;
  const query = q1 ?? q2;
  let sp = new URLSearchParams(query || "");
  try {
    const o = JSON.parse(query);
    if (Array.isArray(o.color_dots))
      o.color_dots = o.color_dots.join(",");
    sp = new URLSearchParams(o);
  } catch (err) {
    if (!(err instanceof SyntaxError))
      throw err;
  }
  const drawOptions = {
    sizeDotBorderRadius: 2,
    sizeCell: 16,
    sizeDot: 12,
    ...palettes["default"]
  };
  const animationOptions = {
    frameByStep: 1,
    stepDurationMs: 100
  };
  {
    const palette = palettes[sp.get("palette")];
    if (palette) {
      Object.assign(drawOptions, palette);
    }
  }
  if (sp.has("color_dots")) {
    const colors = sp.get("color_dots").split(/[,;]/);
    drawOptions.colorDots = colors;
    drawOptions.colorEmpty = colors[0];
  }
  if (sp.has("color_snake"))
    drawOptions.colorSnake = sp.get("color_snake");
  if (sp.has("color_background"))
    drawOptions.colorBackground = sp.get("color_background");
  if (sp.has("color_dot_border"))
    drawOptions.colorDotBorder = sp.get("color_dot_border");
  return {
    filename,
    format,
    drawOptions,
    animationOptions
  };
};

// github-action.ts
var os = __toESM(require("node:os"));
var getInput = (name) => process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
var setFailed = (message) => {
  process.exitCode = 1;
  process.stdout.write(`::error::${escapeData(message)}::${os.EOL}`);
};
function escapeData(s) {
  return s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

// avatarPixels.ts
var import_jpeg_js = __toESM(require_jpeg_js());
var import_pngjs = __toESM(require_png());
var decodeImage = (buf, contentType) => {
  if (contentType.includes("png")) {
    const png = import_pngjs.PNG.sync.read(buf);
    return { width: png.width, height: png.height, data: png.data };
  }
  const decoded = import_jpeg_js.default.decode(buf, { useTArray: true, maxMemoryUsageInMB: 50 });
  if (!decoded?.data)
    throw new Error("failed to decode avatar image");
  return {
    width: decoded.width,
    height: decoded.height,
    data: Buffer.from(decoded.data)
  };
};
var bufferToSnakeHeadPixels = (buf, contentType, outSize = 24) => {
  const { width, height, data } = decodeImage(buf, contentType);
  const colors = [];
  const r2 = outSize / 2 * (outSize / 2);
  for (let y = 0;y < outSize; y++) {
    for (let x = 0;x < outSize; x++) {
      const dx = x + 0.5 - outSize / 2;
      const dy = y + 0.5 - outSize / 2;
      if (dx * dx + dy * dy > r2) {
        colors.push(null);
        continue;
      }
      const sx = Math.min(width - 1, Math.floor((x + 0.5) / outSize * width));
      const sy = Math.min(height - 1, Math.floor((y + 0.5) / outSize * height));
      const i = (sy * width + sx) * 4;
      colors.push(`rgb(${data[i]},${data[i + 1]},${data[i + 2]})`);
    }
  }
  return { size: outSize, colors };
};

// index.ts
var fetchAvatarPixels = async (username, token) => {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "snk-avatar-head"
  };
  if (token)
    headers.Authorization = `Bearer ${token}`;
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers
  });
  if (!userRes.ok) {
    throw new Error(`failed to fetch user ${username}: ${userRes.status}`);
  }
  const user = await userRes.json();
  if (!user.avatar_url) {
    throw new Error(`no avatar_url for ${username}`);
  }
  const avatarUrl = `${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}s=64`;
  const imgRes = await fetch(avatarUrl, {
    headers: { "User-Agent": "snk-avatar-head" }
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
    const userName = getInput("github_user_name");
    const githubToken = process.env.GITHUB_TOKEN ?? getInput("github_token");
    const outputsRaw = [
      ...getInput("outputs").split(`
`),
      getInput("gif_out_path"),
      getInput("svg_out_path")
    ].map((x) => x.trim()).filter(Boolean);
    const outputs = parseOutputsOption(outputsRaw);
    console.log(`\uD83D\uDDBC️  fetching GitHub avatar pixels for ${userName}`);
    const snakeHeadPixels = await fetchAvatarPixels(userName, githubToken);
    for (const out of outputs) {
      if (out)
        out.drawOptions.snakeHeadPixels = snakeHeadPixels;
    }
    const results = await generateSnakeAnimation({ platform: "github", username: userName, githubToken }, outputs);
    outputs.forEach((out, i) => {
      const result = results[i];
      if (out?.filename && result) {
        console.log(`\uD83D\uDCBE writing to ${out?.filename}`);
        fs2.mkdirSync(path2.dirname(out?.filename), { recursive: true });
        fs2.writeFileSync(out?.filename, result);
      }
    });
  } catch (e) {
    setFailed(`Action failed with "${e.message}"`);
  }
})();
