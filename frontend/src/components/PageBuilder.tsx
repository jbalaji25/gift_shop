import { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Edit2, X } from 'lucide-react';
import { useSiteBuilder, type SectionType, type LayoutType } from '../contexts/SiteBuilderContext';

const SECTION_TYPES: { value: SectionType; label: string }[] = [
  { value: 'hero-carousel', label: 'Hero Carousel' },
  { value: 'featured-products', label: 'Featured Products' },
  { value: 'bestsellers', label: 'Best Sellers' },
  { value: 'categories', label: 'Categories' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'features', label: 'Features' },
  { value: 'text-section', label: 'Text Section' },
  { value: 'image-gallery', label: 'Image Gallery' },
  { value: 'contact-form', label: 'Contact Form' },
  { value: 'faq', label: 'FAQ' },
  { value: 'stats', label: 'Stats' },
  { value: 'team', label: 'Team' },
  { value: 'cta-banner', label: 'CTA Banner' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'products-grid', label: 'Products Grid' },
];

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: 'full-width', label: 'Full Width' },
  { value: 'centered', label: 'Centered' },
  { value: 'two-column', label: '2 Columns' },
  { value: 'three-column', label: '3 Columns' },
  { value: 'four-column', label: '4 Columns' },
];

export function PageBuilder() {
  const {
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
  } = useSiteBuilder();

  const [activeTab, setActiveTab] = useState<'pages' | 'sections' | 'colors' | 'settings'>('pages');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState<SectionType>('text-section');

  const currentPage = getCurrentPage();

  const handleAddSection = () => {
    addSection(currentPageId, {
      id: `section-${Date.now()}`,
      type: newSectionType,
      title: `New ${newSectionType}`,
      visible: true,
      layout: 'full-width',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      properties: {},
      images: [],
    });
    setShowAddSection(false);
    setNewSectionType('text-section');
  };

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
        <h2 className="text-2xl font-bold text-slate-900">Website Page Builder</h2>
        <p className="text-slate-600 mt-1">Build and customize your entire website with full control over sections, colors, and layouts</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 flex-wrap">
        {(['pages', 'sections', 'colors', 'settings'] as const).map((tab) => (
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

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteConfig.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPageId(page.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                currentPageId === page.id
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                  : 'border-slate-200 bg-white hover:border-amber-300'
              }`}
            >
              <h3 className="font-semibold text-slate-900">{page.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{page.sections.length} sections</p>
              <p className="text-xs text-slate-400 mt-2 truncate">{page.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && currentPage && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{currentPage.name} Sections</h3>
                <p className="text-sm text-slate-600 mt-1">Edit, reorder, or add sections to this page</p>
              </div>
              <button
                onClick={() => setShowAddSection(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Section
              </button>
            </div>

            {/* Add Section Form */}
            {showAddSection && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Section Type</label>
                  <select
                    value={newSectionType}
                    onChange={(e) => setNewSectionType(e.target.value as SectionType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {SECTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddSection}
                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Create Section
                  </button>
                  <button
                    onClick={() => setShowAddSection(false)}
                    className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Sections List */}
            <div className="space-y-2">
              {currentPage.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div
                    key={section.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{section.title}</h4>
                            <p className="text-sm text-slate-500">{SECTION_TYPES.find((t) => t.value === section.type)?.label}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                          <span>Layout: {section.layout}</span>
                          <span className="flex items-center gap-1">
                            {section.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {section.visible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => updateSection(currentPageId, section.id, { visible: !section.visible })}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title={section.visible ? 'Hide' : 'Show'}
                        >
                          {section.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>

                        <button
                          onClick={() => reorderSections(currentPageId, section.id, 'up')}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Move up"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => reorderSections(currentPageId, section.id, 'down')}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Move down"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete "${section.title}"?`)) {
                              deleteSection(currentPageId, section.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Edit Section Form */}
                    {editingSectionId === section.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSection(currentPageId, section.id, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Layout</label>
                            <select
                              value={section.layout}
                              onChange={(e) => updateSection(currentPageId, section.id, { layout: e.target.value as LayoutType })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                              {LAYOUT_OPTIONS.map((layout) => (
                                <option key={layout.value} value={layout.value}>
                                  {layout.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Background Color</label>
                            <input
                              type="color"
                              value={section.backgroundColor}
                              onChange={(e) => updateSection(currentPageId, section.id, { backgroundColor: e.target.value })}
                              className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
                            <input
                              type="color"
                              value={section.textColor}
                              onChange={(e) => updateSection(currentPageId, section.id, { textColor: e.target.value })}
                              className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                          <textarea
                            value={section.description || ''}
                            onChange={(e) => updateSection(currentPageId, section.id, { description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Section Images</label>
                          <button
                            onClick={() =>
                              triggerFileInput((base64) => {
                                updateSection(currentPageId, section.id, {
                                  images: [...section.images, base64],
                                });
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-dashed border-amber-300 rounded-lg hover:bg-amber-50 transition-colors text-amber-700 font-medium"
                          >
                            + Add Image
                          </button>
                          {section.images.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                              {section.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                  <img src={img} alt={`Section ${idx}`} className="w-full h-20 object-cover rounded-lg" />
                                  <button
                                    onClick={() =>
                                      updateSection(currentPageId, section.id, {
                                        images: section.images.filter((_, i) => i !== idx),
                                      })
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setEditingSectionId(null)}
                          className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                          Done Editing
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Theme Colors</h3>

            {[
              { key: 'primary', label: 'Primary Color' },
              { key: 'secondary', label: 'Secondary Color' },
              { key: 'accent', label: 'Accent Color' },
              { key: 'dark', label: 'Dark Color' },
              { key: 'light', label: 'Light Color' },
              { key: 'text', label: 'Text Color' },
              { key: 'successColor', label: 'Success Color' },
              { key: 'errorColor', label: 'Error Color' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={siteConfig.theme[key as keyof typeof siteConfig.theme] || ''}
                    onChange={(e) => updateTheme({ [key]: e.target.value })}
                    className="w-20 h-10 border border-slate-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={siteConfig.theme[key as keyof typeof siteConfig.theme] || ''}
                    onChange={(e) => updateTheme({ [key]: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Color Preview</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'primary', label: 'Primary' },
                { key: 'secondary', label: 'Secondary' },
                { key: 'accent', label: 'Accent' },
                { key: 'dark', label: 'Dark' },
                { key: 'light', label: 'Light' },
                { key: 'text', label: 'Text' },
                { key: 'successColor', label: 'Success' },
                { key: 'errorColor', label: 'Error' },
              ].map(({ key, label }) => (
                <div key={key} className="rounded-lg overflow-hidden border border-slate-200">
                  <div
                    style={{ backgroundColor: siteConfig.theme[key as keyof typeof siteConfig.theme] || '#000000' }}
                    className="w-full h-20"
                  />
                  <div className="p-2 text-xs font-medium text-slate-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && currentPage && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Page Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
              <input
                type="text"
                value={currentPage.title}
                onChange={(e) => updatePageConfig(currentPageId, { title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Page Slug</label>
              <input
                type="text"
                value={currentPage.slug}
                onChange={(e) => updatePageConfig(currentPageId, { slug: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Page Description</label>
            <textarea
              value={currentPage.description}
              onChange={(e) => updatePageConfig(currentPageId, { description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              checked={currentPage.visible}
              onChange={(e) => updatePageConfig(currentPageId, { visible: e.target.checked })}
              className="w-4 h-4 text-amber-600"
            />
            <label className="text-sm font-medium text-slate-700">Visible on website</label>
          </div>
        </div>
      )}

      {/* Save Indicator */}
      <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">All changes auto-saved to localStorage</span>
      </div>
    </div>
  );
}
