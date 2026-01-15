import React from 'react';
import { motion } from 'framer-motion';

export const WeligamaFeatures: React.FC = () => {
    const features = [
        {
            icon: '🏖️',
            title: 'Beach Paradise',
            description: 'Ride along pristine beaches from Weligama to Mirissa. Feel the ocean breeze as you cruise the coastal roads.',
            gradient: 'from-cyan-500 to-blue-500',
        },
        {
            icon: '🌊',
            title: 'Surf & Adventure',
            description: 'Perfect for surfers! Quick access to surf spots, whale watching points, and hidden coves.',
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            icon: '🏛️',
            title: 'Cultural Sites',
            description: 'Explore Galle Fort, ancient temples, and colonial architecture. History meets tropical beauty.',
            gradient: 'from-orange-500 to-red-500',
        },
        {
            icon: '🌴',
            title: 'Tropical Routes',
            description: 'Palm-lined roads, coconut groves, and rice paddies. Experience authentic Sri Lankan countryside.',
            gradient: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <section className="py-20 bg-white dark:bg-slate-900 batik-pattern relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 lotus-divider opacity-30" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-semibold mb-4">
                        🇱🇰 Discover Weligama
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Your Gateway to
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                            Southern Sri Lanka
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Weligama is perfectly located for exploring Sri Lanka's stunning southern coast. From surf beaches to ancient forts, adventure awaits.
                    </p>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-200 dark:border-slate-700 card-hover"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                            {/* Icon */}
                            <div className="relative z-10 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Decorative Arrow */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Popular Routes */}
                <motion.div
                    className="mt-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-6">🏍️ Popular Routes from Weligama</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <h4 className="font-bold mb-2">Coastal Paradise</h4>
                                <p className="text-sm text-white/90">Weligama → Mirissa → Matara</p>
                                <p className="text-xs text-white/70 mt-2">45km • 1.5 hours • Beaches & Whale watching</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <h4 className="font-bold mb-2">Heritage Trail</h4>
                                <p className="text-sm text-white/90">Weligama → Galle Fort → Unawatuna</p>
                                <p className="text-xs text-white/70 mt-2">35km • 1 hour • Colonial history & Beaches</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <h4 className="font-bold mb-2">Temple Circuit</h4>
                                <p className="text-sm text-white/90">Weligama → Dondra → Dickwella</p>
                                <p className="text-xs text-white/70 mt-2">50km • 2 hours • Temples & Lighthouses</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WeligamaFeatures;
