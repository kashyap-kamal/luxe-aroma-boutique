#!/bin/bash

# Aromé Luxe - Full Deployment Script
# Builds the static site, creates a deploy archive, and cleans up build artifacts.
# Usage: npm run deploy

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo -e "${BLUE}🚀 Aromé Luxe — Full Deploy${NC}\n"

# ── 1. Environment check ────────────────────────────────────────────
echo -e "${BLUE}[1/6] Checking environment variables...${NC}"

REQUIRED_VARS=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${YELLOW}  ⚠ Missing env vars (will use .env files): ${MISSING_VARS[*]}${NC}"
else
    echo -e "${GREEN}  ✓ All required env vars set${NC}"
fi

# ── 2. Clean previous build ─────────────────────────────────────────
echo -e "${BLUE}[2/6] Cleaning previous build artifacts...${NC}"
rm -rf .next out
# Remove any old deploy archives
rm -f aromeluxe-deploy-*.tar.gz aromeluxe-deploy-*.zip aromeluxe_*.zip out_*.zip
echo -e "${GREEN}  ✓ Cleaned${NC}"

# ── 3. Build static site ────────────────────────────────────────────
echo -e "${BLUE}[3/6] Building static site...${NC}"
if npm run build; then
    echo -e "${GREEN}  ✓ Build successful${NC}"
else
    echo -e "${RED}  ✗ Build failed${NC}"
    exit 1
fi

# Verify output
if [ ! -d "out" ] || [ ! -f "out/index.html" ]; then
    echo -e "${RED}  ✗ 'out' directory missing or empty${NC}"
    exit 1
fi

PAGE_COUNT=$(find out -name "*.html" | wc -l | tr -d ' ')
echo -e "${GREEN}  ✓ ${PAGE_COUNT} HTML pages generated${NC}"

# ── 4. Create deploy archive ────────────────────────────────────────
echo -e "${BLUE}[4/6] Creating deploy archive...${NC}"
DATE=$(date +%Y%m%d-%H%M%S)
ARCHIVE_NAME="aromeluxe-deploy-${DATE}.tar.gz"

(cd out && tar -czf "../${ARCHIVE_NAME}" .)

ARCHIVE_SIZE=$(du -h "$ARCHIVE_NAME" | cut -f1)
echo -e "${GREEN}  ✓ ${ARCHIVE_NAME} (${ARCHIVE_SIZE})${NC}"

# ── 5. Clean up build artifacts ──────────────────────────────────────
echo -e "${BLUE}[5/6] Cleaning up build artifacts...${NC}"
rm -rf .next out
echo -e "${GREEN}  ✓ Removed .next/ and out/${NC}"

# ── 6. Done ──────────────────────────────────────────────────────────
echo -e "\n${GREEN}🎉 Deploy archive ready: ${ARCHIVE_NAME}${NC}"
echo -e ""
echo -e "${BLUE}Upload to Hostinger:${NC}"
echo -e "  1. hPanel → File Manager → ${YELLOW}public_html${NC}"
echo -e "  2. Upload ${YELLOW}${ARCHIVE_NAME}${NC}"
echo -e "  3. Extract the archive"
echo -e "  4. Delete the archive from the server"
echo -e "  5. Verify at ${YELLOW}https://aromeluxe.in${NC}"
echo -e ""
echo -e "${BLUE}Or use Claude Code:${NC}"
echo -e "  Ask Claude to deploy with Hostinger MCP tools"
echo -e ""
echo -e "${GREEN}Done!${NC}"
