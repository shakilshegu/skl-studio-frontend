"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { 
  Calendar, 
  LayoutDashboard, 
  User, 
  Building2, 
  BookOpen, 
  Users, 
  FolderOpen, 
  Clock, 
  FileText, 
  Heart, 
  Settings,
  ChevronRight
} from "lucide-react";
import Cookies from "js-cookie";
import { clearUser } from "@/stores/authSlice";

const Sidebar = ({ onItemClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(null);

  // Get partner data from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Extract freelancer/partner details with fallbacks
  const businessName = user?.businessProfile?.vendorName || "";
  const userEmail = user?.email || "";
  const userMobile = user?.mobile || "";
  const profileImage = user?.profileImage || null;
  const userRole = user?.roles?.[user?.roles?.length - 1] 
  const freelancerCategory = user?.businessProfile?.freelancerCategory || "";
  const vendorType = user?.businessProfile?.vendorType || "";
  const city = user?.businessProfile?.city || "";
  const state = user?.businessProfile?.state || "";
  
  // Create display name
  const displayName = businessName || "Freelancer Account";
  const roleDisplay = vendorType === 'freelancer' 
    ? `${freelancerCategory?.charAt(0)?.toUpperCase() + freelancerCategory?.slice(1) || 'Freelancer'}`
    : userRole?.charAt(0)?.toUpperCase() + userRole?.slice(1) || 'Account';
  
  const locationDisplay = city && state ? `${city}, ${state}` : city || state || "";

  const handleNavigation = async (path, isLogout = false) => {
    if (isLogout) {
      setLoading(path);
      try {
        dispatch(clearUser());
        Cookies.remove("Role");
        Cookies.remove("Token");
        Cookies.remove("UserId");
        localStorage.clear();
        window.location.href = "/";
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setLoading(null);
      }
      return;
    }
    if (pathname === path) {
      onItemClick?.();
      return;
    }

    setLoading(path);
    router.push(path);
    onItemClick?.();
    setTimeout(() => setLoading(null), 300);
  };

  const menuItems = useMemo(() => [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/partner/dashboard",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Calendar,
      label: "Calendar",
      path: "/partner/calender",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: BookOpen,
      label: "Bookings",
      path: "/partner/booking-list",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: User,
      label: "Profile",
      path: "/partner/profile",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Building2,
      label: "Business Details",
      path: "/partner/business-service",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: FolderOpen,
      label: "Portfolio",
      path: "/partner/portfolio",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: Clock,
      label: "Availability",
      path: "/partner/availability",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      icon: Users,
      label: "Team Members",
      path: "/partner/team-members",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: FileText,
      label: "Invoice",
      path: "/partner/invoice-management",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      icon: Heart,
      label: "Support",
      path: "/partner/support",
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    },
    // {
    //   icon: Settings,
    //   label: "Settings",
    //   path: "/partner/settings",
    //   color: "text-gray-600",
    //   bgColor: "bg-gray-50"
    // }
  ], []);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) {
      if (freelancerCategory) {
        return freelancerCategory.charAt(0).toUpperCase() + (vendorType?.charAt(0)?.toUpperCase() || 'F');
      }
      return "FA"; // Freelancer Account
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="h-full bg-white flex flex-col">
      {/* Scrollable menu items */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="p-4 lg:p-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              const isLoading = loading === item.path;
              const Icon = item.icon;
              
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path, item.isLogout)}
                  disabled={isLoading}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? `${item.bgColor} ${item.color} shadow-sm ring-1 ring-black/5` 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-lg transition-colors
                      ${isActive 
                        ? `${item.color} bg-white shadow-sm` 
                        : 'text-gray-500 group-hover:text-gray-700'
                      }
                    `}>
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    
                    <span className={`
                      font-medium text-sm
                      ${isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
                    `}>
                      {item.label}
                    </span>
                  </div>

                  {isActive && (
                    <ChevronRight className={`w-4 h-4 ${item.color}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed bottom section with dynamic user info */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-[#892580] to-[#a12d8a] rounded-xl p-4 text-white">
          <div className="flex items-center space-x-3">
            {/* Dynamic Avatar */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(displayName)}
                </div>
              )}
            </div>
            
            {/* Dynamic User Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{displayName}</p>
              <p className="text-xs text-white/80 truncate">{roleDisplay}</p>
              {locationDisplay && (
                <p className="text-xs text-white/60 truncate">{locationDisplay}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;