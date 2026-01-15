import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EagleRiderHero: React.FC = () => {
    const navigate = useNavigate();
    const [pickupDate, setPickupDate] = useState('');
    const [dropoffDate, setDropoffDate] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/scooties');
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Video/Image Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            </div>

            {/* Navigation */}
            <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-4">
                <Link to="/" className="flex items-center gap-3">
                    <span className="text-3xl">🏍️</span>
                    <span className="text-2xl font-black text-white tracking-wider">
                        SCOOTY<span className="text-[#EDC14F]">BOOK</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-white font-semibold text-sm tracking-wider hover:text-[#EDC14F] transition-colors uppercase">
                        Home
                    </Link>
                    <Link to="/scooties" className="text-white font-semibold text-sm tracking-wider hover:text-[#EDC14F] transition-colors uppercase">
                        Rentals
                    </Link>
                    <Link to="/scooties" className="text-white/70 font-semibold text-sm tracking-wider hover:text-[#EDC14F] transition-colors uppercase">
                        Tours
                    </Link>
                    <Link to="/login" className="text-white/70 font-semibold text-sm tracking-wider hover:text-[#EDC14F] transition-colors uppercase">
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-[#EDC14F] text-black font-bold text-sm tracking-wider px-6 py-2.5 rounded hover:bg-[#d4ac3d] transition-colors uppercase"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Tab Toggle */}
                    <div className="inline-flex bg-black/50 backdrop-blur-sm rounded-lg mb-8">
                        <button className="px-8 py-3 text-sm font-bold tracking-widest text-black bg-[#EDC14F] rounded-lg uppercase">
                            Rent
                        </button>
                        <button className="px-8 py-3 text-sm font-bold tracking-widest text-white/70 hover:text-white uppercase transition-colors">
                            Tour
                        </button>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-none mb-6">
                        Your Next<br />
                        <span className="text-[#EDC14F]">Adventure</span><br />
                        Starts Now
                    </h1>

                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 font-light">
                        Welcome to ScootyBook—Sri Lanka's premier scooter and motorcycle rental service.
                        Explore Weligama, Mirissa, and the stunning southern coast on two wheels.
                    </p>
                </motion.div>
            </div>

            {/* Booking Widget - EagleRider Style */}
            <motion.div
                className="relative z-20 w-full bg-white/10 backdrop-blur-lg border-t border-white/20"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <form onSubmit={handleSearch} className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
                        {/* Pick-up Location */}
                        <div className="flex-1 w-full md:border-r border-white/20 px-4">
                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
                                Pick-up Location
                            </label>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#EDC14F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-white font-semibold">Weligama, Sri Lanka</span>
                            </div>
                        </div>

                        {/* Pick-up Date */}
                        <div className="flex-1 w-full md:border-r border-white/20 px-4">
                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
                                Pick-up Date
                            </label>
                            <input
                                type="date"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                className="w-full bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                            />
                        </div>

                        {/* Drop-off Date */}
                        <div className="flex-1 w-full md:border-r border-white/20 px-4">
                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
                                Drop-off Date
                            </label>
                            <input
                                type="date"
                                value={dropoffDate}
                                onChange={(e) => setDropoffDate(e.target.value)}
                                className="w-full bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                            />
                        </div>

                        {/* Motorcycle Count */}
                        <div className="flex-1 w-full px-4">
                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
                                Motorcycles
                            </label>
                            <select className="w-full bg-transparent text-white font-semibold focus:outline-none cursor-pointer">
                                <option value="1" className="text-black">1 Motorcycle</option>
                                <option value="2" className="text-black">2 Motorcycles</option>
                                <option value="3" className="text-black">3 Motorcycles</option>
                                <option value="4" className="text-black">4+ Motorcycles</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="w-full md:w-auto px-4">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-[#EDC14F] hover:bg-[#d4ac3d] text-black font-bold text-sm tracking-widest uppercase px-8 py-4 rounded transition-colors"
                            >
                                Check Availability
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EagleRiderHero;
