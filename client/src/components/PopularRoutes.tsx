import React from 'react';
import { motion } from 'framer-motion';

const routes = [
    {
        name: 'Coastal Paradise',
        from: 'Weligama',
        to: 'Mirissa',
        distance: '10 km',
        duration: '30 min',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
        highlights: ['Whale Watching Point', 'Secret Beach', 'Coconut Tree Hill'],
    },
    {
        name: 'Heritage Trail',
        from: 'Weligama',
        to: 'Galle Fort',
        distance: '35 km',
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
        highlights: ['Dutch Fort', 'Unawatuna Beach', 'Colonial Architecture'],
    },
    {
        name: 'Hill Country Adventure',
        from: 'Weligama',
        to: 'Ella',
        distance: '150 km',
        duration: '5 hours',
        image: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=600',
        highlights: ['Nine Arch Bridge', 'Tea Plantations', 'Ravana Falls'],
    },
];

const PopularRoutes: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <motion.span
                            className="inline-block bg-[#1A1A1A] text-white font-bold text-xs tracking-widest uppercase px-4 py-2 rounded mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            Explore Sri Lanka
                        </motion.span>
                        <motion.h2
                            className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight uppercase"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Popular Routes
                        </motion.h2>
                    </div>
                    <motion.a
                        href="#"
                        className="mt-4 md:mt-0 text-[#EDC14F] font-bold text-sm tracking-wider uppercase hover:underline"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        View All Routes →
                    </motion.a>
                </div>

                {/* Routes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {routes.map((route, index) => (
                        <motion.div
                            key={index}
                            className="group relative rounded-lg overflow-hidden h-[400px] cursor-pointer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Background Image */}
                            <img
                                src={route.image}
                                alt={route.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex items-center gap-2 text-[#EDC14F] text-sm font-bold uppercase tracking-wider mb-2">
                                    <span>{route.from}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                    <span>{route.to}</span>
                                </div>

                                <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-3">
                                    {route.name}
                                </h3>

                                <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        {route.distance}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {route.duration}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {route.highlights.map((highlight, i) => (
                                        <span
                                            key={i}
                                            className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularRoutes;
