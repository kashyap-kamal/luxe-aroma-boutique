# Aromé Luxe Deployment Guide

This guide explains how to deploy the Aromé Luxe project to Hostinger and how to manage Supabase changes.

## Quick Start

The easiest way to prepare a deployment package is to run:

```bash
npm run deploy
```

This will:
1. Check for required environment variables.
2. Build the Next.js static site.
3. Create a compressed archive (`aromeluxe-deploy-YYYYMMDD-HHMMSS.tar.gz`) ready for upload.

## Detailed Deployment Steps

### 1. Environment Variables

Before building, ensure your production environment variables are set. You can set them in your shell or use a `.env.production` file.

Required variables:
- `NEXT_PUBLIC_APP_URL=https://aromeluxe.in`
- `NEXT_PUBLIC_SITE_URL=https://aromeluxe.in`
- `NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key`

### 2. Frontend Deployment (Hostinger)

1. Run `npm run deploy`.
2. Find the generated `.tar.gz` file in the project root.
3. Log in to [Hostinger hPanel](https://hpanel.hostinger.com/).
4. Go to **Websites** -> **Manage** -> **File Manager**.
5. Navigate to the `public_html` folder.
6. Upload the `.tar.gz` file.
7. Right-click the file and select **Extract**.
8. Choose the `public_html` directory as the destination.
9. Delete the `.tar.gz` file after extraction.

### 3. Supabase Deployment

If you have made changes to the database schema or Edge Functions, they must be deployed separately.

#### Using Cursor (Recommended)
Use the Supabase MCP tools available in Cursor to:
- Apply migrations: `supabase/migrations/`
- Deploy functions: `supabase/functions/`

#### Using Supabase CLI
If you have the CLI installed locally:
```bash
# Deploy all Edge Functions
supabase functions deploy

# Push database migrations
supabase migration push
```

## Troubleshooting

### Localhost Redirects
If internal links are redirecting to `localhost:3000` in production, it means the build was performed without the correct `NEXT_PUBLIC_APP_URL` environment variable. Ensure this is set to `https://aromeluxe.in` before building.

### API Routes
This project uses `output: 'export'`, which means Next.js API routes (`src/app/api/`) will not work on static hosting like Hostinger. All backend logic has been moved to **Supabase Edge Functions**.

## Maintenance

To clean up old deployment archives:
```bash
rm aromeluxe-deploy-*.tar.gz
```
