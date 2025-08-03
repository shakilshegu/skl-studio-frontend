"use client"
import React, { useState } from "react";
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Send, 
  Clock,
  Globe,
  Star,
  CheckCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacyAgreed: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our friendly team is here to help",
      contact: "hello@SKL.com",
      action: "mailto:hello@SKL.com",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Start new chat",
      action: "#",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      description: "Come say hello at our HQ",
      contact: "Hyderabad, Telangana, India",
      action: "#",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm IST",
      contact: "+91 98765 43210",
      action: "tel:+919876543210",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    { icon: Clock, text: "24/7 Support Available" },
    { icon: Globe, text: "Serving 50+ Cities" },
    { icon: Star, text: "4.9/5 Customer Rating" },
    { icon: CheckCircle, text: "99% Issue Resolution" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-purple-800 to-pink-800 py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0 bg-white"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)',
              backgroundSize: '60px 60px'
            }}
          ></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300 bg-opacity-20 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300 bg-opacity-20 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-md rounded-full border border-white border-opacity-20 text-white mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">We are Here to Help</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            <span className="block">Get in Touch with</span>
            <span className="block bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              Our Team
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-12">
            Have questions about booking studios? Need support? We would love to hear from you and help make your creative vision come to life.
          </p>

          {/* Trust Features */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white text-opacity-80">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-pink-400" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side - Contact Methods */}
          <div className="space-y-8">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Multiple Ways to 
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Connect</span>
              </h2>
              <p className="text-lg text-gray-600">
                Choose the method that works best for you. Our team is ready to assist with any questions or support you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <div key={index} className="group cursor-pointer">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                      <div className={`w-14 h-14 bg-gradient-to-r ${method.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{method.description}</p>
                      
                      <a 
                        href={method.action}
                        className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-pink-600 transition-colors group-hover:gap-3"
                      >
                        <span>{method.contact}</span>
                        <ArrowRight className="w-4 h-4 transition-transform" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mt-12">
              <h3 className="text-2xl font-bold mb-6">Why Choose SKL Support?</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">&lt; 2hrs</div>
                  <div className="text-purple-100">Average Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">98%</div>
                  <div className="text-purple-100">Customer Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-purple-100">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10K+</div>
                  <div className="text-purple-100">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
              <p className="text-gray-600">
                Fill out the form below and we will get back to you within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                  placeholder="you@company.com"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Support</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 resize-vertical"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              {/* Privacy Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacyAgreed"
                  name="privacyAgreed"
                  checked={formData.privacyAgreed}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-4 h-4 text-purple-600 bg-gray-50 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="privacyAgreed" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-purple-600 hover:text-pink-600 font-semibold">
                    privacy policy
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-purple-600 hover:text-pink-600 font-semibold">
                    terms of service
                  </a>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!formData.privacyAgreed}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>

              {/* Response Time */}
              <p className="text-center text-sm text-gray-500 mt-4">
                We typically respond within 2 hours during business hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Cannot find what you are looking for? Contact our support team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {[
              {
                question: "How quickly will I get a response?",
                answer: "We typically respond to all inquiries within 2 hours during business hours (9 AM - 6 PM IST)."
              },
              {
                question: "What information should I include?",
                answer: "Please include your booking ID, detailed description of the issue, and any relevant screenshots."
              },
              {
                question: "Do you offer phone support?",
                answer: "Yes, we offer phone support for urgent matters. Call us at +91 98765 43210 during business hours."
              },
              {
                question: "Can I get help with booking issues?",
                answer: "Absolutely! Our team can help with booking modifications, cancellations, and payment issues."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;