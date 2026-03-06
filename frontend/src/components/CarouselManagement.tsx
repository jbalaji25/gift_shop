import { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Eye, Upload, X } from 'lucide-react';
import { useCarousel, type CarouselSlide } from '../contexts/CarouselContext';

export function CarouselManagement() {
  const { slides, addSlide, updateSlide, deleteSlide } = useCarousel();
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [previewSlide, setPreviewSlide] = useState<CarouselSlide | null>(null);
  const [formData, setFormData] = useState<Partial<CarouselSlide>>({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    cta: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData({ ...formData, image: base64String });
        setUploadProgress(0);
      };

      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAddSlide = () => {
    if (formData.title && formData.image) {
      const newSlide: CarouselSlide = {
        id: Date.now().toString(),
        title: formData.title || '',
        subtitle: formData.subtitle || '',
        description: formData.description || '',
        image: formData.image || '',
        cta: formData.cta || 'Shop Now',
      };
      addSlide(newSlide);
      setFormData({ title: '', subtitle: '', description: '', image: '', cta: '' });
      setIsAddingSlide(false);
    }
  };

  const handleEditSlide = () => {
    if (editingSlide && formData.title && formData.image) {
      updateSlide(editingSlide.id, {
        ...editingSlide,
        title: formData.title || '',
        subtitle: formData.subtitle || '',
        description: formData.description || '',
        image: formData.image || '',
        cta: formData.cta || '',
      });
      setEditingSlide(null);
      setFormData({ title: '', subtitle: '', description: '', image: '', cta: '' });
    }
  };

  const handleEditClick = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: slide.image,
      cta: slide.cta,
    });
  };

  const handleCancel = () => {
    setIsAddingSlide(false);
    setEditingSlide(null);
    setFormData({ title: '', subtitle: '', description: '', image: '', cta: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Carousel</h2>
          <p className="text-slate-600 mt-1">Edit and manage homepage hero slides</p>
        </div>
        {!isAddingSlide && !editingSlide && (
          <button
            onClick={() => setIsAddingSlide(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Slide
          </button>
        )}
      </div>

      {/* Form Section */}
      {(isAddingSlide || editingSlide) && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {editingSlide ? 'Edit Slide' : 'Add New Slide'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Premium Corporate Gifts"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Thoughtfully Curated"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Make Every Occasion Special"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Image *</label>
              
              {/* Upload Area */}
              <div className="space-y-3">
                {/* File Upload Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-full px-4 py-3 border-2 border-dashed border-amber-300 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 text-amber-700 font-medium"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Image From Computer
                  </button>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-500 font-medium">OR</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-xs text-slate-600 mb-2">Paste Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-40 rounded-lg object-cover border-2 border-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-slate-500 mt-2">
                    {formData.image.startsWith('data:') ? '📤 Uploaded from computer' : '🔗 URL based image'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA Button Text</label>
              <input
                type="text"
                name="cta"
                value={formData.cta || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Shop Now"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingSlide ? handleEditSlide : handleAddSlide}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
              >
                {editingSlide ? 'Update Slide' : 'Add Slide'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="w-full md:w-48 flex-shrink-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-32 rounded-lg object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-amber-600 font-semibold">Slide {index + 1}</div>
                    <h3 className="text-xl font-bold text-slate-900">{slide.title}</h3>
                    {slide.subtitle && <p className="text-sm text-amber-600">{slide.subtitle}</p>}
                  </div>
                </div>
                {slide.description && (
                  <p className="text-slate-600">{slide.description}</p>
                )}
                <div className="flex items-center gap-4 pt-2">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    {slide.cta}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 justify-start">
                <button
                  onClick={() => setPreviewSlide(slide)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => handleEditClick(slide)}
                  className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteSlide(slide.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-[400px] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
              <img
                src={previewSlide.image}
                alt={previewSlide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl space-y-6">
                    <div className="text-amber-400 font-semibold text-lg tracking-wider uppercase">
                      {previewSlide.subtitle}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                      {previewSlide.title}
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {previewSlide.description}
                    </p>
                    <button className="group bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 transition-all transform hover:scale-105 shadow-xl">
                      <span>{previewSlide.cta}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 text-center">
              <button
                onClick={() => setPreviewSlide(null)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
