/**
 * Convert render assets from PNG to lossless WebP.
 *
 * Usage:
 *   pnpm tsx scripts/convert-assets-to-webp.ts          # convert + verify, keep sources
 *   pnpm tsx scripts/convert-assets-to-webp.ts --delete # also delete verified source PNGs
 *
 * Every output is verified against its source after decode: the alpha
 * channel must match exactly everywhere, and RGB must match exactly
 * wherever alpha > 0. Fully transparent pixels are exempt from the RGB
 * check because libwebp's lossless encoder clears RGB under alpha = 0
 * (sharp exposes no "exact" flag), and such pixels can never affect
 * compositing output. A source PNG is only deleted when its WebP
 * counterpart passed verification.
 *
 * Excluded: assets/fonts (not images) and assets/example.png (README
 * screenshot, not a render asset).
 */

import { readdir, rm, stat } from "fs/promises";
import { join, relative, dirname } from "path";
import sharp from "sharp";

const REPO_ROOT = join(import.meta.dirname, "..");
const ASSET_ROOTS = ["assets/games", "assets/sketchbook"];
const DELETE_SOURCES = process.argv.includes("--delete");

interface ConversionResult {
  source: string;
  pngBytes: number;
  webpBytes: number;
}

async function collectPngFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".png"))
    .map((e) => join(e.parentPath, e.name))
    .sort();
}

async function decodeRaw(
  file: string,
): Promise<{ data: Buffer; width: number; height: number }> {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function convertFile(pngPath: string): Promise<ConversionResult> {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");

  const metadata = await sharp(pngPath).metadata();
  if (metadata.depth !== "uchar") {
    throw new Error(`${pngPath}: unsupported bit depth "${metadata.depth}"`);
  }

  await sharp(pngPath).webp({ lossless: true, effort: 6 }).toFile(webpPath);

  // Pixel-identity proof: exact alpha everywhere, exact RGB where visible
  const src = await decodeRaw(pngPath);
  const dst = await decodeRaw(webpPath);
  if (src.width !== dst.width || src.height !== dst.height) {
    throw new Error(`${pngPath}: dimension mismatch after conversion`);
  }
  for (let i = 0; i < src.data.length; i += 4) {
    const alpha = src.data[i + 3];
    if (alpha !== dst.data[i + 3]) {
      throw new Error(`${pngPath}: alpha mismatch after conversion`);
    }
    if (
      alpha !== 0 &&
      (src.data[i] !== dst.data[i] ||
        src.data[i + 1] !== dst.data[i + 1] ||
        src.data[i + 2] !== dst.data[i + 2])
    ) {
      throw new Error(`${pngPath}: pixel data mismatch after conversion`);
    }
  }

  const pngBytes = (await stat(pngPath)).size;
  const webpBytes = (await stat(webpPath)).size;

  if (DELETE_SOURCES) {
    await rm(pngPath);
  }

  return { source: pngPath, pngBytes, webpBytes };
}

function formatMB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main(): Promise<void> {
  const files: string[] = [];
  for (const root of ASSET_ROOTS) {
    files.push(...(await collectPngFiles(join(REPO_ROOT, root))));
  }
  if (files.length === 0) {
    console.log("No PNG files found, nothing to do.");
    return;
  }

  console.log(`Converting ${files.length} PNG files to lossless WebP...`);
  const results: ConversionResult[] = [];
  for (const file of files) {
    results.push(await convertFile(file));
  }

  const byDir = new Map<string, { png: number; webp: number; count: number }>();
  for (const r of results) {
    const dir = relative(REPO_ROOT, dirname(r.source));
    const entry = byDir.get(dir) ?? { png: 0, webp: 0, count: 0 };
    entry.png += r.pngBytes;
    entry.webp += r.webpBytes;
    entry.count += 1;
    byDir.set(dir, entry);
  }

  console.log("\nPer directory:");
  for (const [dir, e] of [...byDir.entries()].sort()) {
    const saved = ((1 - e.webp / e.png) * 100).toFixed(1);
    console.log(
      `  ${dir}: ${e.count} files, ${formatMB(e.png)} -> ${formatMB(e.webp)} (-${saved}%)`,
    );
  }

  const totalPng = results.reduce((sum, r) => sum + r.pngBytes, 0);
  const totalWebp = results.reduce((sum, r) => sum + r.webpBytes, 0);
  const totalSaved = ((1 - totalWebp / totalPng) * 100).toFixed(1);
  console.log(
    `\nTotal: ${results.length} files, ${formatMB(totalPng)} -> ${formatMB(totalWebp)} (-${totalSaved}%)`,
  );
  console.log(
    DELETE_SOURCES
      ? "Source PNGs deleted (each only after verification passed)."
      : "Source PNGs kept. Re-run with --delete to remove them.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
