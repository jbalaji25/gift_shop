import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function CartPage({ onNavigate, onClose, isModal }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, total, loading } = useCart();

  const content = (
    <div className={isModal ? '' : 'min-h-screen bg-slate-50 py-12'}>
      <div className={isModal ? 'p-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        {isModal && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Shopping Cart</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {!isModal && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
            <p className="text-slate-600">Review your items and checkout</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-slate-300 mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h3>
            <p className="text-slate-600 mb-8">Add some products to get started</p>
            <button
              onClick={() => {
                onNavigate('products');
                onClose?.();
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => {
                const images = Array.isArray(item.product.images) ? item.product.images : [];
                return (
                  <div key={item.id} className="bg-white rounded-xl p-6 shadow-md flex items-center space-x-6">
                    <img
                      src={String(images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg')}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{item.product.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{item.product.category}</p>
                      <p className="text-xl font-bold text-amber-600">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                <h3 className="font-bold text-xl text-slate-900 mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-amber-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('checkout');
                    onClose?.();
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-lg font-semibold transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => {
                    onNavigate('products');
                    onClose?.();
                  }}
                  className="w-full border-2 border-slate-300 hover:border-slate-400 text-slate-700 py-4 rounded-lg font-semibold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
