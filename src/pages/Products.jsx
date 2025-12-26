import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import AddProductForm from '../components/products/AddProductForm';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await api.get('/beautyVerse/products/list-products/');
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-soft-apricot/10 py-20">
            <div className="container-custom">

                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-heading font-bold text-night-bordeaux mb-4">
                            Our Products
                        </h1>
                        <p className="text-lg text-gray-600">
                            Discover premium beauty products curated just for you
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-8 py-4 bg-gradient-to-r from-blush-rose to-berry-crush text-white rounded-full font-semibold hover:from-berry-crush hover:to-night-bordeaux transition-all shadow-xl hover:scale-105"
                    >
                        {showAddForm ? 'View Products' : 'Add Product'}
                    </button>
                </div>

                {/* Add Product Form */}
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
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
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Products;
