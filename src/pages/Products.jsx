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
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [deliveryFilter, setDeliveryFilter] = useState('All');
    const [locationSearch, setLocationSearch] = useState('');

    const fetchCategories = async () => {
        try {
            const data = await api.get('/products/list-categories/');
            setCategories(data || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

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
        fetchCategories();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesDelivery = deliveryFilter === 'All' || product.delivery_option === deliveryFilter;
        const matchesLocation = !locationSearch ||
            (product.shop_location && product.shop_location.toLowerCase().includes(locationSearch.toLowerCase()));

        return matchesCategory && matchesDelivery && matchesLocation;
    });

    const handleProductAdded = (newProduct) => {
        setProducts(prev => [...prev, newProduct]);
        setShowAddForm(false);
    };

    const handleProductDeleted = () => {
        setSelectedProductId(null);
        fetchProducts();
    };

    return (
        <div className="min-h-screen bg-[#FFF9F9] relative overflow-hidden">
            {/* Main Content Layer */}
            <div className={`transition-all duration-700 ${selectedProductId ? 'blur-md brightness-90 scale-[0.98]' : ''}`}>

                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cotton-candy/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blush-rose/10 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3" />

                {/* Global Unified Filter Bar (Sticky) - Flush with Navbar */}
                <div className="sticky top-0 z-30 w-full bg-night-bordeaux/95 backdrop-blur-xl border-y border-white/10 shadow-2xl">
                    <div className="w-full px-6 lg:px-12 py-2 flex flex-col md:flex-row items-center gap-6 md:gap-8 min-h-[64px]">

                        {/* Categories Segment - Natural Wrap */}
                        <div className="flex-grow flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setActiveCategory('All')}
                                className={`px-5 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all shrink-0 ${activeCategory === 'All'
                                    ? 'bg-blush-rose text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`px-5 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat.name
                                        ? 'bg-blush-rose text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Search & Utility Segment */}
                        <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch gap-4 md:basis-1/2">
                            {/* Location Search Field */}
                            <div className="relative flex-grow group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-blush-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={locationSearch}
                                    onChange={(e) => setLocationSearch(e.target.value)}
                                    placeholder="Search location..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blush-rose/50 transition-all"
                                />
                            </div>

                            {/* Delivery Options */}
                            <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl shrink-0 overflow-hidden">
                                <div className="flex md:hidden lg:flex px-3 border-r border-white/10">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
                                    </svg>
                                </div>

                                <div className="block md:hidden flex-grow px-2">
                                    <select
                                        value={deliveryFilter}
                                        onChange={(e) => setDeliveryFilter(e.target.value)}
                                        className="w-full bg-transparent text-white text-[10px] font-black uppercase tracking-wider focus:outline-none appearance-none"
                                    >
                                        <option value="All" className="bg-night-bordeaux">All Options</option>
                                        <option value="Free Delivery" className="bg-night-bordeaux">Free</option>
                                        <option value="Paid Delivery" className="bg-night-bordeaux">Paid</option>
                                        <option value="Shop Pickup" className="bg-night-bordeaux">Pickup</option>
                                    </select>
                                </div>

                                <div className="hidden md:flex items-center h-full">
                                    {[
                                        { id: 'All', label: 'All' },
                                        { id: 'Free Delivery', label: 'Free' },
                                        { id: 'Paid Delivery', label: 'Paid' },
                                        { id: 'Shop Pickup', label: 'Pickup' }
                                    ].map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setDeliveryFilter(option.id)}
                                            className={`px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${deliveryFilter === option.id
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-500 hover:text-white'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="container-custom relative pt-20 min-h-[600px]">
                    {/* Admin Actions */}
                    <div className="flex justify-end mb-6 px-4">
                        {user && user.isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddForm(!showAddForm)}
                                className={`group flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-xl ${showAddForm
                                    ? 'bg-white text-night-bordeaux border-2 border-night-bordeaux hover:bg-gray-50'
                                    : 'bg-night-bordeaux text-white hover:bg-night-bordeaux/90'
                                    }`}
                            >
                                {showAddForm ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Close Form
                                    </>
                                ) : (
                                    <>
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        Add Product
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>

                    {/* Add Product Form */}
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

                    {/* Results / Status States */}
                    <div className="min-h-[400px]">
                        {loading && !showAddForm && (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cotton-candy border-t-blush-rose"></div>
                            </div>
                        )}

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
                                <h2 className="text-3xl font-heading font-bold text-night-bordeaux mb-4">No Products Yet</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">Start building your product catalog by adding your first product.</p>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-cotton-candy to-blush-rose text-white rounded-full font-semibold hover:from-blush-rose hover:to-berry-crush transition-all shadow-xl hover:scale-105"
                                >
                                    Add Your First Product
                                </button>
                            </motion.div>
                        )}

                        {!loading && !error && products.length > 0 && filteredProducts.length === 0 && !showAddForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-night-bordeaux mb-2">No matches found</h3>
                                <p className="text-gray-500 mb-8">Try adjusting your filters or search terms.</p>
                                <button
                                    onClick={() => {
                                        setActiveCategory('All');
                                        setDeliveryFilter('All');
                                        setLocationSearch('');
                                    }}
                                    className="px-8 py-3 bg-blush-rose/10 text-blush-rose font-bold rounded-xl hover:bg-blush-rose/20 transition-all"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}

                        {!loading && !error && filteredProducts.length > 0 && !showAddForm && (
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
                                {filteredProducts.map((product, index) => (
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
            </div>

            {/* Product Details Modal (Outside blurred Layer) */}
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
