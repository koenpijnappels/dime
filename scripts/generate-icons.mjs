// One-off generator for Dime's PWA icons — a warm terracotta tile with an
// ivory "D" monogram. Zero dependencies: encodes PNG via zlib by hand.
// Run: node scripts/generate-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "icons");
mkdirSync(OUT, { recursive: true });

// Palette
const TERRA = [192, 105, 74];
const TERRA_DK = [168, 84, 56];
const IVORY = [253, 250, 243];

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  // raw scanlines, each prefixed by a filter byte (0 = none)
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Signed distance to a rounded rectangle centred in the tile.
function roundedRectInside(x, y, w, h, r) {
  const dx = Math.abs(x) - (w - r);
  const dy = Math.abs(y) - (h - r);
  const ax = Math.max(dx, 0);
  const ay = Math.max(dy, 0);
  const outside = Math.sqrt(ax * ax + ay * ay) + Math.min(Math.max(dx, dy), 0) - r;
  return outside <= 0;
}

function buildIcon(size, maskable) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  // Tile geometry. Maskable fills edge-to-edge with a generous safe zone.
  const tileHalf = maskable ? size / 2 : size * 0.46;
  const tileRadius = maskable ? 0 : size * 0.22;

  // "D" glyph geometry (scaled to the tile).
  const glyphH = size * (maskable ? 0.34 : 0.42);
  const stemW = glyphH * 0.26;
  const x0 = -glyphH * 0.42; // left edge of stem (relative to centre)
  const rxOuter = glyphH * 0.62;
  const ryOuter = glyphH * 0.62;
  const rxInner = rxOuter - stemW * 1.25;
  const ryInner = ryOuter - stemW * 1.25;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const i = (py * size + px) * 4;
      const x = px - cx;
      const y = py - cy;

      const inTile = roundedRectInside(x, y, tileHalf, tileHalf, tileRadius);
      if (!inTile) {
        rgba[i] = 0;
        rgba[i + 1] = 0;
        rgba[i + 2] = 0;
        rgba[i + 3] = 0; // transparent outside tile
        continue;
      }

      // Vertical gradient for a touch of depth.
      const t = (py / size) * 0.5;
      const bg = [
        Math.round(TERRA[0] * (1 - t) + TERRA_DK[0] * t),
        Math.round(TERRA[1] * (1 - t) + TERRA_DK[1] * t),
        Math.round(TERRA[2] * (1 - t) + TERRA_DK[2] * t),
      ];

      const withinV = Math.abs(y) <= glyphH * 0.66;
      const inStem = withinV && x >= x0 && x <= x0 + stemW;
      const outerE = (x * x) / (rxOuter * rxOuter) + (y * y) / (ryOuter * ryOuter) <= 1;
      const innerE = (x * x) / (rxInner * rxInner) + (y * y) / (ryInner * ryInner) <= 1;
      const inBowl = x >= x0 && outerE && !innerE;
      const inGlyph = inStem || inBowl;

      const c = inGlyph ? IVORY : bg;
      rgba[i] = c[0];
      rgba[i + 1] = c[1];
      rgba[i + 2] = c[2];
      rgba[i + 3] = 255;
    }
  }
  return encodePng(size, size, rgba);
}

const targets = [
  { name: "icon-192.png", size: 192, maskable: false },
  { name: "icon-512.png", size: 512, maskable: false },
  { name: "maskable-512.png", size: 512, maskable: true },
  { name: "apple-touch-icon.png", size: 180, maskable: true },
];

for (const t of targets) {
  const png = buildIcon(t.size, t.maskable);
  writeFileSync(join(OUT, t.name), png);
  console.log(`wrote ${t.name} (${png.length} bytes)`);
}
