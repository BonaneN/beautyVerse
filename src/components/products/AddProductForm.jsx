import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AddProductForm = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount_percentage: '',
        category: '',
        stock_quantity: '',
        image_url: '',
        free_delivery: false
    });
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [imageInputMode, setImageInputMode] = useState('url');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('Fetching categories from API...');
                // Categories is likely under products app or global
                const data = await api.get('/beautyVerse/products/categories/');
                console.log('Categories API response:', data);

                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error('API response is not an array:', data);
                    // If the endpoint doesn't exist yet, we'll keep categories empty or use a placeholder
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'image_url' && value) {
            setImagePreview(value);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let response;

            if (imageInputMode === 'upload' && imageFile) {
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.name);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('price', parseFloat(formData.price));
                formDataToSend.append('category', formData.category);
                formDataToSend.append('stock_quantity', parseInt(formData.stock_quantity));
                formDataToSend.append('free_delivery', formData.free_delivery);

                if (formData.discount_percentage) {
                    const discountPrice = parseFloat(formData.price) * (1 - parseFloat(formData.discount_percentage) / 100);
                    formDataToSend.append('discount_price', discountPrice.toFixed(2));
                }

                formDataToSend.append('image', imageFile);

                const token = localStorage.getItem('access_token');
                // Using correct documentation path: /beautyVerse/products/add-new-product/
                const res = await fetch('https://bonane00.pythonanywhere.com/beautyVerse/products/add-new-product/', {
                    method: 'POST',
                    headers: {
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: formDataToSend
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.detail || errorData.error || 'Failed to add product');
                }

                response = await res.json();
            } else {
                const productData = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    stock_quantity: parseInt(formData.stock_quantity),
                    image_url: formData.image_url,
                    free_delivery: formData.free_delivery
                };

                if (formData.discount_percentage) {
                    const discountPrice = parseFloat(formData.price) * (1 - parseFloat(formData.discount_percentage) / 100);
                    productData.discount_price = parseFloat(discountPrice.toFixed(2));
                }

                // Documentation path: /beautyVerse/products/add-new-product/
                response = await api.post('/beautyVerse/products/add-new-product/', productData);
            }

            setSuccess('Product added successfully!');
            setFormData({
                name: '',
                description: '',
                price: '',
                discount_percentage: '',
                category: '',
                stock_quantity: '',
                image_url: '',
                free_delivery: false
            });
            setImageFile(null);
            setImagePreview('');

            if (onProductAdded) {
                onProductAdded(response);
            }

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-heading font-bold text-night-bordeaux mb-6">
                Add New Product
            </h2>

            {error && (
                <div className="mb-4 p-4 bg-berry-crush/10 border border-berry-crush text-berry-crush rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-cotton-candy/20 border border-cotton-candy text-night-bordeaux rounded-lg">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-semibold text-night-bordeaux mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none transition-all"
                            placeholder="e.g., Luxury Face Cream"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-night-bordeaux mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none transition-all bg-white"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id || cat.name} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-night-bordeaux mb-2">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="2"
                        maxLength="200"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none transition-all resize-none"
                        placeholder="Short description (max 200 characters)..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200 characters</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Price (RWF) */}
                    <div>
                        <label className="block text-sm font-semibold text-night-bordeaux mb-2">
                            Price (RWF) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="1"
                            min="0"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none transition-all"
                            placeholder="0"
                        />
                    </div>

                    {/* Discount Percentage */}
                    <div>
                        <label className="block text-sm font-semibold text-night-bordeaux mb-2">
                            Discount (%)
                        </label>
                        <input
                            type="number"
                            name="discount_percentage"
                            value={formData.discount_percentage}
                            onChange={handleChange}
                            step="1"
                            min="0"
                            max="100"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none transition-all"
                            placeholder="e.g., 10"
                        />
                    </div>

                    {/* Stock Quantity */}
                    <div>
                        <label className="block text-sm font-semibold text-night-bordeaux mb-2">
                            Stock Quantity *
                        </label>
                        <input
                            type="number"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none transition-all"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Image Toggle */}
                <div>
                    <label className="block text-sm font-semibold text-night-bordeaux mb-3">
                        Product Image
                    </label>
                    <div className="flex gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => {
                                setImageInputMode('url');
                                setImageFile(null);
                            }}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${imageInputMode === 'url'
                                ? 'bg-blush-rose text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Image URL
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setImageInputMode('upload');
                                setFormData(prev => ({ ...prev, image_url: '' }));
                            }}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${imageInputMode === 'upload'
                                ? 'bg-blush-rose text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Upload File
                        </button>
                    </div>

                    {imageInputMode === 'url' && (
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-cotton-candy focus:ring-2 focus:ring-cotton-candy/20 outline-none transition-all"
                            placeholder="https://example.com/image.jpg"
                        />
                    )}

                    {imageInputMode === 'upload' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cotton-candy transition-all">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-600 mb-1">
                                    {imageFile ? imageFile.name : 'Click to upload image'}
                                </p>
                                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                            </label>
                        </div>
                    )}

                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-night-bordeaux mb-2">Preview:</p>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-w-xs h-48 object-cover rounded-lg border-2 border-gray-200"
                            />
                        </div>
                    )}
                </div>

                {/* Free Delivery */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="free_delivery"
                        id="free_delivery"
                        checked={formData.free_delivery}
                        onChange={handleChange}
                        className="w-5 h-5 text-cotton-candy border-gray-300 rounded focus:ring-cotton-candy"
                    />
                    <label htmlFor="free_delivery" className="text-sm font-semibold text-night-bordeaux cursor-pointer">
                        Offer Free Delivery
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blush-rose to-berry-crush text-white rounded-full font-bold text-lg hover:from-berry-crush hover:to-night-bordeaux transition-all shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
