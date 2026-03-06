# Wudden Interior - Quick Reference Guide

## 📱 PAGES AT A GLANCE

| Page | Route | Purpose | Key Components |
|------|-------|---------|-----------------|
| **HomePage** | `/` | Landing page with hero carousel | Carousel, ProductCard grid, Stats |
| **ProductsPage** | `/products` | Catalog with filters & sorting | Sidebar filters, Product grid |
| **ProductDetailPage** | `/product/:id` | Individual product view | Image gallery, Info, Add to Cart/Wishlist |
| **CartPage** | `/cart` | Shopping cart management | Item list, Quantity controls, Summary |
| **CheckoutPage** | `/checkout` | 3-step checkout (Address→Summary→Payment) | Form, Order summary, WhatsApp integration |
| **DashboardPage** | `/dashboard` | User order history | Stats cards, Orders table |
| **AdminDashboard** | `/admin` | Admin control panel (5 tabs) | Orders, Inventory, Products, Carousel, Content |
| **WishlistPage** | `/wishlist` | Saved favorites | ProductCard grid |
| **AboutPage** | `/about` | Company info & team | Stats, Values, Timeline, Team |
| **ContactPage** | `/contact` | Contact & FAQ | Form, Contact Info, FAQ, Map |

---

## 🧩 COMPONENTS SUMMARY

| Component | Path | Purpose |
|-----------|------|---------|
| **Header** | `src/components/Header.tsx` | Sticky nav with search, cart, user menu |
| **Footer** | `src/components/Footer.tsx` | 4-column footer with links & contact |
| **ProductCard** | `src/components/ProductCard.tsx` | Reusable product display card |
| **AuthModal** | `src/components/AuthModal.tsx` | Sign in/Sign up modal |
| **SearchModal** | `src/components/SearchModal.tsx` | Full-screen product search |
| **CarouselManagement** | `src/components/CarouselManagement.tsx` | Admin tool for hero slides |
| **ProductEditModal** | `src/components/ProductEditModal.tsx` | Admin tool for product CRUD |
| **ContentManagement** | `src/components/ContentManagement.tsx` | Admin tool for site content |

---

## 🔌 CONTEXTS OVERVIEW

| Context | Location | Purpose | Key Functions |
|---------|----------|---------|----------------|
| **AuthContext** | `src/contexts/AuthContext.tsx` | User authentication & profile | signIn, signUp, signOut, signInWithGoogle |
| **CartContext** | `src/contexts/CartContext.tsx` | Shopping cart state | addToCart, updateQuantity, removeFromCart |
| **WishlistContext** | `src/contexts/WishlistContext.tsx` | User favorites | addToWishlist, removeFromWishlist, isInWishlist |
| **CarouselContext** | `src/contexts/CarouselContext.tsx` | Hero carousel slides | addSlide, updateSlide, deleteSlide, reorderSlides |
| **ContentContext** | `src/contexts/ContentContext.tsx` | Site-wide content | updateContent, updateNestedContent |

---

## 🎨 COLOR PALETTE

```
Primary Accent:    Amber (#f59e0b, #fbbf24)
Primary BG:        Slate-900 (#0f172a)
Secondary BG:      Slate-50 (#f8fafc)
Text Dark:         Slate-900 (#0f172a)
Text Light:        Slate-600 (#475569)
Success:           Green-500 (#10b981)
Warning:           Orange-500 (#f97316)
Error:             Red-500 (#ef4444)
```

---

## 💾 DATABASE TABLES

**Supabase Tables:**
1. `products` - All gift items
2. `cart_items` - User cart items
3. `wishlist_items` - User favorites
4. `orders` - Customer orders
5. `order_items` - Order line items
6. `profiles` - User profiles
7. `reviews` - Product reviews

**Demo Products:** 5 gift items with prices ₹4,500 - ₹25,000

---

## 🔐 DEMO LOGIN CREDENTIALS

| Email | Password | Role |
|-------|----------|------|
| `afsal@123` | `asdasd` | Admin |
| `demo@123` | `demodemo` | Customer |

---

## 📊 PRODUCT FILTERING

**Categories:** All, Corporate, Personalized, Festive, Luxury Boxes

**Price Range:** ₹0 - ₹300,000

**Sort Options:**
- Featured (default)
- Price: Low to High
- Price: High to Low
- Rating
- Newest

---

## 🎯 KEY FEATURES

✅ **E-Commerce**
- Product catalog with 6+ items
- Advanced filtering & sorting
- Shopping cart with quantity management
- Wishlist with heart toggle
- Checkout with WhatsApp notification

✅ **Users**
- Email/password authentication
- Google OAuth integration
- Admin role detection & auto-redirect
- User dashboard with order history

✅ **Admin Tools**
- Product management (CRUD)
- Carousel/hero slide editor
- Site content editor
- Order status tracking
- Inventory management

✅ **Design**
- Fully responsive (mobile, tablet, desktop)
- Tailwind CSS styling
- Smooth animations & transitions
- 8 lucide react icons throughout

---

## 🚀 RESPONSIVE GRID SYSTEM

```
Mobile (xs):   1 column
Tablet (sm):   2 columns
Desktop (md):  3 columns
Large (lg):    4 columns
```

---

## 📝 FORM FIELDS

### Checkout Address Form
- Full Name (prefilled)
- Phone (prefilled)
- Address
- City
- Pincode

### Product Edit Form
- Name, Description, Category
- Price, Compare Price, Stock
- Material, Style, Dimensions
- Images (multiple upload)
- Features list
- Rating, Review count
- Flags: Featured, Bestseller

### Contact Form
- Full Name *
- Email *
- Phone
- Subject
- Message *

---

## ⚙️ CONFIGURATION

**Build Tool:** Vite  
**Framework:** React 18 + TypeScript  
**Styling:** Tailwind CSS  
**Icons:** Lucide React  
**Backend:** Supabase (with mock fallback)  
**State:** Context API  

**Build Commands:**
```bash
npm run dev          # Start dev
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run preview      # Preview build
```

---

## 🎬 CAROUSEL SETTINGS

- **Auto-Rotate:** Every 5 seconds
- **Duration:** 1000ms fade transition
- **Default Slides:** 3 slides (Premium Gifts, Premium Collection, Timeless Elegance)
- **Storage:** localStorage (`carouselSlides` key)

---

## 📍 STATIC CONTENT

**Company Details:**
- Address: 49, GST Road, Pasumalai, Madurai-04
- Phone: 9626262777 / 9626262778
- Email: elysiangifts@gmail.com
- Hours: Mon-Sat, 9 AM - 7 PM

**Brand Name:** Elysian Gifts  
**Company Name:** Wudden Interior

---

## 🔄 DATA FLOW PATTERNS

1. **Product View:** HomePage/ProductsPage → Click Card → ProductDetailPage
2. **Purchase:** ProductDetailPage → Add to Cart → CartPage → Checkout
3. **Admin:** Login → AdminDashboard → Select Tab → Edit Content → Save to State/Storage
4. **Auth:** Header Login → AuthModal → AuthContext → Profile Fetch
5. **Search:** Header Search → SearchModal → Query Filter → Navigate

---

## 💬 ADMIN DASHBOARD BREAKDOWN

| Tab | Functionality | Storage |
|-----|---------------|---------|
| **Orders** | View & update order status | Supabase (mock data) |
| **Inventory** | Toggle product stock | React state only |
| **Products** | Full product CRUD | React state only |
| **Carousel** | Edit hero slides | localStorage |
| **Content** | Edit site content | localStorage |

---

## 📱 MOBILE OPTIMIZATION

- ✅ Header: Mobile hamburger menu
- ✅ Responsive grid (1-4 columns)
- ✅ Touch-friendly buttons & spacing
- ✅ Sidebar filters collapse on mobile
- ✅ Modal cart on small screens
- ✅ Optimized images with fallbacks

---

## 🎬 ANIMATIONS & TRANSITIONS

- Hero carousel: Fade transition (1000ms)
- ProductCard: Hover scale, shadow, lift
- Icons: Hover color change
- Forms: Focus border & shadow
- Scroll: IntersectionObserver for fade-in
- Timeline: Expandable sections on About page
- FAQ: Expandable items on Contact page

---

## 🔗 PAGE INTERCONNECTIONS

```
HomePage ──→ ProductsPage ──→ ProductDetailPage
   ↓                              ↓
[Featured Products]      [Add to Cart/Wishlist]
                              ↓
                          CartPage
                              ↓
                         CheckoutPage
                              ↓
                         DashboardPage

Header Navigation:
Home → Products → About → Contact
                ↓
         (All pages)
                ↓
         Search, Cart, Wishlist, User Menu
```

---

## 🛠️ DEVELOPMENT NOTES

- **TypeScript Strict Mode:** Enabled
- **VSCode Extensions:** ESLint, Prettier (recommended)
- **Node Version:** 16+ (LTS recommended)
- **Package Manager:** npm or yarn
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

---

## 📚 FILE STRUCTURE

```
project/
├── src/
│   ├── pages/          # 10 page components
│   ├── components/     # 8 shared components
│   ├── contexts/       # 5 context providers
│   ├── lib/            # Database types, demo data, Supabase config
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML entry point
├── tailwind.config.js  # Tailwind configuration
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── eslint.config.js    # ESLint configuration
└── package.json        # Dependencies & scripts
```

---

## 📊 STATS

- **Total Pages:** 10
- **Total Components:** 8 reusable + 10 pages
- **Context Providers:** 5
- **Database Tables:** 7 Supabase tables
- **Demo Products:** 5-10 products
- **Color Palette:** 8+ colors defined
- **Icons:** 20+ lucide icons used
- **Responsive Breakpoints:** 4 (sm, md, lg, xl)
- **Lines of Code:** 5000+ (excluding node_modules)

---

**Last Updated:** March 5, 2026  
**Status:** Production Ready ✅  
**Demo Mode:** Supported (no Supabase required)
