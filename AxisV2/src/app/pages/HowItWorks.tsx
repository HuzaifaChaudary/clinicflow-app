import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Calendar, FileText, Activity, BarChart3, CheckCircle, Send } from 'lucide-react';

export function HowItWorks() {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="relative py-40">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-10 font-medium">How Axis runs a clinic day.</h1>
              <p className="text-lg text-[var(--foreground-muted)] font-normal max-w-2xl mx-auto" style={{ lineHeight: '1.75' }}>
                From first call to follow up, Ava handles the front office so your team can focus on patients.
              </p>
            </motion.div>

            {/* Timeline Strip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              className="flex items-center justify-between gap-6 flex-wrap md:flex-nowrap"
            >
              {[
                { icon: Phone, label: 'Calls and messages', color: 'bg-[var(--blue-soft)]' },
                { icon: Calendar, label: 'Intake and scheduling', color: 'bg-[var(--blue-soft)]' },
                { icon: Activity, label: 'Visit and documentation', color: 'bg-[var(--blue-soft)]' },
                { icon: BarChart3, label: 'Follow ups and dashboards', color: 'bg-[var(--blue-soft)]' }
              ].map((stage, i) => (
                <div key={i} className="flex-1 min-w-[200px]">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${stage.color} flex items-center justify-center`}>
                      <stage.icon className="text-[var(--blue-primary)]" size={24} strokeWidth={2} />
                    </div>
                    <div className="text-sm text-[var(--foreground)] font-normal">{stage.label}</div>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-6 h-0.5 bg-[var(--blue-primary)]/20" style={{ transform: 'translateX(12px)' }} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stage 1: Calls and messages */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* Left: Text */}
            <motion.div
              className="pr-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">1. Calls and messages go to Ava.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal mb-8" style={{ lineHeight: '1.75' }}>
                Patients call or text like they do today. Ava answers first, staff can step in anytime.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Answers calls, understands why the patient is reaching out.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Handles routine questions and scheduling on its own.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Warm transfers complex or sensitive cases to staff.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="rounded-xl bg-white border border-[var(--glass-border)] shadow-sm overflow-hidden">
                {/* Call Queue */}
                <div className="p-6 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <Phone className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">Call queue</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Chen', status: 'Handled by Ava', color: 'bg-[var(--blue-soft)] text-[var(--blue-primary)]' },
                      { name: 'Mike Torres', status: 'Transferred to admin', color: 'bg-yellow-50 text-yellow-700' },
                      { name: 'Lisa Park', status: 'Waiting', color: 'bg-gray-100 text-gray-600' }
                    ].map((call, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-[var(--background-secondary)]/30">
                        <span className="text-sm font-normal text-[var(--foreground)]">{call.name}</span>
                        <span className={`text-xs px-2.5 py-1 rounded font-normal ${call.color}`}>
                          {call.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMS Thread */}
                <div className="p-6 bg-[var(--background-secondary)]/20">
                  <div className="flex items-center gap-2 mb-5">
                    <MessageSquare className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">Recent message</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[var(--background-secondary)]/50 p-4 rounded-lg max-w-sm">
                      <p className="text-sm text-[var(--foreground)] font-normal">Hi, I need to reschedule my appointment on Thursday.</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[var(--blue-primary)] text-white p-4 rounded-lg max-w-sm">
                        <p className="text-sm font-normal text-white">I can help with that. What day works better for you?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stage 2: Intake and scheduling */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* Left: Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <div className="rounded-xl bg-white border border-[var(--glass-border)] shadow-sm overflow-hidden">
                {/* Intake Questions */}
                <div className="p-6 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <FileText className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">Intake completed</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-1">Demographics</div>
                      <div className="text-sm text-[var(--foreground)] font-normal">Sarah Chen, 34, San Francisco</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-1">Insurance</div>
                      <div className="text-sm text-[var(--foreground)] font-normal">Blue Cross PPO, verified</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-1">Reason for visit</div>
                      <div className="text-sm text-[var(--foreground)] font-normal">Follow up for lower back pain</div>
                    </div>
                  </div>
                </div>

                {/* Day Schedule */}
                <div className="p-6 bg-[var(--background-secondary)]/20">
                  <div className="flex items-center gap-2 mb-5">
                    <Calendar className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">Today's schedule</span>
                  </div>
                  <div className="space-y-2">
                    <div className="py-2 px-3 rounded-lg bg-white border border-[var(--glass-border)]">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[var(--foreground)] font-normal">9:00 AM - Dr. Smith</div>
                        <div className="text-xs text-[var(--foreground-muted)]">Confirmed</div>
                      </div>
                    </div>
                    <div className="py-2 px-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-green-800 font-normal">11:00 AM - Dr. Smith</div>
                        <div className="text-xs text-green-700">Backfilled</div>
                      </div>
                    </div>
                    <div className="py-2 px-3 rounded-lg bg-white border border-[var(--glass-border)]">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[var(--foreground)] font-normal">2:00 PM - Dr. Jones</div>
                        <div className="text-xs text-[var(--foreground-muted)]">Confirmed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              className="pl-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <h2 className="mb-6 font-medium">2. Intake and scheduling happen automatically.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal mb-8" style={{ lineHeight: '1.75' }}>
                Ava completes intake by phone or text and fills the schedule around your rules.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Collects demographics, insurance, and reason for visit in conversation.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Writes structured intake and a short summary to review in Axis or your EHR.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Backfills cancellations where possible to keep calendars full.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stage 3: Visit and documentation */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* Left: Text */}
            <motion.div
              className="pr-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">3. Ava MD helps during and after visits.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal mb-8" style={{ lineHeight: '1.75' }}>
                With consent, Ava listens in, drafts notes, and suggests follow up options for clinicians.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Consent gated visit recording and transcription.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Draft SOAP or narrative notes for clinicians to edit and sign.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Suggested meds and follow ups as decision support, never auto executed.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Ava MD Note */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <motion.div 
                className="p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                  <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Draft Note</span>
                </div>

                <div className="space-y-5">
                  {/* Transcript Highlights */}
                  <div className="pb-5 border-b border-[var(--glass-border)]">
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Transcript highlights</div>
                    <div className="space-y-2">
                      <p className="text-xs text-[var(--foreground-muted)]/80 italic font-normal" style={{ lineHeight: '1.6' }}>"The pain started about 3 weeks ago..."</p>
                      <p className="text-xs text-[var(--foreground-muted)]/80 italic font-normal" style={{ lineHeight: '1.6' }}>"It gets worse when I sit for more than an hour..."</p>
                    </div>
                  </div>

                  {/* Subjective */}
                  <div>
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Subjective</div>
                    <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                      Patient reports persistent lower back pain for 3 weeks, worsening with prolonged sitting. Pain is described as dull and achy, 5/10 severity.
                    </div>
                  </div>

                  {/* Plan */}
                  <div>
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Plan</div>
                    <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                      Recommend PT referral, continue NSAIDs as needed. Follow up in 4 weeks.
                    </div>
                  </div>

                  {/* Review Button */}
                  <div className="pt-5 border-t border-[var(--glass-border)]">
                    <button className="w-full px-6 py-3 rounded-lg bg-[var(--blue-primary)] text-white text-sm font-medium hover:bg-[var(--blue-primary)]/90 transition-colors">
                      Review and sign
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stage 4: Follow ups and dashboards */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* Left: Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <div className="rounded-xl bg-white border border-[var(--glass-border)] shadow-sm overflow-hidden">
                {/* Follow Up Tasks */}
                <div className="p-6 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <Send className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">Follow up tasks</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { task: 'Missed appointment follow up', status: 'Sent', color: 'bg-[var(--blue-soft)] text-[var(--blue-primary)]' },
                      { task: 'Check in reminder', status: 'Queued', color: 'bg-yellow-50 text-yellow-700' },
                      { task: 'Medication reminder', status: 'Sent', color: 'bg-[var(--blue-soft)] text-[var(--blue-primary)]' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-[var(--background-secondary)]/30">
                        <span className="text-sm font-normal text-[var(--foreground)]">{item.task}</span>
                        <span className={`text-xs px-2.5 py-1 rounded font-normal ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Strip */}
                <div className="p-6 bg-[var(--background-secondary)]/20">
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart3 className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">This week</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-2 font-normal">No show rate</div>
                      <div className="text-2xl font-medium text-[var(--foreground)] mb-1">4.2%</div>
                      <div className="text-xs text-green-600 font-normal">↓ 2.3%</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-2 font-normal">Utilization</div>
                      <div className="text-2xl font-medium text-[var(--foreground)] mb-1">87%</div>
                      <div className="text-xs text-green-600 font-normal">↑ 5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              className="pl-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <h2 className="mb-6 font-medium">4. Follow ups go out, dashboards stay live.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal mb-8" style={{ lineHeight: '1.75' }}>
                Axis keeps patients on track and shows owners what is happening in real time.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Missed appointment and medication follow ups go out automatically.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Dashboards show no show trends, admin time per visit, and utilization.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                    Owners can see impact by provider, location, or service.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Under the hood section */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">Built to fit into real clinics.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal max-w-2xl mx-auto" style={{ lineHeight: '1.75' }}>
                Axis wraps your EHR and phones without forcing you to change systems.
              </p>
            </motion.div>

            {/* Integration Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between gap-8 mb-12 flex-wrap md:flex-nowrap">
                <motion.div 
                  className="flex-1 text-center p-7 rounded-xl bg-white border border-[var(--glass-border)] transition-all duration-150 cursor-pointer"
                  whileHover={{
                    backgroundColor: '#EAF1FF',
                    borderColor: 'rgba(37, 99, 235, 0.3)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                  }}
                >
                  <div className="text-sm font-semibold text-[var(--foreground)]">Patients and staff</div>
                </motion.div>

                <div className="text-[var(--foreground-muted)] text-lg">→</div>

                <motion.div 
                  className="flex-1 text-center p-7 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20 transition-all duration-150 cursor-pointer"
                  whileHover={{
                    backgroundColor: '#EAF1FF',
                    borderColor: 'rgba(37, 99, 235, 0.3)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                  }}
                >
                  <div className="text-sm font-semibold text-[var(--blue-primary)]">Ava</div>
                </motion.div>

                <div className="text-[var(--foreground-muted)] text-lg">→</div>

                <motion.div 
                  className="flex-1 text-center p-7 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20 transition-all duration-150 cursor-pointer"
                  whileHover={{
                    backgroundColor: '#EAF1FF',
                    borderColor: 'rgba(37, 99, 235, 0.3)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                  }}
                >
                  <div className="text-sm font-semibold text-[var(--blue-primary)]">Axis OS</div>
                </motion.div>

                <div className="text-[var(--foreground-muted)] text-lg">→</div>

                <motion.div 
                  className="flex-1 text-center p-7 rounded-xl bg-white border border-[var(--glass-border)] transition-all duration-150 cursor-pointer"
                  whileHover={{
                    backgroundColor: '#EAF1FF',
                    borderColor: 'rgba(37, 99, 235, 0.3)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                  }}
                >
                  <div className="text-sm font-semibold text-[var(--foreground)]">Your EHR</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Three Bullets */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            >
              <div className="text-[15px] text-[var(--foreground-muted)] font-normal leading-relaxed">
                API first where possible.
              </div>
              <div className="text-[15px] text-[var(--foreground-muted)] font-normal leading-relaxed">
                Controlled browser or desktop agent with logging when APIs are missing.
              </div>
              <div className="text-[15px] text-[var(--foreground-muted)] font-normal leading-relaxed">
                Encrypted, access controlled, and auditable.
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
              <h2 className="mb-6 font-medium">Try Axis in one part of your clinic.</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                Start with Ava handling intake and reminders for a few providers, then compare before and after.
              </p>

              <div className="max-w-[600px] mx-auto p-10 rounded-3xl bg-[var(--blue-soft)]/40">
                <Link to="/trial">
                  <motion.button
                    className="w-full px-10 py-5 rounded-full text-base bg-[var(--blue-primary)] text-white font-medium mb-4 transition-all duration-200"
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Join the waitlist
                  </motion.button>
                </Link>

                <Link 
                  to="/voice-automation"
                  className="text-sm text-[var(--blue-primary)] transition-all duration-200 inline-block hover:underline"
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