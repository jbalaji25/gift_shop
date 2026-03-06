import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CarouselProvider } from './contexts/CarouselContext';
import { ContentProvider } from './contexts/ContentContext';
import { SiteBuilderProvider } from './contexts/SiteBuilderContext';
import { OrderProvider } from './contexts/OrderContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthModal } from './components/AuthModal';
import { SearchModal } from './components/SearchModal';
import { OrderNotifications } from './components/OrderNotifications';
import { Footer } from './components/Footer';

type Page = 'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'dashboard' | 'wishlist' | 'categories' | 'about' | 'contact' | 'admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { showAuthModal, setShowAuthModal } = useAuth();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const { profile } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle redirecting an admin bypass login
  useEffect(() => {
    if (profile?.role === 'admin' && currentPage !== 'admin') {
      setCurrentPage('admin');
      setShowAuthModal(false);
    }
  }, [profile]);

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page as Page);
    if (productId) {
      setSelectedProductId(productId);
    }
    setShowCartModal(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'products':
        return <ProductsPage onNavigate={handleNavigate} />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <ProductsPage onNavigate={handleNavigate} />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard />;
      case 'wishlist':
        return <WishlistPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header
            onAuthClick={() => setShowAuthModal(true)}
            onCartClick={() => setShowCartModal(true)}
            onSearchClick={() => setShowSearchModal(true)}
            onNavigate={handleNavigate}
          />

          <main className="flex-1">
            {renderPage()}
          </main>

          <Footer onNavigate={handleNavigate} />

          <OrderNotifications />

          {showAuthModal && (
            <AuthModal onClose={() => setShowAuthModal(false)} />
          )}

          {showSearchModal && (
            <SearchModal
              onClose={() => setShowSearchModal(false)}
              onNavigate={handleNavigate}
            />
          )}

          {showCartModal && (
            <CartPage onNavigate={handleNavigate} onClose={() => setShowCartModal(false)} isModal />
          )}
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <SiteBuilderProvider>
          <CarouselProvider>
            <ContentProvider>
              <AppContent />
            </ContentProvider>
          </CarouselProvider>
        </SiteBuilderProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
