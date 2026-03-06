import React, { createContext, useContext, useState, useEffect } from 'react';

// Page types
export type PageType = 'home' | 'products' | 'about' | 'contact' | 'cart' | 'checkout' | 'wishlist' | 'dashboard';

// Section types
export type SectionType = 
  | 'hero-carousel' 
  | 'featured-products' 
  | 'bestsellers' 
  | 'categories' 
  | 'testimonials' 
  | 'features' 
  | 'text-section' 
  | 'image-gallery' 
  | 'contact-form' 
  | 'faq' 
  | 'stats' 
  | 'team' 
  | 'cta-banner' 
  | 'newsletter'
  | 'products-grid'
  | 'custom-section';

export type LayoutType = 'full-width' | 'centered' | 'two-column' | 'three-column' | 'four-column';

export interface SectionConfig {
  id: string;
  type: SectionType;
  title: string;
  description?: string;
  order: number;
  visible: boolean;
  layout: LayoutType;
  backgroundColor: string;
  textColor: string;
  properties: Record<string, any>;
  images: string[];
  items?: Array<{
    id: string;
    title: string;
    description?: string;
    image?: string;
    link?: string;
  }>;
}

export interface PageConfig {
  id: PageType;
  name: string;
  title: string;
  description: string;
  slug: string;
  visible: boolean;
  sections: SectionConfig[];
  customCss?: string;
}

export interface SiteTheme {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  light: string;
  text: string;
  textLight: string;
  backgroundColor: string;
  borderColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  logo: string;
  logoText: string;
  theme: SiteTheme;
  pages: PageConfig[];
  globalSections: {
    header: Record<string, any>;
    footer: Record<string, any>;
    navbar: Record<string, any>;
  };
}

const DEFAULT_THEME: SiteTheme = {
  primary: '#f59e0b',
  secondary: '#fbbf24',
  accent: '#0f172a',
  dark: '#0f172a',
  light: '#f8fafc',
  text: '#0f172a',
  textLight: '#475569',
  backgroundColor: '#f8fafc',
  borderColor: '#e2e8f0',
  successColor: '#10b981',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
};

const DEFAULT_PAGE_CONFIG: PageConfig = {
  id: 'home',
  name: 'Home',
  title: 'Welcome to Wudden Interior',
  description: 'Premium interior design products and furniture',
  slug: '/',
  visible: true,
  sections: [
    {
      id: 'hero-1',
      type: 'hero-carousel',
      title: 'Hero Carousel',
      order: 0,
      visible: true,
      layout: 'full-width',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      properties: {
        height: '500px',
        autoplay: true,
        interval: 5000,
      },
      images: [],
    },
    {
      id: 'featured-1',
      type: 'featured-products',
      title: 'Featured Products',
      order: 1,
      visible: true,
      layout: 'full-width',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      properties: {
        itemsPerRow: 4,
        showRating: true,
      },
      images: [],
    },
    {
      id: 'bestsellers-1',
      type: 'bestsellers',
      title: 'Best Sellers',
      order: 2,
      visible: true,
      layout: 'full-width',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      properties: {
        itemsPerRow: 4,
        showDiscount: true,
      },
      images: [],
    },
    {
      id: 'categories-1',
      type: 'categories',
      title: 'Shop by Category',
      order: 3,
      visible: true,
      layout: 'full-width',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      properties: {
        itemsPerRow: 4,
        showCount: true,
      },
      images: [],
    },
  ],
};

interface SiteBuilderContextType {
  siteConfig: SiteConfig;
  currentPageId: PageType;
  setCurrentPageId: (pageId: PageType) => void;
  updatePageConfig: (pageId: PageType, updates: Partial<PageConfig>) => void;
  addSection: (pageId: PageType, section: Omit<SectionConfig, 'order'>) => void;
  updateSection: (pageId: PageType, sectionId: string, updates: Partial<SectionConfig>) => void;
  deleteSection: (pageId: PageType, sectionId: string) => void;
  reorderSections: (pageId: PageType, sectionId: string, direction: 'up' | 'down') => void;
  updateTheme: (updates: Partial<SiteTheme>) => void;
  getCurrentPage: () => PageConfig | undefined;
}

const SiteBuilderContext = createContext<SiteBuilderContextType | undefined>(undefined);

const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'Wudden Interior',
  siteDescription: 'Premium interior design products',
  logo: '',
  logoText: 'Wudden',
  theme: DEFAULT_THEME,
  pages: [DEFAULT_PAGE_CONFIG],
  globalSections: {
    header: {},
    footer: {},
    navbar: {},
  },
};

export function SiteBuilderProvider({ children }: { children: React.ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('wudden_site_builder_config');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_CONFIG;
  });

  const [currentPageId, setCurrentPageId] = useState<PageType>('home');

  useEffect(() => {
    localStorage.setItem('wudden_site_builder_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  const updatePageConfig = (pageId: PageType, updates: Partial<PageConfig>) => {
    setSiteConfig((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === pageId ? { ...page, ...updates } : page
      ),
    }));
  };

  const addSection = (pageId: PageType, section: Omit<SectionConfig, 'order'>) => {
    setSiteConfig((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => {
        if (page.id === pageId) {
          const newOrder = Math.max(...page.sections.map((s) => s.order), -1) + 1;
          return {
            ...page,
            sections: [
              ...page.sections,
              { ...section, order: newOrder } as SectionConfig,
            ],
          };
        }
        return page;
      }),
    }));
  };

  const updateSection = (pageId: PageType, sectionId: string, updates: Partial<SectionConfig>) => {
    setSiteConfig((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            sections: page.sections.map((section) =>
              section.id === sectionId ? { ...section, ...updates } : section
            ),
          };
        }
        return page;
      }),
    }));
  };

  const deleteSection = (pageId: PageType, sectionId: string) => {
    setSiteConfig((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            sections: page.sections.filter((section) => section.id !== sectionId),
          };
        }
        return page;
      }),
    }));
  };

  const reorderSections = (pageId: PageType, sectionId: string, direction: 'up' | 'down') => {
    setSiteConfig((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => {
        if (page.id === pageId) {
          const sections = [...page.sections].sort((a, b) => a.order - b.order);
          const index = sections.findIndex((s) => s.id === sectionId);

          if ((direction === 'up' && index > 0) || (direction === 'down' && index < sections.length - 1)) {
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            [sections[index].order, sections[newIndex].order] = [sections[newIndex].order, sections[index].order];
          }

          return { ...page, sections };
        }
        return page;
      }),
    }));
  };

  const updateTheme = (updates: Partial<SiteTheme>) => {
    setSiteConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...updates },
    }));
  };

  const getCurrentPage = () => siteConfig.pages.find((page) => page.id === currentPageId);

  return (
    <SiteBuilderContext.Provider
      value={{
        siteConfig,
        currentPageId,
        setCurrentPageId,
        updatePageConfig,
        addSection,
        updateSection,
        deleteSection,
        reorderSections,
        updateTheme,
        getCurrentPage,
      }}
    >
      {children}
    </SiteBuilderContext.Provider>
  );
}

export function useSiteBuilder() {
  const context = useContext(SiteBuilderContext);
  if (context === undefined) {
    throw new Error('useSiteBuilder must be used within SiteBuilderProvider');
  }
  return context;
}
