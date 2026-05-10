#!/usr/bin/env bash
# Aromé Luxe — Hostinger MCP Deploy
#
# Builds the static site, creates a deploy archive, then calls the
# Hostinger deployStaticWebsite MCP tool via Claude Code CLI.
#
# Prerequisites:
#   - Claude Code CLI installed and configured (claude --version)
#   - Hostinger MCP server configured with HOSTINGER_API_TOKEN
#
# Usage:
#   ./scripts/deploy-mcp.sh              # build + deploy
#   ./scripts/deploy-mcp.sh --skip-build # deploy existing archive (fastest re-deploy)
#
# Environment:
#   HOSTINGER_DOMAIN  Override target domain (default: aromeluxe.in)

set -euo pipefail

# ── Config ───────────────────────────────────────────────────────────
DOMAIN="${HOSTINGER_DOMAIN:-aromeluxe.in}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

SKIP_BUILD=false
for arg in "$@"; do
  [[ "$arg" == "--skip-build" ]] && SKIP_BUILD=true
done

# ── Colors ───────────────────────────────────────────────────────────
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

log()   { echo -e "${BLUE}[deploy-mcp]${NC} $*"; }
ok()    { echo -e "${GREEN}  ✓${NC} $*"; }
warn()  { echo -e "${YELLOW}  ⚠${NC} $*"; }
fail()  { echo -e "${RED}  ✗${NC} $*"; exit 1; }

echo -e "\n${BOLD}Aromé Luxe — Hostinger MCP Deploy${NC}"
echo -e "  Domain: ${YELLOW}${DOMAIN}${NC}\n"

# ── Step 1: Verify Claude Code CLI ───────────────────────────────────
log "Checking Claude Code CLI..."
if ! command -v claude &>/dev/null; then
  fail "Claude Code CLI not found. Install from https://claude.ai/code or run: npm i -g @anthropic-ai/claude-code"
fi
ok "Claude Code CLI found: $(claude --version 2>/dev/null | head -1)"

# ── Step 2: Build ────────────────────────────────────────────────────
if [[ "$SKIP_BUILD" == "false" ]]; then
  log "Checking environment variables..."
  for var in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY; do
    if [[ -z "${!var:-}" ]]; then
      warn "Missing $var — will fall back to .env"
    fi
  done

  log "Cleaning previous build..."
  rm -rf .next out
  ok "Cleaned .next/ and out/"

  log "Building static site..."
  if ! npm run build; then
    fail "Build failed"
  fi

  if [[ ! -f "out/index.html" ]]; then
    fail "'out/index.html' missing — build may have failed silently"
  fi

  PAGE_COUNT=$(find out -name "*.html" | wc -l | tr -d ' ')
  ok "Build complete — ${PAGE_COUNT} HTML pages"
else
  log "--skip-build: using existing out/ directory"
  [[ -d "out" ]] || fail "No 'out/' directory found. Remove --skip-build to build first."
fi

# ── Step 3: Create archive ───────────────────────────────────────────
log "Creating deploy archive..."
DATE=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="aromeluxe_${DATE}.zip"
ARCHIVE_PATH="${PROJECT_DIR}/${ARCHIVE_NAME}"

(cd out && zip -qr "$ARCHIVE_PATH" .)

ARCHIVE_SIZE=$(du -h "$ARCHIVE_PATH" | cut -f1)
ok "Archive ready: ${ARCHIVE_NAME} (${ARCHIVE_SIZE})"

# ── Step 4: Deploy via Hostinger MCP ─────────────────────────────────
log "Deploying to ${DOMAIN} via Hostinger MCP..."
echo ""

PROMPT="Use the Hostinger MCP tool \`deployStaticWebsite\` to deploy the pre-built static site.

Parameters:
- domain: ${DOMAIN}
- archivePath: ${ARCHIVE_PATH}
- removeArchive: true

After deployment, confirm the site is live by listing websites with \`listWebsitesV1\` and checking the status of ${DOMAIN}."

if claude --print "$PROMPT"; then
  echo ""
  ok "Deployment complete"
  echo -e "\n  ${GREEN}${BOLD}Live at: https://${DOMAIN}${NC}\n"
else
  echo ""
  warn "Claude Code exited with an error. Archive preserved at:"
  warn "  ${ARCHIVE_PATH}"
  warn "You can deploy manually from Claude Code:"
  warn "  Use deployStaticWebsite with archivePath: ${ARCHIVE_PATH}"
  exit 1
fi
