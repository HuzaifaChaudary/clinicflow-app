import { motion } from 'motion/react';
import { CheckCircle, LucideIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * UNIVERSAL VECTOR FLOW BLUEPRINT
 * 
 * Core Pattern (never change):
 * Node → Connector → Action → Connector → Outcome
 * 
 * Visual: ● ───▶ ◻ ───▶ ✓
 */

// Element A: Node (the dot)
interface FlowNodeProps {
  active?: boolean;
  label?: string;
  index?: number;
}

function FlowNode({ active = false, label, index = 1 }: FlowNodeProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          active 
            ? 'bg-[var(--orange-signal)] shadow-[0_0_8px_rgba(249,115,22,0.6)]' 
            : 'bg-[rgba(107,114,128,0.3)] border border-[rgba(107,114,128,0.4)]'
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      />
      {label && (
        <div className="text-xs text-[var(--foreground-muted)] text-center max-w-[80px]">
          {label}
        </div>
      )}
    </div>
  );
}

// Element B: Connector (the line)
interface ConnectorProps {
  type?: 'automated' | 'manual';
  direction?: 'horizontal' | 'vertical';
  active?: boolean;
}

function Connector({ type = 'automated', direction = 'horizontal', active = false }: ConnectorProps) {
  if (direction === 'vertical') {
    return (
      <div className={`w-[2px] h-12 transition-all duration-300 ${
        type === 'manual' ? 'border-l-2 border-dashed' : ''
      } ${
        active ? 'bg-[var(--blue-primary)]' : 'bg-[var(--blue-primary)]/40'
      }`}>
        {/* Arrow pointing down */}
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path 
                d="M4 6 L0 0 L8 0 Z" 
                fill={active ? 'var(--blue-primary)' : 'rgba(37, 99, 235, 0.4)'}
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center min-w-[60px] px-2">
      <div className={`flex-1 h-[2px] transition-all duration-300 relative ${
        type === 'manual' ? 'border-t-2 border-dashed border-[var(--blue-primary)]' : ''
      } ${
        type === 'automated' && (active ? 'bg-[var(--blue-primary)]' : 'bg-[var(--blue-primary)]/40')
      }`}>
        {/* Arrow pointing right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
            <path 
              d="M6 4 L0 0 L0 8 Z" 
              fill={active ? 'var(--blue-primary)' : 'rgba(37, 99, 235, 0.4)'}
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Element C: Action Card (the system step)
interface ActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  isHovered?: boolean;
  onHover?: (hovered: boolean) => void;
}

function ActionCard({ icon: Icon, label, description, isHovered = false, onHover }: ActionCardProps) {
  return (
    <motion.div
      className={`relative px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer min-w-[200px] ${
        isHovered
          ? 'bg-[var(--blue-primary)] shadow-[0_4px_16px_rgba(37,99,235,0.3)]'
          : 'bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20'
      }`}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isHovered
            ? 'bg-white/20'
            : 'bg-white'
        }`}>
          <Icon className={`w-5 h-5 transition-colors duration-300 ${
            isHovered ? 'text-white' : 'text-[var(--blue-vivid)]'
          }`} />
        </div>
        <div className="flex-1">
          <div className={`text-sm transition-colors duration-300 ${
            isHovered ? 'text-white' : 'text-[var(--foreground)]'
          }`}>
            {label}
          </div>
          {description && (
            <div className={`text-xs mt-1 transition-colors duration-300 ${
              isHovered ? 'text-white/80' : 'text-[var(--foreground-muted)]'
            }`}>
              {description}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Element D: Outcome (the check / result)
interface OutcomeProps {
  label: string;
  icon?: LucideIcon;
}

function Outcome({ label, icon: Icon = CheckCircle }: OutcomeProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="w-10 h-10 rounded-full bg-[var(--orange-signal)] flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.5)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="text-xs text-[var(--foreground)] text-center max-w-[100px]">
        {label}
      </div>
    </div>
  );
}

// HORIZONTAL VERSION (best for hero sections)
export interface HorizontalFlowStep {
  nodeLabel: string;
  actionIcon: LucideIcon;
  actionLabel: string;
  actionDescription?: string;
  outcomeLabel: string;
  outcomeIcon?: LucideIcon;
  connectorType?: 'automated' | 'manual';
}

interface HorizontalFlowProps {
  step: HorizontalFlowStep;
  index?: number;
}

export function HorizontalFlow({ step, index = 0 }: HorizontalFlowProps) {
  const [hoveredAction, setHoveredAction] = useState(false);

  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* Node */}
      <FlowNode label={step.nodeLabel} index={index} />

      {/* Connector */}
      <Connector type={step.connectorType} active={hoveredAction} />

      {/* Action Card */}
      <ActionCard
        icon={step.actionIcon}
        label={step.actionLabel}
        description={step.actionDescription}
        isHovered={hoveredAction}
        onHover={setHoveredAction}
      />

      {/* Connector */}
      <Connector type="automated" active={hoveredAction} />

      {/* Outcome */}
      <Outcome label={step.outcomeLabel} icon={step.outcomeIcon} />
    </motion.div>
  );
}

// VERTICAL VERSION (best for long pages)
export interface VerticalFlowStep {
  nodeLabel: string;
  actionIcon: LucideIcon;
  actionLabel: string;
  actionDescription?: string;
  outcomeLabel: string;
  outcomeIcon?: LucideIcon;
  connectorType?: 'automated' | 'manual';
}

interface VerticalFlowProps {
  steps: VerticalFlowStep[];
}

export function VerticalFlow({ steps }: VerticalFlowProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isHovered = hoveredIndex === index;
        const isLastStep = index === steps.length - 1;

        return (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            {/* Node */}
            <FlowNode label={step.nodeLabel} active={isLastStep} index={index} />

            {/* Connector */}
            <Connector direction="vertical" type={step.connectorType} active={isHovered} />

            {/* Action Card */}
            <div className="my-2">
              <ActionCard
                icon={step.actionIcon}
                label={step.actionLabel}
                description={step.actionDescription}
                isHovered={isHovered}
                onHover={(hovered) => setHoveredIndex(hovered ? index : null)}
              />
            </div>

            {/* Connector to outcome or next step */}
            {isLastStep ? (
              <>
                <Connector direction="vertical" type="automated" active={isHovered} />
                {/* Outcome */}
                <div className="mt-2">
                  <Outcome label={step.outcomeLabel} icon={step.outcomeIcon} />
                </div>
              </>
            ) : (
              <Connector direction="vertical" type="automated" active={isHovered} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// GRID VERSION (for "What clinics notice first" style layouts)
export interface GridFlowStep {
  step: number;
  label: string;
  description: string;
}

interface GridFlowProps {
  steps: GridFlowStep[];
}

export function GridFlow({ steps }: GridFlowProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Vertical connector line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-12 bottom-12 w-[2px] bg-[var(--blue-primary)]/30 hidden md:block" />

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Node on center line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hidden md:flex">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isHovered
                    ? 'bg-[var(--blue-primary)] border-4 border-[var(--background)] shadow-lg'
                    : 'bg-[var(--blue-primary)] border-4 border-[var(--background)]'
                }`}>
                  <span className="text-sm text-white">{step.step}</span>
                </div>
              </div>

              {/* Card */}
              <div
                className={`p-8 rounded-xl transition-all duration-300 cursor-pointer ${
                  isHovered
                    ? 'bg-[var(--blue-primary)] border-2 border-[var(--blue-vivid)] shadow-[0_4px_16px_rgba(37,99,235,0.3)] scale-[1.01]'
                    : 'bg-[var(--glass-bg)] border-2 border-[var(--blue-primary)]/20 backdrop-blur-xl'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-4">
                  {/* Mobile node */}
                  <div className="flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-[var(--blue-soft)] border border-[var(--blue-primary)]">
                    <span className="text-sm text-[var(--blue-primary)]">{step.step}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className={`mb-2 transition-colors duration-300 ${
                      isHovered ? 'text-white' : 'text-[var(--foreground)]'
                    }`}>
                      {step.label}
                    </h3>
                    <p className={`transition-colors duration-300 ${
                      isHovered ? 'text-white/90' : 'text-[var(--foreground-muted)]'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {/* Orange indicator when hovered */}
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isHovered 
                      ? 'bg-[var(--orange-signal)] shadow-[0_0_8px_rgba(249,115,22,0.8)]' 
                      : 'bg-transparent'
                  }`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}