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
                ALOKA
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full mt-2"></div>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              India's premier platform connecting creative minds with extraordinary spaces. 
              Book studios, photographers, and venues for all your creative projects.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-brand-primary mt-1 flex-shrink-0" size={14} />
                <div className="text-sm text-gray-300">
                  <p>Aloka Technologies Pvt. Ltd.</p>
                  <p>4th Floor, Tech Hub Building</p>
                  <p>Koramangala, Bangalore - 560034</p>
                  <p>Karnataka, India</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaPhone className="text-brand-primary flex-shrink-0" size={14} />
                <div className="text-sm text-gray-300">
                  <p>+91 80 4567 8900</p>
                  <p>+91 98765 43210 (Support)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-brand-primary flex-shrink-0" size={14} />
                <div className="text-sm text-gray-300">
                  <p>hello@aloka.in</p>
                  <p>support@aloka.in</p>
                </div>
              </div>
            </div>
            
            {/* App Store Buttons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-200">Download Our App</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 transition-colors"
                >
                  <img src="/Assets/Googleplay.svg" alt="Google Play" className="h-8" />
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 transition-colors"
                >
                  <img src="/Assets/AppStore.svg" alt="App Store" className="h-8" />
                </a>
              </div>
            </div>
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

        {/* Social Media Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-center lg:text-left">Follow Us</h4>
              <div className="flex justify-center lg:justify-start gap-4">
                <a 
                  href="https://facebook.com/aloka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group"
                >
                  <FaFacebookF className="text-gray-300 group-hover:text-white" size={16} />
                </a>
                <a 
                  href="https://instagram.com/aloka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors group"
                >
                  <FaInstagram className="text-gray-300 group-hover:text-white" size={16} />
                </a>
                <a 
                  href="https://linkedin.com/company/aloka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors group"
                >
                  <FaLinkedinIn className="text-gray-300 group-hover:text-white" size={16} />
                </a>
                <a 
                  href="https://twitter.com/aloka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors group"
                >
                  <FaTwitter className="text-gray-300 group-hover:text-white" size={16} />
                </a>
                <a 
                  href="https://youtube.com/aloka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors group"
                >
                  <FaYoutube className="text-gray-300 group-hover:text-white" size={16} />
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="text-center lg:text-right">
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button className="px-6 py-2 bg-brand-primary hover:bg-brand-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Get latest updates on new studios and offers</p>
            </div>
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
                © 2024 Aloka Technologies Pvt. Ltd. All rights reserved.
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