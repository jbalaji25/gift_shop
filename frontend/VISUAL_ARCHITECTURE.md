# Wudden Interior - Visual Architecture & Diagrams

## 🏗️ APPLICATION ARCHITECTURE

```
┌─────────────────────────────────── APP.TSX ───────────────────────────────────┐
│                                                                                │
│  ┌──────────────────── CONTEXT PROVIDERS ────────────────────┐               │
│  │                                                            │               │
│  │  ┌─ AuthProvider       ┌─ CartProvider     ┌─ WishlistProvider           │
│  │  │                     │                    │                             │
│  │  │  Auth state         │ Cart items         │ Wishlist items             │
│  │  │  User profile       │ Total price        │ Favorites                  │
│  │  │  Sign in/out        │ Add/remove         │ Toggle wishlist            │
│  │  │  Google OAuth       │ Update qty         │                            │
│  │  └─────────────────────┴────────────────────┴────────────────────────────┘
│  │
│  │  ┌─ CarouselProvider                ┌─ ContentProvider                  
│  │  │                                   │                                   
│  │  │  Hero carousel slides            │  Site content                     
│  │  │  Add/Edit/Delete               │  Footer, Header, Pages            
│  │  │  localStorage sync             │  localStorage sync                
│  │  └───────────────────────────────────┴──────────────────────────────────┘
│  │
│  └──────────────────────────────────────────────────────────────────────────┘
│
│  ┌────────────────────── UI SHELL ─────────────────────────┐
│  │                                                          │
│  │  ┌─ HEADER (sticky, z-50) ─────────────────────┐       │
│  │  │ Logo │ Nav │ Search 🔍 │ Wishlist ❤ │ Cart 🛒 │ User │
│  │  └───────────────────────────────────────────────┘       │
│  │                                                          │
│  │  ┌─ MAIN CONTENT (Dynamic based on route) ──────┐       │
│  │  │                                                │       │
│  │  │ [Page Component Renders Here]                │       │
│  │  │                                                │       │
│  │  └────────────────────────────────────────────────┘       │
│  │                                                          │
│  │  ┌─ FOOTER ─────────────────────────────────────┐       │
│  │  │ Company │ Links │ Categories │ Contact      │       │
│  │  └──────────────────────────────────────────────┘       │
│  │                                                          │
│  ├─ MODALS (Fixed Position, z-50+) ────────────────┐       │
│  │ • AuthModal (sign in/up)                         │       │
│  │ • SearchModal (search results)                  │       │
│  │ • CartPage Modal (shopping cart preview)        │       │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📑 PAGE ROUTING & STRUCTURE

```
┌─ HOME PAGE (/) ─────────────────────────────────┐
│                                                  │
│  Hero Carousel (Auto-rotate 5 sec)             │
│  ├─ Premium Corporate Gifts                    │
│  ├─ Premium Collection                         │
│  └─ Timeless Elegance                          │
│                                                 │
│  Featured Products Grid (4 items)              │
│  Best Sellers Grid (4 items)                   │
│                                                 │
│  Category Showcase (4 cards)                   │
│  Trust & Features Section                      │
│                                                 │
└─────────────────────────────────────────────────┘

┌─ PRODUCTS PAGE (/products) ──────────────────────┐
│                                                  │
│  ┌─ SIDEBAR FILTERS (lg:w-64) ─────┐           │
│  │ • Categories dropdown            │           │
│  │ • Price Range slider (0-300k)    │           │
│  │ • Sort by (featured/price/rating)│           │
│  │ • Apply filters button           │           │
│  └──────────────────────────────────┘           │
│                                                  │
│  ┌─ PRODUCT GRID (responsive) ─────┐           │
│  │ ProductCard × 12 (grid 1-4 cols) │           │
│  │ • [1 col] mobile                 │           │
│  │ • [2 cols] tablet                │           │
│  │ • [4 cols] desktop               │           │
│  └──────────────────────────────────┘           │
│                                                  │
│  [Load More] / Pagination (optional)            │
│                                                  │
└─────────────────────────────────────────────────┘

