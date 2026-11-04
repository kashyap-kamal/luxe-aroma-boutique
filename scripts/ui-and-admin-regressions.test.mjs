import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walkTsxFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkTsxFiles(full));
    } else if (entry.isFile() && full.endsWith(".tsx")) {
      results.push(full);
    }
  }
  return results;
}

test("should never pass empty string value to Radix SelectItem anywhere in src/", () => {
  const files = walkTsxFiles(path.join(ROOT, "src"));
  assert.ok(files.length > 20, "Expected to scan all .tsx files under src/");
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(
      content,
      /<SelectItem[^>]*\bvalue=(?:\{["']{2}\}|["']{2})/,
      `Empty <SelectItem value=""> crashes Radix Select in ${path.relative(ROOT, file)}`
    );
  }
  const adminPage = fs.readFileSync(path.join(ROOT, "src/app/admin/page.tsx"), "utf8");
  assert.match(adminPage, /DEFAULT_SPOTLIGHT_VALUE\s*=\s*['"]__default__['"]/);
});

test("should render readable Shop by Mood hover states in Navbar and CollectionsSection", () => {
  const navbar = fs.readFileSync(path.join(ROOT, "src/components/navbar.tsx"), "utf8");
  const moodMapStart = navbar.indexOf("moodSubLinks.map");
  const moodMapSlice = navbar.slice(moodMapStart, moodMapStart + 650);
  assert.match(moodMapSlice, /hover:bg-\[#0E0E0C\]/);
  assert.match(moodMapSlice, /hover:text-\[#F2EDE4\]/);
  assert.doesNotMatch(
    moodMapSlice,
    /color:\s*["']#0E0E0C["']/,
    "Inline color on moodSubLinks overrides Tailwind hover:text-[#F2EDE4]"
  );
  assert.match(navbar, /aria-label="Open menu"/, "Mobile top bar should include menu button");

  const collections = fs.readFileSync(
    path.join(ROOT, "src/components/home/collections-section.tsx"),
    "utf8"
  );
  assert.doesNotMatch(collections, /scale\(1\.03\)/, "scale(1.03) clips inside overflowX auto strip");
  assert.match(collections, /\/products\?tag=sweet/, "Gourmand mood card must route to valid sweet tag");
  assert.doesNotMatch(collections, /\/products\?tag=gourmand/);
});

test("should support featured=true filter, gourmand tag alias, and mobile-safe inputs on /products", () => {
  const productsPage = fs.readFileSync(path.join(ROOT, "src/app/products/page.tsx"), "utf8");
  assert.match(productsPage, /searchParams\.get\(["']featured["']\)\s*===\s*["']true["']/);
  assert.match(productsPage, /params\.set\(["']featured["'],\s*["']true["']\)/);
  assert.match(productsPage, /gourmand/);
  assert.match(productsPage, /text-base\s+md:text-\[11px\]/);
});

test("should style auth pages with Saffron Press tokens and preserve safe internal redirect on sign-in", () => {
  const signInForm = fs.readFileSync(path.join(ROOT, "src/components/auth/signin-form.tsx"), "utf8");
  assert.match(signInForm, /searchParams\.get\(["']redirect["']\)/);
  assert.match(signInForm, /!rawRedirect\.startsWith\(["']\/\/["']\)/);
  assert.match(signInForm, /router\.push\(redirectTarget\)/);

  const authFiles = [
    "src/app/auth/signin/page.tsx",
    "src/app/auth/signup/page.tsx",
    "src/app/auth/forgot-password/page.tsx",
    "src/app/auth/reset-password/page.tsx",
    "src/app/auth/verify-email/page.tsx",
    "src/app/auth/error/page.tsx",
    "src/components/auth/signin-form.tsx",
    "src/components/auth/signup-form.tsx",
  ];
  for (const rel of authFiles) {
    const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
    assert.doesNotMatch(
      src,
      /amber-600|from-amber-50|orange-600/,
      `Legacy amber/orange template classes must not remain in ${rel}`
    );
  }
});

test("should lift mobile PDP/Bundle sticky CTAs above MobileBottomNav, provide /bundles index, and fix quiz grid", () => {
  const pdp = fs.readFileSync(
    path.join(ROOT, "src/app/products/[id]/product-detail-client.tsx"),
    "utf8"
  );
  assert.match(pdp, /calc\(56px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(pdp, /zIndex:\s*41/);

  const bundleDetail = fs.readFileSync(
    path.join(ROOT, "src/app/bundles/[id]/bundle-detail-client.tsx"),
    "utf8"
  );
  assert.match(bundleDetail, /calc\(56px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(bundleDetail, /z-\[41\]/);

  assert.equal(
    fs.existsSync(path.join(ROOT, "src/app/bundles/page.tsx")),
    true,
    "/bundles route must exist so VIEW ALL link never 404s"
  );

  const quiz = fs.readFileSync(path.join(ROOT, "src/app/quiz/page.tsx"), "utf8");
  assert.doesNotMatch(quiz, /!grid-cols-none/);
  assert.match(quiz, /sm:grid-cols-3/);
});

test("should serve optimized WebP local perfume assets and scale upload dimensions cleanly", async () => {
  const perfumesDir = path.join(ROOT, "public/assets/perfumes");
  const files = fs.readdirSync(perfumesDir);
  const pngs = files.filter((f) => f.endsWith(".png"));
  const webps = files.filter((f) => f.endsWith(".webp"));
  assert.equal(pngs.length, 0, "Uncompressed local .png perfume files should be replaced by .webp");
  assert.ok(webps.length >= 20, "Expected converted .webp perfume assets");

  const heroAssetSize = fs.statSync(path.join(perfumesDir, "1-million-nobg.webp")).size;
  assert.ok(heroAssetSize < 100 * 1024, `Expected hero WebP < 100KB, got ${heroAssetSize}B`);

  const imgCompSrc = fs.readFileSync(path.join(ROOT, "src/lib/image-compression.ts"), "utf8");
  assert.match(imgCompSrc, /image\/webp/);
  assert.match(imgCompSrc, /fitInsideDimensions/);
});
