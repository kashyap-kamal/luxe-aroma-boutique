# Environment Configuration Guide

This guide explains how to properly configure environment variables for different deployment scenarios.

## 🚨 **FIX FOR CORS ISSUE**

The CORS error you're experiencing is because the `assetPrefix` is set to `https://aromeluxe.in` in development. Here's the correct configuration:

## 📁 Environment Files

### For Development (`.env.local`)
```env
# Development Environment - Leave these EMPTY for local development
BASE_PATH=
URL=

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_your_test_key_here
RAZORPAY_KEY_SECRET=your_test_secret_here

# Delhivery API Configuration (Test Mode)
DELHIVERY_API_KEY=your_delhivery_test_api_key
DELHIVERY_BASE_URL=https://track.delhivery.com
DELHIVERY_CLIENT_ID=your_delhivery_test_client_id

# Seller Information
SELLER_NAME=Aromé Luxe
SELLER_ADDRESS=Your Business Address, City, State, Pincode
SELLER_GSTIN=your_gstin_number_here
```

### For Production (`.env.production`)
```env
# Production Environment - Set these for Hostinger deployment
BASE_PATH=
URL=https://aromeluxe.in

# Razorpay Configuration (Live Mode)
RAZORPAY_KEY_ID=rzp_live_your_live_key_here
RAZORPAY_KEY_SECRET=your_live_secret_here

# Delhivery API Configuration (Live Mode)
DELHIVERY_API_KEY=your_delhivery_live_api_key
DELHIVERY_BASE_URL=https://track.delhivery.com
DELHIVERY_CLIENT_ID=your_delhivery_live_client_id

# Seller Information
SELLER_NAME=Aromé Luxe
SELLER_ADDRESS=Your Business Address, City, State, Pincode
SELLER_GSTIN=your_gstin_number_here
```

## 🔧 **IMMEDIATE FIX**

To fix the current CORS issue, update your `.env.local` file:

```env
# Fix for CORS issue - Remove the URL for development
BASE_PATH=
URL=

# Keep your other environment variables...
RAZORPAY_KEY_ID=rzp_test_placeholder_key_id
RAZORPAY_KEY_SECRET=placeholder_key_secret
```

## 🚀 **How It Works**

### Development Mode
- `NODE_ENV=development`
- `assetPrefix` and `basePath` are **NOT** set
- Assets load from `http://localhost:3000`
- No CORS issues

### Production Mode
- `NODE_ENV=production`
- `assetPrefix` and `basePath` are set from environment variables
- Assets load from your production domain
- Optimized for static hosting

## 📋 **Quick Setup Steps**

1. **Update your `.env.local`**:
   ```bash
   echo "BASE_PATH=" > .env.local
   echo "URL=" >> .env.local
   echo "RAZORPAY_KEY_ID=rzp_test_placeholder_key_id" >> .env.local
   echo "RAZORPAY_KEY_SECRET=placeholder_key_secret" >> .env.local
   ```

2. **Restart your development server**:
   ```bash
   npm run dev
   ```

3. **Clear browser cache** to remove cached assets

## 🎯 **Environment-Specific Builds**

### Development Build
```bash
npm run dev
# Uses .env.local with empty BASE_PATH and URL
```

### Production Build
```bash
NODE_ENV=production npm run build
# Uses environment variables for assetPrefix and basePath
```

### Hostinger Deployment
```bash
# Set production environment variables
export NODE_ENV=production
export BASE_PATH=
export URL=https://aromeluxe.in
npm run build
```

## 🔍 **Troubleshooting**

### CORS Errors
- **Problem**: Assets trying to load from production URL in development
- **Solution**: Ensure `URL=` is empty in `.env.local`

### 404 Errors on Assets
- **Problem**: `assetPrefix` pointing to wrong domain
- **Solution**: Check your environment variables match your deployment

### Build Failures
- **Problem**: Missing environment variables
- **Solution**: Ensure all required variables are set

## 📊 **Environment Variable Reference**

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `BASE_PATH` | `""` (empty) | `""` or `/subfolder` | Base path for the app |
| `URL` | `""` (empty) | `https://yourdomain.com` | Full URL for assets |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | `rzp_live_...` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | `test_secret` | `live_secret` | Razorpay secret |
| `DELHIVERY_API_KEY` | `test_key` | `live_key` | Delhivery API key |
| `DELHIVERY_CLIENT_ID` | `test_client` | `live_client` | Delhivery client ID |

## ✅ **Verification**

After updating your environment:

1. **Check development server**:
   ```bash
   npm run dev
   # Should load without CORS errors
   ```

2. **Check production build**:
   ```bash
   npm run build
   # Should generate static files correctly
   ```

3. **Verify assets**:
   - Development: `http://localhost:3000/_next/static/...`
   - Production: `https://aromeluxe.in/_next/static/...`

## 🎉 **Result**

With this configuration:
- ✅ No CORS errors in development
- ✅ Proper asset loading in production
- ✅ Seamless deployment to Hostinger
- ✅ Delhivery integration working
- ✅ Razorpay payments functioning

Your development environment should now work without CORS issues! 🚀
