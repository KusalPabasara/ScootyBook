import React from 'react';
import { motion } from 'framer-motion';

export const TouristInfo: React.FC = () => {
    const safetyTips = [
        {
            icon: '←',
            title: 'Drive on the Left',
            description: 'Sri Lanka follows left-hand traffic. Take it slow until you adjust.',
        },
        {
            icon: '🪖',
            title: 'Helmet is Mandatory',
            description: 'We provide quality helmets free with every rental. Wear it always!',
        },
        {
            icon: '🌧️',
            title: 'Monsoon Awareness',
            description: 'Check weather before long rides. Roads can be slippery when wet.',
        },
        {
            icon: '🐘',
            title: 'Wildlife Crossings',
            description: 'Elephants, monkeys, and peacocks use these roads too. Stay alert!',
        },
    ];

    const permitInfo = [
        {
            step: '1',
            title: 'We Handle Everything',
            description: 'No need to visit DMT offices. We process your temporary permit.',
        },
        {
            step: '2',
            title: 'Required Documents',
            description: 'Valid passport, home country license, and one photo.',
        },
        {
            step: '3',
            title: 'Ready in 24 Hours',
            description: 'Permit valid for 1-6 months. We deliver to your hotel.',
        },
    ];

    const routes = [
        {
            name: 'Weligama to Mirissa',
            distance: '10 km',
            time: '30 min',
            highlights: '🏖️ Beaches 🐋 Whale Watching 🌅 Sunset Points',
            difficulty: 'Easy',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            name: 'Galle Fort Circuit',
            distance: '35 km',
            time: '1.5 hours',
            highlights: '🏛️ Dutch Fort 🏖️ Unawatuna 📸 Colonial Buildings',
            difficulty: 'Easy',
            color: 'from-purple-500 to-pink-500',
        },
        {
            name: 'Hill Country Adventure',
            distance: '120 km',
            time: '4 hours',
            highlights: '🍃 Tea Plantations ⛰️ Mountains 💎 Waterfalls',
            difficulty: 'Moderate',
            color: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Tourist Guide Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4">
                        📚 Tourist Guide
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Everything You Need to Know
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        First time riding in Sri Lanka? We've got you covered with safety tips, permit info, and the best routes.
                    </p>
                </motion.div>

                {/* Safety Tips */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <span className="text-3xl">🛡️</span>
                        Safety First
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {safetyTips.map((tip, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl border border-slate-200 dark:border-slate-600"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl mb-3">{tip.icon}</div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{tip.title}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{tip.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Permit Information */}
                <motion.div
                    className="mb-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span>📄</span>
                            Driving Permit? We've Got It!
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {permitInfo.map((item, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                        {item.step}
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                                    <p className="text-sm text-white/90">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Recommended Routes */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <span className="text-3xl">🗺️</span>
                        Recommended Routes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {routes.map((route, index) => (
                            <motion.div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-200 dark:border-slate-700 card-hover"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${route.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                <div className="relative z-10">
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{route.name}</h4>

                                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
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
                                            {route.time}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        {route.highlights}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${route.difficulty === 'Easy'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                            }`}>
                                            {route.difficulty}
                                        </span>
                                        <button className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1">
                                            View Map
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Emergency Contacts */}
                <motion.div
                    className="mt-16 bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-2xl">📞</span>
                        Emergency Contacts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Our 24/7 Support:</span>
                            <p className="text-orange-500 font-bold">+94 77 123 4567</p>
                        </div>
                        <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Police Emergency:</span>
                            <p className="text-slate-600 dark:text-slate-400">119</p>
                        </div>
                        <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Hospital (Karapitiya):</span>
                            <p className="text-slate-600 dark:text-slate-400">+94 91 223 4508</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TouristInfo;
