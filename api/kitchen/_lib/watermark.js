const sharp = require("sharp");
const config = require("./config");

function watermarkSvg(width, height) {
  const safeW = Math.max(width, 500);
  const font = Math.round(Math.max(20, safeW * 0.03));
  const pad = Math.round(font * 0.9);
  const text = "Oak Park Construction - concept only";
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${pad}" y="${height - font * 2.6}" width="${Math.min(width - pad * 2, font * 21)}" height="${font * 1.9}" rx="${font * 0.5}" fill="rgba(10,10,10,0.72)" stroke="rgba(203,204,16,0.72)" stroke-width="2"/>
      <text x="${pad + font * 0.7}" y="${height - font * 1.35}" font-family="Arial, Helvetica, sans-serif" font-size="${font}" font-weight="700" fill="#F0EBE3">${text}</text>
    </svg>
  `);
}

async function makePreview(buffer) {
  const resized = await sharp(buffer)
    .rotate()
    .resize({ width: config.previewWidth, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  const meta = await sharp(resized).metadata();
  return sharp(resized)
    .composite([{ input: watermarkSvg(meta.width || config.previewWidth, meta.height || 700), top: 0, left: 0 }])
    .jpeg({ quality: 76, mozjpeg: true })
    .toBuffer();
}

async function makeHighResConcept(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: config.highResWidth, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

module.exports = { makePreview, makeHighResConcept };
