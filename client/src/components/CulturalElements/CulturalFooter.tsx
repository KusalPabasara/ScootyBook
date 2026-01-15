import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CulturalFooter: React.FC = () => {
    return (
        <footer className="relative bg-slate-900 dark:bg-slate-950 text-slate-300 py-16 border-t border-slate-800 overflow-hidden">
            {/* Cultural Pattern Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="lotus-divider h-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Top Section with Logo and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <span className="text-4xl">🏍️</span>
                            <span className="font-bold text-2xl text-white">
                                Scooty<span className="text-orange-500">Book</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            Your trusted partner for bike rentals in Weligama, Sri Lanka. Explore paradise on two wheels.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🇱🇰</span>
                            <span className="text-sm font-semibold text-orange-400">Proudly Sri Lankan</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <span>🔗</span>
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-orange-400 transition flex items-center gap-2">
                                    <span>→</span> Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/scooties" className="hover:text-orange-400 transition flex items-center gap-2">
                                    <span>→</span> Browse Bikes
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-orange-400 transition flex items-center gap-2">
                                    <span>→</span> Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-orange-400 transition flex items-center gap-2">
                                    <span>→</span> Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Tourist Info */}
                    <div>
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <span>🧳</span>
                            For Tourists
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-orange-400 transition cursor-pointer flex items-center gap-2">
                                <span>→</span> Driving Permits
                            </li>
                            <li className="hover:text-orange-400 transition cursor-pointer flex items-center gap-2">
                                <span>→</span> Safety Guidelines
                            </li>
                            <li className="hover:text-orange-400 transition cursor-pointer flex items-center gap-2">
                                <span>→</span> Popular Routes
                            </li>
                            <li className="hover:text-orange-400 transition cursor-pointer flex items-center gap-2">
                                <span>→</span> Travel Tips
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <span>📍</span>
                            Contact Us
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>Beach Road, Weligama<br />Sri Lanka 81700</span>
                            </li>
                            <li>
                                <a href="tel:+94771234567" className="flex items-center gap-2 hover:text-orange-400 transition">
                                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    +94 77 123 4567
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@scootybook.lk" className="flex items-center gap-2 hover:text-orange-400 transition">
                                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    info@scootybook.lk
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/94771234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-orange-400 transition"
                                >
                                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp Us 24/7
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Cultural Divider */}
                <div className="border-t border-slate-800 pt-8 mb-8">
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="flex items-center gap-2">
                            🏖️ Weligama
                        </span>
                        <span className="flex items-center gap-2">
                            🌊 Mirissa
                        </span>
                        <span className="flex items-center gap-2">
                            🏛️ Galle Fort
                        </span>
                        <span className="flex items-center gap-2">
                            🐋 Whale Watching
                        </span>
                        <span className="flex items-center gap-2">
                            🏄 Surfing
                        </span>
                        <span className="flex items-center gap-2">
                            🍃 Tea Country
                        </span>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <span>© 2024 ScootyBook.</span>
                        <span className="hidden md:inline">•</span>
                        <span>Made with ❤️ in Sri Lanka</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-orange-400 transition">Privacy Policy</a>
                        <a href="#" className="hover:text-orange-400 transition">Terms of Service</a>
                        <a href="#" className="hover:text-orange-400 transition">Sitemap</a>
                    </div>
                </div>

                {/* Decorative Sri Lankan Elements */}
                <div className="absolute bottom-4 right-4 text-6xl opacity-10 pointer-events-none">
                    🌴
                </div>
                <div className="absolute top-4 left-4 text-4xl opacity-10 pointer-events-none">
                    🪷
                </div>
            </div>

            {/* Batik Pattern Overlay */}
            <div className="absolute inset-0 batik-pattern opacity-5 pointer-events-none" />
        </footer>
    );
};

export default CulturalFooter;
