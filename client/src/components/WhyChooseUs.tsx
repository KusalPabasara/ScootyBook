import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'FULLY INSURED',
        description: 'Comprehensive insurance coverage included with every rental for your peace of mind.',
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: 'PREMIUM MAINTAINED',
        description: 'All motorcycles are serviced to strict factory standards before every rental.',
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'FREE DELIVERY',
        description: 'Free delivery to your hotel or villa anywhere in Weligama and Mirissa.',
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        title: '24/7 SUPPORT',
        description: 'Round-the-clock roadside assistance and customer support whenever you need it.',
    },
];

const WhyChooseUs: React.FC = () => {
    return (
        <section className="py-20 bg-[#1A1A1A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.span
                        className="inline-block border-2 border-[#EDC14F] text-[#EDC14F] font-bold text-xs tracking-widest uppercase px-4 py-2 rounded mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Why ScootyBook
                    </motion.span>
                    <motion.h2
                        className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        The Ultimate<br />
                        <span className="text-[#EDC14F]">Riding Experience</span>
                    </motion.h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="text-center group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#EDC14F]/10 text-[#EDC14F] mb-6 group-hover:bg-[#EDC14F] group-hover:text-black transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-black text-white tracking-wider uppercase mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    className="mt-20 pt-16 border-t border-white/10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl md:text-6xl font-black text-[#EDC14F] mb-2">500+</div>
                            <div className="text-white/60 uppercase text-sm tracking-widest">Happy Riders</div>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black text-[#EDC14F] mb-2">50+</div>
                            <div className="text-white/60 uppercase text-sm tracking-widest">Motorcycles</div>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black text-[#EDC14F] mb-2">5</div>
                            <div className="text-white/60 uppercase text-sm tracking-widest">Star Rating</div>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black text-[#EDC14F] mb-2">24/7</div>
                            <div className="text-white/60 uppercase text-sm tracking-widest">Support</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
