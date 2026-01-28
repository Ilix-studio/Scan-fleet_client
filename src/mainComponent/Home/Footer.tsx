import { Mail, Linkedin, Twitter, ScanQrCode } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-white/5 backdrop-blur-xl border-t border-white/10 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid md:grid-cols-4 gap-8 mb-8'>
          {/* Brand */}
          <div>
            <div className='flex items-center gap-3 font-bold text-lg mb-4'>
              <div className='relative'>
                <div className='w-10 h-10 bg-gradient-to-br from-red-500 via-black to-white rounded-xl flex items-center justify-center text-white font-bold shadow-lg'>
                  <ScanQrCode size={20} />
                </div>
                <div className='absolute -inset-1 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl blur opacity-30'></div>
              </div>
              <span className='text-white font-bold'>ScanFleet</span>
            </div>
            <p className='text-sm text-white/90'>
              Revolutionizing dealership communication with Scan-to-Call
              technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className='font-bold mb-4 text-white'>Product</h4>
            <ul className='space-y-2 text-sm text-white/90'>
              <li>
                <Link to='#' className='hover:text-cyan-300 transition-colors'>
                  Features
                </Link>
              </li>
              <li>
                <Link to='#' className='hover:text-cyan-300 transition-colors'>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to='#' className='hover:text-cyan-300 transition-colors'>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className='font-bold mb-4 text-white'>Company</h4>
            <ul className='space-y-2 text-sm text-white/90'>
              <li>
                <Link to='#' className='hover:text-cyan-300 transition-colors'>
                  About
                </Link>
              </li>
              <li>
                <Link to='#' className='hover:text-cyan-300 transition-colors'>
                  Blog
                </Link>
              </li>
              <li>
                <Link to='#' className='hover:text-cyan-300 transition-colors'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className='font-bold mb-4 text-white'>Follow Us</h4>
            <div className='flex gap-4'>
              <Link
                to='#'
                className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white hover:text-white hover:bg-cyan-500/30 transition-colors'
              >
                <Twitter size={20} />
              </Link>
              <Link
                to='#'
                className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white hover:text-white hover:bg-blue-500/30 transition-colors'
              >
                <Linkedin size={20} />
              </Link>
              <Link
                to='#'
                className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white hover:text-white hover:bg-purple-500/30 transition-colors'
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-white/10 pt-8 text-center text-sm text-white/60'>
          <Link to='/admin-login'>
            <p>
              &copy; {currentYear} ScanFleet Technologies. All rights reserved.
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
