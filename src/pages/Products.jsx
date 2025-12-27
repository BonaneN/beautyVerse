import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import AddProductForm from '../components/products/AddProductForm';
import ProductDetailsModal from './ProductDetails';
import { useAuth } from '../context/AuthContext';

const Products = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await api.get('/products/list-products/');
            setProducts(data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductAdded = (newProduct) => {
        setProducts(prev => [...prev, newProduct]);
        setShowAddForm(false);
    };

    const handleProductDeleted = () => {
        setSelectedProductId(null);
        fetchProducts();
    };

    return (
        <div className="min-h-screen bg-[#FFF9F9] py-24 relative overflow-hidden">
            {/* Blurred Content Layer */}
            <div className={`transition-all duration-700 ${selectedProductId ? 'blur-md brightness-90 scale-[0.98]' : ''}`}>
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cotton-candy/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blush-rose/10 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3" />

                <div className="container-custom relative">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-6xl md:text-7xl font-heading font-black text-night-bordeaux mb-4 tracking-tight">
                                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blush-rose to-berry-crush">Collection</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-lg font-medium leading-relaxed">
                                Discover our curated selection of premium beauty essentials, crafted for your unique glow.
                            </p>
                        </motion.div>

                        {user && user.isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddForm(!showAddForm)}
                                className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl ${showAddForm
                                    ? 'bg-white text-night-bordeaux border-2 border-night-bordeaux hover:bg-gray-50'
                                    : 'bg-night-bordeaux text-white hover:bg-night-bordeaux/90'
                                    }`}
                            >
                                {showAddForm ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Close Form
                                    </>
                                ) : (
                                    <>
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        Add New Product
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>

                    {/* Glassmorphic Form Container */}
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="mb-20 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blush-rose via-berry-crush to-night-bordeaux" />
                            <AddProductForm onProductAdded={handleProductAdded} />
                        </motion.div>
                    )}

                    {/* Loading State */}
                    {loading && !showAddForm && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cotton-candy border-t-blush-rose"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !showAddForm && (
                        <div className="bg-berry-crush/10 border border-berry-crush text-berry-crush rounded-2xl p-8 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-bold mb-2">Error Loading Products</h3>
                            <p>{error}</p>
                            <button
                                onClick={fetchProducts}
                                className="mt-4 px-6 py-2 bg-berry-crush text-white rounded-full hover:bg-night-bordeaux transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && products.length === 0 && !showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-12 text-center"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-soft-apricot to-cotton-candy rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-blush-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-night-bordeaux mb-4">
                                No Products Yet
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Start building your product catalog by adding your first product. Click the "Add Product" button above to get started!
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-8 py-4 bg-gradient-to-r from-cotton-candy to-blush-rose text-white rounded-full font-semibold hover:from-blush-rose hover:to-berry-crush transition-all shadow-xl hover:scale-105"
                            >
                                Add Your First Product
                            </button>
                        </motion.div>
                    )}

                    {/* Products Grid */}
                    {!loading && !error && products.length > 0 && !showAddForm && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    onClick={(p) => setSelectedProductId(p.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details Modal (Direct Child of absolute root to avoid blur) */}
            <AnimatePresence>
                {selectedProductId && (
                    <ProductDetailsModal
                        productId={selectedProductId}
                        onClose={(wasDeleted) => {
                            if (wasDeleted === true) {
                                handleProductDeleted();
                            } else {
                                setSelectedProductId(null);
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;