┌─ PRODUCT DETAIL PAGE (/product/:id) ────────────┐
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Image Gallery (lg:col-span-1)              │ │
│  │ • Large product image                      │ │
│  │ • Thumbnail carousel                       │ │
│  │ • Zoom on hover                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Product Info (lg:col-span-1)               │ │
│  │ ⭐ Rating & Reviews                        │ │
│  │ ₹Price | ~~Compare Price~~                │ │
│  │ Stock: In Stock / Low Stock / Out of Stock │ │
│  │ Features:                                   │ │
│  │ • Feature 1                                 │ │
│  │ • Feature 2                                 │ │
│  │ • Feature 3                                 │ │
│  │ Qty: [-] 1 [+]                            │ │
│  │ [🛒 Add to Cart] [❤ Wishlist] [Buy Now]  │ │
│  │ Trust Badges:                               │ │
│  │ 🚚 Free Shipping | 🛡️ Warranty | ✓ Quality│ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└─────────────────────────────────────────────────┘

┌─ CART PAGE (/cart) ─────────────────────────────┐
│                                                  │
│  ┌─ Cart Items (lg:col-span-2) ────┐           │
│  │ ┌─ Item 1 ──────────────────┐    │           │
│  │ │ [Img] Name │ ₹Price       │    │           │
│  │ │ - 1 +  │ [Delete]         │    │           │
│  │ └────────────────────────────┘    │           │
│  │ ┌─ Item 2 ──────────────────┐    │           │
│  │ │ [Img] Name │ ₹Price       │    │           │
│  │ │ - 2 +  │ [Delete]         │    │           │
│  │ └────────────────────────────┘    │           │
│  └──────────────────────────────────┘           │
│                                                  │
│  ┌─ Order Summary (sticky) ────────┐           │
│  │ Subtotal:    ₹X,XXX              │           │
│  │ Shipping:    FREE                │           │
│  │ ─────────────────────            │           │
│  │ TOTAL:       ₹X,XXX              │           │
│  │ [Proceed to Checkout]            │           │
│  └──────────────────────────────────┘           │
│                                                  │
└─────────────────────────────────────────────────┘

┌─ CHECKOUT PAGE (/checkout) ──────────────────────┐
│                                                  │
│  STEP 2: DELIVERY ADDRESS                       │
│  ┌────────────────────────────────────────────┐ │
│  │ Full Name:    [Prefilled]                  │ │
│  │ Phone:        [Prefilled]                  │ │
│  │ Address:      [text input]                 │ │
│  │ City:         [text input]                 │ │
│  │ Pincode:      [number input]               │ │
│  │                [Next →]                    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  STEP 3: ORDER SUMMARY                          │
│  ┌────────────────────────────────────────────┐ │
│  │ Items:                                     │ │
│  │ • Product 1  × 1  ₹ X,XXX                 │ │
│  │ • Product 2  × 2  ₹ X,XXX                 │ │
│  │ Subtotal:  ₹ X,XXX                        │ │
│  │ Shipping:  FREE                           │ │
│  │ TOTAL:     ₹ X,XXX                        │ │
│  │                [Next →]                    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  STEP 4: PAYMENT                                │
│  ┌────────────────────────────────────────────┐ │
│  │ Payment Method: Cash on Delivery (Default) │ │
│  │ [Place Order]                              │ │
│  │ ↓ WhatsApp Confirmation Sent               │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└─────────────────────────────────────────────────┘

┌─ DASHBOARD PAGE (/dashboard) ──────────────────┐
│                                                │
│ Welcome back, [User Name]!                     │
│                                                │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│ │ 📦       │  │ ⏳       │  │ ✓        │     │
│ │ Total    │  │ Pending  │  │ Completed│     │
│ │ Orders:3 │  │ Orders:1 │  │ Orders:2 │     │
│ └──────────┘  └──────────┘  └──────────┘     │
│                                                │
│ Recent Orders                                  │
│ ┌────────────────────────────────────────┐   │
│ │ Order ID│ Date    │ Total  │ Status    │   │
│ │ ORD-001 │ 01/03   │ ₹5,000 │ ⏳ Pending│   │
│ │ ORD-002 │ 28/02   │ ₹8,000 │ ✓ Done   │   │
│ │ ORD-003 │ 25/02   │ ₹3,500 │ ✓ Done   │   │
│ └────────────────────────────────────────┘   │
│                                                │
└────────────────────────────────────────────────┘

