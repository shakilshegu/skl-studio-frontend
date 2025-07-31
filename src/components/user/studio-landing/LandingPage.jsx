
'use client'
import { useState } from 'react';
import HeroSection from './Hero';
import CategoriesSection from './CategoriesSection';
import FeaturesSection from './FeaturesSection';
import StudiosSection from './StudiosSection';
import CTASection from './CTASection';

const StudioBookingLandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');



  return (
    <div className="min-h-screen bg-white">
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <CategoriesSection 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      <FeaturesSection />
      
      <StudiosSection 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      <CTASection 
      />
    </div>
  );
};

export default StudioBookingLandingPage;