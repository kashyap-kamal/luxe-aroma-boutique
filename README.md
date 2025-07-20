# Aromé Luxe - Luxury Fragrance Boutique

<div align="center">
  <img src="https://images.unsplash.com/photo-1592945403244-b3faa74b2c9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Aromé Luxe" width="600" style="border-radius: 12px;"/>
  
  <h3>Experience the Epitome of Luxury Fragrances</h3>
  
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-purple.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-4.4-yellow.svg)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 🌟 Overview

Aromé Luxe is a premium e-commerce platform for luxury fragrances, crafted with passion and precision. Our website offers an elegant shopping experience for discerning customers seeking the finest perfumes from around the world.

**Live Demo**: [https://aromeluxe.in](https://aromeluxe.in)

## ✨ Features

### 🛍️ **E-commerce Functionality**
- **Product Catalog**: Browse luxury fragrances by category (Men's, Women's, Unisex)
- **Product Details**: Comprehensive product information with high-quality imagery
- **Shopping Cart**: Seamless cart management with real-time updates
- **Checkout Process**: Streamlined checkout with multiple payment options
- **Order Management**: Track orders and manage purchase history

### 🎨 **Design & User Experience**
- **Luxury Aesthetic**: Sophisticated design reflecting premium brand positioning
- **Responsive Design**: Optimized for all devices (desktop, tablet, mobile)
- **Smooth Animations**: Elegant transitions and hover effects
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance**: Fast loading times with optimized assets

### 📱 **Modern Technology Stack**
- **React 18**: Latest React features with hooks and functional components
- **TypeScript**: Type-safe development for better code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: Beautiful, accessible UI components
- **React Router**: Client-side routing for seamless navigation
- **Vite**: Lightning-fast build tool and development server

### 🔧 **Advanced Features**
- **Search & Filtering**: Find products quickly with advanced filters
- **Wishlist**: Save favorite fragrances for later
- **Product Reviews**: Customer testimonials and ratings
- **Newsletter Signup**: Stay updated with latest releases
- **Social Media Integration**: Connect with us across platforms

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/arome-luxe.git
   cd arome-luxe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Testing (when implemented)
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

## 📁 Project Structure

```
arome-luxe/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── cart/          # Shopping cart components
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   ├── product/       # Product-related components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts (Cart, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components
│   │   ├── About.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Contact.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Products.tsx
│   │   └── TermsOfService.tsx
│   ├── utils/             # Utility functions and mock data
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── .eslintrc.js           # ESLint configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎯 Key Pages

### **Home Page** (`/`)
- Hero section with featured fragrances
- Product categories showcase
- Featured products grid
- Brand story section
- Newsletter signup

### **Products** (`/products`)
- Product catalog with filtering
- Category-based navigation
- Search functionality
- Product grid with hover effects

### **Product Detail** (`/products/:id`)
- Detailed product information
- High-quality product images
- Add to cart functionality
- Related products suggestions

### **Shopping Cart** (`/cart`)
- Cart item management
- Quantity adjustments
- Price calculations
- Checkout button

### **Checkout** (`/checkout`)
- Multi-step checkout process
- Shipping information
- Payment method selection
- Order confirmation

### **About** (`/about`)
- Company story and mission
- Team member profiles
- Awards and recognition
- Brand values

### **Contact** (`/contact`)
- Contact information
- Contact form
- Business hours
- FAQ section

### **Legal Pages**
- **Privacy Policy** (`/privacy-policy`)
- **Terms of Service** (`/terms-of-service`)

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 18.2.0**: Modern React with hooks and concurrent features
- **TypeScript 5.0**: Type-safe JavaScript development

### **Build Tools**
- **Vite 4.4**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance

### **Styling**
- **Tailwind CSS 3.3**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible UI components
- **Lucide React**: Modern icon library

### **Routing & State Management**
- **React Router 6**: Client-side routing
- **React Context**: State management for cart and user data
- **React Query**: Data fetching and caching

### **Development Tools**
- **TypeScript**: Static type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (recommended)

## 🎨 Design System

### **Color Palette**
```css
--luxe-blue: #1e3a8a      /* Primary brand color */
--luxe-sandy: #d97706     /* Accent color */
--luxe-cream: #fef3c7     /* Background color */
--luxe-violet: #7c3aed    /* Secondary accent */
--luxe-aliceBlue: #f0f8ff /* Light background */
```

### **Typography**
- **Primary Font**: Poppins (Google Fonts)
- **Secondary Font**: Serif for headings
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 900 (black)

### **Components**
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Cards**: Product cards with hover effects
- **Forms**: Styled form inputs and validation
- **Navigation**: Responsive navbar and footer
- **Modals**: Dialog components for confirmations

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_STRIPE_PUBLIC_KEY=your_stripe_key_here
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
```

### **Tailwind Configuration**
The project uses a custom Tailwind configuration with:
- Custom color palette
- Extended spacing and typography
- Custom animations
- Responsive breakpoints

### **TypeScript Configuration**
Strict TypeScript configuration with:
- Strict mode enabled
- Path aliases for clean imports
- React-specific configurations

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Deploy automatically on push to main branch

### **Netlify**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### **Traditional Hosting**
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your server for SPA routing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use meaningful commit messages
- Write clean, readable code
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- **Email**: support@aromeluxe.in
- **Website**: [https://aromeluxe.in](https://aromeluxe.in)
- **Documentation**: [Project Wiki](https://github.com/yourusername/arome-luxe/wiki)

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool
- **Unsplash** for high-quality images
- **Lucide** for the icon library

---

<div align="center">
  <p>Made with ❤️ by the Aromé Luxe Team</p>
  <p>Experience luxury, one fragrance at a time.</p>
</div>
