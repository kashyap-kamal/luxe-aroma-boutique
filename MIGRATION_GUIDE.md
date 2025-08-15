# Migration Guide: React Vite to Next.js

This document outlines the changes made to migrate the Luxe Aroma Boutique project from React Vite to Next.js.

## Major Changes Made

### 1. Package.json Updates
- Replaced Vite scripts with Next.js scripts
- Added `next` dependency
- Removed Vite-specific dependencies (`@vitejs/plugin-react-swc`, `vite`)
- Added `eslint-config-next` for Next.js linting
- Removed `react-router-dom` (replaced with Next.js routing)

### 2. Configuration Files
- **Removed**: `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`
- **Updated**: `tsconfig.json` for Next.js compatibility
- **Added**: `next.config.js`, `next-env.d.ts`

### 3. Project Structure Changes
- **Removed**: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- **Added**: `src/app/` directory structure for Next.js App Router
- **Created**: `src/app/layout.tsx` (root layout)
- **Created**: `src/app/globals.css` (global styles)
- **Created**: `src/app/page.tsx` (home page)

### 4. Routing Migration
- **Before**: React Router with `<BrowserRouter>`, `<Routes>`, `<Route>`
- **After**: Next.js App Router with file-based routing
- **Routes created**:
  - `/` → `src/app/page.tsx`
  - `/products` → `src/app/products/page.tsx`
  - `/products/[id]` → `src/app/products/[id]/page.tsx`
  - `/cart` → `src/app/cart/page.tsx`
  - `/checkout` → `src/app/checkout/page.tsx`
  - `/order-success/[orderId]` → `src/app/order-success/[orderId]/page.tsx`
  - `/about` → `src/app/about/page.tsx`
  - `/contact` → `src/app/contact/page.tsx`
  - `/privacy-policy` → `src/app/privacy-policy/page.tsx`
  - `/terms-of-service` → `src/app/terms-of-service/page.tsx`
  - `/cancellation-refund` → `src/app/cancellation-refund/page.tsx`
  - `/shipping-delivery` → `src/app/shipping-delivery/page.tsx`

### 5. Component Updates
- **Removed**: `<Navbar />` and `<Footer />` from individual pages (now in root layout)
- **Updated**: All `Link` components from `react-router-dom` to `next/link`
- **Updated**: All `to="/path"` attributes to `href="/path"`
- **Updated**: All `useNavigate()` hooks to `useRouter()` from `next/navigation`
- **Updated**: All `useParams()` usage to accept props from page components

### 6. Environment Variables
- **Before**: `import.meta.env.VITE_RAZORPAY_KEY_ID`
- **After**: `process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID`
- **File**: Create `.env.local` instead of `.env`

## How to Run the Project

### 1. Install Dependencies
```bash
npm install
# or
yarn install
# or
bun install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Key Benefits of the Migration

1. **Better SEO**: Next.js provides better server-side rendering and SEO capabilities
2. **Improved Performance**: Built-in optimizations for images, fonts, and code splitting
3. **File-based Routing**: Simpler and more intuitive routing system
4. **API Routes**: Built-in API route support for backend functionality
5. **Better Developer Experience**: Enhanced tooling and debugging capabilities
6. **Production Ready**: Optimized builds and deployment options

## Notes

- The migration maintains all existing functionality while improving the underlying architecture
- All UI components and styling remain unchanged
- The shopping cart and payment functionality work exactly as before
- The design system and component library are preserved
- All existing pages and features are available with the same URLs

## Troubleshooting

If you encounter any issues:

1. **Port conflicts**: Next.js uses port 3000 by default, ensure it's available
2. **Environment variables**: Make sure `.env.local` is in the project root
3. **Build errors**: Check that all dependencies are properly installed
4. **Routing issues**: Verify that page files are in the correct `src/app/` directory structure 