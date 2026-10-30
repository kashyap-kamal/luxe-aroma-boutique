import os from "node:os";
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
  assert.match(wf, /hostinger-deploy:hostinger-deploy/, "Workflow must publish out/ to hostinger-deploy branch for zero-FTP Hostinger Git");
  assert.match(wf, /NEXT_PUBLIC_CASHFREE_ENVIRONMENT:.*production/, "Deploy build must default Cashfree SDK environment to production");
  assert.match(wf, /FTP-Deploy-Action/, "Workflow must include Hostinger FTP deploy step");
});

test("should return fallback static param for /bundles/[id] when offline or zero bundles exist", () => {
  const bundlePage = fs.readFileSync(path.join(root, "src/app/bundles/[id]/page.tsx"), "utf8");
  assert.match(bundlePage, /PLACEHOLDER_BUNDLE_ID\s*=\s*"_placeholder"/);
  assert.match(bundlePage, /bundles\.length === 0/);
});

test("should execute all 4 steps of hosting_deployStaticWebsite against Hostinger API + TUS", async () => {
  const { hosting_deployStaticWebsite } = await import("./deploy-hostinger-static.mjs");
  const calls = [];
  let uploadedBytes = Buffer.alloc(0);

  const mockFetch = async (url, init = {}) => {
    const method = init.method || "GET";
    const parsed = new URL(url);
    const bodyBuf = Buffer.isBuffer(init.body)
      ? init.body
      : typeof init.body === "string"
        ? Buffer.from(init.body)
        : Buffer.alloc(0);
    calls.push({ method, pathname: parsed.pathname + parsed.search, headers: init.headers, bytes: bodyBuf.length });

    if (method === "GET" && parsed.pathname === "/api/hosting/v1/websites") {
      return new Response(JSON.stringify({ data: [{ username: "u677900242", domain: "aromeluxe.in" }] }), { status: 200 });
    }
    if (method === "POST" && parsed.pathname === "/api/hosting/v1/files/upload-urls") {
      return new Response(
        JSON.stringify({ url: "https://tus.hostinger.test/files", auth_key: "tus-auth", rest_auth_key: "tus-rest" }),
        { status: 200 }
      );
    }
    if (method === "POST" && parsed.pathname === "/files/test_deploy.zip") {
      return new Response("", { status: 201 });
    }
    if (method === "PATCH" && parsed.pathname === "/files/test_deploy.zip") {
      uploadedBytes = Buffer.concat([uploadedBytes, bodyBuf]);
      return new Response(null, { status: 204, headers: { "upload-offset": String(uploadedBytes.length) } });
    }
    if (method === "POST" && parsed.pathname === "/api/hosting/v1/accounts/u677900242/websites/aromeluxe.in/deploy") {
      return new Response(JSON.stringify({ message: "Deployment completed" }), { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  };

  const tmpZip = path.join(os.tmpdir(), "test_deploy.zip");
  const samplePayload = Buffer.from("PK\x03\x04mock-zip-archive-contents");
  fs.writeFileSync(tmpZip, samplePayload);

  const out = await hosting_deployStaticWebsite({
    domain: "aromeluxe.in",
    archivePath: tmpZip,
    apiToken: "test-token",
    fetchImpl: mockFetch,
    removeArchive: true,
  });

  assert.equal(out.username, "u677900242");
  assert.equal(out.deploy.status, "success");
  assert.deepEqual(uploadedBytes, samplePayload);
  assert.equal(fs.existsSync(tmpZip), false, "removeArchive: true should unlink temp zip");
  assert.equal(calls.length, 5);
});
