

// 'use client';

// import React, { useState } from 'react';
// import Profile from '@/components/Profile/Profile';
// import AddStudio from './AddStudio';
// import { useQuery } from '@tanstack/react-query';
// import { useSelector } from 'react-redux';
// import { fetchStudioById } from '@/services/PartnerService/studio.service';
// import { fetchFreelancerById } from '@/services/Freelancer/freelancer.service';
// import AddFreelancer from './AddFreelancer';

// const Page = () => {
//   const { role } = useSelector((state) => state.auth);
//   const [isEditing, setIsEditing] = useState(false);

//   const isStudio = role === 'studio';
//   const isFreelancer = role === 'freelancer';

//   const fetchProfileData = async () => {
//     if (isStudio) {
//       return await fetchStudioById();
//     } else if (isFreelancer) {
//       return await fetchFreelancerById();
//     }
//     throw new Error('Invalid user role');
//   };

//   const {
//     data: profileData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ['profile', role, isEditing],
//     queryFn: fetchProfileData,
//     enabled: !!role && (isStudio || isFreelancer),
//   });

//   const hasProfile = isStudio
//     ? Boolean(profileData?.studio)
//     : isFreelancer
//     ? Boolean(profileData?.freelancer)
//     : false;

//   if (isLoading) return <p>Loading...</p>;

//   if (error) {
//     // Optional: show different message for not-found
//     if (error.response?.status === 404) {
//       // profile not found
//     } else {
//       return (
//         <p className="text-red-500">
//           {error.message || 'Failed to fetch profile data'}
//         </p>
//       );
//     }
//   }

//   return (
//     <div>
      
//       {hasProfile && !isEditing ? (
//         <Profile
//           setIsEditing={setIsEditing}
//           isEditing={isEditing}
//           role={role}
//           profileData={profileData}
//         />
//       ) : isStudio ? (
//         <AddStudio userRole={role} />
//       ) : isFreelancer ? (
//         <AddFreelancer
//           setIsEditing={setIsEditing}
//           isEditing={isEditing}
//         />
//       ) : null}
//     </div>
//   );
// };

// export default Page;


'use client';

import React, { useState } from 'react';
import Profile from '@/components/Profile/Profile';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchStudioById } from '@/services/PartnerService/studio.service';
import { fetchFreelancerById } from '@/services/Freelancer/freelancer.service';
import AddFreelancer from './AddFreelancer';
import AddStudio from './AddStudio';

const Page = () => {
  const { role } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const isStudio = role === 'studio';
  const isFreelancer = role === 'freelancer';

  const fetchProfileData = async () => {
    if (isStudio) {
      return await fetchStudioById();
    } else if (isFreelancer) {
      return await fetchFreelancerById();
    }
    throw new Error('Invalid user role');
  };

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile', role, isEditing],
    queryFn: fetchProfileData,
    enabled: !!role && (isStudio || isFreelancer),
  });

  const hasProfile = isStudio
    ? Boolean(profileData?.studio)
    : isFreelancer
    ? Boolean(profileData?.freelancer)
    : false;

  // Extract studio/freelancer data and ID for editing
  const studioData = profileData?.studio;
  const freelancerData = profileData?.freelancer;
  const studioId = studioData?._id;
  const freelancerId = freelancerData?._id;

  // Handle successful form submission
  const handleFormSuccess = (response) => {
    // Exit edit mode and refresh data
    setIsEditing(false);
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    // Optional: show different message for not-found
    if (error.response?.status === 404) {
      // profile not found - this is fine for first-time users
    } else {
      return (
        <p className="text-red-500">
          {error.message || 'Failed to fetch profile data'}
        </p>
      );
    }
  }

  return (
    <div>
      {hasProfile && !isEditing ? (
        // VIEW MODE: Show existing profile with edit button
        <Profile
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          role={role}
          profileData={profileData}
        />
      ) : isStudio ? (
        // CREATE/EDIT MODE: Show studio form
        <div>
          {/* Optional: Add a back button for edit mode */}
          {isEditing && hasProfile && (
            <div className="mb-4">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                Back to Profile
              </button>
            </div>
          )}

          <AddStudio 
            userRole={role}
            isEditMode={isEditing && hasProfile} // Edit mode if editing existing profile
            studioId={studioId} // Pass studio ID for editing
            studioData={studioData} // Pass existing studio data
            onSuccess={handleFormSuccess} // Handle success callback
          />
        </div>
      ) : isFreelancer ? (
        // CREATE/EDIT MODE: Show freelancer form
        <AddFreelancer
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          isEditMode={isEditing && hasProfile} // Edit mode if editing existing profile
          freelancerId={freelancerId} // Pass freelancer ID for editing
          freelancerData={freelancerData} // Pass existing freelancer data
          onSuccess={handleFormSuccess} // Handle success callback
        />
      ) : null}
    </div>
  );
};

export default Page;