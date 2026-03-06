import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
}

interface CarouselContextType {
  slides: CarouselSlide[];
  addSlide: (slide: CarouselSlide) => void;
  updateSlide: (id: string, slide: CarouselSlide) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (slides: CarouselSlide[]) => void;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: '1',
    title: 'Premium Corporate Gifts',
    subtitle: 'Thoughtfully Curated',
    description: 'Make Every Occasion Special',
    image: '/carousel/corporate-gifts-hero.png',
    cta: 'Shop Now',
  },
  {
    id: '2',
    title: 'Premium Collection',
    subtitle: 'Unforgettable Moments',
    description: 'Luxury Gifts At Affordable Prices',
    image: 'https://images.pexels.com/photos/1666070/pexels-photo-1666070.jpeg?auto=compress&cs=tinysrgb&w=1920',
    cta: 'Explore Collection',
  },
  {
    id: '3',
    title: 'Timeless Elegance',
    subtitle: 'Handcrafted Quality',
    description: 'Experience The Art Of Gifting',
    image: 'https://images.pexels.com/photos/6348117/pexels-photo-6348117.jpeg?auto=compress&cs=tinysrgb&w=1920',
    cta: 'Discover More',
  },
];

export function CarouselProvider({ children }: { children: React.ReactNode }) {
  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    const saved = localStorage.getItem('carouselSlides');
    return saved ? JSON.parse(saved) : DEFAULT_SLIDES;
  });

  useEffect(() => {
    localStorage.setItem('carouselSlides', JSON.stringify(slides));
  }, [slides]);

  const addSlide = (slide: CarouselSlide) => {
    setSlides([...slides, slide]);
  };

  const updateSlide = (id: string, updatedSlide: CarouselSlide) => {
    setSlides(slides.map(slide => (slide.id === id ? updatedSlide : slide)));
  };

  const deleteSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  const reorderSlides = (newSlides: CarouselSlide[]) => {
    setSlides(newSlides);
  };

  return (
    <CarouselContext.Provider value={{ slides, addSlide, updateSlide, deleteSlide, reorderSlides }}>
      {children}
    </CarouselContext.Provider>
  );
}

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within CarouselProvider');
  }
  return context;
}
