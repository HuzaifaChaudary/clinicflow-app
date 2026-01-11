import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Phone,
  MessageSquare,
  CheckCircle,
  FileText,
  Clock,
  AlertCircle,
  ArrowRight,
  Clipboard
} from 'lucide-react';

export function Dental() {
  const flowEasing = [0.22, 1, 0.36, 1];

  const struggles = [
    {
      title: 'Last minute no shows',
      description: 'Empty chairs discovered too late to fill cost time and revenue.'
    },
    {
      title: 'Patients forget hygiene or follow up visits',
      description: 'Routine appointments slip through without consistent reminders.'
    },
    {
      title: 'Treatment plans stall after the first visit',
      description: 'Multi visit procedures fall apart when follow through is manual.'
    },
    {
      title: 'Front desk spends the day calling confirmations',
      description: 'Staff time goes to phone calls instead of serving patients who are present.'
    }
  ];

  const workflowSteps = [
    { label: 'Configure', detail: 'Set rules once', icon: Calendar },
    { label: 'Run', detail: 'System applies automatically', icon: CheckCircle },
    { label: 'Monitor', detail: 'Clear visibility', icon: Clock },
    { label: 'Step in', detail: 'Exceptions only', icon: AlertCircle }
  ];

  const treatmentSteps = [
    { step: 'Initial consultation', status: 'complete' },
    { step: 'Cleaning scheduled', status: 'complete' },
    { step: 'Crown prep scheduled', status: 'complete' },
    { step: 'Crown placement', status: 'pending' },
    { step: 'Follow up checkup', status: 'pending' }
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* HERO */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8">Built for dental clinics that run on full chairs</h1>
              <p className="text-2xl text-[var(--foreground-muted)] mb-12">
                Confirmations, reminders, and follow ups happen automatically so chair time stays protected and schedules stay tight.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/how-it-works">
                  <motion.button
                    className="px-8 py-4 rounded-full text-lg"
                    style={{ 
                      backgroundColor: '#2563EB',
                      color: 'white',
                      transition: 'all 200ms ease-out'
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E4ED8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                    }}
                  >
                    See how it works for dental clinics
                  </motion.button>
                </Link>

                <Link to="/trial">
                  <motion.button
                    className="px-8 py-4 rounded-full text-lg border-2"
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
                    Join Waitlist
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Chair based schedule grid */}
            <motion.div
              className="p-10 rounded-2xl"
              style={{ backgroundColor: '#F8FAFC' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="space-y-4">
                <div className="text-sm text-[var(--foreground-muted)] mb-6">Daily schedule - Chair 1</div>
                
                {/* Time slots */}
                {[
                  { time: '9:00 AM', status: 'empty', label: 'Open slot' },
                  { time: '10:00 AM', status: 'confirmed', label: 'Hygiene - Confirmed' },
                  { time: '11:00 AM', status: 'empty', label: 'Open slot' },
                  { time: '1:00 PM', status: 'confirmed', label: 'Crown prep - Confirmed' },
                  { time: '2:30 PM', status: 'confirmed', label: 'Filling - Confirmed' }
                ].map((slot, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: slot.status === 'empty' ? '#FEF2F2' : '#DCFCE7',
                      border: slot.status === 'empty' ? '2px dashed #EF4444' : '2px solid #10B981',
                      opacity: slot.status === 'empty' ? 0.6 : 1
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: slot.status === 'empty' ? 0.6 : 1, 
                      x: 0 
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.4 + i * 0.1,
                      ease: flowEasing 
                    }}
                  >
                    <div className="text-sm min-w-[80px]" style={{ 
                      color: slot.status === 'empty' ? '#EF4444' : '#10B981' 
                    }}>
                      {slot.time}
                    </div>
                    {slot.status === 'confirmed' && (
                      <CheckCircle size={16} style={{ color: '#10B981' }} />
                    )}
                    <div className="text-sm flex-1" style={{ 
                      color: slot.status === 'empty' ? '#EF4444' : 'var(--foreground)' 
                    }}>
                      {slot.label}
                    </div>
                  </motion.div>
                ))}

                {/* Empty chairs fade, confirmed lock in */}
                <motion.div
                  className="text-center text-sm pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                >
                  <span style={{ color: '#10B981' }}>3 confirmed</span>
                  <span className="mx-2 text-[var(--foreground-muted)]">•</span>
                  <span style={{ color: '#EF4444' }}>2 open</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHERE SCHEDULES BREAK DOWN */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">Where schedules break down</h2>
          </motion.div>

          {/* Daily chair timeline with gaps */}
          <div className="max-w-5xl mx-auto space-y-8">
            {struggles.map((struggle, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-white"
                style={{ border: '1px solid var(--glass-border)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
              >
                <div className="mb-6">
                  <h3 className="mb-3 text-lg">{struggle.title}</h3>
                  <p className="text-[var(--foreground-muted)]">{struggle.description}</p>
                </div>

                {/* Visual timeline showing gaps */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 8 }).map((_, idx) => {
                    // Create pattern where some blocks are gaps (red)
                    const isGap = (i === 0 && idx === 3) || 
                                  (i === 1 && (idx === 2 || idx === 5)) || 
                                  (i === 2 && (idx === 4 || idx === 6)) ||
                                  (i === 3 && (idx === 1 || idx === 3 || idx === 7));
                    
                    return (
                      <motion.div
                        key={idx}
                        className="flex-1 h-12 rounded"
                        style={{
                          backgroundColor: isGap ? '#FEE2E2' : '#DBEAFE',
                          border: isGap ? '2px solid #EF4444' : 'none'
                        }}
                        initial={{ opacity: 0, scaleY: 0.5 }}
                        whileInView={{ opacity: 1, scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.3, 
                          delay: 0.3 + idx * 0.05,
                          ease: flowEasing 
                        }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW AXIS FITS DENTAL WORKFLOWS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Designed for high volume visits</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Dental clinics depend on predictable schedules. AXIS confirms visits, sends reminders, and follows up so chairs stay filled without staff chasing patients.
            </p>
          </motion.div>

          {/* Calendar zooming into one day */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="p-10 rounded-2xl" style={{ backgroundColor: '#F8FAFC' }}>
              {/* Month view shrinking */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 1, scale: 1 }}
                whileInView={{ opacity: 0.3, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-center text-sm text-[var(--foreground-muted)] mb-4">January 2026</div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 21 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded flex items-center justify-center text-xs"
                      style={{ 
                        backgroundColor: i === 10 ? '#2563EB' : '#E2E8F0',
                        color: i === 10 ? 'white' : '#64748B'
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Day view expanding */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="text-center mb-6" style={{ color: '#2563EB' }}>
                  Thursday, January 11
                </div>

                <div className="space-y-3">
                  {[
                    '9:00 AM - Hygiene',
                    '10:30 AM - Consultation',
                    '1:00 PM - Crown prep',
                    '2:30 PM - Filling',
                    '4:00 PM - Checkup'
                  ].map((appt, i) => (
                    <motion.div
                      key={i}
                      className="p-4 rounded-xl bg-white flex items-center gap-3"
                      style={{ border: '1px solid #2563EB' }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                    >
                      <CheckCircle size={18} style={{ color: '#10B981' }} />
                      <span className="text-sm">{appt}</span>
                      <span className="ml-auto text-xs" style={{ color: '#10B981' }}>Confirmed</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONFIRMATIONS THAT STICK */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Confirmations that actually get responses</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Patients receive clear confirmation requests by voice or text. One tap or key press confirms. No apps. No logins.
            </p>
          </motion.div>

          {/* Split screen - voice and SMS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Voice prompt */}
            <motion.div
              className="p-8 rounded-2xl bg-white"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                  <Phone size={24} style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <div className="mb-1">Voice confirmation</div>
                  <div className="text-sm text-[var(--foreground-muted)]">Automated call</div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                <p className="text-[var(--foreground-muted)] italic leading-relaxed">
                  "Hello, this is a reminder for your dental appointment on Thursday at 2:00 PM. Press 1 to confirm or press 2 to reschedule."
                </p>
              </div>

              <div className="mt-6 text-sm text-[var(--foreground-muted)]">
                Simple voice prompts. Clear options.
              </div>
            </motion.div>

            {/* SMS confirmation */}
            <motion.div
              className="p-8 rounded-2xl bg-white"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                  <MessageSquare size={24} style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <div className="mb-1">SMS confirmation</div>
                  <div className="text-sm text-[var(--foreground-muted)]">Text message</div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
                  Reminder: Dental appointment Thursday 2:00 PM with Dr. Johnson.
                </p>
                <p className="text-[var(--foreground-muted)] leading-relaxed">
                  Reply YES to confirm or RESCHEDULE to change.
                </p>
              </div>

              <div className="mt-6 text-sm text-[var(--foreground-muted)]">
                One tap confirmation. No apps required.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REMINDER TIMING */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Right reminder. Right time.</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Reminders are timed to reduce forgetfulness without annoying patients. Hygiene visits, procedures, and follow ups each follow their own cadence.
            </p>
          </motion.div>

          {/* Clock based animation */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { type: 'Hygiene', timing: '7 days before', color: '#10B981' },
              { type: 'Procedure', timing: '3 days before', color: '#2563EB' },
              { type: 'Follow up', timing: '24 hours before', color: '#F59E0B' }
            ].map((reminder, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl text-center bg-white"
                style={{ border: '2px solid var(--glass-border)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: flowEasing }}
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  {/* Clock face */}
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${reminder.color}15` }}
                  >
                    <Clock size={40} style={{ color: reminder.color }} />
                  </div>
                  {/* Animated ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      border: `3px solid ${reminder.color}`,
                      opacity: 0.3
                    }}
                    initial={{ scale: 1, opacity: 0.3 }}
                    whileInView={{ scale: 1.3, opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 1.5, 
                      delay: 0.5 + i * 0.15,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                </div>

                <div className="mb-2" style={{ color: reminder.color }}>{reminder.type}</div>
                <div className="text-sm text-[var(--foreground-muted)]">{reminder.timing}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TREATMENT PLAN FOLLOW THROUGH */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Treatment plans do not disappear after visit one</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Follow up visits and procedures stay visible to patients. AXIS prompts next steps so treatment plans move forward naturally.
            </p>
          </motion.div>

          {/* Treatment plan cards stacked vertically */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="space-y-3">
              {treatmentSteps.map((item, i) => (
                <motion.div
                  key={i}
                  className="p-6 rounded-xl flex items-center gap-4"
                  style={{
                    backgroundColor: item.status === 'complete' ? '#DCFCE7' : 'white',
                    border: item.status === 'complete' ? '2px solid #10B981' : '2px solid #E2E8F0'
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: flowEasing }}
                >
                  {item.status === 'complete' ? (
                    <CheckCircle size={24} style={{ color: '#10B981' }} className="flex-shrink-0" />
                  ) : (
                    <div 
                      className="w-6 h-6 rounded-full border-2 flex-shrink-0"
                      style={{ borderColor: '#CBD5E1' }}
                    />
                  )}
                  <div className="flex-1">
                    <div className={item.status === 'complete' ? '' : 'text-[var(--foreground-muted)]'}>
                      {item.step}
                    </div>
                  </div>
                  {item.status === 'complete' ? (
                    <span className="text-sm" style={{ color: '#10B981' }}>Complete</span>
                  ) : (
                    <span className="text-sm text-[var(--foreground-muted)]">Upcoming</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTAKE AND PRE VISIT PREP */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Less chair delay. More care.</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Forms, insurance details, and instructions are collected before the visit so appointments start on time.
            </p>
          </motion.div>

          {/* Document checklist with chair activation */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Checklist */}
              <div className="space-y-3">
                {[
                  { item: 'Patient intake form', complete: true },
                  { item: 'Insurance verification', complete: true },
                  { item: 'Medical history updated', complete: true },
                  { item: 'Pre visit instructions sent', complete: true }
                ].map((task, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-xl bg-white flex items-center gap-3"
                    style={{ border: '1px solid var(--glass-border)' }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <CheckCircle size={20} style={{ color: '#10B981' }} />
                    <span>{task.item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Right: Chair activation */}
              <motion.div
                className="text-center p-12 rounded-2xl"
                style={{ backgroundColor: '#DCFCE7' }}
                initial={{ opacity: 0.3, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <Clipboard size={56} style={{ color: 'white' }} />
                </div>
                <div className="text-lg mb-2" style={{ color: '#10B981' }}>Ready for appointment</div>
                <div className="text-sm text-[var(--foreground-muted)]">All prep complete</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ADMIN AUTOMATION */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Front desk workload drops quietly</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Admins configure rules once. AXIS runs confirmations, reminders, and follow ups automatically. Staff step in only when needed.
            </p>
          </motion.div>

          {/* Linear system flow with dental icons */}
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {workflowSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-4 flex-1">
                  <motion.div
                    className="p-6 rounded-xl w-full transition-all duration-200 bg-white"
                    style={{
                      border: '2px solid #2563EB'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: flowEasing }}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#EFF6FF' }}>
                        <step.icon size={24} style={{ color: '#2563EB' }} />
                      </div>
                      <div className="mb-2" style={{ color: '#2563EB' }}>{step.label}</div>
                      <div className="text-sm text-[var(--foreground-muted)]">{step.detail}</div>
                    </div>
                  </motion.div>
                  {i < workflowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block flex-shrink-0" size={20} style={{ color: '#2563EB' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT DENTAL CLINICS NOTICE FIRST */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">The impact clinics see early</h2>
          </motion.div>

          {/* Before and after daily schedule */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Before */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing }}
              >
                <div className="text-sm text-[var(--foreground-muted)] uppercase tracking-wider mb-6">Before</div>
                <div className="p-8 rounded-2xl" style={{ backgroundColor: '#FEF2F2' }}>
                  <div className="space-y-2">
                    {[
                      { filled: true },
                      { filled: false },
                      { filled: true },
                      { filled: false },
                      { filled: false },
                      { filled: true },
                      { filled: false },
                      { filled: true }
                    ].map((slot, i) => (
                      <div
                        key={i}
                        className="h-10 rounded"
                        style={{
                          backgroundColor: slot.filled ? '#DBEAFE' : '#FEE2E2',
                          border: slot.filled ? 'none' : '2px dashed #EF4444'
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-6 text-sm">
                    <span style={{ color: '#EF4444' }}>4 empty slots</span>
                    <span className="mx-2">•</span>
                    <span style={{ color: '#2563EB' }}>4 filled</span>
                  </div>
                </div>
              </motion.div>

              {/* After */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              >
                <div className="text-sm uppercase tracking-wider mb-6" style={{ color: '#10B981' }}>After</div>
                <div className="p-8 rounded-2xl" style={{ backgroundColor: '#DCFCE7' }}>
                  <div className="space-y-2">
                    {[
                      { filled: true },
                      { filled: true },
                      { filled: true },
                      { filled: false },
                      { filled: true },
                      { filled: true },
                      { filled: true },
                      { filled: true }
                    ].map((slot, i) => (
                      <motion.div
                        key={i}
                        className="h-10 rounded flex items-center justify-center"
                        style={{
                          backgroundColor: slot.filled ? '#10B981' : '#FEE2E2',
                          border: slot.filled ? 'none' : '2px dashed #EF4444'
                        }}
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                      >
                        {slot.filled && <CheckCircle size={16} style={{ color: 'white' }} />}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-center mt-6 text-sm">
                    <span style={{ color: '#10B981' }}>7 filled</span>
                    <span className="mx-2">•</span>
                    <span style={{ color: '#EF4444' }}>1 empty</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Outcomes */}
            <motion.div
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                'Fewer empty chairs',
                'Higher confirmation rates',
                'Better hygiene recall compliance',
                'Less manual calling'
              ].map((outcome, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white flex items-center gap-3"
                  style={{ border: '1px solid var(--glass-border)' }}
                >
                  <CheckCircle size={18} style={{ color: '#10B981' }} />
                  <span>{outcome}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* BUILT TO SUPPORT CHAIR BASED CARE */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">Designed around dental reality</h2>
              <p className="text-xl text-[var(--foreground-muted)]">
                AXIS supports fast paced schedules, repeat visits, and patient follow through without disrupting how clinics already work.
              </p>
            </motion.div>

            {/* Abstract grid motion */}
            <motion.div
              className="max-w-2xl mx-auto p-12 rounded-2xl bg-white"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square rounded"
                    style={{ backgroundColor: '#2563EB' }}
                    initial={{ opacity: 0.2, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.4, 
                      delay: i * 0.03,
                      ease: flowEasing 
                    }}
                  />
                ))}
              </div>
              <div className="text-sm text-[var(--foreground-muted)] mt-8">Steady flow. Full capacity.</div>
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
              <h2 className="mb-6">Protect your chair time</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                See how AXIS supports dental clinics with real workflows.
              </p>

              <div className="max-w-[600px] mx-auto">
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
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                      }}
                    >
                      See a walkthrough
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
                      Join Waitlist
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