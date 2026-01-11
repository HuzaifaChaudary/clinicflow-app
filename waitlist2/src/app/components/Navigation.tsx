import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import headerLogo from '../../assets/axis-logo-header-navy-wordmark.svg';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
            <motion.img
              src={headerLogo}
              alt="AXIS"
              className="h-8"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
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

          {/* Right Side - CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/trial">
              <motion.button
                className="px-6 py-3 rounded-full bg-[var(--accent-primary)] text-white backdrop-blur-xl hover:bg-[var(--accent-primary)]/90 hover:shadow-[0_4px_12px_rgba(13,148,136,0.2)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Join Waitlist
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[var(--foreground)] hover:text-[var(--accent-primary)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Rendered via Portal to avoid stacking context issues */}
      {mounted && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/40 z-[100] md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Mobile Menu Panel */}
              <motion.div
                className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--background-elevated)] border-l border-[var(--glass-border)] z-[110] md:hidden overflow-y-auto shadow-2xl"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ 
                  duration: 0.65, 
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <button
                    className="p-2 text-[var(--foreground)] hover:text-[var(--accent-primary)] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div 
                      key={link.path}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.02,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 rounded-lg text-sm transition-colors duration-200 ${
                          location.pathname === link.path
                            ? 'bg-[var(--accent-soft)] text-[var(--accent-primary)]'
                            : 'text-[var(--foreground-muted)] hover:bg-[var(--glass-blue)] hover:text-[var(--accent-primary)]'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setSolutionsOpen(false);
                        }}
                      >
                        {link.name}
                      </Link>
                      
                      {/* Mobile Solutions Dropdown */}
                      {link.hasDropdown && (
                        <motion.div 
                          className="mt-1 ml-4 space-y-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ 
                            duration: 0.55,
                            delay: (index + 1) * 0.02,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                        >
                          {solutionsDropdown.clinicTypes.map((item, subIndex) => (
                            <motion.div
                              key={subIndex}
                              initial={{ opacity: 0, x: 5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                duration: 0.55,
                                delay: (index + 1) * 0.02 + subIndex * 0.01,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                            >
                              <Link
                                to={item.path}
                                className="block px-4 py-2 rounded-lg text-sm text-[var(--foreground-muted)] hover:bg-[var(--glass-blue)] hover:text-[var(--accent-primary)] transition-colors duration-200"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setSolutionsOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <motion.div 
                  className="mt-8 pt-8 border-t border-[var(--glass-border)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6,
                    delay: navLinks.length * 0.02 + 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <Link to="/trial" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      className="w-full px-6 py-3 rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 transition-all duration-300"
                      whileTap={{ scale: 0.98 }}
                    >
                      Join Waitlist
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </nav>
  );
}