┌─ ADMIN DASHBOARD (/admin) ──────────────────────┐
│                                                 │
│ [Access restricted to admin role]              │
│                                                 │
│ ┌─ TAB NAVIGATION ────────────────────────┐   │
│ │ Orders │ Inventory │ Products │ Carousel│   │
│ │ ├─ ORDERS: View, filter, update status│   │
│ │ ├─ INVENTORY: Toggle stock status      │   │
│ │ ├─ PRODUCTS: Full CRUD + ProductModal │   │
│ │ ├─ CAROUSEL: Edit hero slides          │   │
│ │ └─ CONTENT: Edit site content          │   │
│ └──────────────────────────────────────────┘   │
│                                                 │
└────────────────────────────────────────────────┘

┌─ WISHLIST PAGE (/wishlist) ───────────────────┐
│                                                │
│ My Wishlist                                    │
│ Save your favorite items for later            │
│                                                │
│ ProductCard × N (grid 1-4 cols)               │
│ [same as Products page grid]                  │
│                                                │
│ OR (if empty):                                │
│ ❤️ Icon                                       │
│ Your wishlist is empty                        │
│ [Browse Products]                             │
│                                                │
└────────────────────────────────────────────────┘

┌─ ABOUT PAGE (/about) ────────────────────────┐
│                                              │
│ HERO: Gradient background + title           │
│                                              │
│ STATS (scroll-animated):                    │
│ 15+ Years │ 5000+ Customers │ 97+ Products │
│ 100% Guarantee                              │
│                                              │
│ VALUES (card grid):                         │
│ ┌──────────┐  ┌──────────┐                 │
│ │🔨uration │  │🌲 Quality│                 │
│ │Curated   │  │Premium   │                 │
│ └──────────┘  └──────────┘                 │
│ ┌──────────┐  ┌──────────┐                 │
│ │❤️ First  │  │🛡️Integrity│                 │
│ │Customer  │  │Lifetime  │                 │
│ └──────────┘  └──────────┘                 │
│                                              │
│ TIMELINE (expandable):                      │
│ 2009: The Beginning ▼                       │
│ 2013: First Showroom ▼                      │
│ 2017: Premium Collection ▼                  │
│ 2020: Digital Expansion ▼                   │
│ 2024: Today & Beyond ▼                      │
│                                              │
│ TEAM (avatar cards):                        │
│ [RK] Rajan Kumar │ [PS] Priya Sundaram      │
│ Founder, 25 yrs  │ Head of Design, 15 yrs  │
│ [VN] Vikram Nair │ [LD] Lakshmi Devi       │
│ Operations, 12y  │ Relations, 10 yrs       │
│                                              │
└────────────────────────────────────────────┘

┌─ CONTACT PAGE (/contact) ──────────────────────┐
│                                                │
│ FORM (left):                   INFO (right):  │
│ ┌─────────────────┐           ┌────────────┐ │
│ │Name: [text]    │           │📞 Phone    │ │
│ │Email: [email]  │           │9626262777  │ │
│ │Phone: [tel]    │           │          │ │
│ │Subject: [text] │           │📧 Email   │ │
│ │Message: [area] │           │...@gmail  │ │
│ │[Send Message]  │           │          │ │
│ └─────────────────┘           │📍 Address │ │
│                                │49 GST Rd  │ │
│ FAQ (below):                  │          │ │
│ Q: Customization?             │🕒 Hours   │ │
│   A: Yes! We offer...         │Mon-Sat... │ │
│ Q: Packaging?                 │          │ │
│   A: Premium materials...     │🌐 Social  │ │
│ Q: Delivery time?             │f i t     │ │
│   A: 7-14 days...             └────────────┘ │
│ Q: Return policy?                            │
│   A: 14 days hassle-free...                 │
│ Q: Visit showroom?                          │
│   A: Yes! Mon-Sat 9-7 PM...                 │
│                                              │
│ MAP: Google Map embed                       │
│                                              │
└────────────────────────────────────────────────┘
```

---

## 🧩 COMPONENT RELATIONSHIPS

### ProductCard Component
```
ProductCard (Reusable)
├─ Props
│  ├─ product: Product (object)
│  └─ onNavigate: (page, productId) => void
│
├─ Display
│  ├─ Image Section
│  │  ├─ Main image (h-64, bg-slate-100)
│  │  ├─ Discount badge (if applicable)
│  │  ├─ Wishlist button (❤ toggle)
│  │  └─ Stock warnings
│  │
│  └─ Info Section (p-6)
│     ├─ Rating & review count
│     ├─ Product name
│     ├─ Category badge
│     ├─ Price & compare price
│     ├─ Description preview
│     └─ [Add to Cart] button
│
├─ Hooks Used
│  ├─ useCart() → addToCart()
│  ├─ useWishlist() → add/removeFromWishlist()
│  └─ useAuth() → check user, setShowAuthModal()
│
└─ Used In
   ├─ HomePage (Featured & Bestsellers)
   ├─ ProductsPage (filtered grid)
   ├─ WishlistPage
   └─ Related products sections
