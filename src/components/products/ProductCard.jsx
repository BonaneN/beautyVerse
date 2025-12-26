import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product, index = 0 }) => {
    const {
        id,
        name,
        description,
        price,
        discount_price,
        image_url,
        category,
        stock_quantity,
        free_delivery
    } = product;

    const hasDiscount = discount_price && discount_price < price;
    const discountPercentage = hasDiscount
        ? Math.round(((price - discount_price) / price) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <Link to={`/products/${id}`} className="block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-soft-apricot/20 to-cotton-candy/20">
                        {image_url ? (
                            <img
                                src={image_url}
                                alt={name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-20 h-20 text-blush-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {/* Discount Badge */}
                            {hasDiscount && (
                                <div className="px-3 py-1 bg-berry-crush text-white text-sm font-bold rounded-full shadow-lg">
                                    -{discountPercentage}% OFF
                                </div>
                            )}

                            {/* Free Delivery Badge */}
                            {free_delivery && (
                                <div className="px-3 py-1 bg-cotton-candy text-night-bordeaux text-sm font-semibold rounded-full shadow-lg flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    Free Delivery
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        {stock_quantity === 0 && (
                            <div className="absolute inset-0 bg-night-bordeaux/80 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">Out of Stock</span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                        {category && (
                            <span className="text-xs text-blush-rose font-semibold uppercase tracking-wider">
                                {category}
                            </span>
                        )}
                        <h3 className="font-heading font-bold text-night-bordeaux text-lg mt-1 mb-2 line-clamp-2">
                            {name}
                        </h3>
                        {description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {description}
                            </p>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            {hasDiscount ? (
                                <>
                                    <span className="text-2xl font-bold text-blush-rose">
                                        RWF {discount_price.toFixed(0)}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        RWF {price.toFixed(0)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-night-bordeaux">
                                    RWF {price.toFixed(0)}
                                </span>
                            )}
                        </div>

                        {/* Stock Indicator */}
                        {stock_quantity > 0 && stock_quantity <= 5 && (
                            <p className="text-xs text-berry-crush mt-2">
                                Only {stock_quantity} left in stock!
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
