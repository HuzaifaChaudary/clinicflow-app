import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  HorizontalProcessFlow,
  HorizontalProcessStep,
  SetupStack,
  SetupStackStep,
  ConveyorFlow,
  ConveyorStep,
  DecisionNode,
  DecisionBranch,
  ClinicReadyState
} from '../components/ProcessVisuals';
import {
  Settings,
  Calendar,
  Phone,
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell
} from 'lucide-react';

/**
 * HOW IT WORKS PAGE — Process-specific visual storytelling
 * 
 * Visual metaphor: Process unfolding
 * Design language: Arrows, step transitions, progressive disclosure
 * 
 * Every visualization is unique to this page.
 * No reused components from Product or other pages.
 */

export function HowItWorks() {
  const flowEasing = [0.22, 1, 0.36, 1];

  // SECTION 1: Hero — Horizontal process flow
  const heroSteps: HorizontalProcessStep[] = [
    { label: 'Admin setup', icon: Settings },
    { label: 'Booking', icon: Calendar },
    { label: 'Confirmation', icon: Phone },
    { label: 'Visit', icon: User },
    { label: 'Follow-up', icon: FileText }
  ];

  // SECTION 2: Setup Stack — Vertical timeline with contextual panel
  const setupSteps: SetupStackStep[] = [
    {
      number: '01',
      label: 'Clinic info & hours',
      description: 'Enter clinic name, location, operating hours, and time zones.',
      panelContent: {
        title: 'Basic Configuration',
        items: [
          'Clinic name and contact details',
          'Operating hours (Mon–Fri, custom weekends)',
          'Time zone and regional settings',
          'Staff roles and permissions'
        ]
      }
    },
    {
      number: '02',
      label: 'Scheduling rules',
      description: 'Define appointment types, durations, buffer times, and availability.',
      panelContent: {
        title: 'Scheduling Parameters',
        items: [
          'Appointment types and default durations',
          'Buffer times between sessions',
          'Maximum daily appointments per provider',
          'Block-out times and holidays'
        ]
      }
    },
    {
      number: '03',
      label: 'Communication preferences',
      description: 'Set when and how patients are contacted for confirmations and reminders.',
      panelContent: {
        title: 'Automation Triggers',
        items: [
          'Voice confirmation timing (24-48 hours prior)',
          'Reminder frequency and method',
          'Form delivery schedule',
          'Escalation rules for no-response'
        ]
      }
    }
  ];

  // SECTION 3: Daily Operations — Conveyor flow
  const dailySteps: ConveyorStep[] = [
    {
      icon: Calendar,
      label: 'Patient books',
      description: 'System checks availability and creates appointment'
    },
    {
      icon: CheckCircle,
      label: 'Rules applied',
      description: 'Buffer times, constraints enforced automatically'
    },
    {
      icon: Phone,
      label: 'Reminder sent',
      description: 'Voice call placed 24-48 hours before visit'
    },
    {
      icon: FileText,
      label: 'Forms delivered',
      description: 'Intake paperwork sent to patient automatically'
    }
  ];

  // SECTION 4: Exception handling — Decision nodes
  const decisionBranches: DecisionBranch[] = [
    { condition: 'Confirms', outcome: 'Appointment locked in system' },
    { condition: 'Reschedules', outcome: 'Slot reopened, calendar updated' },
    { condition: 'No answer', outcome: 'Admin notified for follow-up' }
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* SECTION 1: HERO */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-6">How Axis works</h1>
              <p className="text-2xl text-[var(--foreground-muted)]">
                Configured quickly without changing existing workflows. After that, workflows execute automatically with clear ownership and visibility.
              </p>
            </motion.div>

            {/* Right: Horizontal flow diagram */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <HorizontalProcessFlow steps={heroSteps} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INITIAL SETUP */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-20 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <div className="text-xs text-[var(--blue-primary)] mb-4 uppercase tracking-wider">Part 1</div>
            <h2 className="mb-6">Initial setup</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Admin enters basic information once. Axis applies these rules automatically every day with full tracking.
            </p>
          </motion.div>

          <SetupStack steps={setupSteps} />
        </div>
      </section>

      {/* SECTION 3: DAILY OPERATIONS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-20 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <div className="text-xs text-[var(--blue-primary)] mb-4 uppercase tracking-wider">Part 2</div>
            <h2 className="mb-6">Daily operations</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              After setup, workflows execute automatically for every appointment with clear ownership. No manual work required.
            </p>
          </motion.div>

          <ConveyorFlow steps={dailySteps} />
        </div>
      </section>

      {/* SECTION 4: EXCEPTIONS & EDGE CASES */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-20 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">What happens when patients respond</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Axis handles every response automatically with clear tracking. Staff only step in when specific attention is needed.
            </p>
          </motion.div>

          <DecisionNode
            trigger="Patient receives voice confirmation call"
            branches={decisionBranches}
          />
        </div>
      </section>

      {/* Intake & Forms Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">Forms completed before arrival</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-8">
                Patients receive intake forms automatically after booking with clear follow through. Doctors see a complete summary before the session starts.
              </p>
              <div className="space-y-3">
                {[
                  'Forms sent via email and SMS',
                  'Patient completes on their device',
                  'System generates summary for doctor',
                  'Session starts with full context'
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: flowEasing }}
                  >
                    <CheckCircle className="w-5 h-5 text-[var(--blue-primary)] mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--foreground-muted)]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="p-10 rounded-xl bg-[var(--blue-soft)]/30 border border-[var(--blue-primary)]/20"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[var(--blue-primary)]" />
                  <span className="text-lg">Intake Form</span>
                </div>
                <div className="space-y-2 text-sm text-[var(--foreground-muted)]">
                  <div className="p-3 rounded bg-white/60">Medical history</div>
                  <div className="p-3 rounded bg-white/60">Current medications</div>
                  <div className="p-3 rounded bg-white/60">Reason for visit</div>
                  <div className="p-3 rounded bg-white/60">Insurance information</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What This Means Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">What this means in practice</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Settings,
                role: 'For admins',
                description: 'Configure clinic rules once. Axis follows them automatically. Override when needed with full visibility. Never lose control.'
              },
              {
                icon: User,
                role: 'For doctors',
                description: 'Show up to appointments with full context. See clear execution status. Start sessions prepared. Focus on care, not logistics.'
              },
              {
                icon: Calendar,
                role: 'For patients',
                description: 'Book appointments anytime with clear confirmation. Get automatic reminders. Know what to bring. Show up prepared.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-xl bg-white border border-[var(--glass-border)] hover:bg-[var(--blue-clinical-hover)] hover:border-[var(--blue-primary)]/40 transition-all duration-200 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: flowEasing }}
                style={{
                  transform: 'scale(1)',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--blue-soft)] flex items-center justify-center mb-6 group-hover:bg-[var(--blue-primary)] transition-colors duration-200">
                  <item.icon className="w-6 h-6 text-[var(--blue-primary)] group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="mb-4">{item.role}</h3>
                <p className="text-[var(--foreground-muted)]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CLINIC READY STATE */}
      <section className="relative py-40 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <ClinicReadyState />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">See how this fits your clinic</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                A short walkthrough of real workflows.<br />
                No setup required. No pressure to switch systems.
              </p>

              {/* CTA Block */}
              <div className="max-w-[720px] mx-auto p-10 rounded-3xl" style={{ backgroundColor: '#EAF1FF' }}>
                <Link to="/trial">
                  <motion.button
                    className="w-full px-10 py-5 rounded-full text-lg mb-6"
                    style={{ 
                      backgroundColor: '#2563EB',
                      color: 'white',
                      transition: 'all 200ms ease-out'
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E4ED8';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Join Waitlist
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}