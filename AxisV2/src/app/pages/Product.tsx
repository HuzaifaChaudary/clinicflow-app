import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Calendar, CheckCircle, Clock, TrendingDown, BarChart3, Activity, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Product() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [adminTab, setAdminTab] = useState<'calls' | 'reminders' | 'intake'>('calls');

  return (
    <div className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="relative py-40">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left: Copy */}
            <motion.div
              className="lg:pt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-10 text-5xl font-semibold">Axis runs the front office of your clinic.</h1>
              <p className="text-lg text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                Ava answers calls, completes intake, and manages scheduling, reminders, and follow ups around your EHR.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/trial">
                  <motion.button
                    className="px-8 py-4 rounded-full bg-[var(--blue-primary)] text-white font-medium transition-all duration-200"
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join the waitlist
                  </motion.button>
                </Link>
                <Link to="/voice-automation">
                  <span className="text-sm text-[var(--blue-primary)] font-medium hover:underline cursor-pointer">
                    Or Try Ava Voice assistant to Join Waitlist
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Right: Coherent Axis Workspace */}
            <motion.div
              className="lg:pt-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              {/* Single Workspace Container */}
              <div className="rounded-2xl bg-white border border-[var(--glass-border)] shadow-lg overflow-hidden">
                
                {/* Ava Call Queue Panel */}
                <div className="p-6 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <Phone className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">Calls Ava is handling now</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { name: 'Sarah Chen', status: 'Confirmed', time: '2:00 PM' },
                      { name: 'Mike Torres', status: 'Rescheduled', time: '3:30 PM' },
                      { name: 'Lisa Park', status: 'Needs follow up', time: '4:15 PM' }
                    ].map((call, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-[var(--background-secondary)]/30">
                        <span className="text-sm font-normal text-[var(--foreground)]">{call.name}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs text-[var(--foreground-muted)]">{call.time}</span>
                          <span className={`text-xs px-2.5 py-1 rounded font-normal ${
                            call.status === 'Confirmed' ? 'bg-[var(--blue-soft)] text-[var(--blue-primary)]' :
                            call.status === 'Rescheduled' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-orange-50 text-orange-700'
                          }`}>
                            {call.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ava MD Draft Panel */}
                <div className="p-6 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <Activity className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">Draft from today's visit</span>
                  </div>
                  <div className="text-sm text-[var(--foreground-muted)] font-normal mb-4" style={{ lineHeight: '1.75' }}>
                    <p className="text-xs text-[var(--foreground-muted)] mb-2">Subjective</p>
                    <p className="text-sm">Patient reports persistent lower back pain for 3 weeks, worsening with prolonged sitting...</p>
                  </div>
                  <button className="w-full py-2.5 px-4 rounded-lg text-sm text-[var(--blue-primary)] font-medium bg-[var(--blue-soft)] hover:bg-[var(--blue-soft)]/80 transition-colors">
                    Review and sign
                  </button>
                </div>

                {/* This Week Metrics Strip */}
                <div className="p-6 bg-[var(--background-secondary)]/20">
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart3 className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--foreground)]">This week in your clinic</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-2 font-normal">No show rate</div>
                      <div className="flex items-end gap-3">
                        <div className="text-2xl font-medium text-[var(--foreground)]">4.2%</div>
                        <div className="text-xs text-green-600 font-normal pb-1">↓ 2.3%</div>
                      </div>
                      {/* Mini trend graph */}
                      <div className="mt-3 h-8 flex items-end gap-0.5">
                        {[8, 7.5, 6.8, 5.9, 5.2, 4.8, 4.2].map((val, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-[var(--blue-primary)]/40 rounded-sm"
                            style={{ height: `${(val / 8) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-2 font-normal">Utilization</div>
                      <div className="flex items-end gap-3">
                        <div className="text-2xl font-medium text-[var(--foreground)]">87%</div>
                        <div className="text-xs text-green-600 font-normal pb-1">↑ 5%</div>
                      </div>
                      {/* Mini bar graph */}
                      <div className="mt-3 space-y-1.5">
                        {[92, 85, 84].map((val, i) => (
                          <div key={i} className="h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[var(--blue-primary)]/60"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Axis wraps your EHR */}
      <section className="relative py-40 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">Axis wraps your existing EHR.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                We keep your EHR as the system of record and automate intake, scheduling, reminders, and follow ups around it.
              </p>
            </motion.div>
          </div>

          {/* Diagram */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="flex items-center justify-between gap-8 mb-16 flex-wrap md:flex-nowrap">
              {/* Patients & Staff */}
              <div className="flex-1 text-center p-7 rounded-xl bg-[var(--background-secondary)]/40">
                <div className="text-sm font-semibold text-[var(--foreground)]">Patients and staff</div>
              </div>

              <div className="text-[var(--foreground-muted)] text-lg">→</div>

              {/* Ava Layer */}
              <div className="flex-1 text-center p-7 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20">
                <div className="text-sm font-semibold text-[var(--blue-primary)] mb-3">Ava</div>
                <div className="text-xs text-[var(--foreground-muted)] font-normal space-y-1.5">
                  <div>Calls and SMS</div>
                  <div>Intake questions</div>
                  <div>Reminders and follow ups</div>
                </div>
              </div>

              <div className="text-[var(--foreground-muted)] text-lg">→</div>

              {/* Axis OS */}
              <div className="flex-1 text-center p-7 rounded-xl bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20">
                <div className="text-sm font-semibold text-[var(--blue-primary)] mb-3">Axis OS</div>
                <div className="text-xs text-[var(--foreground-muted)] font-normal space-y-1.5">
                  <div>Queues and triage</div>
                  <div>Dashboards and notes</div>
                </div>
              </div>

              <div className="text-[var(--foreground-muted)] text-lg">→</div>

              {/* Your EHR */}
              <div className="flex-1 text-center p-7 rounded-xl bg-[var(--background-secondary)]/40">
                <div className="text-sm font-semibold text-[var(--foreground)]">Your EHR</div>
              </div>
            </div>

            {/* Bullets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="text-[15px] text-[var(--foreground-muted)] font-normal leading-relaxed">
                API first where possible.
              </div>
              <div className="text-[15px] text-[var(--foreground-muted)] font-normal leading-relaxed">
                Controlled browser or desktop agent with full logging when APIs are missing.
              </div>
              <div className="text-[15px] text-[var(--foreground-muted)] font-normal leading-relaxed">
                No double data entry for staff.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ava for admins / front desk */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-medium">Ava for admins and front desk</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Your always on front desk that still works under staff control.
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="mb-8 flex items-center justify-center gap-2 flex-wrap">
              <button 
                onClick={() => setAdminTab('calls')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  adminTab === 'calls' 
                    ? 'bg-[var(--blue-primary)] text-white' 
                    : 'bg-[var(--background-secondary)]/40 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]/60'
                }`}
              >
                Inbound calls
              </button>
              <button 
                onClick={() => setAdminTab('reminders')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  adminTab === 'reminders' 
                    ? 'bg-[var(--blue-primary)] text-white' 
                    : 'bg-[var(--background-secondary)]/40 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]/60'
                }`}
              >
                Reminders and follow ups
              </button>
              <button 
                onClick={() => setAdminTab('intake')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  adminTab === 'intake' 
                    ? 'bg-[var(--blue-primary)] text-white' 
                    : 'bg-[var(--background-secondary)]/40 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]/60'
                }`}
              >
                Intake and work queues
              </button>
            </div>

            {/* Tab Content */}
            <motion.div
              key={adminTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm"
            >
              {adminTab === 'calls' && (
                <div>
                  <p className="text-sm text-[var(--foreground-muted)] mb-6 font-normal" style={{ lineHeight: '1.75' }}>
                    Answers calls, understands why the patient is calling, and routes or books.
                  </p>
                  
                  {/* Call Log UI */}
                  <div className="space-y-3">
                    {[
                      { time: '10:23 AM', caller: 'Sarah Chen', reason: 'Appointment booking', status: 'Scheduled' },
                      { time: '10:45 AM', caller: 'Mike Torres', reason: 'Reschedule request', status: 'Transferred to admin' },
                      { time: '11:12 AM', caller: 'Lisa Park', reason: 'Billing question', status: 'Handled by Ava' },
                      { time: '11:34 AM', caller: 'James Wilson', reason: 'New patient inquiry', status: 'Scheduled' }
                    ].map((call, i) => (
                      <div key={i} className="flex items-center justify-between py-3 px-4 rounded-lg border-b border-[var(--glass-border)] last:border-0">
                        <div className="flex items-center gap-4 flex-1">
                          <Phone className="text-[var(--blue-primary)] flex-shrink-0" size={16} strokeWidth={2} />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[var(--foreground)]">{call.caller}</div>
                            <div className="text-xs text-[var(--foreground-muted)] font-normal mt-0.5">{call.reason}</div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xs text-[var(--foreground-muted)] font-normal mb-1">{call.time}</div>
                          <div className="text-xs text-[var(--blue-primary)] font-medium">{call.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === 'reminders' && (
                <div>
                  <p className="text-sm text-[var(--foreground-muted)] mb-6 font-normal" style={{ lineHeight: '1.75' }}>
                    Multi touch voice and SMS confirmations and reschedules.
                  </p>
                  
                  {/* SMS Conversation UI */}
                  <div className="space-y-4">
                    <div className="bg-[var(--background-secondary)]/30 p-4 rounded-lg max-w-md">
                      <p className="text-sm text-[var(--foreground)] font-normal leading-relaxed">
                        Hi Sarah, this is Ava with Dr. Smith's office. Your appointment is tomorrow at 9:00 AM. Will you still be able to come in?
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[var(--blue-primary)] text-white p-4 rounded-lg max-w-md">
                        <p className="text-sm font-normal">Yes, that works. Thanks.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-center py-4">
                      <CheckCircle className="text-green-600" size={16} strokeWidth={2} />
                      <span className="text-sm text-[var(--foreground-muted)]">Appointment confirmed</span>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'intake' && (
                <div>
                  <p className="text-sm text-[var(--foreground-muted)] mb-6 font-normal" style={{ lineHeight: '1.75' }}>
                    Phone and text intake turned into structured data and summaries.
                  </p>
                  
                  {/* Work Queue UI */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-[var(--background-secondary)]/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-[var(--foreground)]">Sarah Chen - New Patient Intake</div>
                        <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700">Complete</span>
                      </div>
                      <div className="text-xs text-[var(--foreground-muted)] space-y-1">
                        <div>✓ Medical history collected</div>
                        <div>✓ Insurance verified</div>
                        <div>✓ Forms signed</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--background-secondary)]/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-[var(--foreground)]">Mike Torres - Follow Up</div>
                        <span className="text-xs px-2 py-1 rounded bg-yellow-50 text-yellow-700">In Progress</span>
                      </div>
                      <div className="text-xs text-[var(--foreground-muted)] space-y-1">
                        <div>✓ Symptom update received</div>
                        <div>⋯ Waiting for test results upload</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ava MD for clinicians */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">Ava MD for clinicians</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Optional AI scribe and suggested plans, with clinicians editing and signing every note.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            {/* Left: Benefits List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)] mb-1">Consent gated visit recording and transcription.</div>
                  <div className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>Patients opt in before any recording starts.</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)] mb-1">Draft SOAP or narrative notes you can edit and sign.</div>
                  <div className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>You keep full editorial control.</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)] mb-1">Suggested meds and follow ups as decision support.</div>
                  <div className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>Suggestions only, never auto executed.</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Note UI */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                  <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Draft Note</span>
                </div>

                <div className="space-y-5">
                  {/* Transcript Preview - Shortened and Lighter */}
                  <div className="pb-5 border-b border-[var(--glass-border)]">
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Transcript highlights</div>
                    <div className="space-y-2">
                      <p className="text-xs text-[var(--foreground-muted)]/80 italic font-normal" style={{ lineHeight: '1.6' }}>"The pain started about 3 weeks ago..."</p>
                      <p className="text-xs text-[var(--foreground-muted)]/80 italic font-normal" style={{ lineHeight: '1.6' }}>"It gets worse when I sit for more than an hour..."</p>
                    </div>
                  </div>

                  {/* Draft SOAP */}
                  <div>
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Subjective</div>
                    <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                      Patient reports persistent lower back pain for 3 weeks, worsening with prolonged sitting. Pain is described as dull and achy, 5/10 severity. No radiating symptoms.
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Assessment and plan</div>
                    <div className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.7' }}>
                      Likely mechanical low back pain. Recommend PT referral, continue NSAIDs as needed. Follow up in 4 weeks.
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-5 border-t border-[var(--glass-border)]">
                    <button className="w-full px-6 py-3 rounded-lg bg-[var(--blue-primary)] text-white text-sm font-medium hover:bg-[var(--blue-primary)]/90 transition-colors">
                      Review and sign
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Axis for owners and practice leaders */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-medium">Axis for owners and practice leaders</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                See no shows, utilization, and workload for your clinic in one place.
              </p>
            </motion.div>

            {/* Quantitative Tiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {/* No show rate */}
              <motion.div 
                className="p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="mb-4">
                  <span className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">No show rate</span>
                </div>
                <div className="text-3xl font-medium text-[var(--foreground)] mb-2">4.2%</div>
                <div className="text-xs text-[var(--foreground-muted)] font-normal mb-4">Down 2.3% since last month.</div>
                {/* Mini trend line - cleaner with fewer bars */}
                <div className="h-10 flex items-end gap-1">
                  {[6.5, 5.8, 5.2, 4.8, 4.2].map((val, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-[var(--blue-primary)]/40 rounded-sm"
                      style={{ height: `${(val / 6.5) * 100}%` }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Admin minutes per visit */}
              <motion.div 
                className="p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="mb-4">
                  <span className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">Admin minutes per visit</span>
                </div>
                <div className="text-3xl font-medium text-[var(--foreground)] mb-2">12</div>
                <div className="text-xs text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.6' }}>
                  Time spent on calls, confirmations, and intake per kept visit.
                </div>
              </motion.div>

              {/* Utilization */}
              <motion.div 
                className="p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="mb-4">
                  <span className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">Utilization</span>
                </div>
                <div className="text-3xl font-medium text-[var(--foreground)] mb-2">87%</div>
                <div className="text-xs text-[var(--foreground-muted)] font-normal mb-4">By provider for this week.</div>
                {/* Mini bar chart - tight spacing, 3 providers */}
                <div className="space-y-1.5">
                  {[
                    { name: 'Dr. Smith', value: 92 },
                    { name: 'Dr. Jones', value: 85 },
                    { name: 'Dr. Lee', value: 84 }
                  ].map((provider, i) => (
                    <div key={i} className="h-1.5 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--blue-primary)]/70"
                        style={{ width: `${provider.value}%` }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.4 }}
              className="text-center"
            >
              <p className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Dashboards show call volume, intake completion, reminders, and kept visits by provider, location, or service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflows that run themselves */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-medium">Workflows that run themselves</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Turn common front office tasks into automations you can switch on in a few clicks.
              </p>
            </motion.div>

            {/* Automation List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              className="space-y-4"
            >
              {[
                {
                  label: 'New patient intake call and forms',
                  description: 'Runs when a new appointment is booked.'
                },
                {
                  label: 'Appointment reminder voice call and text',
                  description: 'Runs 24 hours before the visit, retries if no response.'
                },
                {
                  label: 'Missed appointment follow up',
                  description: 'Runs 2 hours after a no show.'
                },
                {
                  label: 'Medication check in reminder',
                  description: 'Runs 7 days after prescription.'
                }
              ].map((workflow, i) => (
                <div 
                  key={i}
                  className="p-7 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm hover:border-[var(--blue-primary)]/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-[var(--foreground)] pr-6">{workflow.label}</div>
                    {/* Toggle Switch */}
                    <div className="relative w-12 h-6 bg-[var(--blue-primary)] rounded-full cursor-pointer flex-shrink-0">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] font-normal pr-14">{workflow.description}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIPAA ready with human in the loop */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-medium">HIPAA ready with human in the loop.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Ava helps, staff and clinicians stay in control of every step.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: Bullets */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing }}
                className="space-y-7 pr-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-medium" style={{ lineHeight: '1.7' }}>
                    Encrypted in transit and at rest.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-medium" style={{ lineHeight: '1.7' }}>
                    Role based access and audit logs for every call, text, and note.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-medium" style={{ lineHeight: '1.7' }}>
                    Patient consent required for recording and AI notes.
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-[var(--blue-primary)]" size={14} strokeWidth={2} />
                  </div>
                  <div className="text-sm text-[var(--foreground)] font-medium" style={{ lineHeight: '1.7' }}>
                    Clinicians review and approve all documentation and suggestions.
                  </div>
                </div>
              </motion.div>

              {/* Right: Audit Log */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              >
                <div className="p-7 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm">
                  <div className="flex items-center gap-2 mb-7">
                    <Activity className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                    <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">Audit Log</span>
                  </div>

                  <div className="space-y-5">
                    {[
                      { event: 'Call handled by Ava', user: 'System', time: '2:34 PM' },
                      { event: 'Note drafted by Ava MD', user: 'Ava MD', time: '2:36 PM' },
                      { event: 'Note reviewed by Dr. Smith', user: 'Dr. Smith', time: '2:45 PM' },
                      { event: 'Note approved and signed', user: 'Dr. Smith', time: '2:46 PM' }
                    ].map((log, i) => (
                      <div key={i} className="flex items-start justify-between py-3 border-b border-[var(--glass-border)] last:border-0">
                        <div>
                          <div className="text-sm text-[var(--foreground)] font-medium">{log.event}</div>
                          <div className="text-xs text-[var(--foreground-muted)]/70 mt-1.5 font-normal">{log.user}</div>
                        </div>
                        <div className="text-xs text-[var(--foreground-muted)]/70 font-normal">{log.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Start small, expand fast */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 font-medium">Start small, expand fast.</h2>
              <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                Most clinics switch on Axis for one location or a few providers first.
              </p>
            </motion.div>

            {/* Three Steps Horizontal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {[
                {
                  step: '1',
                  title: 'Connect your EHR and phone number',
                  description: 'API or secure browser agent, your choice.'
                },
                {
                  step: '2',
                  title: 'Pick which calls and reminders Ava handles',
                  description: 'Start with confirmations and intake, expand from there.'
                },
                {
                  step: '3',
                  title: 'Review results, then roll out across the clinic',
                  description: 'Most clinics see fewer no shows and less front desk load in the first weeks.'
                }
              ].map((item, i) => (
                <div key={i} className="text-center px-4 py-6">
                  <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-[var(--blue-soft)] flex items-center justify-center">
                    <span className="text-lg font-medium text-[var(--blue-primary)]">{item.step}</span>
                  </div>
                  <h3 className="text-base font-medium text-[var(--foreground)] mb-3 px-2">{item.title}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] font-normal px-2" style={{ lineHeight: '1.7' }}>
                    {item.description}
                  </p>
                </div>
              ))}
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
              <h2 className="mb-6 font-medium">See Axis in action</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 leading-relaxed font-normal">
                A short walkthrough. Real clinic workflows.
              </p>

              <div className="max-w-[600px] mx-auto p-10 rounded-3xl bg-[var(--blue-soft)]/40">
                <p className="text-sm mb-8 text-[var(--foreground-muted)] font-normal">
                  No sales pressure. Real workflows. Your questions answered.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link to="/trial">
                    <motion.button
                      className="px-10 py-5 rounded-full text-base bg-[var(--blue-primary)] text-white font-medium transition-all duration-200"
                      whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Join the waitlist
                    </motion.button>
                  </Link>
                  <Link to="/voice-automation">
                    <span className="text-sm text-[var(--blue-primary)] font-medium hover:underline cursor-pointer">
                      Or Try Ava Voice assistant to Join Waitlist
                    </span>
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