/**
 * WhatsApp Integration Service
 * 
 * This service handles sending WhatsApp messages via Twilio or Firebase
 * Configure your credentials in environment variables:
 * - VITE_TWILIO_ACCOUNT_SID
 * - VITE_TWILIO_AUTH_TOKEN
 * - VITE_TWILIO_WHATSAPP_FROM (e.g., whatsapp:+14155552671)
 * 
 * For Firebase Cloud Functions, ensure you have:
 * - VITE_FIREBASE_FUNCTION_URL (endpoint for WhatsApp function)
 */

interface WhatsAppMessage {
  to: string;
  message: string;
  orderId: string;
}

interface WhatsAppResponse {
  success: boolean;
  messageSid?: string;
  error?: string;
}

/**
 * Send WhatsApp message via Twilio (Recommended)
 * Requires Twilio account with WhatsApp enabled
 */
export async function sendWhatsAppViaTwilio(params: WhatsAppMessage): Promise<WhatsAppResponse> {
  try {
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const fromNumber = import.meta.env.VITE_TWILIO_WHATSAPP_FROM;

    if (!accountSid || !authToken || !fromNumber) {
      return {
        success: false,
        error: 'Twilio credentials not configured. Please set environment variables.',
      };
    }

    const formData = new URLSearchParams();
    formData.append('From', fromNumber);
    formData.append('To', `whatsapp:${params.to}`);
    formData.append('Body', params.message);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to send WhatsApp message',
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageSid: data.sid,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Send WhatsApp message via Firebase Cloud Function
 * Requires Firebase Cloud Function configured for WhatsApp
 */
export async function sendWhatsAppViaFirebase(params: WhatsAppMessage): Promise<WhatsAppResponse> {
  try {
    const functionUrl = import.meta.env.VITE_FIREBASE_FUNCTION_URL;

    if (!functionUrl) {
      return {
        success: false,
        error: 'Firebase Cloud Function URL not configured.',
      };
    }

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: params.to,
        message: params.message,
        orderId: params.orderId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to send WhatsApp message',
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageSid: data.messageSid,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Send WhatsApp message via backend API
 * Generic implementation that works with any backend
 */
export async function sendWhatsAppViaBackend(params: WhatsAppMessage): Promise<WhatsAppResponse> {
  try {
    // Change this URL to your actual backend endpoint
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${backendUrl}/api/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: params.to,
        message: params.message,
        orderId: params.orderId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to send WhatsApp message',
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageSid: data.messageSid,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Main function to send WhatsApp notification
 * Uses the configured provider
 */
export async function sendWhatsAppNotification(
  to: string,
  message: string,
  orderId: string
): Promise<WhatsAppResponse> {
  const provider = import.meta.env.VITE_WHATSAPP_PROVIDER || 'backend';

  const params = { to, message, orderId };

  switch (provider) {
    case 'twilio':
      return sendWhatsAppViaTwilio(params);
    case 'firebase':
      return sendWhatsAppViaFirebase(params);
    case 'backend':
    default:
      return sendWhatsAppViaBackend(params);
  }
}

/**
 * Format phone number for WhatsApp
 * Removes all non-digit characters and ensures country code
 */
export function formatPhoneForWhatsApp(phone: string, defaultCountryCode = '91'): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // If no country code (10 digits only), prepend India code
  if (cleaned.length === 10) {
    return defaultCountryCode + cleaned;
  }

  return cleaned;
}

/**
 * Build order message for WhatsApp
 */
export function buildOrderMessage(
  orderId: string,
  customerName: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
): string {
  const itemsList = items
    .map((item) => `• ${item.name} x${item.quantity} - ₹${item.price.toLocaleString()}`)
    .join('\n');

  return (
    `🎉 *Thank you for your order!*\n\n` +
    `📦 *Order ID:* ${orderId}\n` +
    `👤 *Customer:* ${customerName}\n\n` +
    `📝 *Items:*\n${itemsList}\n\n` +
    `💰 *Total:* ₹${total.toLocaleString()}\n\n` +
    `✓ We will contact you shortly to confirm your order.\n\n` +
    `Thank you for choosing *Wudden Interior!* 🙏`
  );
}
