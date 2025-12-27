import { motion } from 'framer-motion';
import api from '../../utils/api';

const ProductCard = ({ product, index = 0, onClick }) => {
    const {
        id,
        name,
        description,
        price,
        discount_percentage,
        final_price,
        product_image,
        category,
        delivery_option
    } = product;

    const hasDiscount = discount_percentage > 0;
    const discountPercentage = Math.round(discount_percentage);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="group relative"
        >
            <div
                onClick={() => onClick(product)}
                className="cursor-pointer h-full bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(183,72,104,0.15)] transition-all duration-500 flex flex-col border border-white hover:border-blush-rose/20 relative group"
            >
                {/* Background Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-soft-apricot/0 via-cotton-candy/0 to-blush-rose/0 group-hover:from-soft-apricot/10 group-hover:via-cotton-candy/10 group-hover:to-blush-rose/5 transition-all duration-700 -z-10" />

                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    {product_image ? (
                        <img
                            src={api.getImageUrl(product_image)}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-soft-apricot/10 to-cotton-candy/10">
                            <svg className="w-16 h-16 text-blush-rose/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    )}

                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                        <div className="flex flex-col gap-2">
                            {hasDiscount && (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="px-3 py-1 bg-berry-crush text-white text-[10px] font-black rounded-full shadow-lg backdrop-blur-md"
                                >
                                    {discountPercentage}% OFF
                                </motion.div>
                            )}
                            {delivery_option === 'Free Delivery' && (
                                <div className="px-3 py-1 bg-white/90 text-night-bordeaux text-[9px] font-black rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1 border border-white uppercase tracking-wider">
                                    <svg className="w-3 h-3 text-blush-rose" fill="currentColor" viewBox="2 2 20 20">
                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-1-1h-5z" />
                                    </svg>
                                    Free
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-grow flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            {category && (
                                <span className="text-[9px] bg-soft-apricot/30 text-blush-rose font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded">
                                    {category}
                                </span>
                            )}
                        </div>

                        <h3 className="font-heading font-black text-night-bordeaux text-lg mb-0.5 line-clamp-1 group-hover:text-blush-rose transition-colors duration-300">
                            {name}
                        </h3>

                        {description && (
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed font-medium">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{delivery_option}</span>
                            </div>
                            {hasDiscount ? (
                                <>
                                    <span className="text-xl font-black text-blush-rose">
                                        RWF {parseFloat(final_price).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-gray-400 line-through font-bold">
                                        RWF {parseFloat(price).toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-black text-night-bordeaux">
                                    RWF {parseFloat(price).toLocaleString()}
                                </span>
                            )}
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-night-bordeaux text-white flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:bg-blush-rose">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
