import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteContent {
  // Footer
  footer: {
    address: string;
    phone1: string;
    phone2: string;
    email: string;
    socials: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
  };

  // Navigation/Header
  header: {
    logo: string;
    logoText: string;
    tagline: string;
  };

  // Homepage sections
  homepage: {
    featuredTitle: string;
    featuredDescription: string;
    bestSellersTitle: string;
    bestSellersDescription: string;
    categoriesTitle: string;
    categoriesDescription: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };

  // Shop by category section
  categories: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    productCount: number;
  }>;

  // Pages
  pages: {
    about: {
      title: string;
      introText: string;
      missionText: string;
      visionText: string;
      image: string;
    };
    contact: {
      title: string;
      introText: string;
      address: string;
      phone: string;
      email: string;
      image: string;
    };
  };

  // Additional sections
  customSections: Array<{
    id: string;
    title: string;
    content: string;
    image?: string;
    position: number;
  }>;
}

interface ContentContextType {
  content: SiteContent;
  updateContent: (section: keyof SiteContent, data: any) => void;
  updateNestedContent: (section: string, key: string, data: any) => void;
}

const DEFAULT_CONTENT: SiteContent = {
  footer: {
    address: '49, GST Road, Pasumalai, Madurai-04',
    phone1: '9626262777',
    phone2: '9626262778',
    email: 'contact@wuddeninterior.com',
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
    },
  },
  header: {
    logo: 'https://images.pexels.com/photos/3817517/pexels-photo-3817517.jpeg',
    logoText: 'WUDDEN INTERIOR',
    tagline: 'Premium Corporate Gifts & Interior Solutions',
  },
  homepage: {
    featuredTitle: 'Featured Products',
    featuredDescription: 'Handpicked selections just for you',
    bestSellersTitle: 'Best Sellers',
    bestSellersDescription: 'Most loved by our customers',
    categoriesTitle: 'Shop By Category',
    categoriesDescription: 'Explore our wide range of gift categories designed to make every occasion memorable',
    features: [
      { title: 'Free Delivery', description: 'On orders above ₹50,000' },
      { title: 'Warranty', description: 'Up to 10 years warranty' },
      { title: 'Premium Quality', description: '100% genuine premium materials' },
      { title: 'Best Prices', description: 'Biggest store, biggest savings' },
    ],
  },
  categories: [
    {
      id: '1',
      name: 'Luxury Gifts',
      description: 'Premium luxury gift collection',
      image: 'https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg',
      productCount: 150,
    },
    {
      id: '2',
      name: 'Corporate Gifts',
      description: 'Professional corporate gift solutions',
      image: 'https://images.pexels.com/photos/6348130/pexels-photo-6348130.jpeg',
      productCount: 120,
    },
    {
      id: '3',
      name: 'Festive Collection',
      description: 'Perfect for celebrations and festivals',
      image: 'https://images.pexels.com/photos/1666070/pexels-photo-1666070.jpeg',
      productCount: 80,
    },
    {
      id: '4',
      name: 'Personalized Gifts',
      description: 'Custom and personalized gift options',
      image: 'https://images.pexels.com/photos/6348117/pexels-photo-6348117.jpeg',
      productCount: 95,
    },
  ],
  pages: {
    about: {
      title: 'About Wudden Interior',
      introText: 'Welcome to Wudden Interior, your premier destination for premium corporate gifts and interior solutions.',
      missionText: 'Our mission is to provide thoughtfully curated gifts that make every occasion special and memorable.',
      visionText: 'We envision becoming the most trusted gift and interior solutions provider, known for quality and innovation.',
      image: 'https://images.pexels.com/photos/3944387/pexels-photo-3944387.jpeg',
    },
    contact: {
      title: 'Contact Us',
      introText: 'Get in touch with our team. We are here to help!',
      address: '49, GST Road, Pasumalai, Madurai-04',
      phone: '9626262777',
      email: 'contact@wuddeninterior.com',
      image: 'https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg',
    },
  },
  customSections: [],
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('siteContent');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem('siteContent', JSON.stringify(content));
  }, [content]);

  const updateContent = (section: keyof SiteContent, data: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const updateNestedContent = (section: string, key: string, data: any) => {
    setContent((prev) => {
      const sectionData = prev[section as keyof SiteContent] as any;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [key]: data,
        },
      };
    });
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, updateNestedContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
}
