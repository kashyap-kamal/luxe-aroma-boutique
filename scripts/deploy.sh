#!/bin/bash

# Aromé Luxe Deployment Script
# This script automates the process of building and preparing the project for deployment to Hostinger.

# Set colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Aromé Luxe Deployment Preparation...${NC}\n"

# 1. Check for required environment variables
echo -e "${BLUE}⚙️  Checking environment variables...${NC}"

REQUIRED_VARS=("NEXT_PUBLIC_APP_URL" "NEXT_PUBLIC_SITE_URL" "NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING: The following environment variables are not set in your current shell:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "   - $var"
    done
    echo -e "\n${YELLOW}These should be set to your production values before building for production.${NC}"
    echo -e "Example: export NEXT_PUBLIC_APP_URL=https://aromeluxe.in"
    echo -e "${YELLOW}Continuing with build (Next.js will use values from .env files if present)...${NC}\n"
else
    echo -e "${GREEN}✅ All required environment variables are set in the environment.${NC}\n"
fi

# 2. Ask about Supabase changes
echo -e "${BLUE}❓ Do you need to deploy Supabase changes? (y/n)${NC}"
read -r deploy_supabase

if [[ $deploy_supabase =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}Supabase Deployment Notice:${NC}"
    echo -e "Since you are using Cursor with Supabase MCP, it is recommended to deploy functions"
    echo -e "and apply migrations directly through the Cursor AI interface for best results."
    echo -e "Alternatively, if you have the Supabase CLI installed, you can run:"
    echo -e "  - ${BLUE}supabase functions deploy${NC} (to deploy all functions)"
    echo -e "  - ${BLUE}supabase migration push${NC} (to push migrations)"
    echo -e "\nContinuing with frontend build...\n"
fi

# 3. Clean previous build
echo -e "${BLUE}🧹 Cleaning previous build...${NC}"
rm -rf out
rm -rf .next
echo -e "${GREEN}✅ Cleaned!${NC}\n"

# 4. Build the project
echo -e "${BLUE}📦 Building static site (Next.js export)...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}\n"
else
    echo -e "${RED}❌ Build failed! Please check the errors above.${NC}"
    exit 1
fi

# 5. Verify 'out' directory exists
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Error: 'out' directory not found. Static export might have failed.${NC}"
    exit 1
fi

# 6. Create archive
echo -e "${BLUE}🗜️  Compressing 'out' directory...${NC}"
DATE=$(date +%Y%m%d-%H%M%S)
ARCHIVE_NAME="aromeluxe-deploy-$DATE.tar.gz"

# Create the archive from within the 'out' folder to avoid including the folder itself
(cd out && tar -czf "../$ARCHIVE_NAME" .)

if [ -f "$ARCHIVE_NAME" ]; then
    echo -e "${GREEN}✅ Archive created: $ARCHIVE_NAME${NC}\n"
else
    echo -e "${RED}❌ Failed to create archive!${NC}"
    exit 1
fi

# 7. Final instructions
echo -e "${GREEN}🎉 Deployment package is ready!${NC}"
echo -e "\n${BLUE}Next Steps for Hostinger Deployment:${NC}"
echo -e "1. Log in to your Hostinger hPanel."
echo -e "2. Go to File Manager for ${YELLOW}aromeluxe.in${NC}."
echo -e "3. Navigate to the ${YELLOW}public_html${NC} directory."
echo -e "4. Upload ${YELLOW}$ARCHIVE_NAME${NC}."
echo -e "5. Extract the archive (this will overwrite existing files)."
echo -e "6. Delete the $ARCHIVE_NAME file from the server after extraction."
echo -e "7. Verify the site at ${YELLOW}https://aromeluxe.in${NC}."

echo -e "\n${GREEN}Done!${NC}"
