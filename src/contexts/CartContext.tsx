import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isMock } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Product } from '../lib/database.types';
import { mockProducts } from '../lib/demoData';

interface CartItemWithProduct {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItemWithProduct[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    if (isMock) return; // Mock data uses local React state

    setLoading(true);
    const { data } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products(*)
      `)
      .eq('user_id', user.id);

    if (data) {
      setItems(data.map(item => ({
        id: item.id,
        product: item.product as unknown as Product,
        quantity: item.quantity,
      })));
    }
    setLoading(false);
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) throw new Error('Must be logged in to add to cart');

    if (isMock) {
      const product = mockProducts.find(p => p.id === productId);
      if (!product) return;

      const existingItem = items.find(i => i.product.id === productId);
      if (existingItem) {
        setItems(items.map(i =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ));
      } else {
        setItems([...items, { id: Date.now().toString(), product, quantity }]);
      }
      alert('Product added to cart successfully!');
      return;
    }

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
    } else {
      await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: productId,
        quantity,
      });
    }

    await fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (isMock) {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      setItems(items.map(i =>
        i.product.id === productId
          ? { ...i, quantity }
          : i
      ));
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    await fetchCart();
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    if (isMock) {
      setItems(items.filter(i => i.product.id !== productId));
      return;
    }

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;

    if (isMock) {
      setItems([]);
      return;
    }

    await supabase.from('cart_items').delete().eq('user_id', user.id);
    await fetchCart();
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