```

### Header Component
```
Header (Sticky, Top-fixed)
├─ Brand Section
│  ├─ Logo (ELYSIAN GIFTS - gradient)
│  ├─ Tagline (GIFTS)
│  └─ Brand button → onNavigate('home')
│
├─ Navigation (hidden on mobile)
│  ├─ Home button
│  ├─ Products button
│  ├─ About button
│  └─ Contact button
│
├─ Right Section (Icons)
│  ├─ Search 🔍 → Opens SearchModal
│  ├─ Wishlist ❤ (conditional) → Navigate to wishlist
│  │  └─ Badge shows count
│  ├─ Cart 🛒 → Open cart modal
│  │  └─ Badge shows total qty
│  └─ User Menu
│     ├─ If logged in: Profile → Settings / Logout
│     └─ If not: [Sign In] button
│
└─ Mobile Menu (hamburger)
   └─ Slide-out nav on small screens
```

---

## 🔄 STATE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│              GLOBAL STATE (Contexts)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  AuthContext              CartContext                   │
│  ├─ user                  ├─ items[]                    │
│  ├─ profile               ├─ total (calculated)         │
│  ├─ loading               └─ loading                    │
│  └─ showAuthModal                                       │
│                                                         │
│  WishlistContext          CarouselContext               │
│  ├─ items[]               ├─ slides[]                   │
│  └─ loading               └─ functions                  │
│                                                         │
│  ContentContext                                        │
│  └─ content object                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
          ↓ (useContext hooks) ↓
┌─────────────────────────────────────────────────────────┐
│           COMPONENT TREE (Pages & Components)          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ App.tsx                                                 │
│  ├─ Header (uses AuthContext, CartContext)             │
│  │  ├─ AuthModal (modal overlay)                       │
│  │  └─ SearchModal (modal overlay)                     │
│  │                                                     │
│  ├─ Main Content (router-based)                        │
│  │  ├─ HomePage (uses CarouselContext, fetches data)  │
│  │  │  └─ ProductCard[] (uses CartContext)            │
│  │  │                                                  │
│  │  ├─ ProductsPage (filters state, fetches data)     │
│  │  │  └─ ProductCard[] (uses CartContext)            │
│  │  │                                                  │
│  │  ├─ ProductDetailPage (uses CartContext, Auth)     │
│  │  │                                                  │
│  │  ├─ CartPage (uses CartContext)                    │
│  │  │                                                  │
│  │  ├─ CheckoutPage (uses CartContext, Auth)          │
│  │  │                                                  │
│  │  ├─ AdminDashboard (uses Auth, checks role)        │
│  │  │  ├─ ProductEditModal (ProductCard editing)     │
│  │  │  ├─ CarouselManagement (uses useCarousel)      │
│  │  │  └─ ContentManagement (uses useContent)        │
│  │  │                                                  │
│  │  ├─ DashboardPage (uses Auth)                      │
│  │  ├─ WishlistPage (uses WishlistContext)            │
│  │  ├─ AboutPage                                      │
│  │  └─ ContactPage                                    │
│  │                                                     │
│  ├─ CartPage Modal (if showCartModal)                 │
│  │  └─ (uses CartContext)                             │
│  │                                                     │
│  └─ Footer (uses ContentContext)                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 DATA FLOW: Product Purchase

```
Step 1: BROWSE
User → HomePage | ProductsPage
          ↓
    View ProductCard[] grid
    
