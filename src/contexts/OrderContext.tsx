import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: 'whatsapp' | 'cod' | 'pending';
  notes?: string;
  whatsappSent: boolean;
  whatsappError?: string;
}

export interface OrderNotification {
  id: string;
  orderId: string;
  type: 'order_received' | 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'order_cancelled' | 'whatsapp_sent' | 'whatsapp_failed';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface OrderContextType {
  orders: Order[];
  notifications: OrderNotification[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'whatsappSent'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  sendWhatsAppNotification: (orderId: string, phone: string) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | undefined;
  getNotifications: () => OrderNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadNotificationCount: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wudden_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<OrderNotification[]>(() => {
    const saved = localStorage.getItem('wudden_order_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist orders to localStorage
  useEffect(() => {
    localStorage.setItem('wudden_orders', JSON.stringify(orders));
  }, [orders]);

  // Persist notifications to localStorage
  useEffect(() => {
    localStorage.setItem('wudden_order_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'whatsappSent'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      whatsappSent: false,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Add notification
    addNotification({
      orderId: newOrder.id,
      type: 'order_received',
      title: 'New Order Received',
      message: `Order ${newOrder.id} from ${newOrder.customer.name} - ₹${newOrder.total.toLocaleString()}`,
    });

    // Attempt to send WhatsApp notification
    sendWhatsAppNotification(newOrder.id, newOrder.customer.phone);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status };

          // Add notification for status change
          addNotification({
            orderId,
            type: 'order_confirmed',
            title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Order ${orderId} has been ${status}`,
          });

          return updatedOrder;
        }
        return order;
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const sendWhatsAppNotification = async (orderId: string, phone: string): Promise<boolean> => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return false;

      // Build order message
      const itemsList = order.items.map((item) => `• ${item.name} x${item.quantity} - ₹${item.price}`).join('\n');

      const message = `🎉 Thank you for your order!\n\n📦 Order ID: ${orderId}\n\n📝 Items:\n${itemsList}\n\nTotal: ₹${order.total}\n\nWe will contact you shortly to confirm.\n\nThank you for choosing Wudden Interior!`;

      // Call WhatsApp API
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          message,
          orderId,
        }),
      });

      if (response.ok) {
        // Mark as sent
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, whatsappSent: true, whatsappError: undefined } : order
          )
        );

        addNotification({
          orderId,
          type: 'whatsapp_sent',
          title: 'WhatsApp Notification Sent',
          message: `Order notification sent to ${phone}`,
        });

        return true;
      } else {
        const error = await response.text();
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, whatsappSent: false, whatsappError: error || 'Failed to send WhatsApp' }
              : order
          )
        );

        addNotification({
          orderId,
          type: 'whatsapp_failed',
          title: 'WhatsApp Notification Failed',
          message: `Failed to send WhatsApp for order ${orderId}: ${error}`,
        });

        return false;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, whatsappSent: false, whatsappError: errorMsg }
            : order
        )
      );

      addNotification({
        orderId,
        type: 'whatsapp_failed',
        title: 'WhatsApp Error',
        message: `Error sending WhatsApp: ${errorMsg}`,
      });

      return false;
    }
  };

  const addNotification = (
    notification: Omit<OrderNotification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: OrderNotification = {
      ...notification,
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  const getNotifications = (): OrderNotification[] => {
    return notifications;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadNotificationCount = (): number => {
    return notifications.filter((n) => !n.read).length;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        notifications,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        sendWhatsAppNotification,
        getOrderById,
        getNotifications,
        markNotificationAsRead,
        clearNotifications,
        getUnreadNotificationCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
}
