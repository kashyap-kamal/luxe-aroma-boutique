# Deployment Guide

## For Hostinger or Similar Shared Hosting

### Method 1: Static File Deployment (Recommended)

1. **Build the project locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Upload files:**
   - Navigate to the `dist` folder created after build
   - Upload ALL contents of the `dist` folder to your hosting's `public_html` directory
   - Also upload the `.htaccess` file to `public_html` for proper routing

### Method 2: Git-based Deployment

If your hosting supports Node.js:

1. **Ensure your hosting plan supports Node.js applications**
2. **Set build command:** `npm run build`
3. **Set publish directory:** `dist`
4. **Set Node.js version:** 18+ (check package.json engines if needed)

### Troubleshooting

- **PHP detection error:** This happens when the host assumes it's a PHP project. Use static file deployment instead.
- **404 errors on routes:** Make sure `.htaccess` is uploaded and mod_rewrite is enabled
- **Blank page:** Check browser console for errors, usually missing files or incorrect paths

### Files for Deployment

- `netlify.toml` - Deployment configuration
- `.htaccess` - Apache server configuration for React Router
- `dist/` folder contents - Built application files 