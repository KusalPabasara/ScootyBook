import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[80vh] bg-primary">
        <div className="hero-content text-center text-primary-content">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="6" cy="18" r="3" strokeWidth="2" />
                <circle cx="18" cy="18" r="3" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18h12M9 18V8l3-2h5l2 4M14 10h4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h2v2h-2z" />
              </svg>
            </div>
            <h1 className="text-6xl font-bold mb-6">
              ScootyBook
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Rent scooties for your daily commute or weekend adventures.
              Find the perfect ride near you with our easy-to-use platform!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/scooties" className="btn btn-secondary btn-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Scooties
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose ScootyBook?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card bg-base-200 shadow-xl card-hover max-w-sm mx-auto">
              <div className="card-body text-center p-6">
                <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="card-title justify-center mb-4 text-xl">Fast & Easy</h3>
                <p className="text-base-content/70 text-sm leading-relaxed">
                  Book your scooty in minutes with our streamlined process.
                  No complicated forms or lengthy procedures.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl card-hover max-w-sm mx-auto">
              <div className="card-body text-center p-6">
                <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="card-title justify-center mb-4 text-xl">Safe & Secure</h3>
                <p className="text-base-content/70 text-sm leading-relaxed">
                  All scooties are verified and maintained.
                  Your safety and security are our top priorities.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl card-hover max-w-sm mx-auto">
              <div className="card-body text-center p-6">
                <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="card-title justify-center mb-4 text-xl">Best Prices</h3>
                <p className="text-base-content/70 text-sm leading-relaxed">
                  Competitive rates for hourly and daily rentals.
                  Get the best value for your money.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ScootyBook for their transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scooties" className="btn btn-secondary btn-lg">
              Browse Available Scooties
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Create Your Account
            </Link>
          </div>
        </div>
      </div>

      {/* Store Location Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16">Visit Our Store</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Store Information */}
            <div className="space-y-6">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl mb-4">ScootyBook Store</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Address</p>
                        <p className="text-base-content/70">123 Main Street, Colombo 03, Sri Lanka</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-base-content/70">+94 11 234 5678</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Hours</p>
                        <p className="text-base-content/70">Mon-Sun: 8:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <a 
                      href="https://maps.google.com/?q=123+Main+Street+Colombo+03+Sri+Lanka" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-lg w-full"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Google Maps Embed */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-0">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8!2d79.8!3d6.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTQnMDAuMCJOIDc5wrA0OCcwMC4wIkU!5e0!3m2!1sen!2slk!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ScootyBook Store Location"
                  ></iframe>
                </div>
                <div className="p-4">
                  <p className="text-sm text-center text-base-content/70">
                    Interactive map showing our store location
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;