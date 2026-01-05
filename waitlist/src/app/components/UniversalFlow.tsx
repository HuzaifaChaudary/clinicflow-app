import { motion } from 'motion/react';
import { LucideIcon, CheckCircle } from 'lucide-react';
import { useState, ReactNode } from 'react';

/**
 * UNIVERSAL VECTOR FLOW BLUEPRINT
 * 
 * Core structure (never change):
 * - Left rail: vertical timeline spine (1-1.5px, muted blue-gray)
 * - Middle column: narrative text (Problem → friction → system action, 3 beats)
 * - Right column: outcome card (visual proof)
 * 
 * Visual grammar:
 * - Lines = calm continuity
 * - Nodes = state change
 * - Cards = outcome
 * - Arrows = causality (never decoration)
 */

// Flow Step Interface
export interface UniversalFlowStep {
  // Middle column: 3-beat narrative
  problem: string;      // Line 1: What's happening
  friction: string;     // Line 2: Why it's a problem
  action: string;       // Line 3: System action
  
  // Right column: Outcome
  outcome: {
    label: string;      // Short outcome text
    icon?: LucideIcon;  // Optional custom icon
    visual?: ReactNode; // Optional custom visualization
  };
  
  // Left rail: Node state
  nodeState?: 'default' | 'active' | 'complete';
}

interface UniversalFlowProps {
  steps: UniversalFlowStep[];
  variant?: 'product' | 'how-it-works' | 'voice' | 'pricing';
}

export function UniversalFlow({ steps, variant = 'product' }: UniversalFlowProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isHovered = hoveredIndex === index;
        const isLastStep = index === steps.length - 1;
        const nodeState = step.nodeState || 'default';

        return (
          <div key={index} className="relative">
            {/* Container for entire step */}
            <div className="grid grid-cols-12 gap-8 items-start py-8">
              
              {/* LEFT RAIL: Vertical timeline spine */}
              <div className="col-span-1 flex flex-col items-center relative h-full">
                {/* Vertical line (except first step) */}
                {index > 0 && (
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-[var(--flow-line)] -mt-8"
                    style={{ height: '32px' }}
                  />
                )}

                {/* Circular node */}
                <div 
                  className={`w-3 h-3 rounded-full border-[1.5px] transition-all duration-200 ${
                    nodeState === 'complete' || isLastStep
                      ? 'bg-[var(--orange-signal)] border-[var(--orange-signal)]'
                      : nodeState === 'active' || isHovered
                      ? 'bg-[var(--blue-primary)] border-[var(--blue-primary)]'
                      : 'bg-white border-[var(--flow-node)]'
                  }`}
                  style={{
                    boxShadow: isHovered ? '0 0 0 4px rgba(37, 99, 235, 0.1)' : 'none'
                  }}
                />

                {/* Vertical line to next step */}
                {!isLastStep && (
                  <div 
                    className="w-[1.5px] flex-1 bg-[var(--flow-line)] mt-2"
                    style={{ minHeight: '80px' }}
                  />
                )}
              </div>

              {/* MIDDLE COLUMN: Narrative text (3 beats) */}
              <div className="col-span-5 space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Line 1: Problem (bold) */}
                  <p className="text-base">
                    <strong>{step.problem}</strong>
                  </p>
                  
                  {/* Line 2: Friction (muted) */}
                  <p className="text-base text-[var(--foreground-muted)]">
                    {step.friction}
                  </p>
                  
                  {/* Line 3: System action (blue) */}
                  <p className="text-base text-[var(--blue-primary)]">
                    {step.action}
                  </p>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Outcome card */}
              <div className="col-span-6">
                <motion.div
                  className={`p-6 rounded-xl transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'bg-[var(--blue-clinical-hover)] border-[1.5px] border-[var(--blue-primary)]/40 shadow-[0_2px_8px_rgba(37,99,235,0.08)]'
                      : 'bg-white border-[1px] border-[var(--glass-border)] shadow-[var(--shadow-soft)]'
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    transform: isHovered ? 'scale(1.03) translateY(4px)' : 'scale(1) translateY(0)',
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Custom visualization or default icon + label */}
                  {step.outcome.visual ? (
                    step.outcome.visual
                  ) : (
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      {step.outcome.icon && (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                          isHovered 
                            ? 'bg-[var(--blue-soft)]'
                            : 'bg-[var(--background-secondary)]'
                        }`}>
                          {React.createElement(step.outcome.icon, {
                            className: `w-5 h-5 ${isHovered ? 'text-[var(--blue-primary)]' : 'text-[var(--foreground-muted)]'}`
                          })}
                        </div>
                      )}
                      
                      {/* Label */}
                      <div className={`text-sm transition-colors duration-200 ${
                        isHovered ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
                      }`}>
                        {step.outcome.label}
                      </div>

                      {/* Completion indicator for last step */}
                      {isLastStep && (
                        <div className="ml-auto">
                          <CheckCircle className="w-5 h-5 text-[var(--orange-signal)]" />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Responsive Grid Flow (for mobile/tablet)
interface ResponsiveFlowProps {
  steps: UniversalFlowStep[];
}

export function ResponsiveFlow({ steps }: ResponsiveFlowProps) {
  return (
    <>
      {/* Desktop: Full universal flow */}
      <div className="hidden lg:block">
        <UniversalFlow steps={steps} />
      </div>

      {/* Tablet: Horizontal collapsed */}
      <div className="hidden md:block lg:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="min-w-[300px] p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[var(--blue-primary)]" />
                <span className="text-xs text-[var(--foreground-muted)]">Step {index + 1}</span>
              </div>
              <p className="text-sm mb-2"><strong>{step.problem}</strong></p>
              <p className="text-sm text-[var(--foreground-muted)] mb-2">{step.friction}</p>
              <p className="text-sm text-[var(--blue-primary)]">{step.action}</p>
              <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                <p className="text-xs text-[var(--foreground-muted)]">{step.outcome.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical stacked cards */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  index === steps.length - 1
                    ? 'bg-[var(--orange-signal)] text-white'
                    : 'bg-[var(--blue-soft)] text-[var(--blue-primary)]'
                }`}>
                  {index + 1}
                </div>
              </div>
              <p className="text-sm mb-2"><strong>{step.problem}</strong></p>
              <p className="text-sm text-[var(--foreground-muted)] mb-2">{step.friction}</p>
              <p className="text-sm text-[var(--blue-primary)] mb-4">{step.action}</p>
              <div className="pt-4 border-t border-[var(--glass-border)]">
                <p className="text-sm text-[var(--foreground-muted)]">{step.outcome.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Import React for createElement
import React from 'react';
