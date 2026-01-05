import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Calendar, 
  Phone, 
  FileText, 
  Settings,
  CheckCircle,
  ArrowRight,
  Minus
} from 'lucide-react';

export function About() {
  const flowEasing = [0.22, 1, 0.36, 1];

  const systemNodes = [
    { icon: Calendar, label: 'Scheduling' },
    { icon: Phone, label: 'Communication' },
    { icon: FileText, label: 'Intake' },
    { icon: Settings, label: 'Automation' }
  ];

  const painPoints = [
    { label: 'Confirmations', detail: 'Manual calls consume staff time' },
    { label: 'Reschedules', detail: 'Changes create scheduling chaos' },
    { label: 'Follow ups', detail: 'Reminders fall through the cracks' },
    { label: 'No shows', detail: 'Lost revenue without warning' }
  ];

  const whatWeAre = [
    'A clinic operations layer',
    'An automation engine',
    'A communication system',
    'A support layer for existing tools'
  ];

  const whatWeAreNot = [
    'Not a marketplace',
    'Not an EHR',
    'Not a staffing replacement',
    'Not another tool to train for weeks'
  ];

  const clinicTypes = [
    { name: 'Primary care clinics', description: 'Built for daily patient volume and routine workflows' },
    { name: 'Multi-provider practices', description: 'Coordinated scheduling across multiple providers' },
    { name: 'Specialty clinics', description: 'Handles specialized intake and communication needs' },
    { name: 'Growing healthcare groups', description: 'Scales across locations without added complexity' }
  ];

  const workflowSteps = [
    { label: 'Configure', detail: 'Set rules once' },
    { label: 'Run', detail: 'System applies automatically' },
    { label: 'Monitor', detail: 'Clear visibility' },
    { label: 'Step in only when needed', detail: 'Exceptions only' }
  ];

  const reliabilityChecks = [
    'Designed for real clinic workflows',
    'Predictable behavior',
    'Clear system states',
    'Human-readable automation',
    'Support when needed'
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* HERO */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8">Built for how clinics actually work</h1>
              <p className="text-2xl text-[var(--foreground-muted)]">
                Clinicflow exists to remove operational friction, not to replace your systems or add complexity.
              </p>
            </motion.div>

            {/* Right: Blue abstract system visual */}
            <motion.div
              className="p-12 rounded-2xl"
              style={{ backgroundColor: '#2563EB' }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-6">
                {systemNodes.map((node, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: flowEasing }}
                  >
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                    >
                      <node.icon className="w-7 h-7" style={{ color: 'white' }} />
                    </div>
                    <span className="text-sm text-white/90">{node.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Connection lines (decorative) */}
              <svg 
                className="mt-8 w-full h-12" 
                viewBox="0 0 200 48" 
                fill="none"
                style={{ opacity: 0.3 }}
              >
                <line x1="50" y1="0" x2="150" y2="48" stroke="white" strokeWidth="2" />
                <line x1="150" y1="0" x2="50" y2="48" stroke="white" strokeWidth="2" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW WE DESIGN */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">How we design</h2>
              <div className="text-xl text-[var(--foreground-muted)] space-y-6">
                <p>
                  Clinicflow is built to reduce daily decision making. You set rules once. The system follows them automatically. Routine work runs quietly in the background.
                </p>
                <p>
                  The interface shows you what is happening without demanding your attention. System states are clear. Actions are predictable. Interruptions only occur when something genuinely needs a human decision.
                </p>
                <p>
                  Staff see what they need when they need it. Everything else stays out of the way.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW CLINICS WORK WITH CLINICFLOW */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">How clinics work with Clinicflow</h2>
          </motion.div>

          {/* Horizontal flow visualization */}
          <motion.div
            className="max-w-5xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {workflowSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-4 flex-1">
                  <motion.div
                    className="p-6 rounded-xl w-full transition-all duration-200"
                    style={{
                      backgroundColor: '#EAF1FF',
                      border: '1px solid #2563EB'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: flowEasing }}
                  >
                    <div className="text-center">
                      <div className="mb-2" style={{ color: '#2563EB' }}>{step.label}</div>
                      <div className="text-sm text-[var(--foreground-muted)]">{step.detail}</div>
                    </div>
                  </motion.div>
                  {i < workflowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block flex-shrink-0" size={20} style={{ color: '#94A3B8' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Detailed explanations for each step */}
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Configure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: flowEasing }}
            >
              <h3 className="mb-4">Configure</h3>
              <p className="text-xl text-[var(--foreground-muted)]">
                Admins set rules once for confirmations, reminders, follow ups, and exceptions. This happens upfront. It does not require daily involvement. The clinic defines when patients should be contacted, what qualifies as an exception, and how the system should respond to common scenarios.
              </p>
            </motion.div>

            {/* Run */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: flowEasing }}
            >
              <h3 className="mb-4">Run</h3>
              <p className="text-xl text-[var(--foreground-muted)]">
                Once configured, the system executes automatically. Routine communication and tasks complete without staff involvement. Confirmations are sent. Responses are logged. Schedule changes are applied. Most activity does not need to be watched. The system follows the rules you set.
              </p>
            </motion.div>

            {/* Monitor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: flowEasing }}
            >
              <h3 className="mb-4">Monitor</h3>
              <p className="text-xl text-[var(--foreground-muted)]">
                Clinics can see what is happening when they want to. No constant alerts. No noise. Visibility exists without pressure to act. Staff can check the schedule, review confirmations, or see upcoming tasks. The system does not interrupt unless intervention is needed.
              </p>
            </motion.div>

            {/* Step in only when needed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: flowEasing }}
            >
              <h3 className="mb-4">Step in only when needed</h3>
              <p className="text-xl text-[var(--foreground-muted)]">
                Staff are only involved when something falls outside the rules. A patient does not respond. An appointment needs special handling. A schedule conflict requires a decision. Exceptions are clear and intentional. Humans focus on care, not routine operations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-40 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">Built to work quietly. Ready when you are.</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                See how the system handles routine operations without constant attention.
              </p>

              {/* CTA Block */}
              <div className="max-w-[720px] mx-auto p-10 rounded-3xl" style={{ backgroundColor: '#EAF1FF' }}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/how-it-works">
                    <motion.button
                      className="px-10 py-5 rounded-full text-lg"
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
                      See how it works
                    </motion.button>
                  </Link>

                  <Link to="/trial">
                    <motion.button
                      className="px-10 py-5 rounded-full text-lg border-2"
                      style={{ 
                        backgroundColor: 'transparent',
                        borderColor: '#2563EB',
                        color: '#2563EB',
                        transition: 'all 200ms ease-out'
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#2563EB';
                      }}
                    >
                      Join Waitlist for 3 Months Free Access
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}