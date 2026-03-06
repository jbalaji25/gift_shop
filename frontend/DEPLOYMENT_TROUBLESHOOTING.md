# WhatsApp Order System - Troubleshooting & Production Deployment

---

## 🔍 Troubleshooting Guide

### Problem 1: "WhatsApp Pending" - Message Never Sends ⏳

#### Symptoms
- Order placed successfully
- Status shows "Pending" for hours
- No error message
- No message received on phone

#### Diagnosis
```
Open DevTools (F12) → Console → Search for "WhatsApp"
Look for error messages
```

#### Solutions (Try in Order)

**1. Check Environment Variables**
```bash
# In .env file at project root:
VITE_WHATSAPP_PROVIDER=twilio  # ✓ Must be set
VITE_TWILIO_ACCOUNT_SID=ACxxxx  # ✓ Check for typos
VITE_TWILIO_AUTH_TOKEN=12345  # ✓ Exactly copied from Twilio
VITE_TWILIO_WHATSAPP_FROM=whatsapp:+14155552671  # ✓ With whatsapp: prefix
```

**2. Restart Dev Server**
```bash
# Stop: Ctrl+C
# Then:
npm run dev
```

**3. Check Credentials in Twilio Console**
- Go to https://www.twilio.com/console
- Copy exact Account SID (not from browser tab)
- Copy exact Auth Token (click "Show" first)
- Paste into .env
- Reload page

**4. Verify Phone Number Format**
- Admin → WhatsApp Orders
- Check phone field in order details
- Should be: `+919876543210` or `919876543210`
- NOT: `9876543210` (missing country code)

**5. Check Twilio WhatsApp Sandbox**
- Go to https://www.twilio.com/console/sms/whatsapp/sandbox
- Verify "From" number is active
- Verify your test phone is "joined"
- If not, send "join [code]" from your phone

**6. Try Test Phone**
- Use Twilio's test number: `+14155552671`
- Send message to yourself at that number
- This verifies Twilio is working

---

### Problem 2: "WhatsApp Failed: 401 Unauthorized" ❌

#### Symptom
- Order shows red error: `401 Unauthorized`
- Twilio credentials are wrong

#### Solution

**Step 1: Get Fresh Credentials**
```
Twilio Console (https://www.twilio.com/console)
↓
Account → Account Info
↓
Account SID: Copy exactly (no spaces)
Auth Token: Click "Show" → Copy exactly
```

**Step 2: Paste Exactly**
- Paste into `.env` with NO extra spaces
- No quotes needed
- Example:
```
VITE_TWILIO_ACCOUNT_SID=AC1234567890abcdef
VITE_TWILIO_AUTH_TOKEN=1234567890abcdefghij1234
```

**Step 3: Restart Server**
```bash
Ctrl+C
npm run dev
```

**Step 4: Test Again**
- Place new order
- Check browser console for response code

---

### Problem 3: "WhatsApp Failed: 404 Not Found" 🔍

#### Symptom
- Error message includes: `404 Not Found`
- Means Twilio number/route doesn't exist

#### Solution

**Check WhatsApp From Number**
```bash
# In .env:
VITE_TWILIO_WHATSAPP_FROM=whatsapp:+14155552671
                           ^^^^^^^^ MUST include this prefix
```

If missing `whatsapp:` prefix:
```bash
# ❌ Wrong:
VITE_TWILIO_WHATSAPP_FROM=+14155552671

# ✓ Correct:
VITE_TWILIO_WHATSAPP_FROM=whatsapp:+14155552671
```

**Verify in Twilio Console**
- Go to Messaging → Services
- Find your WhatsApp service
- Check "From" number
- Copy it exactly: `whatsapp:+14155552671`

---

### Problem 4: Message Received But Customer Says "No Message" 📱

#### Symptom
- Admin dashboard says "✓ Sent"
- Customer has no message
- Or message delayed by hours

#### Possible Causes

**1. Opt-in Required (WhatsApp Sandbox)**
- Twilio sandbox needs customer opt-in
- Customer must first send: "join [code]" to Twilio number
- Then only can receive messages
- Wait 5 minutes after opt-in

**2. Check Phone Number Format**
- Must include country code
- India: `+91` or `+919876543210`
- Must be valid active number

**3. Message Length**
- WhatsApp has 1600 character limit
- Our messages shouldn't exceed this
- Check browser console for message content

**4. Twilio Account Balance**
- Go to Twilio Console
- Check Account Balance (top right)
- Must have credit/money
- Free trial: $15 credit (use for testing)
- After: ~$0.0075/message

---

### Problem 5: Orders Not Appearing in Admin Dashboard ❌

#### Symptoms
- Place order successfully
- Redirect to dashboard
- But order not in list
- Or list shows old orders only

#### Solutions

**1. Hard Refresh Browser**
```bash
Windows: Ctrl+Shift+R
Mac: Cmd+Shift+R
```

