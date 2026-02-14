import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, UserPlus, Calendar, Bell } from 'lucide-react';

export function TryAva() {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="min-h-screen pt-32">
      {/* Hero: Ava AI live demo */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Heading and subline */}
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8 font-medium">Ava AI is your clinic's voice front desk.</h1>
              <p className="text-lg text-[var(--foreground-muted)] font-normal mb-8" style={{ lineHeight: '1.75' }}>
                Call like today. Ava answers first, your team steps in when needed, and clinics see fewer missed calls and no‑shows.
              </p>

              {/* Primary CTA */}
              <Link to="/trial">
                <motion.button
                  className="px-8 py-4 rounded-full bg-[var(--blue-primary)] text-white text-base font-medium mb-12"
                  style={{ transition: 'all 150ms ease-out' }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join the waitlist
                </motion.button>
              </Link>
            </motion.div>

            {/* Two Demo Blocks - Side by Side on Desktop */}
            {/* OR Divider */}
            <div className="flex items-center justify-center mb-6">
              <span className="text-lg font-medium text-[var(--foreground-muted)] px-4">OR</span>
            </div>

            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              {/* Call Ava */}
              <motion.div 
                className="p-8 rounded-xl bg-[var(--blue-soft)]/40 border border-[var(--blue-primary)]/20 cursor-pointer shadow-sm text-center"
                style={{ transition: 'all 150ms ease-out' }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Phone className="text-[var(--blue-primary)]" size={22} strokeWidth={2} />
                  <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Call Ava now</span>
                </div>
                <a href="tel:+16282004122" className="block">
                  <div className="text-4xl font-semibold text-[var(--blue-primary)] mb-2 cursor-pointer hover:underline">(628) 200-4122</div>
                </a>
                <p className="text-xs text-[var(--foreground-muted)]/70 font-normal mb-4">Click or tap the number to call now.</p>
                <p className="text-sm text-[var(--foreground-muted)] font-normal mb-3">Call now to secure your spot for a dashboard walkthrough and lock in 3 months free access. <span className="font-medium">Limited spots available this week!</span></p>
                <p className="text-sm text-[var(--foreground-muted)] font-normal">
                  Prefer a different option? <Link to="/trial" className="text-[var(--blue-primary)] hover:underline font-normal">Join Waitlist instead</Link>.
                </p>
              </motion.div>
            </motion.div>

            {/* Live Workspace Visual - Now Below the Demo Blocks */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.4 }}
            >
              <div className="rounded-2xl bg-white border border-[var(--glass-border)] shadow-lg overflow-hidden">
                {/* Calls Ava is handling now */}
                <div className="p-6 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <Phone className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">Calls Ava is handling now</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { name: 'Sarah Chen', status: 'Scheduling new patient', time: '2:00 PM' },
                      { name: 'Mike Torres', status: 'Confirming tomorrow', time: '3:30 PM' },
                      { name: 'Lisa Park', status: 'Billing question', time: '4:15 PM' }
                    ].map((call, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-[var(--background-secondary)]/30">
                        <span className="text-sm font-normal text-[var(--foreground)]">{call.name}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs text-[var(--foreground-muted)]">{call.time}</span>
                          <span className="text-xs px-2.5 py-1 rounded font-normal bg-[var(--blue-soft)] text-[var(--blue-primary)]">
                            {call.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Ava can handle today */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-medium">What Ava can handle today.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Turn your phone line into a 24/7 front desk without adding headcount.
              </p>
            </motion.div>

            {/* Three Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: UserPlus,
                  title: 'New patient calls',
                  description: 'Intake questions, insurance, and first appointment.'
                },
                {
                  icon: Calendar,
                  title: 'Existing patient requests',
                  description: 'Reschedules, confirmations, and basic questions.'
                },
                {
                  icon: Bell,
                  title: 'Follow ups and reminders',
                  description: 'Missed appointments, check ins, and medication reminders.'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: flowEasing }}
                  whileHover={{
                    backgroundColor: '#EAF1FF',
                    borderColor: 'rgba(37, 99, 235, 0.3)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                  }}
                >
                  <div className="w-14 h-14 rounded-xl bg-[var(--blue-soft)] flex items-center justify-center mb-6">
                    <item.icon className="text-[var(--blue-primary)]" size={24} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-3">{item.title}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.7' }}>
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample flows section */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-medium">See how Ava handles real situations.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Three common scenarios from real clinics, handled by Ava without adding staff.
              </p>
            </motion.div>

            {/* Three Story Cards - Desktop: Three columns, Mobile: Stacked */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: New patient call */}
              <motion.div
                className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm flex flex-col transition-all duration-150 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: flowEasing }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[var(--blue-soft)] flex items-center justify-center">
                    <Phone className="text-[var(--blue-primary)]" size={18} strokeWidth={2} />
                  </div>
                  <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">New patient call</span>
                </div>
                <div className="space-y-4 mb-6 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mt-1 w-14 flex-shrink-0">Ava</div>
                    <p className="text-sm text-[var(--foreground)] font-normal flex-1" style={{ lineHeight: '1.7' }}>
                      Hi, thanks for calling Dr. Smith's office. Are you a current patient or is this your first time?
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mt-1 w-14 flex-shrink-0">Caller</div>
                    <p className="text-sm text-[var(--foreground)] font-normal flex-1" style={{ lineHeight: '1.7' }}>
                      First time. I need a physical.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mt-1 w-14 flex-shrink-0">Ava</div>
                    <p className="text-sm text-[var(--foreground)] font-normal flex-1" style={{ lineHeight: '1.7' }}>
                      Perfect. Let me get some information and find a good time for you.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--glass-border)]">
                  <p className="text-sm text-[var(--foreground-muted)] font-normal italic">
                    Outcome: New patient scheduled in the next available slot.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Reschedule over text */}
              <motion.div
                className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm flex flex-col transition-all duration-150 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: flowEasing }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[var(--blue-soft)] flex items-center justify-center">
                    <Calendar className="text-[var(--blue-primary)]" size={18} strokeWidth={2} />
                  </div>
                  <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Reschedule call</span>
                </div>
                <div className="space-y-4 mb-6 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mt-1 w-14 flex-shrink-0">Caller</div>
                    <p className="text-sm text-[var(--foreground)] font-normal flex-1" style={{ lineHeight: '1.7' }}>
                      I need to move my Thursday appointment to next week.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mt-1 w-14 flex-shrink-0">Ava</div>
                    <p className="text-sm text-[var(--foreground)] font-normal flex-1" style={{ lineHeight: '1.7' }}>
                      No problem! How about Thursday at 10 AM? I have that open.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--glass-border)]">
                  <p className="text-sm text-[var(--foreground-muted)] font-normal italic">
                    Outcome: Visit rescheduled in under a minute.
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Missed appointment follow up */}
              <motion.div
                className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm flex flex-col transition-all duration-150 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: flowEasing }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[var(--blue-soft)] flex items-center justify-center">
                    <Bell className="text-[var(--blue-primary)]" size={18} strokeWidth={2} />
                  </div>
                  <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Missed appointment</span>
                </div>
                <div className="space-y-3 mb-6 flex-1">
                  <div className="bg-[var(--background-secondary)]/30 p-4 rounded-lg">
                    <p className="text-sm text-[var(--foreground)] font-normal mb-3">
                      Hi Sarah, this is Ava from Dr. Smith's office. We noticed you weren't able to make your appointment today. Would you like to reschedule?
                    </p>
                    <div className="text-xs text-[var(--foreground-muted)] font-normal pt-3 border-t border-[var(--glass-border)]">
                      Sent 2 hours after missed appointment
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--glass-border)]">
                  <p className="text-sm text-[var(--foreground-muted)] font-normal italic">
                    Outcome: No‑show converted into a rescheduled visit.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Light proof section */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-medium">What clinics notice on their phone lines.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Early adopters see noticeable changes on their phone lines in the first few weeks.
              </p>
            </motion.div>

            {/* Metric Strip with Sublines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              {[
                {
                  title: 'Fewer missed calls',
                  subline: 'Ava answers when the front desk is busy or after hours.'
                },
                {
                  title: 'Fewer no‑shows',
                  subline: 'Voice reminders confirm or reschedule more visits.'
                },
                {
                  title: 'Less front desk time per kept visit',
                  subline: 'Intake, confirmations, and follow ups run in the background.'
                }
              ].map((metric, i) => (
                <motion.div 
                  key={i} 
                  className="p-6 rounded-xl bg-[var(--blue-soft)]/30 border border-[var(--blue-primary)]/20 text-center transition-all duration-150 cursor-pointer"
                  whileHover={{
                    backgroundColor: '#EAF1FF',
                    borderColor: 'rgba(37, 99, 235, 0.3)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                  }}
                >
                  <p className="text-base font-medium text-[var(--foreground)] mb-3">{metric.title}</p>
                  <p className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.6' }}>
                    {metric.subline}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Quote Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.4 }}
              className="p-10 rounded-2xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
              whileHover={{
                backgroundColor: '#EAF1FF',
                borderColor: 'rgba(37, 99, 235, 0.3)',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
              }}
            >
              <p className="text-xl text-[var(--foreground)] font-normal mb-6 italic" style={{ lineHeight: '1.6' }}>
                "Our phones feel under control for the first time in years."
              </p>
              <div className="text-sm text-[var(--foreground-muted)] font-normal">
                — Clinic owner, multi-provider practice
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">Hear Ava on your own phone.</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                Call (628) 200-4122 now or <Link to="/trial" className="text-[var(--blue-primary)] hover:underline">join the waitlist</Link> to get Ava on your clinic's number.
              </p>

              <div className="max-w-[600px] mx-auto p-10 rounded-3xl bg-[var(--blue-soft)]/40">
                <Link to="/trial">
                  <motion.button
                    className="w-full px-10 py-5 rounded-full text-base bg-[var(--blue-primary)] text-white font-medium mb-6 transition-all duration-200"
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Join the waitlist
                  </motion.button>
                </Link>

                <Link to="/voice-automation" className="text-base text-[var(--foreground-muted)] font-normal">
                  <span className="text-[var(--blue-primary)] font-medium hover:underline">Or Try Ava Voice assistant to Join Waitlist</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
