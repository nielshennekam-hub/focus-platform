/* Genereert de PWA-iconen zonder dependencies.
   Gebruik: node tools/gen-icons.mjs */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

function crc32(buf) {
  let c, table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function writePng(path, size, pixels /* RGBA Uint8Array */) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    pixels.subarray(y * size * 4, (y + 1) * size * 4)
      .forEach((v, i) => { raw[y * (size * 4 + 1) + 1 + i] = v; });
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
  console.log(`✓ ${path} (${size}x${size})`);
}

function lerp(a, b, t) { return a + (b - a) * t; }

/* Tekent het icoon: donkere achtergrond, gradient-ring (de "dagscore"),
   maansikkel in het midden. maskable = volledige bleed zonder ronde hoeken. */
function drawIcon(size, maskable) {
  const px = new Uint8Array(size * size * 4);
  const c = size / 2;
  const ringR = size * (maskable ? 0.30 : 0.36);
  const ringW = size * 0.075;
  const cornerR = size * 0.2;
  // kleuren
  const teal = [94, 234, 212], indigo = [124, 140, 248];
  const bgTop = [27, 42, 77], bgBot = [11, 18, 32];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // afgeronde hoeken voor niet-maskable
      let alpha = 255;
      if (!maskable) {
        const dx = Math.max(cornerR - x, x - (size - 1 - cornerR), 0);
        const dy = Math.max(cornerR - y, y - (size - 1 - cornerR), 0);
        const d = Math.hypot(dx, dy);
        if (d > cornerR) alpha = 0;
        else if (d > cornerR - 1.5) alpha = Math.round(255 * (cornerR - d) / 1.5);
      }
      // achtergrond: diagonale gradient
      const t = (x + y) / (2 * size);
      let r = lerp(bgTop[0], bgBot[0], t), g = lerp(bgTop[1], bgBot[1], t), b = lerp(bgTop[2], bgBot[2], t);

      const dx = x - c, dy = y - c;
      const dist = Math.hypot(dx, dy);

      // gradient-ring (3/4 open onderaan rechts, als een voortgangsring)
      const angle = Math.atan2(dy, dx); // -PI..PI
      const norm = ((angle + Math.PI / 2) / (2 * Math.PI) + 1) % 1; // 0 bovenaan
      const ringEdge = Math.abs(dist - ringR);
      if (norm <= 0.78 && ringEdge < ringW / 2 + 1) {
        const cov = Math.min(1, (ringW / 2 + 1 - ringEdge) / 1.5);
        const rc = [
          lerp(teal[0], indigo[0], norm / 0.78),
          lerp(teal[1], indigo[1], norm / 0.78),
          lerp(teal[2], indigo[2], norm / 0.78),
        ];
        r = lerp(r, rc[0], cov); g = lerp(g, rc[1], cov); b = lerp(b, rc[2], cov);
      }

      // maansikkel in het midden
      const moonR = ringR * 0.52;
      const inMoon = dist < moonR;
      const biteDist = Math.hypot(dx - moonR * 0.45, dy + moonR * 0.35);
      if (inMoon && biteDist > moonR * 0.82) {
        const edge = Math.min(moonR - dist, biteDist - moonR * 0.82);
        const cov = Math.min(1, edge / 1.5);
        r = lerp(r, 232, cov); g = lerp(g, 237, cov); b = lerp(b, 247, cov);
      }

      px[i] = Math.round(r); px[i + 1] = Math.round(g); px[i + 2] = Math.round(b); px[i + 3] = alpha;
    }
  }
  return px;
}

mkdirSync("icons", { recursive: true });
writePng("icons/icon-192.png", 192, drawIcon(192, false));
writePng("icons/icon-512.png", 512, drawIcon(512, false));
writePng("icons/icon-512-maskable.png", 512, drawIcon(512, true));
