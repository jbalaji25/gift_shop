import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isMock } from '../lib/supabase';

interface DashboardPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: Array<{
    product: {
      name: string;
      images: any;
    };
    quantity: number;
    price: number;
  }>;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);

    if (isMock) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          product:products (
            name,
            images
          )
        )
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data as unknown as Order[]);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Dashboard</h1>
          <p className="text-slate-600">Welcome back, {profile?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-slate-600 text-sm mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-slate-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-slate-600 text-sm mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold text-orange-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-slate-600 text-sm mb-2">Completed Orders</h3>
            <p className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Order History</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h3>
              <p className="text-slate-600 mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => onNavigate('products')}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {orders.map(order => (
                <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-semibold text-slate-900">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Total</p>
                      <p className="text-xl font-bold text-amber-600">
                        ₹{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2 relative px-4 sm:px-8">
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map((stepLabel, idx) => {
                        const getStepIndex = (status: string) => {
                          if (status === 'completed' || status === 'delivered') return 3;
                          if (status === 'shipped') return 2;
                          if (status === 'processing') return 1;
                          return 0; // pending
                        };
                        const currentIdx = order.status === 'cancelled' ? -1 : getStepIndex(order.status);
                        const isCompleted = currentIdx >= idx;
                        return (
                          <div key={idx} className="flex flex-col items-center w-1/4 relative z-10">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 ${isCompleted ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-400 border-2 border-white'}`}>
                              {isCompleted ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> : (idx + 1)}
                            </div>
                            <span className={`text-[10px] md:text-xs text-center ${isCompleted ? 'text-amber-600 font-bold' : ''}`}>{stepLabel}</span>
                          </div>
                        )
                      })}
                      {/* Connecting Line */}
                      <div className="absolute top-4 md:top-5 left-[12.5%] right-[12.5%] h-1 md:h-1.5 bg-slate-100 rounded-full" style={{ zIndex: 0 }}>
                        {order.status !== 'cancelled' && (
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${(() => {
                                if (order.status === 'completed' || order.status === 'delivered') return 100;
                                if (order.status === 'shipped') return 66.6;
                                if (order.status === 'processing') return 33.3;
                                return 0; // pending
                              })()}%`
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {order.status === 'cancelled' && (
                      <div className="mt-4 p-3 bg-red-50 text-red-600 rounded text-sm font-semibold flex items-center justify-center">
                        <XCircle className="w-5 h-5 mr-2" /> This order was cancelled.
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2">Items in this order</h4>
                    {order.order_items.map((item, idx) => {
                      const images = Array.isArray(item.product.images) ? item.product.images : [];
                      return (
                        <div key={idx} className="flex items-center space-x-4 text-sm">
                          <img
                            src={images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="flex-1 text-slate-700">{item.product.name}</span>
                          <span className="text-slate-600">Qty: {item.quantity}</span>
                          <span className="font-semibold text-slate-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
