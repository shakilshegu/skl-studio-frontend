'use client';
import React, { useState } from "react";
import { 
  Camera, 
  Clock, 
  Shield, 
  Users, 
  Headphones, 
  Zap, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Play
} from "lucide-react";

const featuresData = [
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Professional Equipment",
    description: "Access to high-end cameras, lighting setups, and studio equipment. Professional-grade gear for photography, videography, and content creation with 4K capabilities and premium accessories.",
    highlights: ["4K Cameras", "Pro Lighting", "Audio Equipment"],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Flexible Booking",
    description: "Book studios by the hour, day, or month with instant confirmation. Easy rescheduling, competitive pricing, and 24/7 availability to fit your creative schedule and project needs.",
    highlights: ["Instant Booking", "Flexible Hours", "Easy Rescheduling"],
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure & Reliable",
    description: "Safe, insured studios with secure payment processing and equipment protection. Professional-grade security systems and reliable infrastructure for your peace of mind.",
    highlights: ["Secure Payment", "Insured Equipment", "24/7 Security"],
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100"
  }
];

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#892580]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#892580]/3 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#892580]/10 text-[#892580] rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Why Choose Aloka
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for 
            <span className="text-[#892580]"> Creative Success</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            From professional equipment to expert support, we provide all the tools and services you need to bring your creative vision to life in our premium studio spaces.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${feature.hoverColor}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon Container */}
              <div className={`relative flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <div className={`text-transparent bg-gradient-to-br ${feature.color} bg-clip-text`}>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#892580] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More Button */}
                <button className="inline-flex items-center gap-2 text-[#892580] font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-2xl overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${feature.color} transition-all duration-500 ${
                    hoveredIndex === index ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Corner Accent */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                <div className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#892580] rounded-full transform -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#892580] rounded-full transform translate-x-20 translate-y-20"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#892580]/10 text-[#892580] rounded-full text-sm font-medium mb-6">
              <Play className="w-4 h-4" />
              Ready to Get Started?
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Experience the Aloka Difference Today
            </h3>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of creative professionals who trust Aloka for their studio needs. 
              Book your perfect studio space and bring your vision to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#892580] text-white font-semibold rounded-xl hover:bg-[#7a2073] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span>Book Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </section>
  );
};

export default Features;