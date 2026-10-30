import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE_URL = "https://developers.hostinger.com";
const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB TUS chunks matching hostinger-api-mcp
const USER_AGENT = "hostinger-mcp-server/3.24.1";

export async function hosting_deployStaticWebsite({
  domain,
  archivePath,
  apiToken,
  removeArchive = false,
  baseUrl = DEFAULT_BASE_URL,
  fetchImpl = globalThis.fetch,
}) {
  if (!domain || typeof domain !== "string") {
    throw new Error("domain is required and must be a string");
  }
  if (!archivePath || typeof archivePath !== "string") {
    throw new Error("archivePath is required and must be a string");
  }
  if (!apiToken || typeof apiToken !== "string") {
    throw new Error("apiToken is required and must be a string");
  }
  if (!fs.existsSync(archivePath) || !fs.statSync(archivePath).isFile()) {
    throw new Error(`Archive file not found: ${archivePath}`);
  }

  const rootUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const authHeaders = {
    Authorization: `Bearer ${apiToken}`,
    "User-Agent": USER_AGENT,
    Accept: "application/json",
  };

  // 1. Resolve username for domain
  const sitesUrl = new URL(`api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`, rootUrl).toString();
  const sitesRes = await fetchImpl(sitesUrl, { headers: authHeaders });
  const sitesBody = await sitesRes.json().catch(() => ({}));
  if (!sitesRes.ok) {
    throw new Error(`Failed to resolve website (${sitesRes.status}): ${JSON.stringify(sitesBody)}`);
  }
  const websites = Array.isArray(sitesBody?.data) ? sitesBody.data : [];
  const site = websites.find((w) => w.domain === domain) || websites[0];
  if (!site?.username) {
    throw new Error(`No Hostinger website username found for domain: ${domain}`);
  }
  const username = site.username;

  // 2. Fetch TUS upload credentials
  const credsUrl = new URL("api/hosting/v1/files/upload-urls", rootUrl).toString();
  const credsRes = await fetchImpl(credsUrl, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ username, domain }),
  });
  const credsBody = await credsRes.json().catch(() => ({}));
  if (!credsRes.ok) {
    throw new Error(`Failed to fetch upload credentials (${credsRes.status}): ${JSON.stringify(credsBody)}`);
  }
  const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = credsBody;
  if (!uploadUrl || !authToken || !authRestToken) {
    throw new Error("Invalid upload credentials received from Hostinger API");
  }

  // 3. TUS pre-upload creation POST + 10 MB chunked PATCH upload
  const archiveBasename = path.basename(archivePath);
  const fileBuffer = fs.readFileSync(archivePath);
  const totalSize = fileBuffer.byteLength;
  const cleanUploadUrl = uploadUrl.replace(/\/$/, "");
  const uploadUrlWithFile = `${cleanUploadUrl}/${encodeURIComponent(archiveBasename)}?override=true`;
  const metadataB64 = Buffer.from(archiveBasename).toString("base64");

  const baseTusHeaders = {
    "X-Auth": authToken,
    "X-Auth-Rest": authRestToken,
    "User-Agent": USER_AGENT,
    "Tus-Resumable": "1.0.0",
    "Upload-Metadata": `filename ${metadataB64}`,
  };

  const createRes = await fetchImpl(uploadUrlWithFile, {
    method: "POST",
    headers: {
      ...baseTusHeaders,
      "upload-length": String(totalSize),
      "upload-offset": "0",
    },
    body: "",
  });
  if (createRes.status !== 201) {
    const errText = await createRes.text();
    throw new Error(`Pre-upload POST failed (${createRes.status}): ${errText}`);
  }

  let offset = 0;
  while (offset < totalSize) {
    const end = Math.min(offset + CHUNK_SIZE, totalSize);
    const chunk = fileBuffer.subarray(offset, end);
    const patchRes = await fetchImpl(uploadUrlWithFile, {
      method: "PATCH",
      headers: {
        ...baseTusHeaders,
        "Content-Type": "application/offset+octet-stream",
        "Upload-Offset": String(offset),
      },
      body: chunk,
    });
    if (patchRes.status !== 204 && patchRes.status !== 200) {
      const errText = await patchRes.text();
      throw new Error(`TUS PATCH failed at offset ${offset} (${patchRes.status}): ${errText}`);
    }
    const nextOffset = patchRes.headers.get("upload-offset");
    offset = nextOffset ? Number(nextOffset) : end;
  }

  // 4. Trigger static website archive extraction & deployment
  const deployUrl = new URL(
    `api/hosting/v1/accounts/${encodeURIComponent(username)}/websites/${encodeURIComponent(domain)}/deploy`,
    rootUrl
  ).toString();
  const deployRes = await fetchImpl(deployUrl, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ archive_path: archiveBasename }),
  });
  const deployBody = await deployRes.json().catch(() => ({}));
  if (deployRes.status !== 200) {
    throw new Error(`Deploy trigger failed (${deployRes.status}): ${JSON.stringify(deployBody)}`);
  }

  if (removeArchive) {
    fs.unlinkSync(archivePath);
  }

  return {
    domain,
    username,
    upload: { status: "success", filename: archiveBasename, bytes: totalSize },
    deploy: { status: "success", data: deployBody },
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const domain = process.env.HOSTINGER_DOMAIN || "aromeluxe.in";
  const archivePath = process.env.HOSTINGER_ARCHIVE_PATH || path.resolve(process.cwd(), "aromeluxe_deploy.zip");
  const apiToken = process.env.HOSTINGER_API_TOKEN || "";

  const result = await hosting_deployStaticWebsite({
    domain,
    archivePath: path.isAbsolute(archivePath) ? archivePath : path.resolve(archivePath),
    apiToken,
  });
  console.log(JSON.stringify(result, null, 2));
}
