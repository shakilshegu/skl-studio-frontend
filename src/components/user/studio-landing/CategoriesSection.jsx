import React from 'react';
import { Building } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStudioCategories } from '../../../services/studio/studio.service'; 

const CategoriesSection = ({ selectedCategory, setSelectedCategory }) => {
  // Fetch categories from API using service directly in useQuery
  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ['studioCategories'],
    queryFn: getStudioCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });

  // Prepare categories with "All Studios" option
  const allCategories = React.useMemo(() => {
    const apiCategories = categoriesData?.categories || [];
    const categoriesWithImages = apiCategories
      .filter(category => category.isActive)
      .map((category) => ({
        id: category._id,
        name: category.name,
        imageUrl: category.imageUrl
      }));

    // Add "All Studios" as first option
    return [
      { 
        id: 'all', 
        name: 'All Studios', 
        imageUrl: null // No image for "All Studios"
      },
      ...categoriesWithImages
    ];
  }, [categoriesData]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect studio for your creative needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-red-600">
              Failed to load categories. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600">
            Find the perfect studio for your creative needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-6">
          {allCategories.map((category) => {
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group cursor-pointer bg-white rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 border-2 ${
                  selectedCategory === category.id 
                    ? 'border-brand-primary shadow-lg' 
                    : 'border-transparent hover:border-brand-200'
                }`}
              >
                {/* Category Image */}
                {category.imageUrl ? (
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden group-hover:scale-110 transition-transform">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  // "All Studios" fallback
                  <div className="bg-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Building className="text-white" size={28} />
                  </div>
                )}
                
                <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

  