import { motion } from 'motion/react';
import { LucideIcon, Settings, Calendar, Phone, FileText, CheckCircle, ArrowRight, Clock, User } from 'lucide-react';
import { useState } from 'react';

/**
 * PROCESS-SPECIFIC VISUALIZATIONS FOR "HOW IT WORKS" PAGE
 * 
 * Each component is designed specifically for this page.
 * Visual language: process unfolding, arrows, step transitions.
 * No reused components from other pages.
 */

// SECTION 1: HERO — Horizontal Flow Diagram
export interface HorizontalProcessStep {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
}

interface HorizontalProcessFlowProps {
  steps: HorizontalProcessStep[];
}

export function HorizontalProcessFlow({ steps }: HorizontalProcessFlowProps) {
  return (
    <div className="relative">
      {/* Desktop: Horizontal flow */}
      <div className="hidden md:flex items-center justify-between gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Node */}
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.isActive
                  ? 'bg-[var(--blue-primary)] shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-[var(--blue-soft)]'
              }`}>
                <step.icon className={`w-7 h-7 ${
                  step.isActive ? 'text-white' : 'text-[var(--blue-primary)]'
                }`} />
              </div>
              <span className={`text-sm text-center max-w-[100px] ${
                step.isActive ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
              }`}>
                {step.label}
              </span>
            </motion.div>

            {/* Arrow connector (except last) */}
            {index < steps.length - 1 && (
              <motion.div
                className="flex-1 h-[2px] bg-[var(--blue-primary)]/30 mx-3 relative"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                style={{ transformOrigin: 'left' }}
              >
                <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--blue-primary)]/30" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Vertical flow */}
      <div className="flex md:hidden flex-col gap-4">
        {steps.map((step, index) => (
          <div key={index}>
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                step.isActive ? 'bg-[var(--blue-primary)]' : 'bg-[var(--blue-soft)]'
              }`}>
                <step.icon className={`w-5 h-5 ${
                  step.isActive ? 'text-white' : 'text-[var(--blue-primary)]'
                }`} />
              </div>
              <span className="text-sm">{step.label}</span>
            </motion.div>
            {index < steps.length - 1 && (
              <div className="w-[2px] h-8 bg-[var(--blue-primary)]/30 ml-6 my-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// SECTION 2: SETUP STACK — Vertical timeline with contextual panel
export interface SetupStackStep {
  number: string;
  label: string;
  description: string;
  panelContent: {
    title: string;
    items: string[];
  };
}

interface SetupStackProps {
  steps: SetupStackStep[];
}

export function SetupStack({ steps }: SetupStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left: Numbered steps with timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-[1.5px] bg-[var(--blue-primary)]/20 hidden lg:block" />

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={index}
                className={`relative p-6 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--blue-clinical-hover)] border-[1.5px] border-[var(--blue-primary)]/40'
                    : 'bg-white border border-[var(--glass-border)] hover:bg-[var(--blue-clinical-hover)] hover:border-[var(--blue-primary)]/20'
                }`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Number badge */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                    isActive
                      ? 'bg-[var(--blue-primary)] text-white'
                      : 'bg-[var(--blue-soft)] text-[var(--blue-primary)]'
                  }`}>
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`mb-2 text-lg ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}>
                      {step.label}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right: Contextual system panel */}
      <motion.div
        className="sticky top-32 p-8 rounded-xl bg-[var(--blue-soft)]/30 border border-[var(--blue-primary)]/20"
        key={activeIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <div className="text-xs text-[var(--blue-primary)] mb-2 uppercase tracking-wider">System Panel</div>
          <h3 className="text-xl">{steps[activeIndex].panelContent.title}</h3>
        </div>

        <div className="space-y-3">
          {steps[activeIndex].panelContent.items.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/60"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <CheckCircle className="w-4 h-4 text-[var(--blue-primary)] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[var(--foreground-muted)]">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// SECTION 3: CONVEYOR FLOW — Left-to-right process blocks
export interface ConveyorStep {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface ConveyorFlowProps {
  steps: ConveyorStep[];
}

export function ConveyorFlow({ steps }: ConveyorFlowProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* Desktop: Horizontal conveyor */}
      <div className="hidden lg:block relative">
        {/* Background alternating bands */}
        <div className="absolute inset-0 flex">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 ${index % 2 === 0 ? 'bg-transparent' : 'bg-[var(--blue-soft)]/10'}`}
            />
          ))}
        </div>

        <div className="relative flex items-center">
          {steps.map((step, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div key={index} className="flex items-center flex-1">
                {/* Block */}
                <motion.div
                  className={`relative p-8 rounded-xl transition-all duration-200 cursor-pointer flex-1 ${
                    isHovered
                      ? 'bg-[var(--blue-clinical-hover)] border-[1.5px] border-[var(--blue-primary)]/40 shadow-[0_4px_12px_rgba(37,99,235,0.1)]'
                      : 'bg-white border border-[var(--glass-border)]'
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  style={{
                    transform: isHovered ? 'scale(1.03) translateY(4px)' : 'scale(1)',
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                      isHovered ? 'bg-[var(--blue-primary)]' : 'bg-[var(--blue-soft)]'
                    }`}>
                      <step.icon className={`w-6 h-6 ${isHovered ? 'text-white' : 'text-[var(--blue-primary)]'}`} />
                    </div>
                    <div>
                      <h3 className={`mb-2 ${isHovered ? 'text-[var(--blue-primary)]' : ''}`}>
                        {step.label}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Arrow connector (except last) */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="px-4 flex items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                  >
                    <ArrowRight className="w-6 h-6 text-[var(--blue-primary)]/40" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical stack */}
      <div className="flex lg:hidden flex-col gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl bg-white border border-[var(--glass-border)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-[var(--blue-primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-base">{step.label}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

// SECTION 4: DECISION NODES — Branching paths
export interface DecisionBranch {
  condition: string;
  outcome: string;
}

interface DecisionNodeProps {
  trigger: string;
  branches: DecisionBranch[];
}

export function DecisionNode({ trigger, branches }: DecisionNodeProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Desktop: Branching visualization */}
      <div className="hidden md:block">
        <div className="flex flex-col items-center">
          {/* Trigger */}
          <motion.div
            className="p-6 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/30 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-center">{trigger}</p>
          </motion.div>

          {/* Vertical line down */}
          <div className="w-[1.5px] h-12 bg-[var(--blue-primary)]/30" />

          {/* Branch point */}
          <div className="w-4 h-4 rounded-full bg-[var(--blue-primary)]" />

          {/* Branches */}
          <div className="relative w-full mt-8">
            <div className="grid grid-cols-3 gap-4">
              {branches.map((branch, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Path line */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[1.5px] h-8 bg-[var(--blue-primary)]/30" />

                  {/* Branch card */}
                  <div className="p-6 rounded-xl bg-white border border-[var(--glass-border)] hover:bg-[var(--blue-clinical-hover)] hover:border-[var(--blue-primary)]/40 transition-all duration-200">
                    <div className="text-xs text-[var(--blue-primary)] mb-2 uppercase">
                      {branch.condition}
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {branch.outcome}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Linear stack */}
      <div className="flex md:hidden flex-col gap-4">
        <div className="p-6 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/30">
          <p className="text-center">{trigger}</p>
        </div>

        <div className="text-xs text-center text-[var(--foreground-muted)] py-2">
          Possible outcomes:
        </div>

        {branches.map((branch, index) => (
          <div key={index} className="p-4 rounded-xl bg-white border border-[var(--glass-border)]">
            <div className="text-xs text-[var(--blue-primary)] mb-1">{branch.condition}</div>
            <p className="text-sm text-[var(--foreground-muted)]">{branch.outcome}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// SECTION 5: CLINIC READY STATE — Final status panel
export function ClinicReadyState() {
  return (
    <motion.div
      className="max-w-2xl mx-auto p-12 rounded-2xl bg-[var(--blue-soft)]/40 border-2 border-[var(--blue-primary)]/30 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <CheckCircle className="w-10 h-10 text-[var(--blue-primary)]" />
      </motion.div>

      <h2 className="mb-4">Clinic ready to operate</h2>
      <p className="text-lg text-[var(--foreground-muted)]">
        System configured. Rules active. Automation running.
      </p>
    </motion.div>
  );
}
