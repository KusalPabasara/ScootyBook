import React from 'react';
import Hero3D from '../components/Hero3D';
import { WeligamaFeatures } from '../components/WeligamaFeatures';
import { TouristInfo } from '../components/Tourism/TouristInfo';
import { FleetShowcase } from '../components/FleetShowcase';
import { CulturalFooter } from '../components/CulturalElements/CulturalFooter';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

      {/* Hero Section with Three.js */}
      <Hero3D />

      {/* Weligama Features Section */}
      <WeligamaFeatures />

      {/* Fleet Showcase */}
      <FleetShowcase />

      {/* Tourist Information */}
      <TouristInfo />

      {/* Cultural Footer */}
      <CulturalFooter />
    </div>
  );
};

export default Home;