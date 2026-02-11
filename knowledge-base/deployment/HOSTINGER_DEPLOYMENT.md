# Hostinger Deployment Guide for Luxe Aroma Boutique

This guide will help you deploy your Next.js website to Hostinger using static export, based on the [Hostinger deployment tutorial](https://dev.to/oandersonmagalhaes/deploying-your-nextjs-project-on-hostinger-4gpm).

## ⚠️ Important Notes

**API Routes Limitation**: Your website currently has API routes (`/api/checkout` and `/api/store-payment`) that won't work with static export. You'll need to either:
1. Remove the payment functionality temporarily
2. Use client-side payment integration (like Razorpay's client-side SDK)
3. Deploy to a platform that supports serverless functions (Vercel, Netlify)

## Configuration Changes Made

### 1. Next.js Configuration (`next.config.ts`)
```typescript
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  assetPrefix: process.env.URL ? process.env.URL : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};
```

### 2. Environment Variables Needed
Create a `.env.local` file with:
```env
BASE_PATH=
URL=
```

## Deployment Steps

### Option 1: Manual FTP Upload

1. **Build the static files**:
   ```bash
   npm run build
   ```
   This creates an `out` folder with all static files.

2. **Upload to Hostinger**:
   - Access your Hostinger File Manager or use FTP
   - Upload all contents from the `out` folder to your domain's public_html directory
   - Ensure `index.html` is in the root directory

### Option 2: Automated Deployment with GitLab CI/CD

1. **Set up GitLab repository** and add these CI/CD variables:
   - `luxe_aroma_base_path`: Your base path (usually empty for root domain)
   - `luxe_aroma_ftp_host`: Your FTP host (e.g., ftp.yourdomain.com)
   - `luxe_aroma_ftp_user`: Your FTP username
   - `luxe_aroma_ftp_password`: Your FTP password
   - `luxe_aroma_url`: Your website URL (e.g., https://aromeluxe.in)

2. **Create `.gitlab-ci.yml`**:
   ```yaml
   image: node:21.4.0-alpine

   cache:
     paths:
       - node_modules/

   before_script:
     - apk add lftp
     - npm install

   upload:
     environment: prd
     stage: deploy
     script:
       - echo "Preparing FTP... $luxe_aroma_ftp_host $luxe_aroma_ftp_user $luxe_aroma_ftp_password"
       - URL=$luxe_aroma_url BASE_PATH=$luxe_aroma_base_path npx next build
       - lftp -c "set verify-certificate/$luxe_aroma_ftp_host no; set ftp:ssl-allow on; open -u $luxe_aroma_ftp_user,$luxe_aroma_ftp_password ftp://$luxe_aroma_ftp_host; mirror -Rev out/ ./ --ignore-time --parallel=10"
     only:
       - master
       - main
   ```

## Hostinger Setup

1. **Create subdomain or folder** in your Hostinger account
2. **Set up FTP account** with limited access to that directory (Principle of Least Privilege)
3. **Configure domain/subdomain** to point to your deployment directory

## Testing Your Deployment

1. Run `npm run build` locally
2. Test the `out` folder by serving it locally:
   ```bash
   npx serve out
   ```
3. Verify all pages load correctly
4. Check that images and assets load properly

## Payment Integration Alternative

Since API routes don't work with static export, consider:

1. **Client-side Razorpay integration**:
   ```javascript
   // Example client-side payment
   const options = {
     key: 'YOUR_RAZORPAY_KEY',
     amount: amount * 100,
     currency: 'INR',
     name: 'Aromé Luxe',
     description: 'Payment for order',
     handler: function (response) {
       // Handle success
     }
   };
   const rzp = new Razorpay(options);
   rzp.open();
   ```

2. **Use a payment form** that redirects to Razorpay's hosted checkout page

## Benefits of This Approach

- ✅ Low-cost hosting solution
- ✅ Fast static site performance
- ✅ Easy to maintain and update
- ✅ Suitable for marketing pages and POCs
- ✅ Automated deployment with CI/CD

## Limitations

- ❌ No server-side functionality (API routes)
- ❌ No dynamic server-side rendering
- ❌ Limited to static content
- ❌ Payment processing requires client-side integration

## Next Steps

1. Test the static build: `npm run build`
2. Set up your Hostinger account and FTP credentials
3. Choose deployment method (manual or automated)
4. Configure payment integration for client-side processing
5. Deploy and test your live website

For questions or issues, refer to the [original deployment guide](https://dev.to/oandersonmagalhaes/deploying-your-nextjs-project-on-hostinger-4gpm).
