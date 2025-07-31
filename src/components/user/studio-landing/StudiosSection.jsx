import React from "react";
import {
  Star,
  MapPin,
  Clock,
  Heart,
  ArrowRight,
  Camera,
  Video,
  Music,
  Palette,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchStudioCategories } from "@/services/PartnerService/studio.service";
import { useQuery } from "@tanstack/react-query";
import { fetchTopRatedStudios } from "@/services/Home/home.service";
import moment from "moment";

const StudiosSection = ({ selectedCategory, setSelectedCategory }) => {
    
  const router = useRouter();


    // Fetch studio categories
  const { data: categories, isLoading: isLoadingStudioCategories } =
    useQuery({
      queryKey: ["studio-categories"],
      queryFn: fetchStudioCategories,
      select: (data) => data?.data?.categories,
    });

    const {data:filteredStudios,isLoading,isError}=useQuery({
      queryKey:['top-studios',selectedCategory],
      queryFn : ()=> fetchTopRatedStudios({categoryId:selectedCategory=="all"?null:selectedCategory}),
      select:(data)=>data?.data
    })

    


  const handleViewStudios = () => {
    router.push("/user/studio-list");
  };

  const handleBook =(studio)=>{
        router.push(`/user/studios/${studio._id}?entityType=studio&entityId=${studio._id}`);

  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Top Rated Studios
            </h2>
            <p className="text-xl text-gray-600">
              Discover studios loved by our community
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              // value={selectedCategory}
                value={selectedCategory ?? 'null'}
  onChange={(e) => {
    const val = e.target.value;
    setSelectedCategory(val === 'null' ? null : val);
  }}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value={null}>All</option>
              {categories?.map((cat) => (
                <option key={cat?._id} value={cat?._id}>
                  {cat?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">



          {filteredStudios?.map((studio) => (
            <div
              key={studio._id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={studio?.images[0]}
                  alt={studio?.studioName}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {studio.featured && (
                  <div className="absolute top-4 left-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                )}
   
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                    {studio?.studioName}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="font-medium text-gray-900">
                      {studio?.averageRating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin size={16} />
                  <span>{studio?.address?.city}</span>
                </div>

    <div>
      <h3 className="text-gray-500 mb-2">{studio?.studioDescription.slice(0,120)} ......</h3>
    </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-brand-primary">
                      ₹{(studio?.pricePerHour)}
                    </span>
                    <span className="text-gray-600"> / hour</span>
                  </div>
             
                </div>

                <button onClick={()=>handleBook(studio)} className="w-full bg-brand-primary text-white py-3 rounded-lg hover:bg-brand-700 transition-colors font-medium flex items-center justify-center gap-2 group">
                  Book Now
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleViewStudios}
            className="bg-brand-primary text-white px-8 py-3 rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            View All Studios
          </button>
        </div>
      </div>
    </section>
  );
};

export default StudiosSection;
