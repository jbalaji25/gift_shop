import { useState, useRef } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import type { Product } from '../lib/database.types';

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductEditModal({ product, isOpen, onClose, onSave }: ProductEditModalProps) {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: '',
      name: '',
      description: '',
      category: '',
      price: 0,
      compare_price: null,
      stock: 0,
      material: '',
      style: '',
      images: [],
      features: [],
      dimensions: { width: 0, height: 0, depth: 0 },
      rating: 0,
      review_count: 0,
      is_featured: false,
      is_bestseller: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  const [newImage, setNewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

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
        const images = (Array.isArray(formData.images) ? formData.images : []) as string[];
        setFormData({ ...formData, images: [...images, base64String] as any });
        setUploadProgress(0);
      };

      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (name.startsWith('dimensions.')) {
      const dimension = name.split('.')[1];
      const dims = typeof formData.dimensions === 'object' && formData.dimensions
        ? { ...(formData.dimensions as any) }
        : { width: 0, height: 0, depth: 0 };
      setFormData({
        ...formData,
        dimensions: {
          ...dims,
          [dimension]: parseFloat(value),
        } as any,
      });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addImage = () => {
    if (newImage.trim()) {
      const images = (Array.isArray(formData.images) ? formData.images : []) as string[];
      setFormData({ ...formData, images: [...images, newImage] as any });
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    const images = (Array.isArray(formData.images) ? formData.images : []) as string[];
    setFormData({ ...formData, images: images.filter((_, i) => i !== index) as any });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const features = (Array.isArray(formData.features) ? formData.features : []) as string[];
      setFormData({ ...formData, features: [...features, newFeature] as any });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const features = (Array.isArray(formData.features) ? formData.features : []) as string[];
    setFormData({ ...formData, features: features.filter((_, i) => i !== index) as any });
  };

  const handleSave = () => {
    setFormData({
      ...formData,
      updated_at: new Date().toISOString(),
    });
    onSave({
      ...formData,
      updated_at: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {product?.id ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Executive Leather Compendium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Corporate"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Product description..."
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Pricing & Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Compare Price (₹)</label>
                <input
                  type="number"
                  name="compare_price"
                  value={formData.compare_price || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Material & Style */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Genuine Leather"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Style</label>
                <input
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Classic"
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Dimensions (cm)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Width</label>
                <input
                  type="number"
                  name="dimensions.width"
                  value={
                    typeof formData.dimensions === 'object' && formData.dimensions
                      ? (formData.dimensions as any).width || 0
                      : 0
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height</label>
                <input
                  type="number"
                  name="dimensions.height"
                  value={
                    typeof formData.dimensions === 'object' && formData.dimensions
                      ? (formData.dimensions as any).height || 0
                      : 0
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Depth</label>
                <input
                  type="number"
                  name="dimensions.depth"
                  value={
                    typeof formData.dimensions === 'object' && formData.dimensions
                      ? (formData.dimensions as any).depth || 0
                      : 0
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Product Images</h3>
            
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={addImage}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(Array.isArray(formData.images) ? formData.images : []).map((image, index) => (
                <div key={index} className="relative group">
                  <img src={String(image)} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {String(image).startsWith('data:') ? '📤' : '🔗'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Features</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                onClick={addFeature}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="space-y-2">
              {(Array.isArray(formData.features) ? formData.features : []).map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-100 px-3 py-2 rounded-lg">
                  <span className="text-slate-700">{String(feature)}</span>
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Product Flags</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-slate-700">Featured Product</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_bestseller"
                  checked={formData.is_bestseller}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-slate-700">Bestseller</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
