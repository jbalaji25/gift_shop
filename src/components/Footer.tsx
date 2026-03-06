import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              ELYSIAN GIFTS
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Premium gifts for your loved ones. We make every occasion special and memorable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-amber-400 transition-colors">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-400 transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('products')} className="hover:text-amber-400 transition-colors">Living Room</button></li>
              <li><button onClick={() => onNavigate('products')} className="hover:text-amber-400 transition-colors">Bedroom</button></li>
              <li><button onClick={() => onNavigate('products')} className="hover:text-amber-400 transition-colors">Office</button></li>
              <li><button onClick={() => onNavigate('products')} className="hover:text-amber-400 transition-colors">Kitchen</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>49, GST Road, Pasumalai, Madurai-04</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>9626262777 / 9626262778</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <span>elysiangifts@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
          <p>&copy; 2025 Elysian Gifts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
