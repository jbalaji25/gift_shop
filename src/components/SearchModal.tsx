import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { supabase, isMock } from '../lib/supabase';
import { mockProducts } from '../lib/demoData';
import type { Product } from '../lib/database.types';

interface SearchModalProps {
  onClose: () => void;
  onNavigate: (page: string, productId?: string) => void;
}

export function SearchModal({ onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchQuery();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchQuery = async () => {
    setLoading(true);

    if (isMock) {
      const filtered = mockProducts.filter((product: Product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8);

      setResults(filtered);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(8);

    if (data) {
      setResults(data);
    }
    setLoading(false);
  };

  const handleSelect = (productId: string) => {
    onNavigate('product-detail', productId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4">
      <div className="max-w-2xl mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center border-b border-slate-200 p-4">
            <Search className="w-6 h-6 text-slate-400 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for gifts..."
              className="flex-1 text-lg outline-none"
              autoFocus
            />
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Searching...</div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {results.map(product => {
                  const images = Array.isArray(product.images) ? product.images : [];
                  return (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="w-full p-4 hover:bg-slate-50 flex items-center space-x-4 text-left transition-colors"
                    >
                      <img
                        src={(images[0] as string) || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{product.name}</h4>
                        <p className="text-sm text-slate-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{product.price.toLocaleString()}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-8 text-center text-slate-500">
                No products found for "{query}"
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                Start typing to search...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
