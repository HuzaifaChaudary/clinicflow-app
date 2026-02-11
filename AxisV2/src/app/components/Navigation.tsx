import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  
  // Safely get location with fallback
  let location;
  try {
    location = useLocation();
  } catch (e) {
    // Fallback during HMR when Router context might not be available
    location = { pathname: '/' };
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSolutionsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Product', path: '/product' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Solutions', path: '/solutions', hasDropdown: true },
    { name: 'Try Ava', path: '/voice-automation' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];

  const solutionsDropdown = {
    clinicTypes: [
      { name: 'Mental Health Clinics', path: '/solutions/mental-health' },
      { name: 'Physiotherapy Clinics', path: '/solutions/physiotherapy' },
      { name: 'Dental Clinics', path: '/solutions/dental' },
      { name: 'Outpatient Clinics', path: '/solutions/outpatient' },
    ],
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-[32px] bg-[var(--background)]/85' : 'bg-transparent'
      }`}
      style={{ opacity: scrolled ? 1 : 0.95 }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative group z-50">
            <motion.div
              className="flex items-center gap-3 text-xl tracking-tight font-medium"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/favicon copy.svg"
                alt="Axis logo"
                className="w-8 h-8"
              />
              <span>AXIS</span>
            </motion.div>
            <div className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--accent-primary)] transition-all duration-300 group-hover:w-full"></div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setSolutionsOpen(true)}
                onMouseLeave={() => link.hasDropdown && setSolutionsOpen(false)}
              >
                <Link
                  to={link.path}
                  className={`relative text-sm tracking-wide transition-colors duration-300 hover:text-[var(--accent-primary)] ${
                    location.pathname === link.path
                      ? 'text-[var(--foreground)]'
                      : 'text-[var(--foreground-muted)]'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--accent-primary)]"
                      layoutId="activeNav"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>

                {/* Solutions Dropdown */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {solutionsOpen && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          className="fixed inset-0 bg-black/40 z-30"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setSolutionsOpen(false)}
                        />
                        
                        <motion.div
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-6 z-40"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="bg-[var(--background-elevated)] border border-[var(--glass-border)] rounded-2xl p-10 min-w-[320px] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                            <div className="text-xs text-[var(--foreground-muted)] mb-6 tracking-widest uppercase">
                              By Clinic Type
                            </div>
                            <div className="space-y-3">
                              {solutionsDropdown.clinicTypes.map((item, index) => (
                                <Link
                                  key={index}
                                  to={item.path}
                                  className="block text-sm text-[var(--foreground)] hover:text-[var(--accent-primary)] transition-colors duration-250"
                                  onClick={() => setSolutionsOpen(false)}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right Side - Auth & CTA */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {/* Login temporarily disabled
            <Link 
              to="/login"
              className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors duration-300"
            >
              Log in
            </Link>
            <Link 
              to="/trial"
              className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] transition-colors duration-300"
            >
              Sign up
            </Link>
            */}
            <Link to="/trial">
              <motion.button
                className="px-6 xl:px-7 py-2.5 rounded-full bg-[var(--accent-primary)] text-white text-sm font-medium hover:bg-[var(--accent-primary)]/90 hover:shadow-[0_4px_12px_rgba(13,148,136,0.2)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Join Waitlist
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden z-50 p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="text-[var(--foreground)]" size={24} strokeWidth={2} />
            ) : (
              <Menu className="text-[var(--foreground)]" size={24} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-[var(--background)] shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-6 pt-20">
                {/* Mobile Nav Links */}
                <div className="space-y-1 mb-8">
                  {navLinks.map((link) => (
                    <div key={link.path}>
                      {link.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                            className="w-full flex items-center justify-between py-4 px-4 rounded-xl text-base font-medium text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors duration-200"
                          >
                            {link.name}
                            <ChevronDown
                              className={`text-[var(--foreground-muted)] transition-transform duration-200 ${
                                mobileSolutionsOpen ? 'rotate-180' : ''
                              }`}
                              size={20}
                            />
                          </button>
                          <AnimatePresence>
                            {mobileSolutionsOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 py-2 space-y-1">
                                  {solutionsDropdown.clinicTypes.map((item, index) => (
                                    <Link
                                      key={index}
                                      to={item.path}
                                      className="block py-3 px-4 rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--background-secondary)] transition-colors duration-200"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={link.path}
                          className={`block py-4 px-4 rounded-xl text-base font-medium transition-colors duration-200 ${
                            location.pathname === link.path
                              ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                              : 'text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                          }`}
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Auth & CTA */}
                <div className="space-y-3 pt-6 border-t border-[var(--glass-border)]">
                  {/* Login temporarily disabled
                  <Link
                    to="/login"
                    className="block py-3 px-4 rounded-xl text-center text-base text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--background-secondary)] transition-colors duration-200"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/trial"
                    className="block py-3 px-4 rounded-xl text-center text-base text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--background-secondary)] transition-colors duration-200"
                  >
                    Sign up
                  </Link>
                  */}
                  <Link to="/trial" className="block">
                    <button className="w-full py-4 rounded-full bg-[var(--accent-primary)] text-white text-base font-medium hover:bg-[var(--accent-primary)]/90 transition-all duration-200">
                      Join Waitlist
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}