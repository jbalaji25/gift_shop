import { useState } from 'react';
import { Upload, X, Save } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export function ContentManagement() {
  const { content, updateContent, updateNestedContent } = useContent();
  const [activeTab, setActiveTab] = useState<'footer' | 'header' | 'homepage' | 'categories' | 'pages'>('footer');

  const triggerFileInput = (callback: (base64: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          callback(base64);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
        <p className="text-slate-600 mt-1">Edit all text content, images, and sections across your website</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-slate-200">
        {(['footer', 'header', 'homepage', 'categories', 'pages'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-amber-500 text-amber-700 bg-amber-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Footer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea
                  value={content.footer.address}
                  onChange={(e) =>
                    updateNestedContent('footer', 'address', e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={content.footer.email}
                  onChange={(e) =>
                    updateNestedContent('footer', 'email', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone 1</label>
                <input
                  type="tel"
                  value={content.footer.phone1}
                  onChange={(e) =>
                    updateNestedContent('footer', 'phone1', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone 2</label>
                <input
                  type="tel"
                  value={content.footer.phone2}
                  onChange={(e) =>
                    updateNestedContent('footer', 'phone2', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
                <input
                  type="text"
                  value={content.footer.socials.facebook || ''}
                  onChange={(e) =>
                    updateNestedContent('footer', 'socials', {
                      ...content.footer.socials,
                      facebook: e.target.value,
                    })
                  }
                  placeholder="https://facebook.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
                <input
                  type="text"
                  value={content.footer.socials.instagram || ''}
                  onChange={(e) =>
                    updateNestedContent('footer', 'socials', {
                      ...content.footer.socials,
                      instagram: e.target.value,
                    })
                  }
                  placeholder="https://instagram.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Twitter</label>
                <input
                  type="text"
                  value={content.footer.socials.twitter || ''}
                  onChange={(e) =>
                    updateNestedContent('footer', 'socials', {
                      ...content.footer.socials,
                      twitter: e.target.value,
                    })
                  }
                  placeholder="https://twitter.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">YouTube</label>
                <input
                  type="text"
                  value={content.footer.socials.youtube || ''}
                  onChange={(e) =>
                    updateNestedContent('footer', 'socials', {
                      ...content.footer.socials,
                      youtube: e.target.value,
                    })
                  }
                  placeholder="https://youtube.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Tab */}
      {activeTab === 'header' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Navigation Header</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Logo Text</label>
            <input
              type="text"
              value={content.header.logoText}
              onChange={(e) =>
                updateNestedContent('header', 'logoText', e.target.value)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
            <input
              type="text"
              value={content.header.tagline}
              onChange={(e) =>
                updateNestedContent('header', 'tagline', e.target.value)
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Logo Image</label>
            <div className="space-y-3">
              <button
                onClick={() =>
                  triggerFileInput((base64) =>
                    updateNestedContent('header', 'logo', base64)
                  )
                }
                className="w-full px-4 py-3 border-2 border-dashed border-amber-300 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 text-amber-700 font-medium"
              >
                <Upload className="w-5 h-5" />
                Upload Logo Image
              </button>

              {content.header.logo && (
                <div className="relative inline-block">
                  <img
                    src={content.header.logo}
                    alt="Logo preview"
                    className="h-24 rounded-lg border-2 border-amber-200"
                  />
                  <button
                    onClick={() => updateNestedContent('header', 'logo', '')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Homepage Tab */}
      {activeTab === 'homepage' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Homepage Sections</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Featured Products Title</label>
              <input
                type="text"
                value={content.homepage.featuredTitle}
                onChange={(e) =>
                  updateNestedContent('homepage', 'featuredTitle', e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Featured Products Description</label>
              <input
                type="text"
                value={content.homepage.featuredDescription}
                onChange={(e) =>
                  updateNestedContent('homepage', 'featuredDescription', e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Best Sellers Title</label>
              <input
                type="text"
                value={content.homepage.bestSellersTitle}
                onChange={(e) =>
                  updateNestedContent('homepage', 'bestSellersTitle', e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Best Sellers Description</label>
              <input
                type="text"
                value={content.homepage.bestSellersDescription}
                onChange={(e) =>
                  updateNestedContent('homepage', 'bestSellersDescription', e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categories Title</label>
              <input
                type="text"
                value={content.homepage.categoriesTitle}
                onChange={(e) =>
                  updateNestedContent('homepage', 'categoriesTitle', e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categories Description</label>
              <textarea
                value={content.homepage.categoriesDescription}
                onChange={(e) =>
                  updateNestedContent('homepage', 'categoriesDescription', e.target.value)
                }
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="font-semibold text-slate-900 mb-4">Homepage Features</h4>
            <div className="space-y-3">
              {content.homepage.features.map((feature, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...content.homepage.features];
                        newFeatures[index].title = e.target.value;
                        updateNestedContent('homepage', 'features', newFeatures);
                      }}
                      placeholder="Feature title"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...content.homepage.features];
                        newFeatures[index].description = e.target.value;
                        updateNestedContent('homepage', 'features', newFeatures);
                      }}
                      placeholder="Feature description"
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Product Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.categories.map((category, index) => (
              <div key={category.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => {
                    const newCategories = [...content.categories];
                    newCategories[index].name = e.target.value;
                    updateContent('categories', newCategories);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-semibold"
                />
                <textarea
                  value={category.description}
                  onChange={(e) => {
                    const newCategories = [...content.categories];
                    newCategories[index].description = e.target.value;
                    updateContent('categories', newCategories);
                  }}
                  rows={2}
                  placeholder="Category description"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
                <input
                  type="number"
                  value={category.productCount}
                  onChange={(e) => {
                    const newCategories = [...content.categories];
                    newCategories[index].productCount = parseInt(e.target.value) || 0;
                    updateContent('categories', newCategories);
                  }}
                  placeholder="Product count"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
                <div>
                  <button
                    onClick={() =>
                      triggerFileInput((base64) => {
                        const newCategories = [...content.categories];
                        newCategories[index].image = base64;
                        updateContent('categories', newCategories);
                      })
                    }
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors text-amber-700 font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Upload className="w-4 h-4" />
                    Change Image
                  </button>
                </div>
                {category.image && (
                  <img src={category.image} alt={category.name} className="w-full h-24 object-cover rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Page Content</h3>

          {/* About Page */}
          <div className="border border-slate-200 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-slate-900">About Page</h4>
            <input
              type="text"
              value={content.pages.about.title}
              onChange={(e) =>
                updateNestedContent('pages', 'about', {
                  ...content.pages.about,
                  title: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Page title"
            />
            <textarea
              value={content.pages.about.introText}
              onChange={(e) =>
                updateNestedContent('pages', 'about', {
                  ...content.pages.about,
                  introText: e.target.value,
                })
              }
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Intro text"
            />
            <textarea
              value={content.pages.about.missionText}
              onChange={(e) =>
                updateNestedContent('pages', 'about', {
                  ...content.pages.about,
                  missionText: e.target.value,
                })
              }
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Mission text"
            />
            <textarea
              value={content.pages.about.visionText}
              onChange={(e) =>
                updateNestedContent('pages', 'about', {
                  ...content.pages.about,
                  visionText: e.target.value,
                })
              }
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Vision text"
            />
            <button
              onClick={() =>
                triggerFileInput((base64) =>
                  updateNestedContent('pages', 'about', {
                    ...content.pages.about,
                    image: base64,
                  })
                )
              }
              className="px-4 py-2 border border-amber-300 rounded-lg hover:bg-amber-50 text-amber-700 font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Change Image
            </button>
          </div>

          {/* Contact Page */}
          <div className="border border-slate-200 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-slate-900">Contact Page</h4>
            <input
              type="text"
              value={content.pages.contact.title}
              onChange={(e) =>
                updateNestedContent('pages', 'contact', {
                  ...content.pages.contact,
                  title: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Page title"
            />
            <textarea
              value={content.pages.contact.introText}
              onChange={(e) =>
                updateNestedContent('pages', 'contact', {
                  ...content.pages.contact,
                  introText: e.target.value,
                })
              }
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Intro text"
            />
            <input
              type="text"
              value={content.pages.contact.address}
              onChange={(e) =>
                updateNestedContent('pages', 'contact', {
                  ...content.pages.contact,
                  address: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Address"
            />
            <input
              type="tel"
              value={content.pages.contact.phone}
              onChange={(e) =>
                updateNestedContent('pages', 'contact', {
                  ...content.pages.contact,
                  phone: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Phone"
            />
            <input
              type="email"
              value={content.pages.contact.email}
              onChange={(e) =>
                updateNestedContent('pages', 'contact', {
                  ...content.pages.contact,
                  email: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Email"
            />
            <button
              onClick={() =>
                triggerFileInput((base64) =>
                  updateNestedContent('pages', 'contact', {
                    ...content.pages.contact,
                    image: base64,
                  })
                )
              }
              className="px-4 py-2 border border-amber-300 rounded-lg hover:bg-amber-50 text-amber-700 font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Change Image
            </button>
          </div>
        </div>
      )}

      {/* Save Indicator */}
      <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
        <Save className="w-5 h-5" />
        <span className="text-sm font-medium">All changes are saved automatically to localStorage</span>
      </div>
    </div>
  );
}
