import { motion } from 'motion/react';
import { useRef } from 'react';
import { Calendar, ClipboardCheck, Bell, CircleCheck } from 'lucide-react';
import { useScrollStep } from '../hooks/useScrollStep';

export function ClinicDayFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nodes = [
    { 
      icon: Calendar, 
      label: 'Clinic schedule set',
      sublabel: null
    },
    { 
      icon: ClipboardCheck, 
      label: 'Appointments planned',
      sublabel: null
    },
    { 
      icon: Bell, 
      label: 'Patients informed',
      sublabel: 'Calls or messages sent automatically'
    },
    { 
      icon: CircleCheck, 
      label: 'Day runs smoothly',
      sublabel: null
    },
  ];

  const { nodeTransforms, railFillHeight } = useScrollStep({
    containerRef,
    totalSteps: nodes.length
  });

  return (
    <div ref={containerRef} className="relative min-h-[600px]">
      <div className="sticky top-32">
        <div className="relative h-[420px] flex items-start pt-2">
          {/* Background rail line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-[rgba(255,255,255,0.12)]" />
          
          {/* Animated fill line */}
          <motion.div 
            className="absolute left-8 top-0 w-px bg-[var(--accent-mint)]"
            style={{ height: railFillHeight }}
          />
          
          {/* Nodes */}
          <div className="relative flex flex-col justify-between h-full py-4">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              const { opacity, scale, glow } = nodeTransforms[index];

              return (
                <motion.div
                  key={index}
                  className="relative flex items-center gap-4 z-10"
                  style={{ opacity }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-[var(--accent-mint)] bg-[var(--glass-bg)] backdrop-blur-xl flex items-center justify-center transition-all duration-200"
                    style={{ 
                      scale,
                      boxShadow: glow
                    }}
                  >
                    <Icon className="w-6 h-6 text-[var(--accent-mint)]" />
                  </motion.div>
                  
                  <div>
                    <div className="text-sm whitespace-nowrap">
                      {node.label}
                    </div>
                    
                    {/* Voice sublabel - only for Node 3 (Bell icon) */}
                    {node.sublabel && (
                      <div className="text-xs text-[var(--foreground-muted)] mt-1 whitespace-nowrap">
                        {node.sublabel}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}