
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="luxury-container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-luxe-purple">
              Aromé <span className="text-luxe-gold">Luxe</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="font-medium hover:text-luxe-purple transition-colors">
              Home
            </Link>
            <Link to="/products" className="font-medium hover:text-luxe-purple transition-colors">
              Perfumes
            </Link>
            <Link to="/about" className="font-medium hover:text-luxe-purple transition-colors">
              About
            </Link>
            <Link to="/contact" className="font-medium hover:text-luxe-purple transition-colors">
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-luxe-gold text-luxe-black text-xs h-5 w-5 flex items-center justify-center rounded-full"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="luxury-container">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-serif font-bold text-luxe-purple">
                  Aromé <span className="text-luxe-gold">Luxe</span>
                </h1>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 mt-8">
              <Link 
                to="/" 
                className="text-lg font-medium hover:text-luxe-purple transition-colors py-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-lg font-medium hover:text-luxe-purple transition-colors py-2"
                onClick={toggleMenu}
              >
                Perfumes
              </Link>
              <Link 
                to="/about" 
                className="text-lg font-medium hover:text-luxe-purple transition-colors py-2"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-lg font-medium hover:text-luxe-purple transition-colors py-2"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
