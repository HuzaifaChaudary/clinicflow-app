import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { UniversalFlow, UniversalFlowStep } from '../components/UniversalFlow';
import { TheInfiniteGrid } from '../components/ui/TheInfiniteGrid';
import { Calendar, Phone, FileText, CheckCircle, ChevronDown, Activity, Clock, UserCheck, MessageSquare, Mail } from 'lucide-react';
import { useState } from 'react';

export function Home() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [commTab, setCommTab] = useState<'voice' | 'text' | 'email'>('voice');
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);

  const homeFlowSteps: UniversalFlowStep[] = [
    {
      problem: 'Phones ring all day.',
      friction: 'Staff drown in scheduling and questions.',
      action: 'Ava answers, routes, and books automatically.',
      outcome: { label: 'Schedule filled automatically', icon: Calendar }
    },
    {
      problem: 'Text reminders get ignored.',
      friction: 'No shows surprise everyone.',
      action: 'Voice and SMS reminders confirm or reschedule.',
      outcome: { label: 'Patients respond reliably', icon: Phone }
    },
    {
      problem: 'Intake forms pile up.',
      friction: 'Clinicians walk in cold.',
      action: 'Ava collects intake by phone or text and sends a summary.',
      outcome: { label: 'Sessions start prepared', icon: FileText }
    },
    {
      problem: 'Staff firefight all day.',
      friction: 'Chaos becomes normal.',
      action: 'Routine work runs in the background.',
      outcome: { label: 'Operations stay smooth', icon: CheckCircle },
      nodeState: 'complete'
    },
  ];

  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Infinite Grid */}
      <TheInfiniteGrid className="min-h-screen" style={{ backgroundSize: '100px 100px', opacitscale: 1.4 }}>
        <section className="relative pt-20 md:pt-32 pb-12 md:pb-24">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            {/* Mobile: use flexbox with order to rearrange, Desktop: original order */}
            <div className="flex flex-col md:block">
              
            {/* Headline & Subline - Order 1 on mobile, appears first */}
            <motion.div
              className="order-1 md:order-none max-w-[800px] mx-auto text-center px-4 md:px-8 mb-6 md:mb-0 md:hidden"
              initial={{ opacitscale: 1, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: flowEasing, delascale: 1.3 }}
            >
              <h1 className="text-2xl md:text-3xl font-semibold mb-2 md:mb-3 leading-tight tracking-tight">
                Axis runs your clinic's intake, scheduling, and reminders.
              </h1>
              <p className="text-sm md:text-base text-[var(--foreground-muted)] leading-relaxed font-normal max-w-[700px] mx-auto">
                Ava answers calls, texts patients, and keeps your schedule full under your team's control.
              </p>
            </motion.div>

            {/* CTA Buttons - Order 2 on mobile */}
            <motion.div
              className="order-2 md:order-none flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-0 md:hidden"
              initial={{ opacitscale: 1, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: flowEasing, delascale: 1.5 }}
            >
              <Link to="/trial" className="w-full md:w-auto">
                <motion.button
                  className="w-full md:w-auto px-8 py-3.5 md:py-4 rounded-full bg-[var(--blue-primary)] text-white text-base font-medium hover:bg-[var(--blue-vivid)] shadow-[0_2px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Waitlist
                </motion.button>
              </Link>
              <Link to="/voice-automation" className="w-full md:w-auto">
                <motion.button
                  className="w-full md:w-auto px-8 py-3.5 md:py-4 rounded-full border border-[var(--glass-border)] bg-white/80 backdrop-blur-xl text-[var(--foreground)] text-base font-medium hover:border-[var(--blue-primary)]/40 hover:bg-[var(--glass-blue)] transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Or Try Ava Voice assistant to Join Waitlist
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Product Visual - Order 3 on mobile, appears last */}
            <motion.div
              className="order-3 md:order-none max-w-[1200px] mx-auto mb-8 md:mb-12"
              initial={{ opacitscale: 1, y: 30 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <div className="relative p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-xl border border-[var(--glass-border)] shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8 pb-4 md:pb-6 border-b border-[var(--glass-border)]/60 gap-3 md:gap-0">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="text-sm md:text-base font-semibold mb-0.5 tracking-tight">Axis Admin</h4>
                      <p className="text-xs text-[var(--foreground-muted)] font-normal">Saturday, January 31</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-6 flex-wrap">
                    <div className="flex items-center gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-[var(--blue-soft)]/30 border border-[var(--blue-primary)]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--blue-primary)] animate-pulse"></div>
                      <span className="text-[0.625rem] md:text-xs font-medium text-[var(--blue-primary)] tracking-wide">Live</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
                      <Phone className="text-[var(--accent-primary)]" size={10} strokeWidth={2} />
                      <span className="text-[0.625rem] md:text-xs font-medium text-[var(--accent-primary)]">Incoming call</span>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                  {/* Left Column - Ava Call Activity */}
                  <div className="md:col-span-5">
                    <div className="mb-4 md:mb-6">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <Phone className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                        <span className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Ava Call Activity</span>
                      </div>
                      <div className="space-y-2 md:space-y-2.5">
                        {/* Incoming call - highlighted */}
                        <motion.div
                          className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-[rgba(37,99,235,0.05)] shadow-[0_0_0_4px_rgba(13,148,136,0.08)]"
                          style={{ borderWidth: '2px', borderStyle: 'solid', borderRadius: '0.75rem' }}
                          animate={{ borderColor: ['rgba(37, 99, 235, 0.3)', 'rgba(37, 99, 235, 0.5)', 'rgba(37, 99, 235, 0.3)'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                              <Phone className="text-white" size={14} strokeWidth={2} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold leading-tight tracking-tight">Emma Davis</p>
                              <p className="text-xs text-[var(--foreground-muted)] leading-tight mt-0.5 font-normal">New patient - calling now</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
                            <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </motion.div>

                        <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-[var(--blue-soft)]/25 border border-[var(--blue-primary)]/10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue-primary)] flex items-center justify-center">
                              <Phone className="text-white" size={14} strokeWidth={2} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold leading-tight tracking-tight">Sarah Johnson</p>
                              <p className="text-xs text-[var(--foreground-muted)] leading-tight mt-0.5 font-normal">Confirmed 9:00 AM</p>
                            </div>
                          </div>
                          <CheckCircle className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                        </div>

                        <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-[var(--background-secondary)]/60 border border-[var(--glass-border)]/60">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--flow-node)]/80 flex items-center justify-center">
                              <Phone className="text-[var(--foreground-muted)]" size={14} strokeWidth={2} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold leading-tight tracking-tight">Michael Chen</p>
                              <p className="text-xs text-[var(--foreground-muted)] leading-tight mt-0.5 font-normal">Reminder sent</p>
                            </div>
                          </div>
                          <CheckCircle className="text-[var(--foreground-muted)]" size={16} strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Column - Tasks & SMS */}
                  <div className="md:col-span-4">
                    {/* Tasks Queue */}
                    <div className="mb-4 md:mb-6">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                        <span className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Tasks</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 md:gap-2.5">
                        <div className="p-3 rounded-xl bg-[var(--blue-soft)]/25 border border-[var(--blue-primary)]/15 text-center shadow-[0_1px_2px_rgba(37,99,235,0.05)]">
                          <p className="text-2xl font-semibold text-[var(--blue-primary)] mb-1 leading-tight tracking-tight">3</p>
                          <p className="text-[0.6875rem] text-[var(--foreground-muted)] leading-tight font-normal mb-2">Active Now</p>
                          <div className="h-1 w-full bg-[var(--blue-primary)]/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-[var(--blue-primary)]"
                              initial={{ width: "0%" }}
                              animate={{ width: "60%" }}
                              transition={{ duration: 1.5, ease: flowEasing }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="p-3 rounded-xl bg-[var(--background-secondary)]/60 border border-[var(--glass-border)]/60 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <p className="text-lg font-semibold text-[var(--blue-primary)] mb-0.5 leading-tight tracking-tight">12</p>
                            <p className="text-[0.6875rem] text-[var(--foreground-muted)] leading-tight font-normal">Pending</p>
                          </div>
                          <div className="p-3 rounded-xl bg-[var(--background-secondary)]/60 border border-[var(--glass-border)]/60 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <p className="text-lg font-semibold text-[var(--foreground)] mb-0.5 leading-tight tracking-tight">34</p>
                            <p className="text-[0.6875rem] text-[var(--foreground-muted)] leading-tight font-normal">Complete</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SMS Preview */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <FileText className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                        <span className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Recent SMS</span>
                      </div>
                      <div className="p-3 md:p-3.5 rounded-xl bg-[var(--background-secondary)]/60 border border-[var(--glass-border)]/60">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold tracking-tight">To: Sarah Johnson</p>
                          <p className="text-[0.6875rem] text-[var(--foreground-muted)]">Just now</p>
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed font-normal">
                          "Your appointment is confirmed for tomorrow at 9:00 AM. Reply YES to confirm or CANCEL to reschedule."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Today's Schedule */}
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <Calendar className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                      <span className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Today's Schedule</span>
                    </div>
                    <div className="space-y-2 md:space-y-2.5">
                      <div className="p-3 md:p-3.5 rounded-xl bg-[var(--blue-soft)]/25 border border-[var(--blue-primary)]/15">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-10 rounded-full bg-[var(--blue-primary)]"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold leading-tight tracking-tight">Dr. Smith</p>
                            <p className="text-[0.6875rem] text-[var(--foreground-muted)] leading-tight mt-0.5 font-normal">Room A</p>
                          </div>
                        </div>
                        <div className="pl-3">
                          <p className="text-xs text-[var(--foreground-muted)] font-normal mb-1">9:00 AM - 5:00 PM</p>
                          <p className="text-xs font-semibold text-[var(--blue-primary)]">8 patients</p>
                        </div>
                      </div>

                      <div className="p-3 md:p-3.5 rounded-xl bg-[var(--background-secondary)]/60 border border-[var(--glass-border)]/60">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-10 rounded-full bg-[var(--foreground-muted)]"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold leading-tight tracking-tight">Dr. Lee</p>
                            <p className="text-[0.6875rem] text-[var(--foreground-muted)] leading-tight mt-0.5 font-normal">Room B</p>
                          </div>
                        </div>
                        <div className="pl-3">
                          <p className="text-xs text-[var(--foreground-muted)] font-normal mb-1">10:00 AM - 4:00 PM</p>
                          <p className="text-xs font-semibold text-[var(--foreground)]">6 patients</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Centered Subtext - Desktop only */}
            <motion.div
              className="hidden md:block max-w-[800px] mx-auto text-center px-8"
              initial={{ opacitscale: 1, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: flowEasing, delascale: 1.3 }}
            >
              <h1 className="text-3xl font-semibold mb-3 leading-tight tracking-tight">
                Axis runs your clinic's intake, scheduling, and reminders.
              </h1>
              <p className="text-base text-[var(--foreground-muted)] leading-relaxed font-normal max-w-[700px] mx-auto">
                Ava answers calls, texts patients, and keeps your schedule full under your team's control.
              </p>
            </motion.div>

            {/* CTA Buttons - Desktop only */}
            <motion.div
              className="hidden md:flex items-center justify-center gap-4 mt-10"
              initial={{ opacitscale: 1, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: flowEasing, delascale: 1.5 }}
            >
              <Link to="/trial">
                <motion.button
                  className="px-8 py-4 rounded-full bg-[var(--blue-primary)] text-white text-base font-medium hover:bg-[var(--blue-vivid)] shadow-[0_2px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Waitlist
                </motion.button>
              </Link>
              <Link to="/voice-automation">
                <motion.button
                  className="px-8 py-4 rounded-full border border-[var(--glass-border)] bg-white/80 backdrop-blur-xl text-[var(--foreground)] text-base font-medium hover:border-[var(--blue-primary)]/40 hover:bg-[var(--glass-blue)] transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Or Try Ava Voice assistant to Join Waitlist
                </motion.button>
              </Link>
            </motion.div>
            
            </div>{/* End of flex container */}
          </div>
        </section>
      </TheInfiniteGrid>

      {/* Product Overview Section */}
      <section className="relative py-40 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-semibold">One platform for intake, scheduling, and reminders.</h2>
              <p className="text-base text-[var(--foreground-muted)] leading-relaxed font-normal max-w-2xl mx-auto mb-12">
                Axis wraps your EHR, running front office workflows so your team can focus on patients.
              </p>
              
              {/* Subtle UI Strip with Persona Chips */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {/* Admins pill */}
                <motion.div
                  className="px-4 py-2.5 rounded-full bg-white/50 backdrop-blur-sm border border-[var(--glass-border)] shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  initial={{ opacitscale: 1, y: 10 }}
                  viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delascale: 1.2 }}
                >
                  <span className="text-xs font-medium text-[var(--foreground)] tracking-tight">Admins – Ava handles calls and intake</span>
                </motion.div>

                {/* Doctors pill */}
                <motion.div
                  className="px-4 py-2.5 rounded-full bg-white/50 backdrop-blur-sm border border-[var(--glass-border)] shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  initial={{ opacitscale: 1, y: 10 }}
                  viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delascale: 1.3 }}
                >
                  <span className="text-xs font-medium text-[var(--foreground)] tracking-tight">Doctors – Ava MD drafts your notes</span>
                </motion.div>

                {/* Owners pill */}
                <motion.div
                  className="px-4 py-2.5 rounded-full bg-white/50 backdrop-blur-sm border border-[var(--glass-border)] shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  initial={{ opacitscale: 1, y: 10 }}
                  viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delascale: 1.4 }}
                >
                  <span className="text-xs font-medium text-[var(--foreground)] tracking-tight">Owners – Dashboards for no shows and utilization</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How the day actually runs */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="mb-24">
            <motion.div
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">How the day runs</h2>
              <p className="text-lg text-[var(--foreground-muted)] max-w-2xl leading-relaxed font-normal">
                Appointments, calls, and follow ups. Axis runs the day so your team does not.
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
              className="p-8 rounded-2xl bg-white border border-[var(--glass-border)] shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-150 cursor-pointer"
              initial={{ opacitscale: 1, x: -30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              whileHover={{ 
                backgroundColor: '#EAF1FF',
                borderColor: 'rgba(37, 99, 235, 0.3)',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20 flex items-center justify-center mb-5 group-hover:border-[var(--blue-primary)]/40 transition-all">
                <Calendar className="text-[var(--blue-primary)]" size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-2 tracking-tight">Smart scheduling</h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed font-normal mb-6">
                Ava fills and backfills the schedule automatically.
              </p>
              
              {/* Micro Visual: Schedule Strip */}
              <div className="space-y-1.5 pt-4 border-t border-[var(--glass-border)]/50">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                  <div className="w-0.5 h-6 rounded-full bg-[var(--blue-primary)]"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.6875rem] font-medium leading-tight">9:00 AM - Sarah J.</p>
                  </div>
                  <CheckCircle className="text-[var(--blue-primary)]" size={11} strokeWidth={2} />
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                  <div className="w-0.5 h-6 rounded-full bg-[var(--foreground-muted)]"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.6875rem] font-medium leading-tight text-[var(--foreground-muted)]">10:00 AM - Available</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-8 rounded-2xl bg-white border border-[var(--glass-border)] shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer group"
              initial={{ opacitscale: 1, x: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delascale: 1.1 }}
              whileHover={{ 
                y: -4, 
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
                borderColor: 'rgba(17, 24, 39, 0)',
                backgroundColor: '#EAF1FF'
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20 flex items-center justify-center mb-5 group-hover:border-[var(--blue-primary)]/40 transition-all">
                <Phone className="text-[var(--blue-primary)]" size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-2 tracking-tight">Patient communication</h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed font-normal mb-6">
                Calls and texts handled 24/7, no chasing.
              </p>
              
              {/* Micro Visual: Call Log */}
              <div className="space-y-1.5 pt-4 border-t border-[var(--glass-border)]/50">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[var(--blue-primary)] flex items-center justify-center">
                      <Phone className="text-white" size={10} strokeWidth={2} />
                    </div>
                    <p className="text-[0.6875rem] font-medium leading-tight">Emma D.</p>
                  </div>
                  <p className="text-[0.625rem] text-[var(--foreground-muted)]">2m ago</p>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[var(--foreground-muted)]/60 flex items-center justify-center">
                      <FileText className="text-white" size={10} strokeWidth={2} />
                    </div>
                    <p className="text-[0.6875rem] font-medium leading-tight text-[var(--foreground-muted)]">Sarah J.</p>
                  </div>
                  <p className="text-[0.625rem] text-[var(--foreground-muted)]">15m ago</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-8 rounded-2xl bg-white border border-[var(--glass-border)] shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer group"
              initial={{ opacitscale: 1, x: -30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delascale: 1.2 }}
              whileHover={{ 
                y: -4, 
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
                borderColor: 'rgba(17, 24, 39, 0)',
                backgroundColor: '#EAF1FF'
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20 flex items-center justify-center mb-5 group-hover:border-[var(--blue-primary)]/40 transition-all">
                <FileText className="text-[var(--blue-primary)]" size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-2 tracking-tight">Intake and summaries</h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed font-normal mb-6">
                Phone and SMS intake, structured into notes.
              </p>
              
              {/* Micro Visual: Intake Question */}
              <div className="pt-4 border-t border-[var(--glass-border)]/50">
                <div className="p-2.5 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50 mb-1.5">
                  <p className="text-[0.6875rem] font-medium leading-tight mb-1.5 text-[var(--foreground-muted)]">What brings you in today?</p>
                  <div className="p-1.5 rounded-md bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                    <p className="text-[0.625rem] text-[var(--foreground)] leading-snug">Annual checkup and blood work</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="text-[var(--blue-primary)]" size={11} strokeWidth={2} />
                  <p className="text-[0.625rem] text-[var(--blue-primary)] font-medium">Completed</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-8 rounded-2xl bg-white border border-[var(--glass-border)] shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer group"
              initial={{ opacitscale: 1, x: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delascale: 1.3 }}
              whileHover={{ 
                y: -4, 
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
                borderColor: 'rgba(17, 24, 39, 0)',
                backgroundColor: '#EAF1FF'
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20 flex items-center justify-center mb-5 group-hover:border-[var(--blue-primary)]/40 transition-all">
                <Activity className="text-[var(--blue-primary)]" size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-2 tracking-tight">Admin automation</h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed font-normal mb-6">
                Routine tasks queued so staff step in only when needed.
              </p>
              
              {/* Micro Visual: Task Queue */}
              <div className="space-y-1.5 pt-4 border-t border-[var(--glass-border)]/50">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--blue-primary)]"></div>
                    <p className="text-[0.6875rem] font-medium leading-tight">Confirm appointments</p>
                  </div>
                  <p className="text-[0.625rem] text-[var(--blue-primary)] font-medium">Auto</p>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--foreground-muted)]"></div>
                    <p className="text-[0.6875rem] font-medium leading-tight text-[var(--foreground-muted)]">Send reminders</p>
                  </div>
                  <p className="text-[0.625rem] text-[var(--blue-primary)] font-medium">Auto</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Patient Communication Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">Communication that feels human</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 leading-relaxed font-normal">
                Ava calls and texts patients the way your front desk would speak: clear, kind, and on time.
              </p>

              <div className="p-8 rounded-2xl bg-white border border-[var(--glass-border)] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                {/* Channel Tabs */}
                <div className="flex items-center gap-2 mb-6 pb-5 border-b border-[var(--glass-border)]/60">
                  <button 
                    onClick={() => setCommTab('voice')}
                    className={`px-3 py-1.5 rounded-lg text-[0.6875rem] font-medium transition-all ${
                      commTab === 'voice' 
                        ? 'bg-[var(--blue-primary)] text-white' 
                        : 'bg-[var(--background-secondary)]/40 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]/60'
                    }`}
                  >
                    Voice
                  </button>
                  <button 
                    onClick={() => setCommTab('text')}
                    className={`px-3 py-1.5 rounded-lg text-[0.6875rem] font-medium transition-all ${
                      commTab === 'text' 
                        ? 'bg-[var(--blue-primary)] text-white' 
                        : 'bg-[var(--background-secondary)]/40 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]/60'
                    }`}
                  >
                    Text
                  </button>
                  <button 
                    onClick={() => setCommTab('email')}
                    className={`px-3 py-1.5 rounded-lg text-[0.6875rem] font-medium transition-all ${
                      commTab === 'email' 
                        ? 'bg-[var(--blue-primary)] text-white' 
                        : 'bg-[var(--background-secondary)]/40 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]/60'
                    }`}
                  >
                    Email
                  </button>
                </div>

                {/* Voice Tab */}
                {commTab === 'voice' && (
                  <motion.div
                    initial={{ opacitscale: 1, y: 10 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-[var(--blue-soft)] flex items-center justify-center">
                          <Phone className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                        </div>
                        <div>
                          <div className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Ava Voice Call</div>
                          <div className="text-xs text-[var(--blue-primary)] font-medium">Outbound confirmation</div>
                        </div>
                      </div>
                      <div className="bg-[var(--background-secondary)]/30 p-5 rounded-lg border border-[var(--glass-border)]/50 space-y-4">
                        <div>
                          <p className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                            "Hi, this is Ava calling from Dr. Smith's office.<br />
                            I'm just confirming your appointment for tomorrow at 2 PM.<br />
                            Will you be able to make it?"
                          </p>
                        </div>

                        <div className="pl-4 border-l-2 border-[var(--blue-primary)]/20">
                          <p className="text-xs text-[var(--foreground-muted)] font-medium mb-2">If patient confirms:</p>
                          <p className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                            "Great, we'll see you then. Have a good day."
                          </p>
                        </div>

                        <div className="pl-4 border-l-2 border-[var(--blue-primary)]/20">
                          <p className="text-xs text-[var(--foreground-muted)] font-medium mb-2">If patient needs to reschedule:</p>
                          <p className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                            "No problem. What time works better for you and I'll help you reschedule."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Responses */}
                    <div className="pt-5 border-t border-[var(--glass-border)]/60">
                      <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Recent responses</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--blue-soft)]/25 border border-[var(--blue-primary)]/15">
                          <CheckCircle className="text-[var(--blue-primary)]" size={12} strokeWidth={2} />
                          <span className="text-xs font-medium text-[var(--foreground)]">Confirmed</span>
                          <span className="text-xs text-[var(--foreground-muted)] ml-1">14</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                          <Calendar className="text-[var(--foreground-muted)]" size={12} strokeWidth={2} />
                          <span className="text-xs font-medium text-[var(--foreground)]">Rescheduled</span>
                          <span className="text-xs text-[var(--foreground-muted)] ml-1">3</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                          <Clock className="text-[var(--foreground-muted)]" size={12} strokeWidth={2} />
                          <span className="text-xs font-medium text-[var(--foreground-muted)]">Waiting for reply</span>
                          <span className="text-xs text-[var(--foreground-muted)] ml-1">2</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text Tab */}
                {commTab === 'text' && (
                  <motion.div
                    initial={{ opacitscale: 1, y: 10 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-[var(--blue-soft)] flex items-center justify-center">
                        <MessageSquare className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">SMS Message</div>
                        <div className="text-xs text-[var(--blue-primary)] font-medium">To: Sarah Johnson</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Ava's Message */}
                      <div className="bg-[var(--background-secondary)]/30 p-5 rounded-lg border border-[var(--glass-border)]/50">
                        <p className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                          Hi Sarah, this is Ava with Dr. Smith's office.<br />
                          Your appointment is tomorrow at 9:00 AM.<br />
                          Will you still be able to come in?
                        </p>
                      </div>

                      {/* Example Replies */}
                      <div className="space-y-3">
                        <div className="flex justify-end">
                          <div className="bg-[var(--blue-vivid)] text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[280px]">
                            <p className="text-sm font-normal" style={{ lineHeight: '1.6',  }}>
                              Yes, that works. Thanks.
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <div className="bg-[var(--blue-vivid)] text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[320px]">
                            <p className="text-sm font-normal" style={{ lineHeight: '1.6' }}>
                              I need to reschedule, mornings are better for me.
                            </p>
                          </div>
                        </div>

                        {/* Ava's Follow-up */}
                        <div className="bg-[var(--background-secondary)]/30 p-4 rounded-lg border border-[var(--glass-border)]/50 max-w-[340px]">
                          <p className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                            Got it, I can help with that. Is there a day next week that works for you?
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Email Tab */}
                {commTab === 'email' && (
                  <motion.div
                    initial={{ opacitscale: 1, y: 10 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-[var(--blue-soft)] flex items-center justify-center">
                        <Mail className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Email Reminder</div>
                        <div className="text-xs text-[var(--blue-primary)] font-medium">To: Sarah Johnson</div>
                      </div>
                    </div>

                    <div className="bg-[var(--background-secondary)]/30 p-5 rounded-lg border border-[var(--glass-border)]/50">
                      <div className="mb-4 pb-4 border-b border-[var(--glass-border)]/50">
                        <p className="text-xs text-[var(--foreground-muted)] font-medium mb-1">Subject</p>
                        <p className="text-sm text-[var(--foreground)] font-medium">Checking in about your visit with Dr. Smith</p>
                      </div>

                      <div className="text-sm text-[var(--foreground)] font-normal space-y-3" style={{ lineHeight: '1.7' }}>
                        <p>Hi Sarah,</p>
                        <p>
                          I hope you're doing well. I'm just checking in about your appointment with Dr. Smith tomorrow at 9:00 AM.
                        </p>
                        <p>
                          If that still works, you don't need to do anything.
                        </p>
                        <p>
                          If you'd like to change the time, you can reply to this email and I'll help you find another slot.
                        </p>
                        <p>
                          Best,<br />
                          Ava<br />
                          Dr. Smith's office
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intake Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">Patients arrive prepared. Doctors stay ahead.</h2>
              <p className="text-base text-[var(--foreground-muted)] leading-relaxed font-normal mb-12">
                Ava completes intake by phone or text and sends a short summary before the visit.
              </p>

              {/* Intake Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl bg-white border border-[var(--glass-border)] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                {/* Left: Intake Questions */}
                <div className="space-y-4">
                  <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">Patient intake</p>
                  
                  <div className="space-y-3">
                    {/* Question 1 */}
                    <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                      <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] mb-2">Reason for visit</p>
                      <div className="p-2 rounded-md bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                        <p className="text-xs text-[var(--foreground)] font-normal">Annual checkup and blood work</p>
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                      <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] mb-2">Current meds</p>
                      <div className="p-2 rounded-md bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                        <p className="text-xs text-[var(--foreground)] font-normal">Lisinopril 10mg daily</p>
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div className="p-3 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                      <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] mb-2">Risk flags</p>
                      <div className="p-2 rounded-md bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                        <p className="text-xs text-[var(--foreground)] font-normal">None reported</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Clinician Summary */}
                <div className="flex flex-col">
                  <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">Clinician view</p>
                  
                  <div className="flex-1 p-6 rounded-xl bg-[var(--blue-soft)]/25 border border-[var(--blue-primary)]/20">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                      <p className="text-sm font-semibold text-[var(--foreground)]">Intake summary ready</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-lg bg-white/60 border border-[var(--glass-border)]/50">
                        <p className="text-xs font-medium text-[var(--foreground)] mb-1">Sarah Johnson, 42</p>
                        <p className="text-[0.6875rem] text-[var(--foreground-muted)] leading-relaxed">Annual checkup. No new concerns. Medication stable.</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="px-2.5 py-1 rounded-md bg-[var(--blue-primary)] text-white text-[0.625rem] font-medium">
                          New patient
                        </div>
                        <div className="px-2.5 py-1 rounded-md bg-white/60 border border-[var(--glass-border)]/60 text-[var(--foreground)] text-[0.625rem] font-medium">
                          Follow up
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Admin Automation Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-10 font-medium">Repetitive work handled automatically</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 leading-relaxed font-normal">
                Reminders, confirmations, and follow ups run in the background. Your team focuses on care.
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: 'Appointment confirmations',
                    status: 'Automated by Ava',
                    type: 'automated',
                    icon: UserCheck,
                    detail: 'Calls and responses handled automatically. Staff notified only if needed.',
                    microUI: (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="text-[var(--blue-primary)]" size={10} strokeWidth={2} />
                            <p className="text-[0.6875rem] font-medium">Sarah J. - 9:00 AM</p>
                          </div>
                          <p className="text-[0.625rem] text-[var(--blue-primary)] font-medium">Confirmed</p>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/10">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="text-[var(--blue-primary)]" size={10} strokeWidth={2} />
                            <p className="text-[0.6875rem] font-medium">Mike C. - 11:00 AM</p>
                          </div>
                          <p className="text-[0.625rem] text-[var(--blue-primary)] font-medium">Confirmed</p>
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Reminder scheduling',
                    status: 'Automated by Ava',
                    type: 'automated',
                    icon: Clock,
                    detail: 'Sent at the right time across voice and SMS.',
                    microUI: (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                          <div className="w-0.5 h-5 rounded-full bg-[var(--blue-primary)]"></div>
                          <p className="text-[0.6875rem] font-medium text-[var(--foreground)]">Tomorrow 8 AM</p>
                          <span className="ml-auto text-[0.625rem] text-[var(--foreground-muted)]">6 patients</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                          <div className="w-0.5 h-5 rounded-full bg-[var(--foreground-muted)]"></div>
                          <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)]">Day before 2 PM</p>
                          <span className="ml-auto text-[0.625rem] text-[var(--foreground-muted)]">8 patients</span>
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Follow up tracking',
                    status: 'Automated by Ava',
                    type: 'automated',
                    icon: Activity,
                    detail: 'Responses logged and synced to schedule instantly.',
                    microUI: (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                          <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)]">Missed appointment</p>
                          <span className="text-[0.625rem] text-[var(--foreground-muted)]">3 pending</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--background-secondary)]/40 border border-[var(--glass-border)]/50">
                          <p className="text-[0.6875rem] font-medium text-[var(--foreground-muted)]">Check in</p>
                          <span className="text-[0.625rem] text-[var(--foreground-muted)]">2 pending</span>
                        </div>
                      </div>
                    )
                  }
                ].map((item, i) => {
                  const isExpanded = expandedIndex === i;
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={i}
                      className="rounded-xl overflow-hidden bg-white border border-[var(--glass-border)] shadow-[var(--shadow-subtle)] transition-all duration-200 cursor-pointer"
                      initial={{ opacitscale: 1, x: -20 }}
                      viewport={{ once: true }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: flowEasing }}
                      onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      whileHover={{ 
                        y: -2,
                        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
                        borderColor: 'rgba(17, 24, 39, 0)',
                        backgroundColor: '#EAF1FF'
                      }}
                    >
                      <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20 flex items-center justify-center flex-shrink-0">
                            <Icon className="text-[var(--blue-primary)]" size={20} />
                          </div>
                          <div className="flex items-center justify-between flex-1">
                            <span className="text-base font-medium">{item.title}</span>
                            <div className="flex items-center gap-3">
                              <span 
                                className="px-3 py-1 rounded-lg text-xs font-medium"
                                style={{
                                  backgroundColor: '#EAF1FF',
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
                          maxHeight: isExpanded ? '200px' : '0',
                          opacity: isExpanded ? 1 : 0
                        }}
                      >
                        <div className="px-6 pb-6 pt-0 pl-[74px]">
                          {item.microUI}
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
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-20 text-center"
            >
              <h2 className="mb-6">What clinics notice first</h2>
              <p className="text-base text-[var(--foreground-muted)] leading-relaxed font-normal">
                Within the first few weeks, clinics see these changes without touching their EHR.
              </p>
            </motion.div>

            {/* Vertical connector line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[280px] bottom-[100px] w-[2px] bg-gradient-to-b from-[var(--blue-primary)]/40 via-[var(--blue-primary)]/20 to-transparent hidden md:block" />

            <div className="space-y-6 relative">
              {[
                { 
                  label: 'Fewer interruptions for staff', 
                  subtext: 'Ava answers routine calls, routes the rest, and keeps the front desk from living on the phone.',
                  step: 1 
                },
                { 
                  label: 'Fewer no shows and gaps', 
                  subtext: 'Multi touch voice and SMS reminders confirm, cancel, and reschedule so the schedule stays full.',
                  step: 2 
                },
                { 
                  label: 'Less front desk pressure', 
                  subtext: 'Intake, confirmations, and follow ups run in the background so admins focus on patients, not paperwork.',
                  step: 3 
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacitscale: 1, scale: 0.95 }}
                  viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                  className="relative"
                >
                  {/* Step number circle on the line */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--blue-primary)] border-4 border-[var(--background)] shadow-lg">
                    <span className="text-sm text-white font-semibold">{item.step}</span>
                  </div>

                  {/* Card */}
                  <motion.div 
                    className="p-8 rounded-xl bg-white border-2 border-[var(--blue-primary)]/15 shadow-[var(--shadow-subtle)] transition-all duration-300 group cursor-default"
                    whileHover={{ 
                      borderColor: 'rgba(37, 99, 235, 0.4)',
                      backgroundColor: '#EAF1FF',
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Mobile step number */}
                      <div className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-[var(--blue-soft)] border-2 border-[var(--blue-primary)] flex-shrink-0 mt-1">
                        <span className="text-sm text-[var(--blue-primary)] font-semibold">{item.step}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium mb-2 group-hover:text-[var(--blue-vivid)] transition-colors">{item.label}</h3>
                        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed font-normal" style={{ lineHeight: '1.7' }}>
                          {item.subtext}
                        </p>
                      </div>
                    </div>
                  </motion.div>
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
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">Not a marketplace. Not an EHR.</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-16 leading-relaxed font-normal">
                Axis wraps your EHR. It runs intake, scheduling, reminders, and follow ups around what you already use.
              </p>

              {/* Visual Comparison Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {/* Marketplace Tools */}
                <motion.div
                  className="p-8 rounded-2xl text-center bg-[var(--background-secondary)]"
                  initial={{ opacitscale: 1, scale: 0.95 }}
                  viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delascale: 1.1, ease: flowEasing }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--foreground-muted)]/10 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 22V12H15V22" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="mb-2 font-medium text-[var(--foreground-muted)]">Marketplace tools</div>
                  <div className="text-sm text-[var(--foreground-muted)]/70 leading-relaxed font-normal">
                    More logins and siloed workflows. Your team still does the work.
                  </div>
                </motion.div>

                {/* Traditional EHR */}
                <motion.div
                  className="p-8 rounded-2xl text-center bg-[var(--background-secondary)]"
                  initial={{ opacitscale: 1, scale: 0.95 }}
                  viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delascale: 1.2, ease: flowEasing }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--foreground-muted)]/10 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#94A3B8" strokeWidth="2"/>
                      <path d="M3 9H21" stroke="#94A3B8" strokeWidth="2"/>
                      <path d="M9 21V9" stroke="#94A3B8" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="mb-2 font-medium text-[var(--foreground-muted)]">Traditional EHR</div>
                  <div className="text-sm text-[var(--foreground-muted)]/70 leading-relaxed font-normal">
                    Necessary for charts and billing, but not built for front desk automation.
                  </div>
                </motion.div>

                {/* Axis */}
                <motion.div
                  className="p-8 rounded-2xl text-center bg-[var(--background-secondary)] transition-all duration-200 cursor-default"
                  initial={{ opacitscale: 1, scale: 0.95 }}
                  viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delascale: 1.3, ease: flowEasing }}
                  whileHover={{
                    backgroundColor: '#EAF1FF',
                    y: -2
                  }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/30 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="2"/>
                      <path d="M12 16V12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="8" r="1" fill="#2563EB"/>
                    </svg>
                  </div>
                  <div className="mb-2 font-medium text-[var(--blue-primary)]">Axis</div>
                  <div className="text-sm text-[var(--foreground-muted)] leading-relaxed font-normal">
                    AI operating layer for your clinic. Ava handles calls, intake, reminders, and follow ups under your team's control.
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6">Questions clinics ask first</h2>
              <p className="text-base text-[var(--foreground-muted)] leading-relaxed font-normal">
                Short answers to what owners, admins, and doctors usually want to know.
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: 'Does Axis replace our EHR?',
                  answer: 'No. Axis works alongside your EHR. Ava runs intake, scheduling, reminders, and follow ups; your EHR stays the source of truth for charts and billing.'
                },
                {
                  question: 'Will our staff still answer the phones?',
                  answer: 'Yes. Ava can handle routine calls and texts, and warm transfer anything complex or sensitive to your team.'
                },
                {
                  question: 'Is Ava HIPAA compliant?',
                  answer: 'Axis is designed for HIPAA readiness: encrypted in transit and at rest, access controls, audit logs, and consent for recording and AI notes, with clinicians approving everything Ava drafts.'
                },
                {
                  question: 'How long does it take to get started?',
                  answer: 'Most clinics turn on Ava for one location or a subset of providers in a few days, then expand once they see fewer no shows and less front desk load.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacitscale: 1, scale: 0.95 }}
                  viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: flowEasing }}
                  className="bg-white rounded-xl border border-[var(--glass-border)] overflow-hidden"
                >
                  <button
                    onClick={() => setFaqExpanded(faqExpanded === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[var(--background-secondary)]/40 transition-colors"
                  >
                    <span className="text-base font-medium text-[var(--foreground)] pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`text-[var(--foreground-muted)] flex-shrink-0 transition-transform duration-200 ${
                        faqExpanded === index ? 'rotate-180' : ''
                      }`}
                      size={20}
                      strokeWidth={2}
                    />
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: faqExpanded === index ? 'auto' : 0,
                      opacity: faqExpanded === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: flowEasing }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-sm text-[var(--foreground-muted)] leading-relaxed font-normal" style={{ lineHeight: '1.7' }}>
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacitscale: 1, y: 30 }}
              viewport={{ once: true }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">See Axis in Action</h2>
              <p className="text-lg text-[var(--foreground-muted)] mb-12 leading-relaxed">
                Real clinic workflows. Your questions answered.
              </p>

              {/* CTA Block */}
              <div className="max-w-[720px] mx-auto p-12 rounded-3xl bg-gradient-to-br from-[var(--blue-soft)]/40 to-[var(--blue-soft)]/20 border border-[var(--blue-primary)]/20 shadow-[var(--shadow-soft)]">
                <p className="text-sm mb-8 text-[var(--foreground-muted)] leading-relaxed">
                  No sales pressure. Real workflows.
                </p>

                <Link to="/trial">
                  <motion.button
                    className="w-full px-10 py-5 rounded-full text-lg mb-6 bg-[var(--blue-primary)] text-white font-medium shadow-lg"
                    whileHover={{ 
                      scale: 1.01,
                      backgroundColor: '#1E4ED8',
                      y: -2,
                      boxShadow: '0 12px 32px rgba(37, 99, 235, 0.3)'
                    }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                  >
                    Join Waitlist
                  </motion.button>
                </Link>

                <Link 
                  to="/voice-automation"
                  className="text-sm text-[var(--blue-primary)] font-medium transition-all duration-200 inline-block hover:underline"
                >
                  Or Try Ava Voice assistant to Join Waitlist
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}