Step 2: VIEW DETAIL
Click ProductCard
  → onNavigate('product-detail', productId)
  → ProductDetailPage loads
  → fetchProduct(productId) from Supabase/mock
  
Step 3: ADD TO CART
Select quantity → [Add to Cart] button
  → Check useAuth() → user exists?
  ├─ No: setShowAuthModal(true)
  └─ Yes: useCart().addToCart(productId, qty)
       → CartContext.addToCart()
       → Update state: setItems([...items, newItem])
       → Alert: "Product added to cart!"
       
Step 4: VIEW CART
[View Cart] button
  → onNavigate('cart')
  → CartPage renders
  → useCart().items rendered
  
Step 5: MANAGE CART
Update qty: [-] [qty] [+]
  → useCart().updateQuantity(productId, newQty)
  
Delete item: [🗑 Delete]
  → useCart().removeFromCart(productId)
  
Step 6: CHECKOUT
[Proceed to Checkout]
  → onNavigate('checkout')
  → setActiveStep(2) - Address form
  
Step 7: DELIVERY ADDRESS
Enter form → [Next]
  → setActiveStep(3) - Summary
  
Step 8: ORDER SUMMARY
Review items & total → [Next]
  → setActiveStep(4) - Payment
  
Step 9: PAYMENT
Select method (COD) → [Place Order]
  → Generate orderId
  → Create order record
  → Create order_items records
  → sendWhatsAppConfirmation()
  └─ Open WhatsApp with formatted message
  
Step 10: CONFIRMATION
Display confirmation screen
User can: Return home or view dashboard
```

---

## 🎯 Admin Content Management Flow

```
ADMIN LOGIN
  email: afsal@123
  password: asdasd
        ↓
AuthContext.signIn() detects hardcoded credentials
        ↓
setUser(mockAdminUser)
setProfile({ role: 'admin', ... })
        ↓
App.tsx detects profile.role === 'admin'
        ↓
Navigate to '/admin' (AdminDashboard)
        ↓
AdminDashboard renders with 5 tabs:

┌─ ORDERS TAB ─────────────────────┐
│ View all orders                   │
│ Search by order ID or customer    │
│ Update status: pending→shipped→delivered
│ Status changes in state          │
│ (Data is mock, no DB update)     │
└───────────────────────────────────┘

┌─ INVENTORY TAB ──────────────────┐
│ View all products                │
│ Toggle stock status              │
│ Updates mockProducts[] state    │
│ No database persistence         │
└───────────────────────────────────┘

┌─ PRODUCTS TAB ───────────────────┐
│ Search products by name          │
│ [+ Add Product] button           │
│   → ProductEditModal opens       │
│   → Fill form fields             │
│   → Upload images (base64)       │
│   → [Save] → addToProducts()    │
│                                  │
│ Existing Products:              │
│ ├─ [✏️ Edit] → Modal opens      │
│ │   → Edit fields               │
│ │   → [Save] → updateProduct() │
│ │                               │
│ └─ [🗑️ Delete] → removeProduct()
│                                  │
│ Updates mockProducts[] state    │
└───────────────────────────────────┘

┌─ CAROUSEL TAB ───────────────────┐
│ CarouselManagement component     │
│                                  │
│ [+ Add Slide] button            │
│   → Form fields appear:         │
│   • Title, subtitle, desc       │
│   • Image upload (base64)       │
│   • CTA button text             │
│   → [Save] → addSlide()        │
│       → Updates slides[] state  │
│       → Saves to localStorage   │
│                                  │
│ Existing Slides:               │
│ ├─ [✏️ Edit] → Form appears    │
│ │   → updateSlide()            │
│ │                               │
│ └─ [🗑️ Delete] → deleteSlide()│
│                                  │
│ Changes reflected on HomePage   │
│ after page reload              │
└───────────────────────────────────┘

