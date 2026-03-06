import { useState } from 'react';
import { Eye, MessageCircle, Trash2, Search, Download } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

export function OrderManagement() {
  const { orders, updateOrderStatus, deleteOrder, sendWhatsAppNotification } = useOrder();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | 'all'>('all');
  const [sendingWhatsApp, setSendingWhatsApp] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleResendWhatsApp = async (orderId: string, phone: string) => {
    setSendingWhatsApp(orderId);
    await sendWhatsAppNotification(orderId, phone);
    setSendingWhatsApp(null);
  };

  const handleExportOrders = () => {
    const dataStr = JSON.stringify(filteredOrders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
        <p className="text-slate-600 mt-1">Track and manage all customer orders with WhatsApp notifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
          <p className="text-slate-600 text-sm font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{orders.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-slate-600 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{orders.filter((o) => o.status === 'pending').length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-slate-600 text-sm font-medium">Confirmed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{orders.filter((o) => o.status === 'confirmed').length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-slate-600 text-sm font-medium">WhatsApp Sent</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{orders.filter((o) => o.whatsappSent).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Order ID, Name, or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExportOrders}
            className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-500">No orders found matching your criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900">{order.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.whatsappSent ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          ✓ WhatsApp Sent
                        </span>
                      ) : order.whatsappError ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          ✗ WhatsApp Failed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          ⏳ WhatsApp Pending
                        </span>
                      )}
                    </div>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600 text-xs">Customer</p>
                        <p className="font-medium text-slate-900">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Phone</p>
                        <p className="font-medium text-slate-900">{order.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Total</p>
                        <p className="font-medium text-slate-900">₹{order.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Items</p>
                        <p className="font-medium text-slate-900">{order.items.length} items</p>
                      </div>
                    </div>
                  </div>

                  <button className="text-slate-500 hover:text-slate-700 transition-colors p-2">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrderId === order.id && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4">
                  {/* Customer Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Email</p>
                      <p className="text-sm text-slate-900 mt-1">{order.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Address</p>
                      <p className="text-sm text-slate-900 mt-1">{order.customer.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">City/State</p>
                      <p className="text-sm text-slate-900 mt-1">
                        {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-semibold text-slate-900 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div>
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <p className="text-slate-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-lg p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax</span>
                        <span className="font-medium">₹{order.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Shipping</span>
                        <span className="font-medium">₹{order.shipping.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex justify-between">
                        <span className="font-semibold text-slate-900">Total</span>
                        <span className="font-bold text-amber-600">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Status */}
                  {order.whatsappError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-800 uppercase">WhatsApp Error</p>
                      <p className="text-sm text-red-700 mt-1">{order.whatsappError}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="bg-white rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {/* Status Update */}
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase">Update Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Resend WhatsApp */}
                      <div className="flex flex-col justify-end">
                        <button
                          onClick={() => handleResendWhatsApp(order.id, order.customer.phone)}
                          disabled={sendingWhatsApp === order.id}
                          className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {sendingWhatsApp === order.id ? 'Sending...' : 'Resend WhatsApp'}
                        </button>
                      </div>
                    </div>

                    {/* Delete Order */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete order ${order.id}?`)) {
                          deleteOrder(order.id);
                        }
                      }}
                      className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Order
                    </button>
                  </div>

                  {/* Order Metadata */}
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Order ID: {order.id}</p>
                    <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
