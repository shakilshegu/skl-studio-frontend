"use client";
import { usePathname } from "next/navigation";
import Navbar from "../components/user/Navbar/Navbar";
import Footer from "../components/user/Footer/Footer";
import Toast from "@/components/Toast/Toast";
import Confirmation from "@/components/Toast/Confirmation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isPartnerRoute = pathname.startsWith("/partner");
  const isAuthRoute = pathname === "/login" || pathname === "/otp";
  const showNavFooter = !isPartnerRoute && !isAuthRoute;

  return (
    <div className="min-h-screen flex flex-col">
      {showNavFooter && <Navbar />}
      <main className="flex-grow">
        {children}
        <Toast />
        <Confirmation />
      </main>
      {showNavFooter && <Footer />}
    </div>
  );
}
