'use client'
import React, { useState } from 'react';
import { 
  Camera, 
  Users, 
  Building, 
  Video,
  Star,
  TrendingUp,
  Shield,
  Clock,
  IndianRupee,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Globe,
  Zap,
  Target,
  Award,
  Play,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Handshake,
  Rocket
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const BecomePartnerPage = () => {
  const [selectedPartnerType, setSelectedPartnerType] = useState('freelancer');

  const partnerTypes = [
    {
      id: 'freelancer',
      title: 'Freelancer',
      subtitle: 'Photographers & Videographers',
      icon: Camera,
      color: 'from-blue-500 to-purple-600',
      description: 'Showcase your talent and get booked by clients across India',
      features: ['Flexible scheduling', 'Direct client communication', 'Portfolio showcase', 'Instant payments'],
    },
    {
      id: 'videographer',
      title: 'Videographer',
      subtitle: 'Video Production Specialists',
      icon: Video,
      color: 'from-red-500 to-pink-600',
      description: 'Connect with clients needing professional video services',
      features: ['Equipment listings', 'Project management', 'Client reviews', 'Secure payments'],
    },
    {
      id: 'studio',
      title: 'Studio Owner',
      subtitle: 'Creative Space Providers',
      icon: Building,
      color: 'from-green-500 to-emerald-600',
      description: 'List your studio and maximize bookings with our platform',
      features: ['24/7 availability management', 'Automated booking system', 'Revenue analytics', 'Marketing support'],
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Your Revenue',
      description: 'Earn up to 3x more with our intelligent matching system and premium client base'
    },
    {
      icon: Globe,
      title: 'Pan-India Reach',
      description: 'Access clients from 25+ cities across India and expand your business nationwide'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Protected payments, verified clients, and 24/7 support for all your bookings'
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Real-time booking alerts and quick client communication through our platform'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your performance, earnings, and growth with detailed insights'
    },
    {
      icon: Award,
      title: 'Recognition Program',
      description: 'Get featured as top performers and earn badges for excellent service'
    }
  ];


  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create your profile in just 3 minutes",
      icon: Users
    },
    {
      step: 2,
      title: "Verification",
      description: "Quick verification process within 24 hours",
      icon: Shield
    },
    {
      step: 3,
      title: "Start Earning",
      description: "Receive bookings and start growing your business",
      icon: TrendingUp
    }
  ];
const router=  useRouter()
  const handleJoinClick = () => {
    router.push('/partner/login');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary via-purple-900 to-brand-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-brand-accent/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-brand-secondary/15 rounded-full blur-lg"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              {/* <Rocket className="text-brand-accent" size={20} /> */}
              <span className="text-brand-100 font-medium">Revolutionary Partnership Program</span>
            </div>
            
            <h1 className="text-4xl sm:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="text-brand-accent">Creative Business</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-brand-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join India's fastest-growing creative platform and unlock unlimited earning potential. 
              <span className="text-brand-accent font-semibold"> We only take commission when you earn!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button onClick={handleJoinClick } className="bg-brand-accent text-white px-8 py-4 rounded-xl hover:bg-pink-600 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3 transform hover:scale-105 shadow-xl">
                {/* <Sparkles size={20} /> */}
                Join the Revolution
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Path to Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the partnership that fits your creative expertise and start earning immediately
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {partnerTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    selectedPartnerType === type.id 
                      ? 'transform -translate-y-4 scale-105' 
                      : 'hover:-translate-y-2'
                  }`}
                  onClick={() => setSelectedPartnerType(type.id)}
                >
                  <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-brand-primary/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="text-white" size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-brand-primary font-medium">{type.subtitle}</p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-center mb-8 leading-relaxed">
                      {type.description}
                    </p>
                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="text-brand-primary flex-shrink-0" size={16} />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2 group">
                      <span>Join as {type.title}</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Aloka Partnership?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful partners who are already transforming their creative careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="bg-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of partners earning with Aloka
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <IconComponent className="text-white" size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-accent text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join India's most trusted creative platform and start earning more today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-brand-primary px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors font-bold text-lg flex items-center justify-center gap-3 transform hover:scale-105">
              <Handshake size={20} />
              Start Partnership
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white hover:text-brand-primary transition-colors font-bold text-lg flex items-center justify-center gap-3">
              <Phone size={20} />
              Call: +91 80 4567 8900
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Mail size={16} />
              <span className="text-sm">partners@aloka.in</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar size={16} />
              <span className="text-sm">Schedule a Demo</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield size={16} />
              <span className="text-sm">100% Secure Platform</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomePartnerPage;