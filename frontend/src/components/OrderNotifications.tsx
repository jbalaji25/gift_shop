import { useState } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Package, Truck, MessageCircle } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

export function OrderNotifications() {
  const { notifications, markNotificationAsRead, clearNotifications, getUnreadNotificationCount, orders } = useOrder();
  const [showPanel, setShowPanel] = useState(false);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);

  const unreadCount = getUnreadNotificationCount();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_received':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'order_confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'order_shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'whatsapp_sent':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'whatsapp_failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_received':
        return 'bg-blue-50 border-blue-200';
      case 'order_confirmed':
        return 'bg-green-50 border-green-200';
      case 'whatsapp_sent':
        return 'bg-green-50 border-green-200';
      case 'whatsapp_failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getOrderDetails = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-110"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute bottom-20 right-0 w-96 max-h-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 flex items-center justify-between">
            <h3 className="font-bold text-lg">Order Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => clearNotifications()}
                  className="text-xs bg-amber-700 hover:bg-amber-800 px-2 py-1 rounded transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowPanel(false)}
                className="hover:bg-amber-700 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {notifications.map((notif) => {
                  const order = getOrderDetails(notif.orderId);
                  const isExpanded = expandedNotifId === notif.id;

                  return (
                    <div
                      key={notif.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${getNotificationColor(notif.type)} ${
                        !notif.read ? 'border-2 font-semibold' : ''
                      }`}
                      onClick={() => setExpandedNotifId(isExpanded ? null : notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getNotificationIcon(notif.type)}</div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{notif.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatTime(notif.timestamp)}</p>

                          {/* Expanded Details */}
                          {isExpanded && order && (
                            <div className="mt-3 pt-3 border-t border-slate-300 space-y-2">
                              <div className="text-xs">
                                <p>
                                  <span className="font-semibold">Customer:</span> {order.customer.name}
                                </p>
                                <p>
                                  <span className="font-semibold">Phone:</span> {order.customer.phone}
                                </p>
                                <p>
                                  <span className="font-semibold">Total:</span> ₹{order.total.toLocaleString()}
                                </p>
                                <p>
                                  <span className="font-semibold">Items:</span> {order.items.length}
                                </p>
                                <p>
                                  <span className="font-semibold">Status:</span> {order.status}
                                </p>
                                {order.whatsappSent ? (
                                  <p className="text-green-700 font-semibold mt-2">✓ WhatsApp sent</p>
                                ) : order.whatsappError ? (
                                  <p className="text-red-700 font-semibold mt-2">✗ WhatsApp failed: {order.whatsappError}</p>
                                ) : (
                                  <p className="text-amber-700 font-semibold mt-2">⏳ WhatsApp pending...</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Mark as Read */}
                          {!notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationAsRead(notif.id);
                              }}
                              className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded mt-2 transition-colors"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 p-3 text-xs text-slate-600 text-center">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
