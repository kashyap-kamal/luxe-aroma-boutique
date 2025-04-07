
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { cartItems, subtotal, clearCart } = useCart();

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="luxury-container">
          <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>
          
          {isEmpty ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-medium">
                      Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                    </h2>
                    <Button 
                      variant="ghost" 
                      className="text-gray-500 hover:text-red-500"
                      onClick={clearCart}
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map(item => (
                      <CartItem key={item.product.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Cart Summary */}
              <div className="w-full lg:w-1/3">
                <CartSummary subtotal={subtotal} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
