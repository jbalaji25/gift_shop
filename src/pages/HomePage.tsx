import { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, Award, Truck, Shield } from 'lucide-react';
import { supabase, isMock } from '../lib/supabase';
import { mockProducts } from '../lib/demoData';
import type { Product } from '../lib/database.types';
import { ProductCard } from '../components/ProductCard';
import { useCarousel } from '../contexts/CarouselContext';

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

const categories: { name: string; image: string; count: number }[] = [
  { name: 'Luxury Gifts', image: 'https://images.pexels.com/photos/贈り物5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&w=600', count: 150 },
  { name: 'Corporate Gifts', image: 'https://images.pexels.com/photos/贈り物贈り物6348130/pexels-photo-6348130.jpeg?auto=compress&cs=tinysrgb&w=600', count: 120 },
  { name: 'Festive Collection', image: 'https://images.pexels.com/photos/贈り物1666070/pexels-photo-1666070.jpeg?auto=compress&cs=tinysrgb&w=600', count: 80 },
  { name: 'Personalized Gifts', image: 'https://images.pexels.com/photos/贈り物6348117/pexels-photo-6348117.jpeg?auto=compress&cs=tinysrgb&w=600', count: 95 },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { slides: heroSlides } = useCarousel();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    if (isMock) {
      setFeaturedProducts(mockProducts.filter(p => p.is_featured).slice(0, 4));
      setBestSellers(mockProducts.filter(p => p.is_bestseller).slice(0, 4));
      setLoading(false);
      return;
    }

    const [{ data: featured }, { data: bestsellers }] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(4),
      supabase
        .from('products')
        .select('*')
        .eq('is_bestseller', true)
        .limit(4),
    ]);

    if (featured) setFeaturedProducts(featured);
    if (bestsellers) setBestSellers(bestsellers);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl space-y-6 animate-fade-in">
                  <div className="text-amber-400 font-semibold text-lg tracking-wider uppercase">
                    {slide.subtitle}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {slide.description}
                  </p>
                  <button
                    onClick={() => onNavigate('products')}
                    className="group bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 transition-all transform hover:scale-105 shadow-xl"
                  >
                    <span>{slide.cta}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-amber-500 w-8' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹50,000' },
              { icon: Shield, title: 'Warranty', desc: 'Up to 10 years warranty' },
              { icon: Award, title: 'Premium Quality', desc: '100% genuine premium materials' },
              { icon: TrendingUp, title: 'Best Prices', desc: 'Biggest store, biggest savings' },
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-3 group">
                <feature.icon className="w-12 h-12 mx-auto text-amber-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Shop By Category</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explore our wide range of gift categories designed to make every occasion memorable
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => onNavigate('products')}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.count}+ Products</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Featured Products</h2>
              <p className="text-slate-600">Handpicked selections just for you</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-amber-500 hover:text-amber-600 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-200 animate-pulse h-96 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Visit Our Showroom
          </h2>
          <p className="text-xl mb-4 opacity-90">
            49, GST Road, Pasumalai, Madurai-04
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-8">
            <a href="tel:9626262777" className="text-lg hover:underline">
              📞 9626262777
            </a>
            <a href="tel:9626262778" className="text-lg hover:underline">
              📞 9626262778
            </a>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Get Directions</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Best Sellers</h2>
              <p className="text-slate-600">Most loved by our customers</p>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-200 animate-pulse h-96 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
