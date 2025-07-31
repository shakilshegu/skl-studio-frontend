// app/user/studios/[id]/page.js
import { Suspense } from 'react';
import { getStudioById } from '@/services/studio/studio.service';
import StudioDetails from '@/components/studio/StudioDetails';
import { notFound } from 'next/navigation';

// Loading component for better UX
function StudioDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded-lg w-2/3 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        
        {/* Image skeleton */}
        <div className="h-[500px] bg-gray-200 rounded-2xl mb-12 animate-pulse"></div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata generation
export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const response = await getStudioById(id);
    const studio = response?.studio || response;
    
    return {
      title: studio?.studioName ? `${studio.studioName} - Studio Details` : 'Studio Details',
      description: studio?.studioDescription ? 
        studio.studioDescription.slice(0, 160) + '...' : 
        'Discover amazing studio spaces for your creative projects.',
      openGraph: {
        title: studio?.studioName || 'Studio Details',
        description: studio?.studioDescription?.slice(0, 160) || 'Amazing studio space',
        images: studio?.images?.[0] ? [
          {
            url: studio.images[0],
            width: 1200,
            height: 630,
            alt: studio.studioName || 'Studio Image',
          }
        ] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Studio Details',
      description: 'Discover amazing studio spaces for your creative projects.',
    };
  }
}

// Main page component
export default async function StudioDetailsPage({ params, searchParams }) {
  try {
    const { id } = await params;
    const queryParams = await searchParams;
    
    // Validate the ID format (assuming MongoDB ObjectId)
    if (!id || id.length !== 24) {
      notFound();
    }
    
    // Fetch studio data
    const response = await getStudioById(id);
    
    // Handle different response structures
    const studio = response?.studio || response;
    
    if (!studio) {
      notFound();
    }
    
    // Extract entity info from search params for potential use
    const entityType = queryParams?.entityType;
    const entityId = queryParams?.entityId;

    

    
    return (
      <Suspense fallback={<StudioDetailsLoading />}>
        <StudioDetails 
          studioId={id} 
          initialData={studio}
          entityType={entityType}
          entityId={entityId}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in StudioDetailsPage:', error);
    
    // You might want to show an error page instead
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Studio</h3>
          <p className="text-gray-600 mb-4">There was an error loading the studio details.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}