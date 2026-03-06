import { useEffect, useState } from 'react';
import { ShoppingCart, Heart, Star, ChevronLeft, Shield, Truck, Award } from 'lucide-react';
import { supabase, isMock } from '../lib/supabase';
import { mockProducts } from '../lib/demoData';
import type { Product } from '../lib/database.types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, setShowAuthModal } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);

    if (isMock) {
      const found = mockProducts.find(p => p.id === productId);
      if (found) {
        setProduct(found);
      }
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (data) {
      setProduct(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h2>
          <button onClick={() => onNavigate('products')} className="text-amber-600 hover:underline">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = (Array.isArray(product.images) ? product.images : []) as string[];
  const features = (Array.isArray(product.features) ? product.features : []) as string[];

  const handleAddToCart = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await addToCart(product.id, quantity);
  };

  const handleWishlist = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await addToCart(product.id, quantity);
    onNavigate('checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('products')}
          className="text-slate-600 hover:text-slate-900 mb-6 inline-flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <img
                src={images[currentImage] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'}
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`rounded-lg overflow-hidden ${idx === currentImage ? 'ring-4 ring-amber-500' : ''
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">({product.review_count} reviews)</span>
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-amber-600">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.compare_price && (
                  <span className="text-lg text-slate-500 line-through">
                    ₹{product.compare_price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-b border-slate-200 py-4">
              <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base">Key Features</h3>
              <ul className="space-y-1">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-100 rounded-lg p-2 text-center">
                <Truck className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p className="text-xs font-medium">Free Delivery</p>
              </div>
              <div className="bg-slate-100 rounded-lg p-2 text-center">
                <Shield className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p className="text-xs font-medium">Warranty</p>
              </div>
              <div className="bg-slate-100 rounded-lg p-2 text-center">
                <Award className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p className="text-xs font-medium">Premium Quality</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border-2 border-slate-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-slate-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-slate-100 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-slate-600">{product.stock} available</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 disabled:bg-slate-50 text-slate-900 disabled:text-slate-400 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors text-sm"
              >
                <span>Buy Now</span>
              </button>
              {user && (
                <button
                  onClick={handleWishlist}
                  className="p-3 border-2 border-slate-300 hover:border-amber-500 rounded-lg transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'
                      }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
