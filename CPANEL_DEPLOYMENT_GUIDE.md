# 🌐 WUDDEN INTERIOR - cPanel Deployment & Hosting Guide

**Complete Step-by-Step Guide for Hostinger cPanel Hosting**

---

## 📋 Pre-Deployment Checklist

Before deploying to cPanel, ensure you have:

- [ ] cPanel login credentials (Hostinger)
- [ ] Git repository cloned locally
- [ ] `.env` file configured (WhatsApp, Supabase)
- [ ] npm dependencies installed (`npm install`)
- [ ] Build tested locally (`npm run build` succeeds)
- [ ] Domain registered and pointed to cPanel
- [ ] SSL certificate ordered (auto-included with cPanel)

---

## 🚀 Step 1: Project Preparation

### 1.1 Update .env File

Create a file named `.env` in project root:

```bash
# Supabase (optional, for real database)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# WhatsApp (required, for order notifications)
VITE_WHATSAPP_PROVIDER=twilio
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_WHATSAPP_FROM=whatsapp:+14155552671
```

**Important:** 
- ✅ This file is in `.gitignore` (won't push to GitHub)
- ✅ Create fresh copy on each deployment
- ✅ Never commit credentials to Git

### 1.2 Test Build Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Check if dist/ folder created successfully
ls -la dist/

# Should see files like:
# index.html
# assets/
# fonts/
```

If build fails, fix errors before proceeding.

---

## 🔑 Step 2: cPanel Access & Setup

### 2.1 Log in to cPanel

1. Go to Hostinger dashboard
2. Navigate to hosting → Manage
3. Click "cPanel" button
4. Log in with your credentials

### 2.2 Create Staging Folder

```
In cPanel File Manager:
  → Navigate to: public_html/
  → Create folder: staging/
  (for testing before going live)
```

### 2.3 Prepare public_html

The `.hostinger-actions` build script will automatically copy files to `public_html`.

Current structure will be:
```
public_html/
├── index.html       (main app)
├── assets/          (CSS, JS, images)
├── favicon.ico      (optional)
└── robots.txt       (optional)
```

---

## 📤 Step 3: Deploy to cPanel

### Option A: Git Integration (Recommended)

**If you have Git set up:**

```bash
# 1. Add cPanel as remote
git remote add production ssh://user@cpanel.example.com/path/to/repo

# 2. Push to cPanel
git push production main

# 3. cPanel webhook triggers build (auto)
#    Uses .hostinger-actions script
#    Deploys to public_html automatically
```

**Time:** ~2 minutes for build + deploy

### Option B: Manual Upload

**If using FTP/SSH:**

```bash
# 1. Build locally
npm run build

# 2. Connect to cPanel via FTP
#    Host: ftp.yourdomain.com
#    User: cpanel_user
#    Pass: your_ftp_password

# 3. Upload contents of dist/ folder
#    To: public_html/
#    Replace all existing files

# 4. Clear browser cache
#    Ctrl+Shift+Delete (Chrome)
```

**Time:** ~5 minutes depending on file size

### Option C: SSH/Terminal

```bash
# 1. SSH into cPanel
ssh user@yourdomain.com

# 2. Navigate to public_html
cd ~/public_html/

# 3. Run build commands
npm install
npm run build
cp -rf dist/* .

# 4. Verify deployment
ls -la index.html
```

**Time:** ~3 minutes

---

## 📝 Step 4: Configure cPanel for SPA Routing

### Issue: 
With a Single Page App (SPA), all requests must go to `/index.html` for routing to work.

### Solution: Create .htaccess File

**In cPanel File Manager:**
1. Navigate to: `public_html/`
2. Create new file: `.htaccess`
3. Paste this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite if it's a real file or directory
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript
</IfModule>

# Cache Control
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Cache HTML for 30 minutes
  ExpiresByType text/html "access plus 30 minutes"
  
  # Cache assets for 1 year
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
```

**Save** and test website.

---

## 🔐 Step 5: SSL/HTTPS Setup

### Automatic SSL (cPanel)

1. In cPanel → SSL/TLS
2. Click "Auto SSL"
3. Select your domain
4. Click "Enable/Renew"
5. Wait 5-10 minutes
6. Test: https://yourdomain.com should have 🔒

### Manual Certificate (If Needed)

1. cPanel → SSL/TLS → Certificates
2. Generate new certificate
3. Domain: yourdomain.com
4. Validity: 1 year (auto-renews)

### Redirect HTTP to HTTPS

Add to `.htaccess`:
```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## ✅ Step 6: Verify Deployment

### 6.1 Check Website Loads

```
Visit: https://yourdomain.com
Should see: Wudden Interior homepage
```

### 6.2 Test Admin Access

```
Visit: https://yourdomain.com
Click: Login (top right)
Enter: afsal@123 / asdasd
Result: Should see admin dashboard
```

### 6.3 Test Shopping Flow

```
1. Browse products
2. Add to cart
3. Proceed to checkout
4. Fill form (name, email, phone, address)
5. Place order
6. Should send WhatsApp (if configured)
7. See order in admin dashboard
```

### 6.4 Check Browser Console

```
F12 → Console tab
Should show: No red errors
May show: Yellow warnings (OK to ignore)
```

### 6.5 Check Network Requests

```
F12 → Network tab
Refresh page
Should see: All resources load (green 200 status)
Check: Asset sizes reasonable
Load time: Should be < 3 seconds
```

---

## 🐛 Step 7: Monitor & Debug

### View Error Logs

In cPanel:
```
1. cPanel → Logs
2. Error log → View
3. Look for errors related to your app
4. Most common: 404 (file not found)
```

### Check File Permissions

Files should have permissions:
```
index.html:     644
public_html/:   755
assets/:        755
```

Fix in cPanel:
```
1. File Manager → Select file
2. Right-click → Change Permissions
3. Set to 644 (files) or 755 (folders)
```

### Monitor Server Resources

cPanel → Resource Usage:
```
CPU:        Should be < 80%
Memory:     Should be < 80%
Disk Space: Should have > 1 GB free
```

---

## 🔧 Step 8: Environment Variables on cPanel

### For cPanel Hosting

Since cPanel hosts static files, environment variables work differently:

**IMPORTANT:** Any environment variables must be set at build time, not runtime.

**Process:**
1. Set `.env` locally with values
2. Run: `npm run build` (variables baked into files)
3. Upload `dist/` folder to cPanel
4. Variables are now static in the JavaScript

**Example:**
```bash
# Set locally:
VITE_WHATSAPP_PROVIDER=twilio

# After npm run build, WhatsApp code has:
if (import.meta.env.VITE_WHATSAPP_PROVIDER === 'twilio') {
  // This is now hardcoded, not dynamic
}
```

### To Change Environment Variables:

1. Update `.env` file
2. Run `npm run build` again
3. Upload new `dist/` folder to cPanel

---

## 📊 Step 9: Performance Optimization

### Asset Optimization

cPanel Automatically:
- ✅ Compresses files (gzip)
- ✅ Serves from cache
- ✅ Minifies CSS/JS (Vite does this)

### Additional Optimization

**In cPanel, you can enable:**
1. CloudFlare (free)
   - Better caching
   - DDoS protection
   - Global CDN
2. ACME Auto SSL
   - Auto-renew certificates

### Monitor Performance

```bash
# Use online tools:
Google PageSpeed: pagespeed.web.dev
GTmetrix:         gtmetrix.com
WebPageTest:      webpagetest.org

# Test your site:
https://yourdomain.com
Check: Mobile + Desktop scores
Target: > 80 score
```

---

## 🔄 Step 10: Continuous Deployment

### Setup Auto-Deploy from Git

**If using GitHub:**

1. In cPanel → Git Version Control
2. Connect to GitHub repo
3. Select branch: main
4. Click "Deploy Now"
5. Future pushes auto-deploy

**Limitations:**
- Build commands must run via webhook
- May need custom build script

**Alternative:** GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to cPanel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - name: Deploy to cPanel
        uses: milanmk/actions-file-deployer@master
        with:
          ftp-host: ftp.yourdomain.com
          ftp-username: ${{ secrets.FTP_USER }}
          ftp-password: ${{ secrets.FTP_PASSWORD }}
          remote-path: /public_html/
          local-path: ./dist/
```

---

## 📞 Step 11: Backup & Recovery

### Automatic Backups (cPanel)

cPanel → Backup:
```
1. Check "Automatic Backups" is enabled
2. Set frequency: Weekly
3. Retention: 4 weeks minimum
```

### Manual Backup

```bash
# Before major changes:
1. cPanel → Backup → Download Full Backup
2. Save to cloud (Google Drive, Dropbox)
3. Keep local copy
```

### Restore Process

If something breaks:
```
1. cPanel → Backup → Restore
2. Select date
3. Choose what to restore
4. Click "Restore"
5. Usually < 5 minutes
```

---

## 🆘 Step 12: Common Issues & Fixes

### Issue 1: White Blank Page

**Problem:** Site loads but shows blank white page

**Causes:**
- Asset not serving correctly
- Routing not configured
- JavaScript error

**Fix:**
1. F12 → Console → Look for errors
2. Check `.htaccess` is in place
3. Verify `index.html` in `public_html/`
4. Check file permissions (644)

### Issue 2: 404 On Routes

**Problem:** "/admin" or "/products" shows 404

**Cause:** SPA routing not configured

**Fix:**
```
Ensure .htaccess has RewriteRule:
RewriteRule ^(.*)$ /index.html [L]
```

### Issue 3: Images Not Loading

**Problem:** Products images show broken

**Cause:** Wrong path or CORS issue

**Fix:**
1. Check asset paths in code
2. Ensure images in `public_html/assets/`
3. Check file permissions

### Issue 4: Slow Loading

**Problem:** Website takes > 5 seconds to load

**Fix:**
1. Enable CloudFlare (free)
2. Enable gzip compression in cPanel
3. Optimize images (use WebP)
4. Check server CPU usage

### Issue 5: WhatsApp Not Sending

**Problem:** Orders placed but no WhatsApp message

**Fix:**
1. Check `.env` has credentials
2. Credentials must be in `.env` before build
3. Run `npm run build` again
4. Upload new `dist/` folder
5. Test from browser console (F12)

---

## 📈 Step 13: Monitoring & Maintenance

### Daily Checks

```bash
# Visit website
https://yourdomain.com

# Check orders
Login → Admin → WhatsApp Orders

# Look for:
✅ Orders appearing
✅ WhatsApp status
❌ Error messages
```

### Weekly Maintenance

```
1. Check error logs (cPanel → Error Logs)
2. Monitor disk space (cPanel → Resource Usage)
3. Test admin functions
4. Backup database (if using Supabase)
5. Review order fulfillment
```

### Monthly Review

```
1. Analyze performance metrics
2. Check server load trends
3. Review security logs
4. Update dependencies
5. Test payment processing
6. Verify SSL certificate
7. Backup full system
```

---

## 🎯 Deployment Checklist

Before Going Live:

**Preparation:**
- [ ] `.env` file created with credentials
- [ ] Build passes locally: `npm run build`
- [ ] No errors in console
- [ ] All features tested locally
- [ ] Database connected (if using Supabase)

**cPanel Setup:**
- [ ] Clean `public_html/` folder
- [ ] Create `.htaccess` file
- [ ] Configure SSL certificate
- [ ] Set file permissions (644/755)

**Deployment:**
- [ ] Upload `dist/` contents
- [ ] Test website loads
- [ ] Test admin login
- [ ] Test shopping flow
- [ ] Test WhatsApp (place order)
- [ ] Check console for errors

**Post-Deployment:**
- [ ] Monitor error logs
- [ ] Test from mobile
- [ ] Check performance
- [ ] Verify backups working
- [ ] Document any issues

---

## 🚀 Deployment Summary

| Step | Duration | Action |
|------|----------|--------|
| 1. Prepare | 15 min | Create `.env`, build locally |
| 2. cPanel Setup | 10 min | Login, prepare folders |
| 3. Deploy | 5-10 min | Upload `dist/` folder |
| 4. Configure Routing | 5 min | Create `.htaccess` |
| 5. Setup SSL | 10 min | Enable auto-SSL |
| 6. Test | 15 min | Verify all functionality |
| **Total** | **60 min** | **Full deployment** |

---

## 📚 Related Guides

For more information, see:

- **PROJECT_COMPLETE_ANALYSIS.md** → Full project breakdown
- **DEPLOYMENT_TROUBLESHOOTING.md** → Debugging guide
- **WHATSAPP_IMPLEMENTATION_GUIDE.md** → WhatsApp setup
- **EXECUTIVE_SUMMARY.md** → Quick overview

---

## ✅ Going Live Checklist

Final verification before public launch:

```
Security:
  [ ] SSL certificate active
  [ ] HTTPS enforced
  [ ] .env credentials secure
  [ ] No passwords in code
  [ ] Rate limiting enabled

Functionality:
  [ ] Homepage loads
  [ ] Products display
  [ ] Cart works
  [ ] Checkout works
  [ ] Admin accessible
  [ ] WhatsApp sending
  [ ] Orders persisting

Performance:
  [ ] Page load < 3 sec
  [ ] No console errors
  [ ] Assets compressed
  [ ] Images optimized
  [ ] Database responsive

Monitoring:
  [ ] Error logging active
  [ ] Backup running
  [ ] Analytics tracking
  [ ] Alerts configured
  [ ] Support email ready
```

---

**Congratulations! Your site is now live on cPanel.** 🎉

For ongoing support, refer to the included guides or contact Hostinger support.

*Last Updated: March 2026*
