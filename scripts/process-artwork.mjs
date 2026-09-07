// One-off processor for the user-supplied kraken artwork: builds the full
// icon set from the single logo, and slices the 2x2 grid into 4 separate
// decorative art assets. Run with: node scripts/process-artwork.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const iconsDir = path.join(root, "public", "icons");
const artDir = path.join(root, "public", "art");
const logo = path.join(root, "art-source", "kraken-logo.jpg");
const grid = path.join(root, "art-source", "kraken-clubs-grid.jpg");

const MASKABLE_BG = "#132534";

async function main() {
  // --- App icon set from the main logo ---
  const pngOpts = { palette: true, quality: 90, effort: 8 };
  await sharp(logo).resize(512, 512).png(pngOpts).toFile(path.join(iconsDir, "icon-512.png"));
  await sharp(logo).resize(192, 192).png(pngOpts).toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(logo).resize(180, 180).flatten({ background: MASKABLE_BG }).png(pngOpts).toFile(path.join(root, "public", "apple-touch-icon.png"));
  await sharp(logo).resize(64, 64).png(pngOpts).toFile(path.join(root, "public", "favicon.png"));

  // maskable: the source is already a finished, self-contained icon design
  // (its own rounded frame baked in) — adding another padded background
  // behind it just doubles the frame, so reuse the plain resize as-is.
  await sharp(logo).resize(512, 512).png(pngOpts).toFile(path.join(iconsDir, "icon-maskable-512.png"));

  // in-app header mark — small retina asset
  await sharp(logo).resize(128, 128).png(pngOpts).toFile(path.join(iconsDir, "header-mark.png"));

  // --- Slice the 2x2 grid into 4 decorative pieces ---
  // JPEG, not PNG: this is dense/textured illustration, not flat vector
  // art, so PNG compresses it poorly (500KB+ vs ~100KB). The CSS
  // mask-image fade used to blend these into each page works on any
  // raster format, no transparency needed.
  const quads = [
    { name: "tentacle-driver.jpg", left: 0, top: 0 },
    { name: "tentacle-irons-crossed.jpg", left: 512, top: 0 },
    { name: "tentacle-irons-tangled.jpg", left: 0, top: 512 },
    { name: "tentacle-trio-ball.jpg", left: 512, top: 512 },
  ];
  for (const q of quads) {
    await sharp(grid)
      .extract({ left: q.left, top: q.top, width: 512, height: 512 })
      .jpeg({ quality: 85 })
      .toFile(path.join(artDir, q.name));
  }

  console.log("Artwork processed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
