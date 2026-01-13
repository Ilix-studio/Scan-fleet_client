import { useState, useEffect } from "react";
import { Menu, X, ScanQrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setIsOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const navLinks = [
    { to: "#how-it-works", label: "How It Works" },
    { to: "#pricing", label: "Pricing" },
    { to: "#dashboard", label: "Dashboard" },
    { to: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Gradient glow effect */}
      <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5'></div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Enhanced Logo */}
          <Link
            to='/'
            className='flex items-center gap-3 font-bold text-xl text-white hover:scale-105 transition-transform duration-200'
          >
            <div className='relative'>
              <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg'>
                <ScanQrCode size={20} />
              </div>
              <div className='absolute -inset-1 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl blur opacity-30'></div>
            </div>
            <span className='hidden sm:inline bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              ScanFleet
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-8'>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className='relative text-sm text-white/80 hover:text-white transition-all duration-200 group'
              >
                {link.label}
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300'></span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className='flex items-center gap-4'>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='md:hidden p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-white border border-white/10'
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Enhanced CTA Button */}
            <Link to='/login'>
              <Button className='hidden sm:inline-flex relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'>
                <span className='relative z-10'>Get Started</span>
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-50'></div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isOpen && (
          <div className='md:hidden'>
            <div className='bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl mx-4 mb-4 p-4 space-y-3'>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className='block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200'
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 py-3 rounded-xl font-semibold shadow-lg'>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
