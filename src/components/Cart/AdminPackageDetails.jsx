import React from 'react';

const AdminPackageDetails = ({ adminPackageData }) => {


    const adminPackage = adminPackageData.data

  if (!adminPackage) {
    return (
      <div className="p-6 border-b">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Handle MongoDB ObjectId format
  const packageId = adminPackage._id?.$oid || adminPackage._id || 'N/A';

  return (
    <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-purple-100">
      <div className="flex items-start space-x-4">
        {/* Package Image */}
        <div className="flex-shrink-0">
          {adminPackage.photo ? (
            <img
              src={adminPackage.photo}
              alt={adminPackage.name}
              className="w-20 h-20 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          <div 
            className={`w-20 h-20 bg-purple-200 rounded-lg shadow-md flex items-center justify-center ${adminPackage.photo ? 'hidden' : 'flex'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#892580]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        
        {/* Package Details */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-[#892580]">{adminPackage.name}</h2>
            <span className="text-xs bg-purple-100 text-[#892580] px-2 py-1 rounded-full font-medium">
              Aloka Package
            </span>
          </div>
          
          <p className="text-gray-700 text-sm mb-3 leading-relaxed">
            {adminPackage.description}
          </p>
          
          <div className="flex items-center justify-between">

            
            <div className="text-right">
              <div className="text-2xl font-bold text-[#892580]">
                ₹{adminPackage.price?.toLocaleString() || '0'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPackageDetails;