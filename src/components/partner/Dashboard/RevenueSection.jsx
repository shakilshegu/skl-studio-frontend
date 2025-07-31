"use client";
import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import RevenueChart from './RevenueChart';

const RevenueSection = ({ revenueData }) => {
  const totalRevenue = revenueData?.totalRevenue || 89235.89;
  const period = revenueData?.period || "Jan 2024";
  const growthPercentage = revenueData?.growthPercentage || "+12.5%";
  const isPositiveGrowth = !growthPercentage.startsWith('-');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-[#892580]" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-gray-600 font-medium">Total Revenue:</span>
              <strong className="text-2xl text-green-600">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </strong>
            </div>
            
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              isPositiveGrowth 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <TrendingUp className={`w-4 h-4 ${isPositiveGrowth ? '' : 'rotate-180'}`} />
              {growthPercentage}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600">
              Period: {period}
            </span>
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="w-full">
        <RevenueChart />
      </div>
    </div>
  );
};

export default RevenueSection;