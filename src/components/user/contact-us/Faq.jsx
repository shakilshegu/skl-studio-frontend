import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchFaqs } from '@/services/contact.servcie';

const Faq = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch FAQs using TanStack Query
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['user-faqs'],
    queryFn: fetchFaqs,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });

  const faqs = response?.data || [];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'general', name: 'General'},
    { id: 'booking', name: 'Booking'},
    { id: 'payment', name: 'Payment'},
    { id: 'cancellation', name: 'Cancellation'},
    { id: 'technical', name: 'Technical'}
  ];

  // Filter FAQs based on category and search
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Unable to Load FAQs
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're having trouble loading the FAQ content. Please try again later.
          </p>
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Need immediate help?</h3>
            <div className="space-y-2">
              <p className="flex items-center justify-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </p>
              <p className="flex items-center justify-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                support@aloka.com
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No FAQs state
  if (faqs.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            FAQs Coming Soon
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're preparing helpful answers to common questions. Check back soon!
          </p>
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Contact our support team</h3>
            <div className="space-y-2">
              <p className="flex items-center justify-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </p>
              <p className="flex items-center justify-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                support@aloka.com
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-purple-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 mx-auto text-[#892580] mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Cannot find what you are looking for? Contact our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#892580] focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#892580] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">
                Try adjusting your search or category filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {filteredFAQs.map((faq) => (
              <div key={faq._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq._id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                  </div>
                  {expandedFAQ === faq._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {expandedFAQ === faq._id && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Faq;