**2. Check If OrderProvider is Active**
```tsx
// In src/App.tsx, should see:
import { OrderProvider } from './contexts/OrderContext';

<OrderProvider>
  {/* Rest of app */}
</OrderProvider>
```

If missing: Add it!

**3. Check localStorage**
- F12 → Application → LocalStorage
- Look for key: `wudden_orders`
- Should have content like: `[{"id":"...","customer":{...}}]`

**4. Clear and Retry**
- Delete `wudden_orders` from localStorage
- Delete `wudden_notifications` 
- Refresh page
- Place new order
- Should appear

**5. Check Browser Console**
- F12 → Console
- Place order
- Look for error messages (red text)
- Copy error, search in code
- Report if needed

---

### Problem 6: "WhatsApp Service Error: Network Error" 🌐

#### Symptom
- Error: `Network Error` or `Failed to fetch`
- Indicates API call failed

#### Solutions

**1. Check Internet Connection**
- Ping Google: Open terminal, type `ping google.com`
- Should get response (not timeout)

**2. Check CORS Issues**
```
Open DevTools → Network tab
Place order
Look for failed request to Twilio
If red X: likely CORS issue
```

**3. Verify Endpoint**
- If using Firebase/Backend:
- Test URL manually in browser
- Should get response (not 404)
- Example: `https://your-api.com/api/send-whatsapp`

**4. Check Firewall**
- Some firewalls block external APIs
- Try from different network (mobile hotspot)
- Or whitelist domain in firewall

---

## 🚀 Production Deployment Checklist

### Before Going Live

#### 1. WhatsApp Setup ✓
- [ ] Twilio/Firebase/Backend account active
- [ ] Credentials in `.env` file
- [ ] Tested 5+ times successfully
- [ ] Response time < 2 seconds

#### 2. Payment Gateway (If Using)
- [ ] Stripe/PayPal connected
- [ ] Test transactions completed
- [ ] Refund process tested

#### 3. Database/Storage
- [ ] Supabase connected (or using localStorage)
- [ ] Backup strategy in place
- [ ] Data retention policy set

#### 4. Email Notifications (Recommended)
- [ ] Email service configured
- [ ] Test confirmation email sent
- [ ] Branded email template ready

#### 5. Security
- [ ] No API keys in public code
- [ ] All secrets in `.env` (in .gitignore)
- [ ] HTTPS enabled on domain
- [ ] CORS headers correct
- [ ] Rate limiting on WhatsApp endpoint

#### 6. Monitoring
- [ ] Error logging setup (Sentry, LogRocket)
- [ ] Order success rate monitored
- [ ] WhatsApp delivery rate tracked
- [ ] Admin notified of failures

#### 7. Performance
- [ ] Build size < 500KB (check with `npm run build`)
- [ ] First load < 3 seconds
- [ ] Images optimized
- [ ] Lazy loading implemented

#### 8. Mobile Experience
- [ ] Tested on iPhone 12+
- [ ] Tested on Android 10+
- [ ] Checkout works on mobile
- [ ] Admin dashboard responsive

#### 9. Backup & Recovery
- [ ] Orders backed up weekly
- [ ] Disaster recovery plan
- [ ] Can restore 7 days of data

#### 10. Documentation
- [ ] Admin team trained
- [ ] FAQ prepared
- [ ] Support email/phone ready
- [ ] Error response procedures documented

### Deployment Steps

#### Step 1: Build for Production
```bash
npm run build

# Check output:
# ✓ dist/index.html
# ✓ dist/assets/*.js (< 500KB)
# ✓ dist/assets/*.css
```

#### Step 2: Set Environment Variables

**Choose Platform:**

**Option A: Vercel (Recommended)**
```bash
# Connect GitHub repo
vercel
# Or in Vercel UI:
# Settings → Environment Variables → Add:
VITE_WHATSAPP_PROVIDER=twilio
VITE_TWILIO_ACCOUNT_SID=AC...
VITE_TWILIO_AUTH_TOKEN=...
VITE_TWILIO_WHATSAPP_FROM=whatsapp:+...
```

**Option B: Netlify**
```bash
# Connect GitHub repo
# Site settings → Build & Deploy → Environment
# Add same variables
```

**Option C: Self-Hosted (Heroku)**
```bash
heroku create app-name
heroku config:set VITE_WHATSAPP_PROVIDER=twilio
heroku config:set VITE_TWILIO_ACCOUNT_SID=AC...
# ... (same for other vars)
git push heroku main
```

#### Step 3: Set Domain
- Update DNS to point to deployment
- Get SSL certificate (auto-handled by Vercel/Netlify)
- Test HTTPS: `https://yourdomain.com`

#### Step 4: Test Production
```
1. Go to https://yourdomain.com
2. Add product to cart
3. Complete checkout
4. Should receive WhatsApp immediately
5. Check admin dashboard
6. Test resend WhatsApp
7. Update order status → Check notification
```

#### Step 5: Monitor First 24 Hours
- Track order volume
- Monitor WhatsApp delivery rate
- Check error logs
- Be available for issues

