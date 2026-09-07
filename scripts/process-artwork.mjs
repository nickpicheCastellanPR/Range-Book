// Processes the user-supplied kraken artwork (art-source/) into the app's
// icon set and decorative page art. Run with: node scripts/process-artwork.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const iconsDir = path.join(root, "public", "icons");
const artDir = path.join(root, "public", "art");
const src = (name) => path.join(root, "art-source", name);

// square.png: full-bleed rectangle, no baked-in rounded-corner frame — this
// is what an app icon source should be, letting the OS apply its own single
// rounding instead of doubling up with a pre-rounded source.
const icon = src("kraken-square.png");
const hero = src("kraken-hero.png");
const driver = src("kraken-driver.png");
const trio = src("kraken-trio.png");
const texture = src("kraken-texture.png");
const grid = src("kraken-clubs-grid.jpg"); // still used for the 2 pieces without a dedicated export

async function main() {
  const pngOpts = { palette: true, quality: 90, effort: 8 };

  // --- App icon set ---
  await sharp(icon).resize(512, 512).png(pngOpts).toFile(path.join(iconsDir, "icon-512.png"));
  await sharp(icon).resize(192, 192).png(pngOpts).toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(icon).resize(180, 180).png(pngOpts).toFile(path.join(root, "public", "apple-touch-icon.png"));
  await sharp(icon).resize(64, 64).png(pngOpts).toFile(path.join(root, "public", "favicon.png"));
  // maskable: pad with a crop of the matching crack texture (not a flat
  // color) so Android's more aggressive circular mask has safe margin to
  // crop into without a visible seam where the padding meets the art
  const maskableSize = 512;
  const contentSize = Math.round(maskableSize * 0.75);
  const [contentBuf, paddingBuf] = await Promise.all([
    sharp(icon).resize(contentSize, contentSize).toBuffer(),
    sharp(texture).resize(maskableSize, maskableSize, { fit: "cover" }).toBuffer(),
  ]);
  await sharp(paddingBuf)
    .composite([{ input: contentBuf, gravity: "center" }])
    .png(pngOpts)
    .toFile(path.join(iconsDir, "icon-maskable-512.png"));
  await sharp(icon).resize(128, 128).png(pngOpts).toFile(path.join(iconsDir, "header-mark.png"));

  // --- App-wide background texture ---
  await sharp(texture).resize(900).jpeg({ quality: 78 }).toFile(path.join(artDir, "texture-bg.jpg"));

  // --- Hero image (About screen), kept as a clean rounded card, not masked ---
  await sharp(hero).resize(700, 700, { fit: "inside" }).jpeg({ quality: 88 }).toFile(path.join(artDir, "hero.jpg"));

  // --- Page background art, one per main tab (square crop — the display
  // frame is square, and these sources vary in aspect ratio) ---
  const jpegOpts = { quality: 85 };
  await sharp(driver).resize(640, 640, { fit: "cover", position: "top" }).jpeg(jpegOpts).toFile(path.join(artDir, "tentacle-driver.jpg"));
  await sharp(trio).resize(640, 640, { fit: "cover" }).jpeg(jpegOpts).toFile(path.join(artDir, "tentacle-trio-ball.jpg"));

  // the other two tabs still use pieces sliced from the original 2x2 grid —
  // no dedicated export was supplied for these
  await sharp(grid).extract({ left: 512, top: 0, width: 512, height: 512 }).jpeg(jpegOpts).toFile(path.join(artDir, "tentacle-irons-crossed.jpg"));
  await sharp(grid).extract({ left: 0, top: 512, width: 512, height: 512 }).jpeg(jpegOpts).toFile(path.join(artDir, "tentacle-irons-tangled.jpg"));

  console.log("Artwork processed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
