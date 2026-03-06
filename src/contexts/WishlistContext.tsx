import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isMock } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Product } from '../lib/database.types';
import { mockProducts } from '../lib/demoData';

interface WishlistContextType {
  items: Product[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    setLoading(true);

    if (isMock) {
      // Use localStorage for mock/demo mode to avoid Supabase network errors
      try {
        const stored = localStorage.getItem(`wishlist_${user.id}`);
        const ids: string[] = stored ? JSON.parse(stored) : [];
        const wishlistProducts = mockProducts.filter(p => ids.includes(p.id));
        setItems(wishlistProducts);
      } catch {
        setItems([]);
      }
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('wishlist_items')
      .select(`
        product:products(*)
      `)
      .eq('user_id', user.id);

    if (data) {
      setItems(data.map(item => item.product as unknown as Product));
    }
    setLoading(false);
  };

  const addToWishlist = async (productId: string) => {
    if (!user) throw new Error('Must be logged in to add to wishlist');

    if (isMock) {
      try {
        const stored = localStorage.getItem(`wishlist_${user.id}`);
        const ids: string[] = stored ? JSON.parse(stored) : [];
        if (!ids.includes(productId)) {
          ids.push(productId);
          localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(ids));
        }
      } catch { /* ignore */ }
      await fetchWishlist();
      return;
    }

    await supabase.from('wishlist_items').insert({
      user_id: user.id,
      product_id: productId,
    });

    await fetchWishlist();
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    if (isMock) {
      try {
        const stored = localStorage.getItem(`wishlist_${user.id}`);
        const ids: string[] = stored ? JSON.parse(stored) : [];
        const updated = ids.filter(id => id !== productId);
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
      } catch { /* ignore */ }
      await fetchWishlist();
      return;
    }

    await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    await fetchWishlist();
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
