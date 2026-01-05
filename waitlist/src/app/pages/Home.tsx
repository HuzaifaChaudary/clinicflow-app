import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { UniversalFlow, UniversalFlowStep } from '../components/UniversalFlow';
import { TheInfiniteGrid } from '../components/ui/TheInfiniteGrid';
import { Calendar, Phone, FileText, CheckCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Home() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const homeFlowSteps: UniversalFlowStep[] = [
    {
      problem: 'Phones ring all day. Staff answer scheduling questions.',
      friction: 'Time disappears into calls.',
      action: 'Patients book online anytime.',
      outcome: { label: 'Schedule filled automatically', icon: Calendar }
    },
    {
      problem: 'Text reminders get ignored.',
      friction: 'No shows happen without warning.',
      action: 'Voice calls confirm automatically.',
      outcome: { label: 'Patients respond reliably', icon: Phone }
    },
    {
      problem: 'Doctors collect patient history during session time.',
      friction: 'Appointments start late and unprepared.',
      action: 'Patients fill forms before arriving.',
      outcome: { label: 'Sessions start prepared', icon: FileText }
    },
    {
      problem: 'Staff firefight routine issues all day.',
      friction: 'Chaos becomes normal.',
      action: 'System handles routine work quietly.',
      outcome: { label: 'Operations run smoothly', icon: CheckCircle },
      nodeState: 'complete'
    },
  ];

  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Infinite Grid */}
      <TheInfiniteGrid className="min-h-screen">
        <section className="relative pt-32 pb-40">
          <div className="max-w-[1400px] mx-auto px-8">
            <motion.div
              className="max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8">Run your clinic without constant interruptions</h1>
              <p className="text-2xl text-[var(--foreground-muted)] mb-12">
                Clinicflow handles the operational work that pulls your team away from care. Scheduling. Patient communication. Intake. All quietly working in the background.
              </p>
              
              <div className="flex items-center gap-4">
                <Link to="/trial">
                  <motion.button
                    className="px-8 py-4 rounded-full bg-[var(--blue-primary)] text-white hover:bg-[var(--blue-vivid)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Join Waitlist for 3 Months Free Access
                  </motion.button>
                </Link>
                <Link to="/how-it-works">
                  <motion.button
                    className="px-8 py-4 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl hover:border-[var(--blue-primary)] hover:bg-[var(--glass-blue)] transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    See how it works
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </TheInfiniteGrid>

      {/* Product Overview Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">One platform built for clinic operations</h2>
              <p className="text-xl text-[var(--foreground-muted)]">
                Clinicflow works alongside your existing systems. It does not replace them. It removes the daily operational noise so your clinic runs smoother without extra staff or extra tools.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How the day actually runs */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">How the day actually runs</h2>
              <p className="text-xl text-[var(--foreground-muted)] max-w-3xl">
                Every clinic day follows the same pattern. Appointments. Patients. Paperwork. Follow ups. Clinicflow supports each step without getting in the way.
              </p>
            </motion.div>
          </div>

          <UniversalFlow steps={homeFlowSteps} variant="product" />
        </div>
      </section>

      {/* Operational Layers */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div
              className="p-10 rounded-2xl bg-white border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EAF1FF';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30, 64, 175, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              style={{
                transition: 'all 200ms ease-out'
              }}
            >
              <h3 className="mb-6">Scheduling</h3>
              <p className="text-[var(--foreground-muted)]">
                Appointments stay organized. Availability stays accurate. Changes are handled without chaos.
              </p>
            </motion.div>

            <motion.div
              className="p-10 rounded-2xl bg-white border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.1 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EAF1FF';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30, 64, 175, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              style={{
                transition: 'all 200ms ease-out'
              }}
            >
              <h3 className="mb-6">Patient Communication</h3>
              <p className="text-[var(--foreground-muted)]">
                Patients are contacted at the right time. Confirmations and reminders happen without staff chasing responses.
              </p>
            </motion.div>

            <motion.div
              className="p-10 rounded-2xl bg-white border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EAF1FF';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30, 64, 175, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              style={{
                transition: 'all 200ms ease-out'
              }}
            >
              <h3 className="mb-6">Intake and Summaries</h3>
              <p className="text-[var(--foreground-muted)]">
                Information is collected before the visit. Doctors walk in prepared.
              </p>
            </motion.div>

            <motion.div
              className="p-10 rounded-2xl bg-white border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.3 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EAF1FF';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30, 64, 175, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              style={{
                transition: 'all 200ms ease-out'
              }}
            >
              <h3 className="mb-6">Admin Automation</h3>
              <p className="text-[var(--foreground-muted)]">
                Routine tasks run quietly. Staff only step in when attention is needed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Patient Communication Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">Patients respond when communication feels human</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                Clinicflow reaches patients the way they expect. Clear. Polite. Timed correctly. Clinics see fewer no shows without adding more calls to the front desk.
              </p>

              <div className="p-10 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl">
                <div className="text-sm text-[var(--accent-mint)] mb-4">Example confirmation</div>
                <p className="text-lg italic text-[var(--foreground-muted)]">
                  "Hi, this is Clinicflow calling to confirm your appointment with Dr. Smith tomorrow at 2 PM. Press 1 to confirm, or press 2 to reschedule."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intake Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">Helps patients arrive prepared</h2>
              <p className="text-xl text-[var(--foreground-muted)]">
                Patients complete what they need before arriving. Doctors see a clear summary before the visit begins. No last minute scrambling.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Admin Automation Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-12">The repetitive work disappears</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                Follow ups. Reminders. Form collection. Clinicflow handles the routine so your team focuses on care and exceptions only.
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: 'Appointment confirmations',
                    status: 'Automated',
                    type: 'automated',
                    detail: 'Calls and responses handled automatically. Staff notified only if needed.'
                  },
                  {
                    title: 'Reminder scheduling',
                    status: 'Automated',
                    type: 'automated',
                    detail: 'Sent at the right time, across voice and SMS, without manual follow ups.'
                  },
                  {
                    title: 'Follow up tracking',
                    status: 'Automated',
                    type: 'automated',
                    detail: 'Responses logged and synced back to the schedule instantly.'
                  },
                  {
                    title: 'Staff intervention',
                    status: 'Only when needed',
                    type: 'manual',
                    detail: 'Only triggered for exceptions or patient requests.'
                  }
                ].map((item, i) => {
                  const isExpanded = expandedIndex === i;
                  
                  return (
                    <motion.div
                      key={i}
                      className="rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: flowEasing }}
                      onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#EAF1FF';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30, 64, 175, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid var(--glass-border)',
                        transition: 'all 200ms ease-out'
                      }}
                    >
                      <div className="flex items-center justify-between p-6">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-base">{item.title}</span>
                            <div className="flex items-center gap-3">
                              <span 
                                className="px-3 py-1 rounded-lg text-sm"
                                style={{
                                  backgroundColor: item.type === 'automated' ? '#EAF1FF' : 'transparent',
                                  border: item.type === 'manual' ? '1px solid rgba(37, 99, 235, 0.35)' : 'none',
                                  color: '#1D4ED8'
                                }}
                              >
                                {item.status}
                              </span>
                              <ChevronDown 
                                className="transition-transform duration-200"
                                size={18}
                                style={{
                                  color: '#64748B',
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className="overflow-hidden transition-all duration-200"
                        style={{
                          maxHeight: isExpanded ? '100px' : '0',
                          opacity: isExpanded ? 1 : 0
                        }}
                      >
                        <div className="px-6 pb-6 pt-0">
                          <p className="text-sm text-[var(--foreground-muted)]">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What clinics notice first */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-20 text-center"
            >
              <h2 className="mb-6">What clinics notice first</h2>
              <p className="text-xl text-[var(--foreground-muted)]">
                Four immediate changes within the first week. No training. No workflow disruption.
              </p>
            </motion.div>

            {/* Vertical connector line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[280px] bottom-[100px] w-[3px] bg-[var(--blue-primary)]/30 hidden md:block" />

            <div className="space-y-8 relative">
              {[
                { label: 'Fewer interruptions', step: 1 },
                { label: 'Fewer no shows', step: 2 },
                { label: 'Less front desk pressure', step: 3 },
                { label: 'Smoother mornings', step: 4 }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                  className="relative"
                >
                  {/* Step number circle on the line */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--blue-primary)] border-4 border-[var(--background)]">
                    <span className="text-sm text-white">{item.step}</span>
                  </div>

                  {/* Card */}
                  <div className="p-8 rounded-xl bg-[var(--glass-bg)] border-2 border-[var(--blue-primary)]/20 backdrop-blur-xl hover:border-[var(--blue-primary)] hover:bg-[var(--blue-soft)]/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      {/* Mobile step number */}
                      <div className="flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-[var(--blue-soft)] border border-[var(--blue-primary)]">
                        <span className="text-sm text-[var(--blue-primary)]">{item.step}</span>
                      </div>
                      <span className="text-lg group-hover:text-[var(--blue-vivid)] transition-colors">{item.label}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Positioning Statement */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">Not another marketplace. Not another EHR.</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-16">
                Clinicflow does not replace your systems. It supports how your clinic already works.
              </p>

              {/* Visual Comparison Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {/* Marketplace Tools */}
                <motion.div
                  className="p-8 rounded-2xl text-center"
                  style={{ backgroundColor: '#F5F9FF' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1, ease: flowEasing }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(148, 163, 184, 0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 22V12H15V22" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="mb-2" style={{ color: '#64748B' }}>Marketplace tools</div>
                  <div className="text-sm" style={{ color: '#94A3B8' }}>
                    Adds another system. More logins. More complexity.
                  </div>
                </motion.div>

                {/* Traditional EHR */}
                <motion.div
                  className="p-8 rounded-2xl text-center"
                  style={{ backgroundColor: '#F5F9FF' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: flowEasing }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(148, 163, 184, 0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#94A3B8" strokeWidth="2"/>
                      <path d="M3 9H21" stroke="#94A3B8" strokeWidth="2"/>
                      <path d="M9 21V9" stroke="#94A3B8" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="mb-2" style={{ color: '#64748B' }}>Traditional EHR</div>
                  <div className="text-sm" style={{ color: '#94A3B8' }}>
                    Heavy and rigid. Forces clinics to change how they work.
                  </div>
                </motion.div>

                {/* Clinicflow */}
                <motion.div
                  className="p-8 rounded-2xl text-center transition-all duration-200 cursor-default"
                  style={{ backgroundColor: '#F5F9FF' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, ease: flowEasing }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EAF1FF';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F9FF';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2563EB" strokeWidth="2"/>
                      <path d="M12 16V12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 8H12.01" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="mb-2" style={{ color: '#2563EB' }}>Clinicflow</div>
                  <div className="text-sm" style={{ color: '#64748B' }}>
                    Operational layer. Works alongside what you already use.
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">See Clinicflow in action</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                A short walkthrough. Real clinic workflows.
              </p>

              {/* CTA Block */}
              <div className="max-w-[720px] mx-auto p-10 rounded-3xl" style={{ backgroundColor: '#EAF1FF' }}>
                <p className="text-sm mb-8" style={{ color: '#64748B' }}>
                  No sales pressure. Real workflows. Your questions answered.
                </p>

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
                    Join Waitlist for 3 Months Free Access
                  </motion.button>
                </Link>

                <Link 
                  to="/how-it-works"
                  className="text-sm transition-all duration-200 inline-block"
                  style={{ color: '#2563EB' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Or explore how it works
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}