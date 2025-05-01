import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className=" shadow-sm">
      <div className="luxury-container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-poppins font-black text-luxe-blue">
              Aromé <span className="text-luxe-violet">Luxe</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="font-medium text-black hover:text-luxe-blue transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="font-medium text-black hover:text-luxe-blue transition-colors"
            >
              Perfumes
            </Link>
            <Link
              to="/about"
              className="font-medium text-black hover:text-luxe-blue transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="font-medium text-black hover:text-luxe-blue transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:text-luxe-blue"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-black hover:text-luxe-blue"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-luxe-sandy text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-black hover:text-luxe-blue"
              onClick={toggleMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-luxe-aliceBlue z-50 md:hidden">
          <div className="p-4 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-black hover:text-luxe-blue"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="p-8 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-lg font-medium text-black hover:text-luxe-blue transition-colors py-2"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-lg font-medium text-black hover:text-luxe-blue transition-colors py-2"
              onClick={toggleMenu}
            >
              Perfumes
            </Link>
            <Link
              to="/about"
              className="text-lg font-medium text-black hover:text-luxe-blue transition-colors py-2"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-lg font-medium text-black hover:text-luxe-blue transition-colors py-2"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