┌─ CONTENT TAB ────────────────────┐
│ ContentManagement component      │
│                                  │
│ Sub-tabs:                       │
│ • Footer: Address, phone, email,│
│   social links                  │
│ • Header: Logo, tagline         │
│ • Homepage: Section titles      │
│ • Categories: Category list     │
│ • Pages: About & Contact        │
│                                  │
│ Each field:                     │
│ [Input/Textarea] → onChange    │
│   → updateContent()            │
│   → Saves to localStorage      │
│                                  │
│ Changes reflected after reload │
└───────────────────────────────────┘
```

---

## 🎨 STYLING HIERARCHY

```
Global Styles
├─ index.css (Tailwind imports, base styles)
├─ Tailwind configuration (theme extend)
└─ PostCSS (Tailwind plugin)

Component-level Styling
├─ Inline Tailwind classes
│  └─ className="flex gap-4 px-6 py-4"
│
├─ Hover states
│  └─ hover:bg-slate-100, hover:text-amber-400
│
├─ Responsive variants
│  └─ md:flex-row, lg:w-64, sm:grid-cols-2
│
├─ Gradients
│  └─ bg-gradient-to-r, bg-gradient-to-br
│
├─ Shadows
│  └─ shadow-md hover:shadow-xl
│
├─ Transforms
│  └─ transform hover:scale-105, hover:-translate-y-2
│
└─ Transitions
   └─ transition-all duration-300, duration-500

Form Styling
├─ Input focus states
│  └─ focus:ring-2 focus:ring-amber-500 focus:border-transparent
│
├─ Button states
│  └─ disabled:opacity-50, active:scale-95
│
└─ Error states
   └─ text-red-500, border-red-300

Dark/Light Modes
└─ Uses slate color palette (professional)
   ├─ Dark BG: slate-900, slate-800
   ├─ Light BG: slate-50, white
   ├─ Text: slate-900, slate-600
   └─ Accents: amber, orange, red, green, blue
```

---

## 📱 Responsive Design Flow

```
Mobile (xs) - default styles
├─ 1 column layout
├─ Full width containers
├─ Hamburger menu (mobile nav)
├─ Stacked form inputs
├─ No sidebar (filters slide in)
└─ Touch-friendly spacing

Tablet (sm: 640px)
├─ 2 column grids
├─ Wider container
├─ Side-by-side forms
└─ Show nav links (if space)

Desktop (md: 768px)
├─ 3 column grids
├─ Sidebar appears
├─ Full navigation visible
└─ Multiple columns for forms

Large Desktop (lg: 1024px)
├─ 4 column grids
├─ Wider sidebar
├─ More spacing/padding
└─ xl: 1280px container (max-w-7xl)

Responsive Patterns Used:
├─ display: hidden md:flex (hide on mobile)
├─ grid-cols-1 md:grid-cols-3 (1 col → 3 col)
├─ w-full md:w-64 (full width → fixed width)
├─ px-4 sm:px-6 lg:px-8 (dynamic padding)
├─ flex-col lg:flex-row (stack → row)
└─ space-y-6 lg:space-y-0 lg:gap-8 (responsive gaps)
```

---

## 🔄 Authentication State Machine

```
┌─────────────────────────────────────┐
│        AUTH STATE FLOW              │
└─────────────────────────────────────┘

NOT_AUTHENTICATED
        ↓
[Sign In Button] / AuthModal
        ↓
Enter credentials
        ↓
│
├─ Mock credentials detected
│  ├─ afsal@123/asdasd → Admin User
│  └─ demo@123/demodemo → Customer User
│
├─ OR Supabase auth
│  ├─ signInWithPassword()
│  └─ fetchProfile(userId)
│
↓
AUTHENTICATED
├─ user: User | null
├─ profile: Profile | null
├─ loading: false
└─ showAuthModal: false
        ↓
App detects user exists
        ↓
Conditional Rendering:
├─ Wishlist button appears
├─ Cart features available
├─ Dashboard link shows
└─ If admin role → Auto-redirect to /admin
        ↓
User Actions:
├─ Can add to cart
├─ Can add to wishlist
├─ Can access dashboard
├─ Can checkout
└─ (Admin can manage content)
        ↓
[Sign Out] button clicked
        ↓
signOut() → setUser(null), setProfile(null)
        ↓
NOT_AUTHENTICATED (back to start)
```

---

**Documentation Generated:** March 5, 2026  
**Format:** ASCII Diagrams + Visual Documentation  
**Audience:** Developers, Project Managers, Stakeholders
