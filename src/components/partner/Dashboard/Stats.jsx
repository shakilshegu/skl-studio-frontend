"use client";
import React from 'react';
import { Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, bgColor, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`${bgColor} ${color} p-3 rounded-xl`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const DashboardStatsCards = ({ stats }) => {
  const cardData = [
    {
      title: "Total Bookings",
      value: stats?.totalBookings?.toLocaleString() || "0",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "This month"
    },
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString("en-IN") || "0"}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "All time"
    },
    {
      title: "Total Pending",
      value: stats?.totalPending?.toLocaleString() || "0",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      trend: "Awaiting confirmation"
    },
    {
      title: "Completed Works",
      value: stats?.completedWorks?.toLocaleString() || "0",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      trend: "Successfully finished"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardData.map((card, index) => (
        <StatsCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          bgColor={card.bgColor}
          trend={card.trend}
        />
      ))}
    </div>
  );
};

export default DashboardStatsCards;