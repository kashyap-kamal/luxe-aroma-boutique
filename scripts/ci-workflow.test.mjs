import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

test("should configure GitHub Actions CI + nightly Hostinger deploy with hidden .htaccess preservation", () => {
  const wfPath = path.join(root, ".github/workflows/ci-and-deploy.yml");
  assert.equal(fs.existsSync(wfPath), true, ".github/workflows/ci-and-deploy.yml must exist");
  const wf = fs.readFileSync(wfPath, "utf8");

  assert.match(wf, /cron:\s*["']30 21 \* \* \*["']/, "Workflow must run nightly at 03:00 IST (21:30 UTC)");
  assert.match(wf, /workflow_dispatch:/, "Workflow must support manual dispatch");
  assert.match(wf, /tsc --noEmit/, "Workflow must run TypeScript check");
  assert.match(wf, /npm test/, "Workflow must run Node test suite");
  assert.match(wf, /cp \.htaccess out\/\.htaccess/, "Workflow must copy .htaccess into out/");
  assert.match(wf, /include-hidden-files:\s*true/, "Artifact upload must preserve hidden .htaccess file");
  assert.match(wf, /FTP-Deploy-Action/, "Workflow must include Hostinger FTP deploy step");
});

test("should return fallback static param for /bundles/[id] when offline or zero bundles exist", () => {
  const bundlePage = fs.readFileSync(path.join(root, "src/app/bundles/[id]/page.tsx"), "utf8");
  assert.match(bundlePage, /PLACEHOLDER_BUNDLE_ID\s*=\s*"_placeholder"/);
  assert.match(bundlePage, /bundles\.length === 0/);
});
