import { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts } from '../lib/demoData';
import { ProductEditModal } from '../components/ProductEditModal';
import { CarouselManagement } from '../components/CarouselManagement';
import { ContentManagement } from '../components/ContentManagement';
import { PageBuilder } from '../components/PageBuilder';
import { OrderManagement } from '../components/OrderManagement';
import type { Product } from '../lib/database.types';

type AdminTab = 'new-orders' | 'inventory' | 'products' | 'carousel' | 'content' | 'page-builder';

export function AdminDashboard() {
    const { profile } = useAuth();
    const [products, setProducts] = useState(mockProducts);
    const [activeTab, setActiveTab] = useState<AdminTab>('new-orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    // Protection: ensure only admin sees this
    if (profile?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Access Denied</h2>
                    <p className="text-slate-600">You must be logged in as an administrator to view this page.</p>
                </div>
            </div>
        );
    }

    const handleStockToggle = (productId: string, inStock: boolean) => {
        setProducts(products.map(p =>
            p.id === productId ? { ...p, stock: inStock ? 10 : 0 } : p
        ));
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = (updatedProduct: Product) => {
        setProducts(products.map(p =>
            p.id === updatedProduct.id ? updatedProduct : p
        ));
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };

    const handleDeleteProduct = (productId: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-600 mt-1">Manage your store orders and inventory</p>
                    </div>

                    <div className="mt-4 sm:mt-0 flex space-x-2 flex-wrap">
                        <button
                            onClick={() => setActiveTab('new-orders')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'new-orders'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            WhatsApp Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'inventory'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'products'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('carousel')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'carousel'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            Carousel
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'content'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            Content
                        </button>
                        <button
                            onClick={() => setActiveTab('page-builder')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'page-builder'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            Page Builder
                        </button>
                    </div>
                </div>

                {/* WhatsApp Orders Tab */}
                {activeTab === 'new-orders' && (
                    <div className="p-6">
                        <OrderManagement />
                    </div>
                )}

                {/* Main Content Area */}
                {activeTab === 'inventory' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder={`Search inventory...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Stock</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {filteredProducts.map((product) => {
                                        const images = Array.isArray(product.images) ? product.images : [];
                                        const imgUrl = images[0] || 'https://via.placeholder.com/150';
                                        return (
                                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img className="h-10 w-10 rounded-lg object-cover" src={String(imgUrl)} alt="" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {product.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    ₹{product.price.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {product.stock > 0 ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {product.stock} in stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Out of stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {product.stock > 0 ? (
                                                        <button
                                                            onClick={() => handleStockToggle(product.id, false)}
                                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                                                        >
                                                            Mark No Stock
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleStockToggle(product.id, true)}
                                                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors"
                                                        >
                                                            Mark In Stock
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Carousel Tab */}
                {activeTab === 'carousel' && (
                    <div className="p-6">
                        <CarouselManagement />
                    </div>
                )}

                {/* Content Management Tab */}
                {activeTab === 'content' && (
                    <div className="p-6">
                        <ContentManagement />
                    </div>
                )}

                {/* Page Builder Tab */}
                {activeTab === 'page-builder' && (
                    <div className="p-6">
                        <PageBuilder />
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Manage Products</h2>
                                <p className="text-slate-600 mt-1">View, edit, and manage all product details and images</p>
                            </div>
                            <button
                                onClick={handleAddProduct}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => {
                                const images = Array.isArray(product.images) ? product.images : [];
                                const imgUrl = images[0] || 'https://via.placeholder.com/150';
                                return (
                                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative h-48 overflow-hidden bg-slate-100">
                                            <img src={String(imgUrl)} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{product.name}</h3>
                                                <p className="text-sm text-slate-600">{product.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString()}</p>
                                                    {product.compare_price && (
                                                        <p className="text-sm text-slate-500 line-through">₹{product.compare_price.toLocaleString()}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 mb-1">Stock</p>
                                                    <p className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {product.stock}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-3">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Product Edit Modal */}
                <ProductEditModal
                    product={editingProduct}
                    isOpen={isProductModalOpen}
                    onClose={() => {
                        setIsProductModalOpen(false);
                        setEditingProduct(null);
                    }}
                    onSave={handleSaveProduct}
                />
            </div>
        </div>
    );
}
