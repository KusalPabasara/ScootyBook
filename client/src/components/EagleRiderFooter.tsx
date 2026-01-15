import React from 'react';
import { Link } from 'react-router-dom';

const EagleRiderFooter: React.FC = () => {
    return (
        <footer className="bg-[#0D0D0D] text-white">
            {/* CTA Bar */}
            <div className="bg-[#EDC14F] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">
                                Ready to Ride?
                            </h3>
                            <p className="text-black/70 font-medium">
                                Book your motorcycle today and start your adventure
                            </p>
                        </div>
                        <Link
                            to="/scooties"
                            className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm tracking-widest uppercase px-8 py-4 rounded transition-colors"
                        >
                            Browse Motorcycles
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <Link to="/" className="flex items-center gap-3 mb-6">
                                <span className="text-4xl">🏍️</span>
                                <span className="text-2xl font-black tracking-wider">
                                    SCOOTY<span className="text-[#EDC14F]">BOOK</span>
                                </span>
                            </Link>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Sri Lanka's premier motorcycle and scooter rental service.
                                Explore the stunning southern coast on two wheels.
                            </p>
                            <div className="flex items-center gap-2 text-[#EDC14F]">
                                <span className="text-2xl">🇱🇰</span>
                                <span className="font-bold text-sm uppercase tracking-wider">
                                    Proudly Sri Lankan
                                </span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/" className="text-gray-400 hover:text-[#EDC14F] transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/scooties" className="text-gray-400 hover:text-[#EDC14F] transition-colors">
                                        Rentals
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-[#EDC14F] transition-colors">
                                        Tours
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-[#EDC14F] transition-colors">
                                        Routes
                                    </a>
                                </li>
                                <li>
                                    <Link to="/login" className="text-gray-400 hover:text-[#EDC14F] transition-colors">
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Locations */}
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest mb-6">Locations</h4>
                            <ul className="space-y-3">
                                <li className="text-gray-400">Weligama Beach Road</li>
                                <li className="text-gray-400">Mirissa Main Street</li>
                                <li className="text-gray-400">Unawatuna Junction</li>
                                <li className="text-gray-400">Galle Fort Area</li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest mb-6">Contact Us</h4>
                            <ul className="space-y-4">
                                <li>
                                    <a
                                        href="tel:+94771234567"
                                        className="flex items-center gap-3 text-gray-400 hover:text-[#EDC14F] transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-[#EDC14F]" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                        +94 77 123 4567
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@scootybook.lk"
                                        className="flex items-center gap-3 text-gray-400 hover:text-[#EDC14F] transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-[#EDC14F]" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                        info@scootybook.lk
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://wa.me/94771234567"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm tracking-wider uppercase px-6 py-3 rounded transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        WhatsApp
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2024 ScootyBook. All rights reserved. Made with ❤️ in Sri Lanka.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-[#EDC14F] transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-[#EDC14F] transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default EagleRiderFooter;
