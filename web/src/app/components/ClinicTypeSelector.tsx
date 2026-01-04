import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export type ClinicType = 'mental-health' | 'physiotherapy' | 'dental' | 'outpatient';

interface ClinicTypeSelectorProps {
  selected: ClinicType;
  onChange: (type: ClinicType) => void;
  className?: string;
}

const clinicOptions: { value: ClinicType; label: string }[] = [
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'physiotherapy', label: 'Physiotherapy' },
  { value: 'dental', label: 'Dental' },
  { value: 'outpatient', label: 'Outpatient' }
];

export function ClinicTypeSelector({ selected, onChange, className = '' }: ClinicTypeSelectorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide selector after scrolling past ~1200px (approximately 2 sections)
      setIsVisible(window.scrollY < 1200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={`sticky top-24 z-40 transition-opacity duration-300 ${className}`}
      style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        {/* Desktop version */}
        <div 
          className="hidden md:flex items-center gap-2 p-2 rounded-2xl w-fit mx-auto"
          style={{ backgroundColor: '#F8FAFC' }}
          role="tablist"
          aria-label="Select clinic type"
        >
          {clinicOptions.map((option) => {
            const isActive = selected === option.value;
            
            return (
              <button
                key={option.value}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${option.value}-content`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onChange(option.value)}
                className="relative px-8 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: isActive ? '#2563EB' : 'transparent',
                  color: isActive ? 'white' : '#334155',
                  fontWeight: isActive ? 500 : 400,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                  focusRingColor: '#2563EB'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#E2E8F0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Mobile version - horizontal scroll */}
        <div 
          className="md:hidden overflow-x-auto scrollbar-hide"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div 
            className="flex items-center gap-2 p-2 rounded-2xl w-fit mx-auto"
            style={{ backgroundColor: '#F8FAFC', minWidth: 'min-content' }}
            role="tablist"
            aria-label="Select clinic type"
          >
            {clinicOptions.map((option) => {
              const isActive = selected === option.value;
              
              return (
                <button
                  key={option.value}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${option.value}-content`}
                  onClick={() => {
                    onChange(option.value);
                    // Center the active option on mobile
                    const button = document.querySelector(`[aria-controls="${option.value}-content"]`);
                    if (button) {
                      button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                  }}
                  className="relative px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? '#2563EB' : 'transparent',
                    color: isActive ? 'white' : '#334155',
                    fontWeight: isActive ? 500 : 400,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Wrapper component for animated content transitions
interface AnimatedClinicContentProps {
  clinicType: ClinicType;
  children: React.ReactNode;
}

export function AnimatedClinicContent({ clinicType, children }: AnimatedClinicContentProps) {
  const transitionConfig = {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1] // ease-out
  };

  // Subtle accent adjustments per clinic type
  const accentConfig = {
    'mental-health': { duration: 0.4, ease: [0.25, 1, 0.4, 1] }, // Softer, slower
    'physiotherapy': { duration: 0.3, ease: [0.22, 1, 0.36, 1] }, // Directional
    'dental': { duration: 0.3, ease: [0.3, 1, 0.4, 1] }, // Crisp
    'outpatient': { duration: 0.35, ease: [0.22, 1, 0.36, 1] } // Steady
  };

  const currentConfig = accentConfig[clinicType];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={clinicType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={currentConfig}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Text transition wrapper
interface AnimatedTextProps {
  clinicType: ClinicType;
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
}

export function AnimatedText({ clinicType, children, as: Component = 'div', className = '' }: AnimatedTextProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${clinicType}-${typeof children === 'string' ? children.substring(0, 20) : 'text'}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Component className={className}>{children}</Component>
      </motion.div>
    </AnimatePresence>
  );
}

// Visual transition wrapper
interface AnimatedVisualProps {
  clinicType: ClinicType;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedVisual({ clinicType, children, className = '' }: AnimatedVisualProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${clinicType}-visual`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Icon transition wrapper
interface AnimatedIconProps {
  clinicType: ClinicType;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedIcon({ clinicType, children, className = '' }: AnimatedIconProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${clinicType}-icon`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
