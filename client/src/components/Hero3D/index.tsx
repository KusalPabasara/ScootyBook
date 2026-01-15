import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { WeligamaBeachScene } from './WeligamaBeachScene';
import { AnimatedMotorcycle } from './AnimatedMotorcycle';
import { ParticleSystem } from './ParticleSystem';
import { MovingScooter3D } from './MovingScooter3D';
import { motion } from 'framer-motion';

interface Hero3DProps {
    onLoaded?: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({ onLoaded }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLowPerformance, setIsLowPerformance] = useState(false);

    useEffect(() => {
        // Detect mobile devices
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Performance detection
        const checkPerformance = () => {
            const isSlow = !!(navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
            setIsLowPerformance(isSlow);
        };

        checkMobile();
        checkPerformance();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fallback to 2D on mobile or low-performance devices
    if (isMobile || isLowPerformance) {
        return <Hero2DFallback />;
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Three.js Canvas */}
            <Canvas
                shadows
                className="absolute inset-0"
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    {/* Camera */}
                    <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />

                    {/* Lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1.5}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <pointLight position={[-10, 5, -10]} intensity={0.5} color="#FFA500" />

                    {/* Environment */}
                    <Environment preset="sunset" />
                    <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

                    {/* 3D Scene Components */}
                    <WeligamaBeachScene />
                    <AnimatedMotorcycle />
                    <MovingScooter3D speed={2} height={1} />
                    <ParticleSystem count={isMobile ? 50 : 200} />

                    {/* Controls */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 3}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>

            {/* Content Overlay */}
            <HeroContent />

            {/* Loading Indicator */}
            <LoadingScreen />
        </div>
    );
};

// Fallback 2D version for mobile/low-end devices
const Hero2DFallback: React.FC = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <motion.img
                    src="/images/weligama-beach.jpg"
                    alt="Weligama Beach"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />

                {/* Animated Particles (CSS-based) */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -100],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content Overlay */}
            <HeroContent />
        </div>
    );
};

// Hero Content Overlay
const HeroContent: React.FC = () => {
    return (
        <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="text-white"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        {/* Location Badge */}
                        <motion.div
                            className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                            <span className="text-sm font-medium tracking-wide">Weligama | Mirissa | Unawatuna</span>
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
                            Ride Through{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-orange-300 to-pink-400 animate-gradient">
                                Paradise
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg leading-relaxed">
                            Discover Weligama's coastal beauty, surf beaches, and hidden gems on premium bikes. Your tropical adventure starts here.
                        </p>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-3 mb-8 max-w-md">
                            {[
                                { icon: '🛡️', text: 'Insurance Included' },
                                { icon: '🏍️', text: 'Premium Fleet' },
                                { icon: '🚚', text: 'Free Hotel Delivery' },
                                { icon: '📞', text: '24/7 Support' },
                            ].map((badge, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                                >
                                    <span className="text-lg">{badge.icon}</span>
                                    <span className="text-sm font-medium">{badge.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.a
                                href="/scooties"
                                className="inline-flex justify-center items-center bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:-translate-y-1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Browse Bikes
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </motion.a>
                            <motion.a
                                href="https://wa.me/94771234567"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:border-white"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* Quick Booking Card */}
                    <motion.div
                        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 lg:ml-auto w-full max-w-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <svg className="w-6 h-6 text-orange-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 21H3V5h18m-7-4v2M10 3v2M7 11h10M7 15h10M7 19h4" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Quick Booking
                        </h3>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">Pickup Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none backdrop-blur-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">Return Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none backdrop-blur-sm"
                                />
                            </div>
                            <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg text-center">
                                Search Bikes →
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="flex flex-col items-center text-white/70">
                    <span className="text-sm mb-2">Scroll to Explore</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </motion.div>
        </div>
    );
};

// Loading Screen
const LoadingScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            style={{ pointerEvents: 'none' }}
        >
            <div className="text-center">
                <motion.div
                    className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-white text-lg font-semibold">Loading Paradise...</p>
            </div>
        </motion.div>
    );
};

export default Hero3D;