---

## 📊 Performance Optimization

### Reduce Build Size
```bash
# Check what's taking space:
npm run build -- --analyze

# Remove unused dependencies:
npm list
npm uninstall [package-name]
```

### Cache Strategy
```typescript
// In src/main.tsx or vite.config.ts

// Cache localStorage data
if (localStorage.getItem('wudden_orders')) {
  // Use cached data immediately
  // Update in background
} else {
  // Fetch fresh
}
```

### Image Optimization
```tsx
// Use lazy loading
<img src={url} loading="lazy" alt="..." />

// Or WebP format
<picture>
  <source srcSet={url + '.webp'} type="image/webp" />
  <img src={url} alt="..." />
</picture>
```

---

## 🔐 Security Checklist

### API Keys
```bash
# ✓ DO: Store in .env (included in .gitignore)
VITE_TWILIO_AUTH_TOKEN=secret123

# ❌ DON'T: Hardcode in source
const token = 'secret123'; // NEVER!
```

### CORS Configuration
```javascript
// Backend should allow your domain
const corsOptions = {
  origin: 'https://yourdomain.com',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### Rate Limiting
```javascript
// Prevent abuse of WhatsApp endpoint
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/api/send-whatsapp', limiter, (req, res) => {
  // Handle request
});
```

### Validation
```typescript
// Validate phone number format
const isValidPhone = (phone: string) => {
  const regex = /^\+?1?\d{9,15}$/;
  return regex.test(phone.replace(/\D/g, ''));
};
```

---

## 📈 Monitoring & Analytics

### What to Track
1. **Order Volume** - Orders/day
2. **WhatsApp Success Rate** - % of messages sent
3. **Conversion Rate** - (Orders / Visitors)
4. **Average Order Value** - Total Revenue / Orders
5. **Customer Acquisition Cost** - Ads Spend / New Customers
6. **Repeat Purchase Rate** - % who order 2+

### Tools
- **Google Analytics** - Traffic
- **Vercel/Netlify Analytics** - Performance
- **Sentry** - Error tracking
- **LogRocket** - User session replay
- **Twilio Dashboard** - Message success rate

---

## 🆘 Emergency Recovery

### If WhatsApp Goes Down
```typescript
// Temporary: Store orders and retry later
if (whatsappFailed) {
  // Queue message for retry
  const queue = JSON.parse(localStorage.getItem('whatsapp_queue') || '[]');
  queue.push({ orderId, phone, message, timestamp });
  localStorage.setItem('whatsapp_queue', JSON.stringify(queue));
  
  // Retry every 5 minutes
  setInterval(() => {
    queue.forEach(msg => sendWhatsAppNotification(msg));
  }, 5 * 60 * 1000);
}
```

### If Website Goes Down
- Backup at: `https://backup.yourdomain.com` (switch DNS)
- Or redeploy: `npm run build && vercel deploy --prod`
- Recovery time: < 5 minutes

### Data Loss Prevention
```javascript
// Auto-backup orders daily
const backupOrders = () => {
  const orders = localStorage.getItem('wudden_orders');
  const backup = {
    date: new Date().toISOString(),
    orders: JSON.parse(orders || '[]'),
  };
  // Send to email/cloud storage
};

// Run daily
setInterval(backupOrders, 24 * 60 * 60 * 1000);
```

---

## 📞 Support Structure

### Create Support Page
```
/support.html
├── FAQ (10+ common questions)
├── Contact Form
├── Email: support@yourdomain.com
├── Phone: +91-XXXXX-XXXXX
└── Hours: Mon-Fri 9AM-6PM IST
```

### Document Common Issues
```
Q: I didn't receive order message
A: Check:
1. Phone number format (+91XXXXXXXXXX)
2. Twilio sandbox opt-in
3. Check spam folder
4. Contact: support@yourdomain.com
```

### Response Time SLA
- **Critical** (Website down): < 15 min
- **High** (Payments failing): < 1 hour
- **Medium** (WhatsApp delayed): < 4 hours
- **Low** (UI bug): < 24 hours

---

## 🎯 Post-Deployment Optimization

### Week 1
- Monitor error rate (should be < 1%)
- Get user feedback
- Fix critical bugs
- Optimize slow pages

### Week 2-4
- Add analytics
- Optimize images
- Add email notifications
- Implement reviews

### Month 2+
- Add SMS fallback
- Create tracking page
- Build analytics dashboard
- Plan Phase 2 features

---

## ✅ Final Checklist Before Go-Live

- [ ] Build successful (`npm run build`)
- [ ] No errors in console
- [ ] WhatsApp tested 10+ times
- [ ] Domain SSL certificate active
- [ ] Admin trained on system
- [ ] Backup strategy implemented
- [ ] Monitoring enabled
- [ ] Support email ready
- [ ] FAQ documented
- [ ] Team phone/backup available

**You're ready to launch!** 🚀
