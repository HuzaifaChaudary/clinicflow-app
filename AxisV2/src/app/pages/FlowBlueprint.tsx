import { motion } from 'motion/react';
import { HorizontalFlow, VerticalFlow, GridFlow, HorizontalFlowStep, VerticalFlowStep, GridFlowStep } from '../components/FlowPattern';
import { Calendar, Phone, FileText, CheckCircle, MessageSquare, Bell } from 'lucide-react';

/**
 * UNIVERSAL VECTOR FLOW BLUEPRINT DEMONSTRATION
 * 
 * This page shows the three canonical layouts:
 * 1. Horizontal Flow (hero sections)
 * 2. Vertical Flow (long pages)
 * 3. Grid Flow (step-based progression)
 */

export function FlowBlueprint() {
  const flowEasing = [0.22, 1, 0.36, 1];

  // HORIZONTAL FLOW EXAMPLES
  const horizontalFlows: HorizontalFlowStep[] = [
    {
      nodeLabel: 'Patient books',
      actionIcon: Calendar,
      actionLabel: 'Auto scheduling',
      actionDescription: 'Online booking system',
      outcomeLabel: 'Schedule filled',
      outcomeIcon: CheckCircle,
      connectorType: 'automated'
    },
    {
      nodeLabel: 'Call initiated',
      actionIcon: Phone,
      actionLabel: 'Voice call placed',
      actionDescription: '24-48 hours before',
      outcomeLabel: 'Response logged',
      outcomeIcon: CheckCircle,
      connectorType: 'automated'
    },
    {
      nodeLabel: 'Forms sent',
      actionIcon: FileText,
      actionLabel: 'Intake collection',
      actionDescription: 'Email + SMS delivery',
      outcomeLabel: 'Patient prepared',
      outcomeIcon: CheckCircle,
      connectorType: 'automated'
    },
  ];

  // VERTICAL FLOW EXAMPLE
  const verticalFlows: VerticalFlowStep[] = [
    {
      nodeLabel: 'Appointment created',
      actionIcon: Calendar,
      actionLabel: 'Schedule sync',
      actionDescription: 'Availability updated',
      outcomeLabel: 'Calendar updated',
      connectorType: 'automated'
    },
    {
      nodeLabel: 'Reminder scheduled',
      actionIcon: Bell,
      actionLabel: 'Auto reminder',
      actionDescription: 'Voice or SMS',
      outcomeLabel: 'Patient notified',
      connectorType: 'automated'
    },
    {
      nodeLabel: 'Response received',
      actionIcon: MessageSquare,
      actionLabel: 'Confirm or reschedule',
      actionDescription: 'Patient choice',
      outcomeLabel: 'Status confirmed',
      connectorType: 'automated'
    },
  ];

  // GRID FLOW EXAMPLE
  const gridFlows: GridFlowStep[] = [
    {
      step: 1,
      label: 'Phone calls drop',
      description: 'Patients book online instead of calling. Reception desk quieter within days.',
    },
    {
      step: 2,
      label: 'No shows reduce',
      description: 'Voice confirmations reach patients automatically. Cancellations happen earlier.',
    },
    {
      step: 3,
      label: 'Sessions start prepared',
      description: 'Intake forms completed before arrival. Every appointment begins with context.',
    },
    {
      step: 4,
      label: 'Staff focus improves',
      description: 'Routine work handled quietly. Team handles exceptions only.',
    },
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* Hero */}
      <section className="relative py-20 border-b border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20">
              <span className="text-sm text-[var(--blue-vivid)]">Design System</span>
            </div>
            <h1 className="mb-6">Universal Vector Flow Blueprint</h1>
            <p className="text-xl text-[var(--foreground-muted)]">
              One pattern. Three layouts. Every process flow across Axis follows this exact structure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Core Pattern */}
      <section className="relative py-32 bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="mb-6">The Core Pattern</h2>
            <p className="text-xl text-[var(--foreground-muted)] mb-8">
              Every flow uses exactly 5 elements, always in this order:
            </p>
            <div className="text-3xl mb-6 text-[var(--blue-primary)]">
              Node → Connector → Action → Connector → Outcome
            </div>
            <div className="text-4xl text-[var(--foreground-muted)]">
              ● ───▶ ◻ ───▶ ✓
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
              <div className="w-12 h-12 rounded-full bg-[var(--foreground-muted)]/30 border border-[var(--foreground-muted)]/40 mb-4 mx-auto" />
              <div className="text-sm text-center mb-2">Node</div>
              <div className="text-xs text-[var(--foreground-muted)] text-center">
                10-14px circle, moment in time
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
              <div className="h-12 flex items-center justify-center mb-4">
                <div className="w-full h-[2px] bg-[var(--blue-primary)]" />
              </div>
              <div className="text-sm text-center mb-2">Connector</div>
              <div className="text-xs text-[var(--foreground-muted)] text-center">
                2px stroke, shows movement
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
              <div className="h-12 flex items-center justify-center mb-4">
                <div className="px-4 py-2 rounded-lg bg-[var(--blue-soft)]">
                  <FileText className="w-5 h-5 text-[var(--blue-vivid)]" />
                </div>
              </div>
              <div className="text-sm text-center mb-2">Action Card</div>
              <div className="text-xs text-[var(--foreground-muted)] text-center">
                System step, blue tint
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
              <div className="h-12 flex items-center justify-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--orange-signal)] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-center mb-2">Outcome</div>
              <div className="text-xs text-[var(--foreground-muted)] text-center">
                Orange check, resolution
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layout 1: Horizontal Flow */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4">Horizontal Flow</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Best for hero sections. Shows complete flow in one line.
            </p>
          </div>

          <div className="space-y-12">
            {horizontalFlows.map((step, index) => (
              <div key={index} className="flex justify-center">
                <HorizontalFlow step={step} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layout 2: Vertical Flow */}
      <section className="relative py-32 bg-[var(--background-secondary)] border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4">Vertical Flow</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Best for long pages. Shows sequential progression.
            </p>
          </div>

          <div className="flex justify-center">
            <VerticalFlow steps={verticalFlows} />
          </div>
        </div>
      </section>

      {/* Layout 3: Grid Flow */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4">Grid Flow</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Best for "What clinics notice first" style sections. Shows numbered progression.
            </p>
          </div>

          <GridFlow steps={gridFlows} />
        </div>
      </section>

      {/* Color System */}
      <section className="relative py-32 bg-[var(--background-secondary)] border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center">Color System (Locked)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
                <div className="w-16 h-16 rounded-lg bg-[var(--blue-primary)] mb-4" />
                <div className="text-sm mb-2">Connectors & Active States</div>
                <div className="text-xs text-[var(--foreground-muted)]">
                  Blue (#2563EB) - All lines, arrows, active elements
                </div>
              </div>

              <div className="p-8 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
                <div className="w-16 h-16 rounded-lg bg-[var(--orange-signal)] mb-4" />
                <div className="text-sm mb-2">Outcomes & Completion</div>
                <div className="text-xs text-[var(--foreground-muted)]">
                  Orange (#F97316) - Final nodes, checkmarks only
                </div>
              </div>

              <div className="p-8 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
                <div className="w-16 h-16 rounded-lg bg-[var(--blue-soft)] mb-4" />
                <div className="text-sm mb-2">Action Card Backgrounds</div>
                <div className="text-xs text-[var(--foreground-muted)]">
                  Blue-tinted (#DBEAFE) - System module containers
                </div>
              </div>

              <div className="p-8 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
                <div className="w-16 h-16 rounded-lg bg-[var(--foreground-muted)]/30 border border-[var(--foreground-muted)]/40 mb-4" />
                <div className="text-sm mb-2">Inactive Nodes</div>
                <div className="text-xs text-[var(--foreground-muted)]">
                  Muted blue-gray - Default state markers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interaction States */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">Hover / Interaction States</h2>
            <p className="text-xl text-[var(--foreground-muted)] mb-12">
              Hover over any Action Card above to see the system come alive.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="text-sm mb-3">On hover:</div>
                <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
                  <li>• Background shifts to deeper blue</li>
                  <li>• Text turns white</li>
                  <li>• Connectors leading in brighten</li>
                  <li>• Subtle scale animation (1.02x)</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="text-sm mb-3">Timing:</div>
                <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
                  <li>• Transition: 300ms</li>
                  <li>• Easing: cubic-bezier</li>
                  <li>• Stagger: 0.1s per element</li>
                  <li>• Feels immediate, not jarring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Rules */}
      <section className="relative py-32 bg-[var(--background-secondary)] border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center">Where This Blueprint MUST Be Used</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-8 rounded-xl bg-[var(--background)] border-2 border-[var(--blue-primary)]">
                <div className="text-sm text-[var(--blue-primary)] mb-4">MANDATORY</div>
                <ul className="space-y-3 text-sm">
                  <li>• How the day runs</li>
                  <li>• What clinics notice first</li>
                  <li>• Voice confirmations</li>
                  <li>• Scheduling flow</li>
                  <li>• Intake → Visit → Follow-up</li>
                  <li>• Admin automation</li>
                </ul>
              </div>

              <div className="p-8 rounded-xl bg-[var(--background)] border border-[var(--glass-border)]">
                <div className="text-sm text-[var(--foreground-muted)] mb-4">RECOMMENDED</div>
                <ul className="space-y-3 text-sm text-[var(--foreground-muted)]">
                  <li>• Metrics explanation</li>
                  <li>• Pricing logic</li>
                  <li>• Onboarding steps</li>
                  <li>• Support workflows</li>
                  <li>• Integration guides</li>
                </ul>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-[#FEF2F2] border-2 border-[#DC2626]">
              <div className="text-sm text-[#DC2626] mb-4">NEVER DO THIS</div>
              <ul className="space-y-2 text-sm text-[var(--foreground)]">
                <li>❌ No floating icons without connectors</li>
                <li>❌ No standalone cards without flow context</li>
                <li>❌ No text-only process explanations</li>
                <li>❌ No decorative arrows with no meaning</li>
                <li>❌ No random colors outside the system</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final Message */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">The Mindset Shift</h2>
            <p className="text-xl text-[var(--foreground-muted)] mb-8">
              You are not designing a website.
            </p>
            <p className="text-2xl mb-8">
              You are designing a calm, visible operating system for clinics.
            </p>
            <div className="p-8 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20">
              <p className="text-lg">
                This blueprint is how you show: <strong>order</strong>, <strong>inevitability</strong>, <strong>control</strong>, and <strong>relief</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}