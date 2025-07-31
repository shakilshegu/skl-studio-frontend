"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/partner/Navbar/Navbar";
import Sidebar from "@/components/partner/Sidebar/Sidebar";
import { Menu, X } from "lucide-react";

export default function PartnerLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const noLayoutRoutes = [
    "/partner/login",
    "/partner/onboarding",
    "/login",
    "/otp"
  ];

  const showLayout = !noLayoutRoutes.includes(pathname);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  if (!showLayout) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Fixed Navbar */}
      <div className="flex-shrink-0">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={isMobile}
        />
      </div>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Fixed */}
        {!isMobile && (
          <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200">
            <div className="h-full overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && (
          <>
            <div
              className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity lg:hidden ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setSidebarOpen(false)}
            />
            <div className={`fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-full overflow-y-auto pb-16">
                <Sidebar onItemClick={() => setSidebarOpen(false)} />
              </div>
            </div>
          </>
        )}

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 lg:p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}