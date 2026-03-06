import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { Check, Shield, Minus, Plus, Trash2 } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user, profile } = useAuth();
  const { addOrder } = useOrder();
  const [loading, setLoading] = useState(false);

  // Steps: 2: Address, 3: Order Summary, 4: Payment
  const [activeStep, setActiveStep] = useState<2 | 3 | 4>(2);

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    address: '',
    city: '',
    pincode: '',
  });

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep(3); // Proceed to Order Summary
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // Calculate shipping and tax
      const subtotal = total > 1000 ? total - 100 : total; // Remove shipping if > 1000
      const shipping = total > 1000 ? 0 : 100;
      const tax = Math.round(subtotal * 0.05); // 5% tax
      const finalTotal = subtotal + shipping + tax;

      // Create order items
      const orderItems = items.map((item) => {
        const images = Array.isArray(item.product.images) ? item.product.images : [];
        return {
          id: `${item.product.id}-${Date.now()}`,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: images[0] instanceof Blob ? undefined : (images[0] as string),
        };
      });

      // Create order object
      const newOrder = {
        status: 'pending' as const,
        customer: {
          name: formData.fullName,
          email: user?.email || '',
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: '', // Add to form
          zipCode: formData.pincode,
        },
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total: finalTotal,
        paymentMethod: 'whatsapp' as const,
      };

      // Add order to OrderContext (automatically sends WhatsApp)
      await addOrder(newOrder);

      // Clear cart
      await clearCart();

      // Show alert
      alert('Order sent successfully!');

      // Navigate to dashboard
      onNavigate('dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };


  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-xl shadow-md max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Add items to it now.</p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-amber-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-600 transition"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Steps */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Login */}
            <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between p-6">
              <div className="flex items-center space-x-4 mb-2 md:mb-0">
                <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-md text-sm">1</div>
                <div className="font-bold text-slate-900 text-lg flex items-center">
                  Login <Check className="w-5 h-5 text-amber-600 ml-2" />
                </div>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-slate-900">{profile?.full_name || 'User'}</span>
                <span className="text-slate-600 ml-2">{user?.email || 'user@example.com'}</span>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`px-6 py-5 flex items-center transition-colors ${activeStep === 2 ? 'bg-amber-500 text-white' : 'text-slate-900 border-b border-slate-100'}`}>
                <div className={`font-bold px-3 py-1 rounded-md text-sm mr-4 ${activeStep === 2 ? 'bg-white text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                  2
                </div>
                <div className={`font-bold text-lg flex items-center ${activeStep === 2 ? 'text-white' : 'text-slate-900'}`}>
                  Delivery Address {activeStep > 2 && <Check className="w-5 h-5 text-amber-600 ml-2" />}
                </div>
              </div>

              {activeStep === 2 && (
                <div className="p-6">
                  <form onSubmit={handleDeliverySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="City/District/Town"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <textarea
                      placeholder="Address (Area and Street)"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />

                    <div>
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm w-full sm:w-auto"
                      >
                        Deliver Here
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {activeStep > 2 && (
                <div className="px-6 py-4 bg-slate-50 text-sm text-slate-800">
                  <p className="mb-2"><span className="font-semibold">{formData.fullName}</span> {formData.phone}</p>
                  <p>{formData.address}, {formData.city} - <span className="font-semibold">{formData.pincode}</span></p>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="mt-3 text-amber-600 font-semibold hover:text-amber-700 hover:underline text-sm uppercase tracking-wide"
                  >
                    Change Details
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Order Summary */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`px-6 py-5 flex items-center transition-colors ${activeStep === 3 ? 'bg-amber-500 text-white' : 'text-slate-900 border-b border-slate-100'}`}>
                <div className={`font-bold px-3 py-1 rounded-md text-sm mr-4 ${activeStep === 3 ? 'bg-white text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                  3
                </div>
                <div className={`font-bold text-lg flex items-center ${activeStep === 3 ? 'text-white' : 'text-slate-900'}`}>
                  Order Summary {activeStep > 3 && <Check className="w-5 h-5 text-amber-600 ml-2" />}
                </div>
              </div>

              {activeStep === 3 && (
                <div className="p-0">
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const images = Array.isArray(item.product.images) ? item.product.images : [];
                      const imgUrl = (images[0] || 'https://via.placeholder.com/150') as string;
                      return (
                        <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5 hover:bg-slate-50 transition-colors">
                          <div className="w-24 h-24 flex-shrink-0 bg-white rounded-lg border border-slate-200 p-2 mx-auto sm:mx-0">
                            <img src={imgUrl} alt={item.product.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between text-center sm:text-left gap-3">
                            <h4 className="font-semibold text-slate-900 line-clamp-2 text-lg">{item.product.name}</h4>
                            <div className="flex items-center justify-center sm:justify-start gap-4">
                              {/* Quantity stepper */}
                              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="px-3 py-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-700 transition-colors font-bold"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 font-semibold text-slate-900 min-w-[2.5rem] text-center bg-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="px-3 py-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-700 transition-colors font-bold"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              {/* Remove button */}
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="font-bold text-amber-600 text-xl">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                              {item.quantity > 1 && (
                                <span className="text-sm font-normal text-slate-500 ml-2">
                                  (₹{item.product.price.toLocaleString()} each)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-6 bg-slate-50 flex justify-end border-t border-slate-100">
                    <button
                      onClick={() => setActiveStep(4)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm w-full sm:w-auto"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
              {activeStep > 3 && (
                <div className="px-6 py-4 bg-slate-50 text-sm font-semibold text-slate-800 flex justify-between items-center">
                  <span>{items.length} Item{items.length !== 1 ? 's' : ''} Summary Checked</span>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="text-amber-600 font-semibold hover:text-amber-700 hover:underline text-sm uppercase tracking-wide"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Step 4: Payment Options */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`px-6 py-5 flex items-center transition-colors ${activeStep === 4 ? 'bg-amber-500 text-white' : 'text-slate-900 border-b border-slate-100'}`}>
                <div className={`font-bold px-3 py-1 rounded-md text-sm mr-4 ${activeStep === 4 ? 'bg-white text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                  4
                </div>
                <div className={`font-bold text-lg ${activeStep === 4 ? 'text-white' : 'text-slate-900'}`}>
                  Payment Options
                </div>
              </div>

              {activeStep === 4 && (
                <div className="p-6">
                  <div className="border-2 border-amber-500 bg-amber-50 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer transition-colors">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="bg-amber-500 rounded-full p-1 shadow-inner">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <label className="font-bold text-slate-900 text-lg cursor-pointer">Cash on Delivery</label>
                        <p className="text-sm text-slate-600 mt-1 font-medium">Pay with cash upon delivery.</p>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-md w-full sm:w-auto disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Confirm Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Price Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md sticky top-24">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="font-bold text-xl text-slate-900 uppercase">Price Details</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>Price ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>Delivery Charges</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-xl text-slate-900">Total Payable</span>
                  <span className="font-bold text-xl text-amber-600">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-slate-500 px-4 mb-8 text-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <Shield className="w-10 h-10 text-amber-500 mb-2" />
              <p className="font-medium text-sm text-slate-800">Safe and Secure Payments.</p>
              <p className="text-xs">Easy returns. 100% Authentic premium products.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
