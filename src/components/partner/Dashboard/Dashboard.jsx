"use client";
import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import DashboardStatsCards from "./Stats";
import RevenueSection from "./RevenueSection";
import BookingsTable from "./BookingTable";

// Sample avatar images
const user1 = "/Assets/partner/user1.png";
const user2 = "/Assets/partner/user2.png";
const user3 = "/Assets/partner/user3.png";
const user4 = "/Assets/partner/user4.png";
const user5 = "/Assets/partner/user5.png";

const DashboardPage = () => {
  // Static dummy data for stats
  const stats = {
    totalBookings: 45,
    totalRevenue: 89235,
    totalPending: 8,
    completedWorks: 37,
  };

  // Sample bookings data
  const currentBookings = [
    {
      customerName: "Alice Green",
      date: "22 Oct 2024",
      startTime: "10:00",
      endTime: "13:00",
      timeInHrs: "3.00 Hrs",
      avatar: user1,
      customerEmail: "alice@example.com"
    },
    {
      customerName: "Robert Black",
      date: "21 Oct 2024",
      startTime: "14:00",
      endTime: "16:00",
      timeInHrs: "2.00 Hrs",
      avatar: user2,
      customerEmail: "robert@example.com"
    },
    {
      customerName: "Sophia White",
      date: "20 Oct 2024",
      startTime: "09:00",
      endTime: "12:00",
      timeInHrs: "3.00 Hrs",
      avatar: user3,
      customerEmail: "sophia@example.com"
    },
    {
      customerName: "Liam Brown",
      date: "19 Oct 2024",
      startTime: "11:30",
      endTime: "13:30",
      timeInHrs: "2.00 Hrs",
      avatar: user4,
      customerEmail: "liam@example.com"
    },
    {
      customerName: "Emily Grey",
      date: "18 Oct 2024",
      startTime: "15:00",
      endTime: "17:00",
      timeInHrs: "2.00 Hrs",
      avatar: user5,
      customerEmail: "emily@example.com"
    },
  ];

  const upcomingBookings = [
    {
      customerName: "Olivia Harper",
      date: "15 Nov 2024",
      startTime: "09:00",
      endTime: "12:00",
      timeInHrs: "3.00 Hrs",
      avatar: user5,
      customerEmail: "olivia@example.com"
    },
    {
      customerName: "Ethan Cross",
      date: "17 Nov 2024",
      startTime: "13:00",
      endTime: "16:00",
      timeInHrs: "3.00 Hrs",
      avatar: user4,
      customerEmail: "ethan@example.com"
    },
    {
      customerName: "Isabella Moore",
      date: "20 Nov 2024",
      startTime: "11:00",
      endTime: "14:00",
      timeInHrs: "3.00 Hrs",
      avatar: user2,
      customerEmail: "isabella@example.com"
    },
    {
      customerName: "Noah Brooks",
      date: "22 Nov 2024",
      startTime: "10:30",
      endTime: "12:30",
      timeInHrs: "2.00 Hrs",
      avatar: user3,
      customerEmail: "noah@example.com"
    },
    {
      customerName: "Ava Turner",
      date: "25 Nov 2024",
      startTime: "14:00",
      endTime: "17:00",
      timeInHrs: "3.00 Hrs",
      avatar: user1,
      customerEmail: "ava@example.com"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className=" mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-[#892580] to-purple-600 p-3 rounded-xl">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your business overview</p>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStatsCards stats={stats} />

        {/* Revenue Section */}
        <RevenueSection 
          revenueData={{
            totalRevenue: stats.totalRevenue,
            period: "Jan 2024",
            growthPercentage: "+12.5%"
          }}
        />

        {/* Bookings Table */}
        <BookingsTable 
          currentBookings={currentBookings}
          upcomingBookings={upcomingBookings}
        />
      </div>
    </div>
  );
};

export default DashboardPage;