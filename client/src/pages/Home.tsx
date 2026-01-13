import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.36 9.36l.57 4.32H5.07l.57-4.32M6.9 18c-.66 0-1.2.54-1.2 1.2S6.24 20.4 6.9 20.4s1.2-.54 1.2-1.2-.54-1.2-1.2-1.2m10.2 0c-.66 0-1.2.54-1.2 1.2s.54 1.2 1.2 1.2 1.2-.54 1.2-1.2-.54-1.2-1.2-1.2M5 9h14V6H5v3z"/>
              </svg>
              <span className="font-bold text-2xl text-slate-900 dark:text-white">
                Scooty<span className="text-sky-600">Book</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 font-medium transition">Home</a>
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 font-medium transition">Features</a>
              <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 font-medium transition">Pricing</a>
              <Link to="/login" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg transition">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Tropical beach road in Weligama" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40 dark:from-slate-950/90 dark:to-slate-900/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                <span className="text-sm font-medium tracking-wide">Available Now in Weligama</span>
              </div>
              
              <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
                Explore Weligama on <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">Two Wheels</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg leading-relaxed">
                Skip the traffic and feel the breeze. Premium scooters delivered directly to your hotel or villa. Easy booking, honest prices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/scooties" className="inline-flex justify-center items-center bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-sky-600/40 hover:shadow-sky-600/60 transform hover:-translate-y-1">
                  Browse Bikes
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a href="tel:+94771234567" className="inline-flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:border-white">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 lg:ml-auto w-full max-w-md transform transition-all hover:scale-[1.02]">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 text-sky-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21H3V5h18m-7-4v2M10 3v2M7 11h10M7 15h10M7 19h4" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Quick Booking
              </h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pickup Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Return Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <Link to="/scooties" className="w-full bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg text-center block">
                  Search Bikes
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose ScootyBook?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need for a perfect rental experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-sky-50 dark:from-sky-950/20 to-transparent border border-sky-100 dark:border-sky-900 hover:border-sky-300 dark:hover:border-sky-700 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Lightning Fast</h3>
                <p className="text-slate-600 dark:text-slate-400">Book your bike in just 60 seconds. No paperwork, no hassle.</p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-sky-50 dark:from-sky-950/20 to-transparent border border-sky-100 dark:border-sky-900 hover:border-sky-300 dark:hover:border-sky-700 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Verified Fleet</h3>
                <p className="text-slate-600 dark:text-slate-400">All bikes are regularly maintained and safety checked.</p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-sky-50 dark:from-sky-950/20 to-transparent border border-sky-100 dark:border-sky-900 hover:border-sky-300 dark:hover:border-sky-700 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-12C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Best Prices</h3>
                <p className="text-slate-600 dark:text-slate-400">Competitive rates for daily or hourly rentals. Transparent pricing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-sky-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Explore Weligama?</h2>
          <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">Start your adventure today with our premium scooter rental service.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scooties" className="bg-white hover:bg-slate-50 text-sky-600 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg">
              Browse Scooters
            </Link>
            <Link to="/register" className="bg-sky-700 hover:bg-sky-800 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all border-2 border-sky-400">
              Create Account
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.36 9.36l.57 4.32H5.07l.57-4.32M6.9 18c-.66 0-1.2.54-1.2 1.2S6.24 20.4 6.9 20.4s1.2-.54 1.2-1.2-.54-1.2-1.2-1.2m10.2 0c-.66 0-1.2.54-1.2 1.2s.54 1.2 1.2 1.2 1.2-.54 1.2-1.2-.54-1.2-1.2-1.2M5 9h14V6H5v3z"/>
                </svg>
                <span className="font-bold text-white">ScootyBook</span>
              </Link>
              <p className="text-sm">Your trusted scooty rental partner in Weligama.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400 transition">Home</a></li>
                <li><a href="#features" className="hover:text-sky-400 transition">Features</a></li>
                <li><Link to="/scooties" className="hover:text-sky-400 transition">Browse Bikes</Link></li>
                <li><a href="#" className="hover:text-sky-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400 transition">About</a></li>
                <li><a href="#" className="hover:text-sky-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-sky-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-sky-400 transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: info@scootybook.com</li>
                <li>Phone: +94 77 123 4567</li>
                <li>Address: Weligama, Sri Lanka</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2024 ScootyBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;