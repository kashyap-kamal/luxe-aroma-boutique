// Runs after `next build`. Fails the build when Tailwind's responsive utilities
// are missing from the exported CSS: that build shipped once and rendered the
// mobile layout on desktop.
import fs from "node:fs";
import path from "node:path";

const dir = "out/_next/static/css";
const css = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n")
  : "";

const required = [".md\\:hidden", ".md\\:flex", ".lg\\:hidden"];
const missing = required.filter((cls) => !css.includes(cls));

if (missing.length > 0) {
  console.error(`✗ Built CSS is missing responsive utilities: ${missing.join(", ")}. Do not deploy this build.`);
  process.exit(1);
}
console.log(`✓ Built CSS has responsive utilities (${Math.round(css.length / 1024)} KB)`);
