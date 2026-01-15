import React from 'react';
import EagleRiderHero from '../components/EagleRiderHero';
import BikeFleet from '../components/BikeFleet';
import WhyChooseUs from '../components/WhyChooseUs';
import PopularRoutes from '../components/PopularRoutes';
import EagleRiderFooter from '../components/EagleRiderFooter';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Hero Section with Booking Widget */}
      <EagleRiderHero />

      {/* Fleet Section */}
      <BikeFleet />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Popular Routes */}
      <PopularRoutes />

      {/* Footer */}
      <EagleRiderFooter />
    </div>
  );
};

export default Home;