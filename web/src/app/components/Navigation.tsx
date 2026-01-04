import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  
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

  const navLinks = [
    { name: 'Product', path: '/product' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Solutions', path: '/solutions', hasDropdown: true },
    { name: 'Voice', path: '/voice-automation' },
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
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative group">
            <motion.div
              className="text-2xl tracking-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              CLINICFLOW
            </motion.div>
            <div className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--accent-primary)] transition-all duration-300 group-hover:w-full"></div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-12">
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

          {/* Right Side - Auth & CTA */}
          <div className="hidden md:flex items-center gap-6">
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
            <Link to="/trial">
              <motion.button
                className="px-6 py-3 rounded-full bg-[var(--accent-primary)] text-white backdrop-blur-xl hover:bg-[var(--accent-primary)]/90 hover:shadow-[0_4px_12px_rgba(13,148,136,0.2)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Access Free Trial
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}