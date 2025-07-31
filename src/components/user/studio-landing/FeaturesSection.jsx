import React from 'react';
import { Shield, Zap, Award } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Studios",
      description: "All studios are verified and quality-checked by our team"
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book your perfect studio in just a few clicks"
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive pricing with transparent costs"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600">
            We make studio booking simple, secure, and stress-free
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-brand-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-200 transition-colors">
                  <IconComponent className="text-brand-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;