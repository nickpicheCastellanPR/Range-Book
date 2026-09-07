import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { renderIconSvg } from "./kraken-shape.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "public", "icons");
const svgPath = path.join(iconsDir, "icon.svg");
const faviconPath = path.join(__dirname, "..", "public", "favicon.svg");

async function main() {
  const svg = renderIconSvg();
  await writeFile(svgPath, svg);
  await writeFile(faviconPath, svg);

  await sharp(svgPath).resize(192, 192).png().toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(svgPath).resize(512, 512).png().toFile(path.join(iconsDir, "icon-512.png"));

  // Maskable icon needs safe-zone padding (content within the inner ~80%)
  const maskableSize = 512;
  const contentSize = Math.round(maskableSize * 0.7);
  const contentBuf = await sharp(svgPath).resize(contentSize, contentSize).png().toBuffer();
  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 15, g: 22, b: 19, alpha: 1 },
    },
  })
    .composite([{ input: contentBuf, gravity: "center" }])
    .png()
    .toFile(path.join(iconsDir, "icon-maskable-512.png"));

  // Apple touch icon (no transparency, iOS applies its own corner mask)
  await sharp(svgPath)
    .resize(180, 180)
    .flatten({ background: "#0f1613" })
    .png()
    .toFile(path.join(__dirname, "..", "public", "apple-touch-icon.png"));

  console.log("Icons generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
