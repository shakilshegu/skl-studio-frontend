import React from 'react';
import { 
  Camera, 
  Users, 
  MapPin, 
  Award, 
  Heart, 
  Star, 
  Shield, 
  Zap, 
  Target,
  CheckCircle,
  Quote,
  Play,
  ArrowRight,
  Globe,
  Clock,
  Sparkles
} from 'lucide-react';

const page = () => {
  const stats = [
    { number: "50K+", label: "Happy Clients", icon: Users },
    { number: "200+", label: "Partner Studios", icon: Camera },
    { number: "25+", label: "Cities Covered", icon: MapPin },
    { number: "99%", label: "Client Satisfaction", icon: Heart }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Reliability",
      description: "We ensure every studio and photographer on our platform meets the highest standards of professionalism and quality."
    },
    {
      icon: Sparkles,
      title: "Creative Excellence",
      description: "Connecting you with the most talented creative professionals who bring your vision to life with artistic brilliance."
    },
    {
      icon: Zap,
      title: "Seamless Experience",
      description: "Our platform makes booking studios and photographers as easy as a few clicks, saving you time and hassle."
    },
    {
      icon: Target,
      title: "Perfect Matches",
      description: "Our smart matching system connects you with the ideal creative space and talent for your specific needs."
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616c6c8f78b?w=300&h=300&fit=crop&crop=face",
      description: "Visionary leader with 15+ years in creative industry"
    },
    {
      name: "Arjun Mehta",
      role: "Head of Technology",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Tech innovator building seamless booking experiences"
    },
    {
      name: "Kavya Reddy",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Award-winning photographer and creative strategist"
    },
    {
      name: "Rahul Singh",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Operations expert ensuring smooth platform experiences"
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Aloka was founded with a vision to democratize access to professional creative spaces"
    },
    {
      year: "2021",
      title: "First 100 Studios",
      description: "Onboarded our first 100 partner studios across major Indian cities"
    },
    {
      year: "2022",
      title: "Technology Innovation",
      description: "Launched our AI-powered matching system and mobile app"
    },
    {
      year: "2023",
      title: "National Expansion",
      description: "Expanded to 25+ cities with 10,000+ successful bookings"
    },
    {
      year: "2024",
      title: "Industry Leadership",
      description: "Became India's most trusted platform for creative space bookings"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary via-purple-900 to-brand-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgNiA2LTYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            {/* Aloka Logo */}
            <div className="mb-8">
              <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent mb-4">
                SKL
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-brand-accent to-brand-secondary mx-auto rounded-full"></div>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-bold mb-6">
              Illuminating Creative Possibilities
            </h2>
            <p className="text-xl sm:text-2xl text-brand-100 mb-8 max-w-3xl mx-auto">
              India's premier platform connecting creative minds with extraordinary spaces. 
              Where every vision finds its perfect stage.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story: From Vision to Reality
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-brand-primary">SKL</strong> was born from a simple yet powerful belief: 
                  every creative has the right to access world-class facilities and bring their artistic vision to life.
                </p>
                <p>
                  Founded in 2020 by a team of passionate creatives and technology enthusiasts, we recognized the gap 
                  between talented artists and premium creative spaces. Traditional booking processes were complex, 
                  expensive, and often inaccessible to emerging talent.
                </p>
                <p>
                  Today, SKL stands as India's most trusted platform, having facilitated thousands of successful 
                  collaborations between artists and studios. We've democratized access to professional creative 
                  infrastructure, making it possible for anyone with a vision to create something extraordinary.
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-4">
                <button className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2">
                  <span>Learn More</span>
                  <ArrowRight size={16} />
                </button>
                <div className="flex items-center gap-2 text-brand-primary">
                  <Globe size={20} />
                  <span className="font-medium">Available across India</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=600&h=400&fit=crop" 
                  alt="Creative studio space"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-brand-primary text-white p-6 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-sm opacity-90">Platform Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the experience we create for our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="bg-brand-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                    <IconComponent className="text-brand-primary group-hover:text-white transition-colors" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Milestones that shaped Aloka into what it is today
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start gap-8">
                  {/* Timeline dot */}
                  <div className="hidden md:flex w-16 h-16 bg-brand-primary rounded-full items-center justify-center text-white font-bold text-sm relative z-10">
                    {milestone.year}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-gray-50 p-8 rounded-2xl">
                    <div className="md:hidden text-brand-primary font-bold text-lg mb-2">{milestone.year}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600 text-lg">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Mission Statement */}
      <section className="py-20 bg-brand-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Quote className="w-16 h-16 mx-auto mb-8 opacity-50" />
          <blockquote className="text-2xl sm:text-3xl font-light leading-relaxed mb-8">
            "To create a world where every creative vision has access to the perfect space, 
            tools, and community needed to bring it to life. We believe that great art should 
            never be limited by lack of resources."
          </blockquote>
          <cite className="text-brand-200 text-lg">— The Aloka Mission</cite>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators who trust Aloka for their creative projects
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-brand-primary text-white px-8 py-4 rounded-xl hover:bg-brand-700 transition-colors font-semibold text-lg">
              Find Your Perfect Studio
            </button>
            <button className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-xl hover:bg-brand-primary hover:text-white transition-colors font-semibold text-lg">
              List Your Studio
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span>Verified Studios</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span>Instant Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;