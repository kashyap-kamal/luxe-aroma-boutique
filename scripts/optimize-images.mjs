#!/usr/bin/env node

/**
 * Image optimization script for Aromé Luxe
 *
 * Uses sharp to losslessly (or near-losslessly) compress images in public/assets.
 *
 * Usage:
 *   node scripts/optimize-images.mjs              # default: visually-lossless (tinify-style)
 *   node scripts/optimize-images.mjs --lossless   # strictly lossless (smaller savings)
 *   node scripts/optimize-images.mjs --webp       # also generate .webp copies
 *   node scripts/optimize-images.mjs --max-width 800  # resize images wider than 800px
 */

import sharp from "sharp";
import { readdir, stat, mkdir } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const ASSETS_DIR = join(PROJECT_ROOT, "public", "assets");
const BACKUP_DIR = join(PROJECT_ROOT, ".image-backups");

// ── CLI flags ───────────────────────────────────────────────────────
const args = process.argv.slice(2);
const LOSSLESS = args.includes("--lossless");
const GENERATE_WEBP = args.includes("--webp");
const DRY_RUN = args.includes("--dry-run");
const NO_BACKUP = args.includes("--no-backup");
const MAX_WIDTH = (() => {
  const idx = args.indexOf("--max-width");
  return idx !== -1 && args[idx + 1] ? parseInt(args[idx + 1], 10) : null;
})();

// ── Supported formats ───────────────────────────────────────────────
const SUPPORTED = new Set([".png", ".jpg", ".jpeg", ".webp"]);

// ── Collect image files recursively ─────────────────────────────────
async function collectImages(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectImages(fullPath)));
    } else if (SUPPORTED.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

// ── Optimize a single image ─────────────────────────────────────────
async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const beforeStat = await stat(filePath);
  const beforeSize = beforeStat.size;
  const relPath = relative(PROJECT_ROOT, filePath);

  let pipeline = sharp(filePath);

  // Resize if wider than max-width (preserves aspect ratio)
  if (MAX_WIDTH) {
    const meta = await sharp(filePath).metadata();
    if (meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }
  }

  // Strip metadata (always — saves bytes, visually identical)
  pipeline = pipeline.withMetadata({});

  // Format-specific compression
  if (ext === ".png") {
    if (LOSSLESS) {
      // Strictly lossless: max zlib compression, keep full color
      pipeline = pipeline.png({ compressionLevel: 9, effort: 10 });
    } else {
      // Visually-lossless (tinify-style): palette quantization + max compression
      pipeline = pipeline.png({
        compressionLevel: 9,
        palette: true,
        quality: 85,
        effort: 10,
        dither: 1.0,
        colours: 256,
      });
    }
  } else if (ext === ".jpg" || ext === ".jpeg") {
    if (LOSSLESS) {
      // Lossless re-encode isn't really possible for JPEG,
      // so we re-encode at quality 100 with mozjpeg for optimal Huffman tables
      pipeline = pipeline.jpeg({ quality: 100, mozjpeg: true });
    } else {
      pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
    }
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: LOSSLESS ? 100 : 82, lossless: LOSSLESS });
  }

  const optimized = await pipeline.toBuffer();

  // Only write if we actually saved bytes
  if (optimized.length < beforeSize) {
    if (!DRY_RUN) {
      await sharp(optimized).toFile(filePath);
    }
    return { relPath, before: beforeSize, after: optimized.length, saved: true };
  }

  return { relPath, before: beforeSize, after: beforeSize, saved: false };
}

// ── Generate WebP copy ──────────────────────────────────────────────
async function generateWebP(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === ".webp") return null;

  const webpPath = filePath.replace(/\.[^.]+$/, ".webp");
  const relPath = relative(PROJECT_ROOT, webpPath);
  const beforeStat = await stat(filePath);

  let pipeline = sharp(filePath);
  if (MAX_WIDTH) {
    const meta = await sharp(filePath).metadata();
    if (meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }
  }

  pipeline = pipeline.webp({ quality: 82, effort: 6 });
  const buf = await pipeline.toBuffer();

  if (!DRY_RUN) {
    await sharp(buf).toFile(webpPath);
  }

  return { relPath, before: beforeStat.size, after: buf.length };
}

// ── Backup originals ────────────────────────────────────────────────
async function backupFile(filePath) {
  const relPath = relative(join(PROJECT_ROOT, "public"), filePath);
  const backupPath = join(BACKUP_DIR, relPath);
  const backupDir = join(backupPath, "..");
  await mkdir(backupDir, { recursive: true });
  await sharp(filePath).toFile(backupPath);
}

// ── Formatting helpers ──────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function pctSaved(before, after) {
  return ((1 - after / before) * 100).toFixed(1);
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🖼️  Aromé Luxe — Image Optimizer\n`);
  console.log(`   Mode:       ${LOSSLESS ? "Strictly lossless" : "Visually-lossless (tinify-style)"}`);
  console.log(`   WebP:       ${GENERATE_WEBP ? "yes" : "no"}`);
  console.log(`   Max width:  ${MAX_WIDTH ?? "unchanged"}`);
  console.log(`   Dry run:    ${DRY_RUN ? "yes" : "no"}`);
  console.log();

  const images = await collectImages(ASSETS_DIR);
  console.log(`   Found ${images.length} images in public/assets/\n`);

  if (images.length === 0) return;

  // Backup originals
  if (!NO_BACKUP && !DRY_RUN) {
    console.log(`   Backing up originals to .image-backups/ ...`);
    await Promise.all(images.map(backupFile));
    console.log(`   ✓ Backed up ${images.length} files\n`);
  }

  // Optimize
  let totalBefore = 0;
  let totalAfter = 0;
  let optimizedCount = 0;

  console.log("   Optimizing...\n");
  console.log("   %-50s %10s %10s %8s", "File", "Before", "After", "Saved");
  console.log("   " + "─".repeat(82));

  for (const filePath of images) {
    const result = await optimizeImage(filePath);
    totalBefore += result.before;
    totalAfter += result.after;
    if (result.saved) optimizedCount++;

    const saved = result.before - result.after;
    const mark = result.saved ? "✓" : "·";
    console.log(
      `   ${mark} %-48s %10s %10s %7s%%`,
      result.relPath.replace("public/assets/", ""),
      formatBytes(result.before),
      formatBytes(result.after),
      result.saved ? pctSaved(result.before, result.after) : "0.0"
    );
  }

  console.log("   " + "─".repeat(82));
  console.log(
    `\n   Total:  ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)}  (saved ${formatBytes(totalBefore - totalAfter)}, ${pctSaved(totalBefore, totalAfter)}%)`
  );
  console.log(`   Files optimized: ${optimizedCount}/${images.length}`);

  // WebP generation
  if (GENERATE_WEBP) {
    console.log(`\n   Generating WebP copies...\n`);
    let webpTotal = 0;
    for (const filePath of images) {
      const result = await generateWebP(filePath);
      if (result) {
        webpTotal += result.after;
        console.log(
          `   + %-48s %10s`,
          result.relPath.replace("public/assets/", ""),
          formatBytes(result.after)
        );
      }
    }
    console.log(`\n   WebP total size: ${formatBytes(webpTotal)}`);
  }

  if (DRY_RUN) {
    console.log(`\n   ℹ  Dry run — no files were modified.`);
    console.log(`      Remove --dry-run to apply changes.\n`);
  } else {
    console.log(`\n   ✓ Done! Originals backed up in .image-backups/\n`);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
