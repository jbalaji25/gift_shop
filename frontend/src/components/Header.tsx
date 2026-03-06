import { Menu, Search, ShoppingCart, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface HeaderProps {
  onAuthClick: () => void;
  onCartClick: () => void;
  onSearchClick: () => void;
  onNavigate: (page: string) => void;
}

export function Header({ onAuthClick, onCartClick, onSearchClick, onNavigate }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 group"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              ELYSIAN
            </div>
            <div className="text-sm text-amber-400/80 hidden sm:block">GIFTS</div>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm font-medium hover:text-amber-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="text-sm font-medium hover:text-amber-400 transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-sm font-medium hover:text-amber-400 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-sm font-medium hover:text-amber-400 transition-colors"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={onSearchClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {user && (
              <button
                onClick={() => onNavigate('wishlist')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onCartClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm hidden lg:block">{profile?.full_name || 'Account'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      (document.activeElement as HTMLElement)?.blur();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-100 flex items-center space-x-2 rounded-t-lg"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        (document.activeElement as HTMLElement)?.blur();
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100 flex items-center space-x-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                  <button
                    onClick={signOut}
                    className="w-full px-4 py-3 text-left hover:bg-slate-100 flex items-center space-x-2 text-red-600 rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <nav className="px-4 py-4 space-y-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('products');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg"
            >
              Products
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg"
            >
              About
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg"
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
