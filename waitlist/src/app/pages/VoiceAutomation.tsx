import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { VoiceStateVisualizer } from '../components/VoiceStateVisualizer';
import { ConversationalFlow, ConversationFlowStep } from '../components/ConversationalFlow';
import { Phone, CheckCircle, Calendar, Bell, TrendingDown } from 'lucide-react';

/**
 * VOICE AUTOMATION PAGE — Conversational Flow System
 * 
 * Visual metaphor: Conversation unfolding
 * Design language: Call bubbles, audio waves, phone/response states
 * More organic spacing than other pages
 * 
 * Hero section: PRESERVED EXACTLY AS IS
 * Flow section: Vertical spine with conversation cards
 */

export function VoiceAutomation() {
  const flowEasing = [0.22, 1, 0.36, 1];

  // Conversational flow steps
  const conversationSteps: ConversationFlowStep[] = [
    {
      id: 'call-initiated',
      label: 'Call initiated',
      icon: Phone,
      conversation: {
        system: 'This is Clinicflow calling about your appointment with Dr. Smith tomorrow at 2 PM.',
        patient: undefined
      },
      outcome: {
        title: 'Patient reached',
        description: 'System automatically places voice call 24-48 hours before appointment. No staff involvement required.',
        metric: '24-48h'
      }
    },
    {
      id: 'patient-reached',
      label: 'Patient reached',
      icon: Bell,
      conversation: {
        system: 'To confirm your appointment, press 1. To reschedule, press 2.',
        patient: undefined
      },
      outcome: {
        title: 'Clear choice presented',
        description: 'Patient hears simple options. No ambiguity. No typing required. Immediate action expected.',
        metric: '2 options'
      }
    },
    {
      id: 'patient-responds',
      label: 'Patient responds',
      icon: CheckCircle,
      conversation: {
        system: 'Your appointment is confirmed. We will see you tomorrow at 2 PM.',
        patient: 'Presses 1 to confirm'
      },
      outcome: {
        title: 'Response logged instantly',
        description: 'System records confirmation immediately. Schedule updates in real-time. Staff sees current status without making calls.',
        metric: 'Real-time'
      }
    },
    {
      id: 'schedule-updated',
      label: 'Schedule updated',
      icon: Calendar,
      conversation: {
        system: 'Appointment confirmed. Your clinic schedule has been updated.',
        patient: undefined
      },
      outcome: {
        title: 'All systems synchronized',
        description: 'Confirmation flows to scheduling system. No manual data entry. No phone tag. No missed updates.',
        metric: 'Instant sync'
      }
    },
    {
      id: 'no-show-avoided',
      label: 'No-show avoided',
      icon: TrendingDown,
      conversation: {
        system: 'Let us know what works better for you. Press 1 for this week. Press 2 for next week.',
        patient: undefined
      },
      outcome: {
        title: 'Early warning prevents losses',
        description: 'Cancellations happen 24-48 hours early. Clinic has time to fill slot. Revenue protected.',
        metric: '40-60% reduction'
      }
    }
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* ========================================
          HERO SECTION — PRESERVED EXACTLY AS IS
          ======================================== */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Dynamic Voice State */}
            <VoiceStateVisualizer />

            {/* Right: Hero Content */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-8">Fewer no-shows, without more staff</h1>
              <p className="text-2xl mb-8">
                Clinicflow calls patients to confirm and reschedule appointments automatically, so your front desk doesn't have to.
              </p>
              <p className="text-xl text-[var(--foreground-muted)]">
                Text reminders get ignored. Voicemails go unchecked. Phone calls from the clinic get returned. Voice confirmations work because patients take them seriously.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================
          CONVERSATIONAL FLOW SECTION (NEW)
          ======================================== */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-20 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">How voice confirmations work</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Watch the conversation unfold. Each step happens automatically.
            </p>
          </motion.div>

          <ConversationalFlow steps={conversationSteps} variant="voice" />
        </div>
      </section>

      {/* Why Voice Works Better Than Text */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">Why voice works better than text</h2>
              <p className="text-xl text-[var(--foreground-muted)]">
                Phone calls demand immediate attention. Patients can't passively dismiss them like text messages.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Immediate response required',
                  description: 'Phone calls interrupt. Patients answer and respond in the moment. No "I\'ll do it later" procrastination.'
                },
                {
                  title: 'Professional and serious',
                  description: 'Calls from a clinic feel official. Patients take them seriously, unlike texts that blend into notification noise.'
                },
                {
                  title: 'Clear call to action',
                  description: '"Press 1 or press 2" is unambiguous. Patients don\'t need to type responses or remember to follow up.'
                },
                {
                  title: 'Handles reschedules instantly',
                  description: 'Patients can reschedule during the call. No back-and-forth texts. No waiting for staff availability.'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-xl bg-white border border-[var(--glass-border)] hover:bg-[var(--blue-clinical-hover)] hover:border-[var(--blue-primary)]/40 transition-all duration-200 group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: flowEasing }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  style={{
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <h4 className="mb-3 group-hover:text-[var(--blue-primary)] transition-colors duration-200">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Real Outcomes */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-12">What clinics see after implementing voice confirmations</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { metric: '40-60%', label: 'Reduction in no-shows', delay: 0 },
                { metric: '8-12 hrs', label: 'Front desk time saved per week', delay: 0.1 },
                { metric: '0', label: 'Additional staff needed', delay: 0.2 }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-xl bg-white border border-[var(--glass-border)] hover:bg-[var(--blue-clinical-hover)] hover:border-[var(--blue-primary)]/40 transition-all duration-200 group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: item.delay, ease: flowEasing }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}
                  style={{
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="text-4xl mb-3 text-[var(--blue-primary)] group-hover:scale-110 transition-transform duration-200">
                    {item.metric}
                  </div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: flowEasing }}
            >
              Voice confirmations don't just reduce no-shows. They free up staff time, fill more appointment slots, and create better patient accountability, without hiring more people.
            </motion.p>

            {/* CTA Block */}
            <motion.div
              className="mt-16 p-10 rounded-3xl text-center"
              style={{ backgroundColor: '#EAF1FF' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: flowEasing }}
            >
              <h3 className="text-2xl mb-4">Ready to reduce no-shows?</h3>
              <p className="text-sm mb-8" style={{ color: '#64748B' }}>
                Join the waitlist and get 3 months free access when we launch.
              </p>
              <Link to="/trial">
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
                  Join Waitlist for 3 Months Free Access
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}