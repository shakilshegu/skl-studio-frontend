import Link from "next/link";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaTwitter, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Information */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                SKL
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full mt-2"></div>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              India's premier platform connecting creative minds with extraordinary spaces. 
              Book studios, photographers, and venues for all your creative projects.
            </p>
            
            {/* App Store Buttons */}
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/user/studios" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Studio Booking</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/photographers" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Photographer Booking</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/photographers" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Videographer Services</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/packages" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Studio Packages</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">For Partners</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/user/become-partner" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>List Your Studio</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/become-partner" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Join as Photographer</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/become-partner" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Partner With Us</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/user/about-us" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>About Us</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/contact-us" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Contact Us</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/faq" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>FAQ</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/help-center" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Help Center</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/blog" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Blog</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link href="/user/careers" className="text-gray-300 hover:text-brand-primary transition-colors text-sm flex items-center group">
                  <span>Careers</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-white text-sm">
                © 2024 SKL .
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm">
              <Link 
                href="/user/terms-and-conditions" 
                className="text-white hover:text-gray-200 transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link 
                href="/user/privacy-policy" 
                className="text-white hover:text-gray-200 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/user/cookie-policy" 
                className="text-white hover:text-gray-200 transition-colors"
              >
                Cookie Policy
              </Link>
              <Link 
                href="/user/refund-policy" 
                className="text-white hover:text-gray-200 transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;