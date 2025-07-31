import React from 'react';

const CTASection = ({ onStartBrowsing, onListStudio }) => {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Book Your Perfect Studio?
        </h2>
        <p className="text-xl mb-8 text-brand-100">
          Join thousands of satisfied customers who found their ideal creative space
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onStartBrowsing}
            className="bg-white text-brand-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Browsing
          </button>
          <button 
            onClick={onListStudio}
            className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-brand-primary transition-colors font-semibold"
          >
            List Your Studio
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;