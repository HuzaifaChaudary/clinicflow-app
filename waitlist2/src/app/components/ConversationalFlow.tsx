import { motion, useScroll, useTransform } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

/**
 * CONVERSATIONAL FLOW SYSTEM — Voice vs SMS
 * 
 * Voice: Interruptive, decisive, immediate
 * - Blue system messages (#2563EB)
 * - Strong directional arrows
 * - Clear vertical progression
 * - Feels like certainty
 * 
 * SMS: Passive, asynchronous, fragile
 * - Light blue bubbles (#EFF6FF)
 * - Thin connectors, status indicators
 * - Non-linear, gaps for waiting
 * - Feels like chance
 */

export interface ConversationFlowStep {
  id: string;
  label: string;
  icon: LucideIcon;
  conversation: {
    system: string;      // What Axis says/does
    patient?: string;    // What patient experiences
  };
  outcome: {
    title: string;
    description: string;
    metric?: string;
  };
}

interface ConversationalFlowProps {
  steps: ConversationFlowStep[];
  variant?: 'voice' | 'sms';
}

export function ConversationalFlow({ steps, variant = 'voice' }: ConversationalFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Track scroll position to determine active step
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerTop = container.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Calculate which step should be active based on scroll position
      const stepElements = container.querySelectorAll('[data-step-index]');
      stepElements.forEach((element, index) => {
        const stepTop = (element as HTMLElement).offsetTop + containerTop;
        const stepBottom = stepTop + (element as HTMLElement).offsetHeight;

        if (scrollPosition >= stepTop && scrollPosition < stepBottom) {
          setActiveStepIndex(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (variant === 'sms') {
    return <SMSFlow steps={steps} containerRef={containerRef} activeStepIndex={activeStepIndex} />;
  }

  return <VoiceFlow steps={steps} containerRef={containerRef} activeStepIndex={activeStepIndex} />;
}

// VOICE FLOW — Interruptive, decisive, immediate
interface FlowProps {
  steps: ConversationFlowStep[];
  containerRef: React.RefObject<HTMLDivElement>;
  activeStepIndex: number;
}

function VoiceFlow({ steps, containerRef, activeStepIndex }: FlowProps) {
  return (
    <div ref={containerRef} className="relative">
      {/* Desktop: Left spine + right cards */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT: Vertical spine */}
          <div className="col-span-3 relative">
            {/* Sticky spine container */}
            <div className="sticky top-32">
              <div className="relative py-12">
                {/* Vertical connecting line */}
                <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-[var(--blue-primary)]/20" />

                {/* Nodes */}
                <div className="space-y-16 relative">
                  {steps.map((step, index) => {
                    const isActive = index === activeStepIndex;
                    const isPassed = index < activeStepIndex;

                    return (
                      <motion.div
                        key={step.id}
                        className="relative flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {/* Node circle (larger for Voice) */}
                        <motion.div
                          className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                            isActive
                              ? 'bg-[var(--blue-primary)] shadow-[0_0_20px_rgba(37,99,235,0.5)]'
                              : isPassed
                              ? 'bg-[var(--blue-primary)]/70'
                              : 'bg-[#E5E7EB]'
                          }`}
                          animate={isActive ? {
                            scale: [1, 1.05, 1],
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <step.icon className={`w-7 h-7 ${
                            isActive || isPassed ? 'text-white' : 'text-[var(--foreground-muted)]'
                          }`} />
                        </motion.div>

                        {/* Label */}
                        <div className="flex-1">
                          <div className={`text-sm transition-colors duration-300 ${
                            isActive ? 'text-[var(--blue-primary)]' : 'text-[var(--foreground-muted)]'
                          }`}>
                            {step.label}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Voice conversation cards */}
          <div className="col-span-9 space-y-32 py-12">
            {steps.map((step, index) => (
              <VoiceCard
                key={step.id}
                step={step}
                index={index}
                isActive={index === activeStepIndex}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical stack */}
      <div className="block lg:hidden space-y-16">
        {steps.map((step, index) => (
          <div key={step.id} data-step-index={index}>
            <motion.div
              className="flex items-start gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                index === activeStepIndex ? 'bg-[var(--blue-primary)]' : 'bg-[#E5E7EB]'
              }`}>
                <step.icon className={`w-5 h-5 ${
                  index === activeStepIndex ? 'text-white' : 'text-[var(--foreground-muted)]'
                }`} />
              </div>
              <div className="text-sm text-[var(--blue-primary)] pt-3">{step.label}</div>
            </motion.div>

            <VoiceCard step={step} index={index} isActive={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Voice conversation card — Blue system messages, white text
interface VoiceCardProps {
  step: ConversationFlowStep;
  index: number;
  isActive: boolean;
}

function VoiceCard({ step, index }: VoiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      data-step-index={index}
      className="space-y-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Voice system message (PRIMARY MOMENT - Blue background, white text) */}
      <motion.div
        className="flex justify-start"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-[85%] p-6 rounded-2xl rounded-tl-sm bg-[var(--blue-primary)] shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
          <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Axis System</div>
          <p className="text-base leading-relaxed" style={{ color: '#FFFFFF' }}>{step.conversation.system}</p>
        </div>
      </motion.div>

      {/* Patient response (if exists) */}
      {step.conversation.patient && (
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="max-w-[75%] p-6 rounded-2xl rounded-tr-sm bg-white border border-[var(--glass-border)] shadow-[var(--shadow-soft)]">
            <div className="text-xs text-[var(--foreground-muted)] mb-2">Patient</div>
            <p className="text-base leading-relaxed text-[var(--foreground)]">{step.conversation.patient}</p>
          </div>
        </motion.div>
      )}

      {/* Outcome card (SECONDARY - White background) */}
      <motion.div
        className={`p-8 rounded-xl transition-all duration-200 cursor-pointer ${
          isHovered
            ? 'bg-[var(--blue-clinical-hover)] border-[1.5px] border-[var(--blue-primary)]/40 shadow-[0_8px_24px_rgba(37,99,235,0.12)]'
            : 'bg-white border border-[var(--glass-border)] shadow-[var(--shadow-soft)]'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h3 className={`mb-3 transition-colors duration-200 ${
              isHovered ? 'text-[var(--blue-primary)]' : 'text-[var(--foreground)]'
            }`}>
              {step.outcome.title}
            </h3>
            <p className="text-[var(--foreground-muted)]">
              {step.outcome.description}
            </p>
          </div>

          {/* Metric badge (if exists) */}
          {step.outcome.metric && (
            <div className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              isHovered ? 'bg-[var(--blue-primary)]' : 'bg-[var(--blue-soft)]'
            }`}>
              <div className={`text-sm transition-colors duration-200 ${
                isHovered ? 'text-white' : 'text-[var(--blue-primary)]'
              }`}>
                {step.outcome.metric}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// SMS FLOW — Passive, asynchronous, fragile
function SMSFlow({ steps, containerRef, activeStepIndex }: FlowProps) {
  return (
    <div ref={containerRef} className="relative">
      {/* Desktop: Non-linear, staggered layout */}
      <div className="hidden lg:block">
        <div className="space-y-24 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <SMSCard
              key={step.id}
              step={step}
              index={index}
              isActive={index === activeStepIndex}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Vertical stack */}
      <div className="block lg:hidden space-y-16">
        {steps.map((step, index) => (
          <div key={step.id} data-step-index={index}>
            <SMSCard step={step} index={index} isActive={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

// SMS conversation card — Light blue bubbles, status indicators
interface SMSCardProps {
  step: ConversationFlowStep;
  index: number;
  isActive: boolean;
}

function SMSCard({ step, index }: SMSCardProps) {
  const status = step.conversation.status || 'delivered';
  const hasNoResponse = status === 'no-response';

  return (
    <motion.div
      data-step-index={index}
      className="space-y-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* SMS system message (Light blue, chat-like) */}
      <motion.div
        className="flex justify-start"
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={`max-w-[75%] p-5 rounded-2xl rounded-tl-sm ${
          hasNoResponse ? 'bg-[#F3F4F6] opacity-60' : 'bg-[#EFF6FF]'
        } shadow-sm`}>
          <p className={`text-sm leading-relaxed ${
            hasNoResponse ? 'text-[var(--foreground-muted)]' : 'text-[#1E3A8A]'
          }`}>
            {step.conversation.system}
          </p>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2 mt-3">
            <div className={`w-1.5 h-1.5 rounded-full ${
              status === 'sent' ? 'bg-[#9CA3AF]' :
              status === 'delivered' ? 'bg-[#60A5FA]' :
              status === 'seen' ? 'bg-[#2563EB]' :
              'bg-[#E5E7EB]'
            }`} />
            <span className="text-xs text-[var(--foreground-muted)] capitalize">
              {status === 'no-response' ? 'No response' : status}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Patient response (if exists and not no-response) */}
      {step.conversation.patient && !hasNoResponse && (
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="max-w-[70%] p-5 rounded-2xl rounded-tr-sm bg-white border border-[var(--glass-border)] shadow-sm">
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              {step.conversation.patient}
            </p>
          </div>
        </motion.div>
      )}

      {/* Visual gap for no-response (represents waiting/silence) */}
      {hasNoResponse && (
        <motion.div
          className="flex justify-center py-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
            <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
            <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
            <div className="w-2 h-2 rounded-full bg-[#E5E7EB]" />
          </div>
        </motion.div>
      )}

      {/* Outcome card (more subtle than Voice) */}
      <motion.div
        className="p-6 rounded-xl bg-white border border-[var(--glass-border)]/50 shadow-sm"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h4 className="mb-2 text-base text-[var(--foreground)]">
          {step.outcome.title}
        </h4>
        <p className="text-sm text-[var(--foreground-muted)]">
          {step.outcome.description}
        </p>
        
        {step.outcome.metric && (
          <div className="mt-3 inline-block px-3 py-1 rounded bg-[#EFF6FF] text-xs text-[#1E3A8A]">
            {step.outcome.metric}
          </div>
        )}
      </motion.div>

      {/* Thin connector line (except last) */}
      {index < steps.length - 1 && (
        <div className="flex justify-center py-4">
          <div className={`w-px h-8 ${
            hasNoResponse ? 'border-l-2 border-dashed border-[#E5E7EB]' : 'bg-[#E5E7EB]'
          }`} />
        </div>
      )}
    </motion.div>
  );
}