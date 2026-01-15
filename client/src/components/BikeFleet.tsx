import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Bike {
    id: string;
    name: string;
    brand: string;
    image: string;
    pricePerDay: number;
    location: string;
    category: string;
}

const bikes: Bike[] = [
    {
        id: '1',
        name: 'Honda Dio',
        brand: 'HONDA',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500',
        pricePerDay: 2500,
        location: 'Weligama',
        category: 'Scooter',
    },
    {
        id: '2',
        name: 'Honda Shine 125',
        brand: 'HONDA',
        image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=500',
        pricePerDay: 3000,
        location: 'Weligama',
        category: 'Standard',
    },
    {
        id: '3',
        name: 'Hero XPulse 200',
        brand: 'HERO',
        image: 'https://images.unsplash.com/photo-1599819177795-7d8bf8b3539d?w=500',
        pricePerDay: 4500,
        location: 'Weligama',
        category: 'Adventure',
    },
    {
        id: '4',
        name: 'TVS Apache RTR',
        brand: 'TVS',
        image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?w=500',
        pricePerDay: 3500,
        location: 'Weligama',
        category: 'Sport',
    },
    {
        id: '5',
        name: 'Yamaha FZ-S',
        brand: 'YAMAHA',
        image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500',
        pricePerDay: 4000,
        location: 'Weligama',
        category: 'Sport',
    },
    {
        id: '6',
        name: 'Royal Enfield Classic',
        brand: 'ROYAL ENFIELD',
        image: 'https://images.unsplash.com/photo-1558980664-1db506751c6c?w=500',
        pricePerDay: 5500,
        location: 'Weligama',
        category: 'Classic',
    },
];

const BikeFleet: React.FC = () => {
    return (
        <section className="py-20 bg-[#F5F5F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.span
                        className="inline-block bg-[#EDC14F] text-black font-bold text-xs tracking-widest uppercase px-4 py-2 rounded mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Our Fleet
                    </motion.span>
                    <motion.h2
                        className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight uppercase"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Choose Your Ride
                    </motion.h2>
                    <motion.p
                        className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Premium scooters and motorcycles maintained to the highest standards
                    </motion.p>
                </div>

                {/* Bike Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bikes.map((bike, index) => (
                        <motion.div
                            key={bike.id}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img
                                    src={bike.image}
                                    alt={bike.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#1A1A1A] text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded">
                                        {bike.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    ScootyBook {bike.location}
                                </div>

                                <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-wide mb-2">
                                    {bike.brand} {bike.name}
                                </h3>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <span className="text-2xl font-black text-[#1A1A1A]">
                                            LKR {bike.pricePerDay.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 text-sm ml-1">/ day</span>
                                    </div>
                                    <Link
                                        to="/scooties"
                                        className="bg-[#EDC14F] hover:bg-[#d4ac3d] text-black font-bold text-xs tracking-wider uppercase px-4 py-2 rounded transition-colors"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/scooties"
                        className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm tracking-widest uppercase px-8 py-4 rounded transition-colors"
                    >
                        View All Motorcycles
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BikeFleet;
