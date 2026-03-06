import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../lib/database.types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, productId: string) => void;
}

export function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, setShowAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);

  const images = Array.isArray(product.images) ? product.images : [];
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={() => onNavigate('product-detail', product.id)}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
    >
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={String(images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg')}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        {user && (
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'
                }`}
            />
          </button>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Only {product.stock} left!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-slate-700">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-slate-500">({product.review_count} reviews)</span>
        </div>

        <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <span className="bg-slate-100 px-2 py-1 rounded">{product.category}</span>
          <span className="bg-slate-100 px-2 py-1 rounded">{product.material}</span>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.compare_price && (
            <span className="text-sm text-slate-500 line-through">
              ₹{product.compare_price.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{loading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}
