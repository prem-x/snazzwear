import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    original_total: 0,
    saved_amount: 0,
    shipping: 0,
    final_total: 0,
    cart_count: 0,
    discount_percentage: 0,
    coupon_code: '',
  });
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart/');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist/');
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.products || []);
        setWishlistIds((data.products || []).map((p) => p.id));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Refetch cart & wishlist when auth status changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCart(), fetchWishlist()]);
      setLoading(false);
    };
    loadData();
  }, [isAuthenticated]);

  const addToCart = async (variantId, quantity) => {
    try {
      const response = await fetch('/api/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ variant_id: variantId, quantity }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCart();
        setCartDrawerOpen(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Failed to add item to cart' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'An error occurred.' };
    }
  };

  const updateCartQuantity = async (itemId, action) => {
    try {
      const response = await fetch('/api/cart/update-quantity/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId, action }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCart();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return { success: false, message: 'An error occurred.' };
    }
  };

  const updateCartSize = async (itemId, variantId) => {
    try {
      const response = await fetch('/api/cart/update-size/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId, variant_id: variantId }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCart();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating cart size:', error);
      return { success: false, message: 'An error occurred.' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch('/api/cart/remove/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
    return { success: false };
  };

  const applyCoupon = async (code) => {
    try {
      const response = await fetch('/api/cart/apply-coupon/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCart();
        return { success: true, discount_percentage: data.discount_percentage };
      } else {
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: 'An error occurred.' };
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const response = await fetch('/api/wishlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchWishlist();
        return { success: true, isActive: data.is_active };
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
    return { success: false };
  };

  const clearCartState = () => {
    setCart({
      items: [],
      subtotal: 0,
      original_total: 0,
      saved_amount: 0,
      shipping: 0,
      final_total: 0,
      cart_count: 0,
      discount_percentage: 0,
      coupon_code: '',
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        wishlistIds,
        cartDrawerOpen,
        setCartDrawerOpen,
        loading,
        fetchCart,
        fetchWishlist,
        addToCart,
        updateCartQuantity,
        updateCartSize,
        removeFromCart,
        applyCoupon,
        toggleWishlist,
        clearCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
