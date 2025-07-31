"use client"
// import { fetchSimilarStudios } from "@/services/studio/studio.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";

// Single Card Component
const SpaceCard = ({ image, price, title, description }) => (
  <div className="min-w-[16rem] rounded-lg overflow-hidden shadow-md border border-gray-300 bg-white">
    <div className="relative">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
        ₹{price}/hr
      </div>
    </div>
    <div className="p-4 bg-white-900 text-black">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-black-400 mt-1">{description}</p>
    </div>  
  </div>
);

// Main Similar Spaces Component
const SimilarSpaces = ({ categoryId }) => {
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ['similarStudios', categoryId],
  //   queryFn: () => fetchSimilarStudios(categoryId),
  //   enabled: !!categoryId
  // });

  // if (isLoading) return <div>Loading similar spaces...</div>;
  // if (isError) return <div>Error: {error.message}</div>;

  // const studios = data?.studios || [];
  const studios =  [];

  if (studios.length === 0) return null;

  return (
    <div className="p-6">
      <h2 className=" font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-4">Similar Spaces to Explore</h2>
      <div className="flex gap-4 overflow-x-auto">
        {studios.map((space) => (
          <SpaceCard
            key={space._id}
            image={space?.images[0] || 'https://via.placeholder.com/150'}
            price={space.price?.perHour}
            title={space.title}
            description={space.studioDescription.slice(0, 200) + '...'}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarSpaces;