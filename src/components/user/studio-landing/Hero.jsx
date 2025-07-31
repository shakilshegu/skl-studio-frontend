import React from 'react';
import { Search } from 'lucide-react';
import StudioSearch from './StudioSearch';

const HeroSection = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <section className="relative bg-gradient-to-br from-brand-primary via-purple-900 to-brand-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgNiA2LTYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
            Find Your Perfect
            <span className="block text-brand-300">Creative Space</span>
          </h1>
          <p className="text-xl sm:text-2xl text-brand-100 mb-8 max-w-3xl mx-auto">
            Discover and book premium studios for photography, videography, music production, and more
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            {/* <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search for studios, locations, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 bg-white/95 backdrop-blur-sm border-0 shadow-xl focus:outline-none focus:ring-4 focus:ring-brand-300/50 text-lg"
              />
              <button 
                onClick={onSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium"
              >
                Search
              </button>
            </div> */}
            <StudioSearch/>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-300">200+</div>
              <div className="text-brand-100">Studios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-300">50+</div>
              <div className="text-brand-100">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-300">10K+</div>
              <div className="text-brand-100">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-300">4.9★</div>
              <div className="text-brand-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;