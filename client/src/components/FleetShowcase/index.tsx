import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const FleetShowcase: React.FC = () => {
    const bikes = [
        {
            name: 'Honda Dio',
            category: 'Scooter',
            price: '2,500',
            image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500',
            features: ['Automatic', '110cc', 'Fuel Efficient'],
            bestFor: 'Beach hopping & Weligama town',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            name: 'Honda Shine',
            category: 'Standard Bike',
            price: '3,000',
            image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=500',
            features: ['125cc', 'Reliable', 'Comfortable'],
            bestFor: 'Galle Fort & coastal roads',
            color: 'from-purple-500 to-pink-500',
        },
        {
            name: 'Hero XPulse',
            category: 'Adventure',
            price: '4,500',
            image: 'https://images.unsplash.com/photo-1599819177795-7d8bf8b3539d?w=500',
            features: ['200cc', 'Off-road', 'Adventure Ready'],
            bestFor: 'Hill country & long rides',
            color: 'from-orange-500 to-red-500',
        },
        {
            name: 'Electric Scooter',
            category: 'Eco-Friendly',
            price: '3,500',
            image: 'https://images.unsplash.com/photo-1588789311100-530863179b26?w=500',
            features: ['Electric', 'Silent', 'Eco-Friendly'],
            bestFor: 'Short coastal trips',
            color: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold mb-4">
                        🏍️ Premium Fleet
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Choose Your Perfect Ride
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        From city scooters to adventure bikes, we have the perfect ride for your Sri Lankan journey.
                    </p>
                </motion.div>

                {/* Bikes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {bikes.map((bike, index) => (
                        <motion.div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 card-hover"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={bike.image}
                                    alt={bike.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${bike.color} opacity-20 group-hover:opacity-30 transition-opacity`} />

                                {/* Category Badge */}
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-900 dark:text-white">
                                    {bike.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {bike.name}
                                </h3>

                                {/* Price */}
                                <div className="flex items-baseline mb-4">
                                    <span className="text-3xl font-bold text-orange-500">
                                        LKR {bike.price}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">/day</span>
                                </div>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {bike.features.map((feature, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Best For */}
                                <div className="flex items-start gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{bike.bestFor}</span>
                                </div>

                                {/* CTA Button */}
                                <Link
                                    to="/scooties"
                                    className="block w-full text-center bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg"
                                >
                                    Book Now →
                                </Link>
                            </div>

                            {/* Hover Decoration */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <span className="text-white text-sm">🔥</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All CTA */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Link
                        to="/scooties"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                        View All Bikes
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FleetShowcase;
