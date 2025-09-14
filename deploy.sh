#!/bin/bash

# Hostinger Deployment Script for Luxe Aroma Boutique
# Based on: https://dev.to/oandersonmagalhaes/deploying-your-nextjs-project-on-hostinger-4gpm

echo "🚀 Starting Hostinger deployment process..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env not found. Creating from example..."
    echo "BASE_PATH=" > .env
    echo "URL=" >> .env
    echo "Please update .env with your actual values before deploying."
fi

# Build the static site
echo "📦 Building static site..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Static files generated in 'out' folder."
    echo ""
    echo "📁 Next steps:"
    echo "1. Upload all contents from the 'out' folder to your Hostinger public_html directory"
    echo "2. Ensure index.html is in the root directory"
    echo "3. Test your website at your domain"
    echo ""
    echo "🔧 For automated deployment, set up GitLab CI/CD with the provided .gitlab-ci.yml"
    echo "📖 See HOSTINGER_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
