import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

test("should not ship unmounted 23MB 3D glb asset or dead auth/three dependencies", () => {
  assert.equal(
    fs.existsSync(path.join(root, "public/assets/3d/ameer-al-oud.glb")),
    false,
    "Unused 23.6 MB ameer-al-oud.glb must be removed"
  );
  assert.equal(
    fs.existsSync(path.join(root, "src/components/home/perfume-bottle-3d.tsx")),
    false,
    "Unmounted perfume-bottle-3d.tsx must be removed"
  );
  assert.equal(
    fs.existsSync(path.join(root, "src/lib/supabase-server.ts")),
    false,
    "Unused supabase-server.ts must be removed"
  );

  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const deadDeps = [
    "three",
    "@types/three",
    "@react-three/fiber",
    "@react-three/drei",
    "next-auth",
    "@next-auth/supabase-adapter",
    "@supabase/auth-helpers-nextjs",
    "@supabase/ssr",
    "date-fns",
    "lenis",
    "nanoid",
  ];
  for (const dep of deadDeps) {
    assert.equal(
      dep in (pkg.dependencies ?? {}),
      false,
      `Dead dependency ${dep} should be pruned from package.json`
    );
  }
});

test("should mark mobile hero bottle Image as priority and gate inactive viewport DOM on matchMedia", () => {
  const heroSrc = fs.readFileSync(
    path.join(root, "src/components/home/hero-section.tsx"),
    "utf8"
  );
  const mobileSectionIdx = heroSrc.indexOf("MOBILE HERO");
  assert.ok(mobileSectionIdx > 0, "MOBILE HERO section comment must exist");
  const mobileSlice = heroSrc.slice(mobileSectionIdx);
  assert.match(
    mobileSlice,
    /<Image[\s\S]*?priority[\s\S]*?\/>/,
    "Mobile hero bottle Image must include priority for mobile LCP"
  );
  assert.match(
    heroSrc,
    /matchMedia\(["']\(min-width:\s*768px\)["']\)/,
    "HeroSection should gate inactive viewport branch via matchMedia after mount"
  );
});
