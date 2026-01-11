import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Repeat,
  CheckCircle,
  FileText,
  ArrowRight,
  Clock,
  Settings,
  TrendingUp
} from 'lucide-react';

export function Physiotherapy() {
  const flowEasing = [0.22, 1, 0.36, 1];

  const frictionPoints = [
    {
      title: 'Patients forget follow up visits',
      description: 'Treatment plans depend on consistency. Missed sessions slow recovery.'
    },
    {
      title: 'Long treatment plans break due to missed sessions',
      description: 'A single missed appointment creates gaps that compound over weeks.'
    },
    {
      title: 'Staff manually rebook recurring appointments',
      description: 'Every reschedule means updating multiple future sessions by hand.'
    },
    {
      title: 'Schedule gaps appear late and waste therapist time',
      description: 'Empty slots discovered too late to fill reduce utilization and revenue.'
    }
  ];

  const workflowSteps = [
    { label: 'Configure', detail: 'Set rules once' },
    { label: 'Run', detail: 'System applies automatically' },
    { label: 'Monitor', detail: 'Clear visibility' },
    { label: 'Step in when needed', detail: 'Exceptions only' }
  ];

  const outcomes = [
    { before: 'Cancelled sessions create gaps', after: 'Fewer cancelled sessions' },
    { before: 'Treatment plans fall behind', after: 'More completed treatment plans' },
    { before: 'Staff manually reschedule', after: 'Less manual rescheduling' },
    { before: 'Uneven therapist schedules', after: 'Better therapist utilization' }
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
              <h1 className="mb-8">Built for physiotherapy clinics that run on consistency</h1>
              <p className="text-2xl text-[var(--foreground-muted)] mb-12">
                Recurring sessions, reminders, and follow ups stay on track automatically so therapists focus on recovery, not rescheduling.
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
                    See how it works for physiotherapy
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

            {/* Right: Calendar based animation */}
            <motion.div
              className="p-10 rounded-2xl"
              style={{ backgroundColor: '#F8FAFC' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="space-y-6">
                {/* Week header */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                    <div key={i} className="text-center text-sm text-[var(--foreground-muted)]">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Week 1 - Recurring sessions */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { active: true, time: '9:00' },
                    { active: false },
                    { active: true, time: '9:00' },
                    { active: false },
                    { active: true, time: '9:00' }
                  ].map((slot, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center"
                      style={{ 
                        backgroundColor: slot.active ? '#DBEAFE' : '#F1F5F9',
                        border: slot.active ? '2px solid #2563EB' : '1px solid #E2E8F0'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                    >
                      {slot.active && (
                        <>
                          <Repeat size={14} style={{ color: '#2563EB' }} className="mb-1" />
                          <span className="text-xs" style={{ color: '#2563EB' }}>{slot.time}</span>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Reschedule indicator */}
                <motion.div
                  className="flex items-center justify-center gap-2 py-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1 }}
                >
                  <div className="text-sm text-[var(--foreground-muted)]">One reschedule</div>
                  <ArrowRight size={16} style={{ color: '#2563EB' }} />
                  <div className="text-sm" style={{ color: '#2563EB' }}>Updates entire plan</div>
                </motion.div>

                {/* Week 2 - Updated plan */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { active: false },
                    { active: true, time: '10:00' },
                    { active: false },
                    { active: true, time: '10:00' },
                    { active: true, time: '10:00' }
                  ].map((slot, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center"
                      style={{ 
                        backgroundColor: slot.active ? '#DBEAFE' : '#F1F5F9',
                        border: slot.active ? '2px solid #2563EB' : '1px solid #E2E8F0'
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.2 + i * 0.08 }}
                    >
                      {slot.active && (
                        <>
                          <CheckCircle size={14} style={{ color: '#10B981' }} className="mb-1" />
                          <span className="text-xs" style={{ color: '#2563EB' }}>{slot.time}</span>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE FRICTION BETWEEN SESSIONS */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">The friction between sessions</h2>
          </motion.div>

          {/* Timeline with broken segments */}
          <div className="max-w-5xl mx-auto space-y-8">
            {frictionPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="mb-3 text-lg">{point.title}</h3>
                    <p className="text-[var(--foreground-muted)]">{point.description}</p>
                  </div>
                  
                  {/* Visual timeline with gap */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: '#2563EB' }} />
                    <div className="w-12 h-3 rounded-full border-2 border-dashed" style={{ borderColor: '#EF4444', backgroundColor: 'transparent' }} />
                    <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: '#94A3B8' }} />
                    
                    {/* Arrow and solution state */}
                    <motion.div
                      className="ml-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    >
                      <ArrowRight size={20} style={{ color: '#10B981' }} />
                    </motion.div>
                    
                    <motion.div
                      className="flex-1 h-3 rounded-full"
                      style={{ backgroundColor: '#10B981' }}
                      initial={{ opacity: 0, scaleX: 0 }}
                      whileInView={{ opacity: 1, scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW AXIS FITS PHYSIOTHERAPY WORKFLOWS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Designed for repeat care, not one off visits</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Physiotherapy care happens over weeks, not once. AXIS manages recurring schedules and communication so patients stay consistent without staff chasing them.
            </p>
          </motion.div>

          {/* Progress bar visualization */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="p-10 rounded-2xl" style={{ backgroundColor: '#F8FAFC' }}>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-[var(--foreground-muted)]">Treatment progress</span>
                <span className="text-sm" style={{ color: '#2563EB' }}>12 session plan</span>
              </div>

              <div className="relative">
                {/* Progress line */}
                <div className="h-2 rounded-full mb-8" style={{ backgroundColor: '#E2E8F0' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#2563EB' }}
                    initial={{ width: '0%' }}
                    whileInView={{ width: '75%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: flowEasing }}
                  />
                </div>

                {/* Session markers */}
                <div className="flex justify-between items-start -mt-12">
                  {[1, 6, 12].map((session, i) => (
                    <motion.div
                      key={session}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                        style={{ 
                          backgroundColor: i < 2 ? '#2563EB' : '#E2E8F0',
                          border: i < 2 ? 'none' : '2px solid #CBD5E1'
                        }}
                      >
                        {i < 2 ? (
                          <CheckCircle size={16} style={{ color: 'white' }} />
                        ) : (
                          <span className="text-xs text-[var(--foreground-muted)]">{session}</span>
                        )}
                      </div>
                      <div className="text-sm" style={{ color: i < 2 ? '#2563EB' : '#94A3B8' }}>
                        Session {session}
                      </div>
                      {i < 2 && (
                        <div className="text-xs text-[var(--foreground-muted)] mt-1">Confirmed</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RECURRING APPOINTMENT MANAGEMENT */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Treatment plans stay intact</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Recurring appointments are confirmed automatically. If a patient reschedules, the system adjusts future sessions while protecting therapist availability.
            </p>
          </motion.div>

          {/* Stacked calendar cards */}
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="space-y-4">
              {/* Original sessions */}
              <div className="text-sm text-[var(--foreground-muted)] mb-4">Original schedule</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Week 1', 'Week 2', 'Week 3'].map((week, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl bg-white border"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar size={18} style={{ color: '#2563EB' }} />
                      <span style={{ color: '#2563EB' }}>{week}</span>
                    </div>
                    <div className="text-sm text-[var(--foreground-muted)]">Mon 9:00 AM</div>
                  </div>
                ))}
              </div>

              {/* Reschedule action */}
              <motion.div
                className="flex items-center justify-center gap-3 py-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <div className="text-sm" style={{ color: '#F59E0B' }}>Patient reschedules Week 1</div>
                <ArrowRight size={18} style={{ color: '#F59E0B' }} />
              </motion.div>

              {/* Updated sessions */}
              <div className="text-sm text-[var(--foreground-muted)] mb-4">System updates remaining</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { week: 'Week 1', time: 'Tue 10:00 AM', updated: true },
                  { week: 'Week 2', time: 'Tue 10:00 AM', updated: true },
                  { week: 'Week 3', time: 'Tue 10:00 AM', updated: true }
                ].map((session, i) => (
                  <motion.div
                    key={i}
                    className="p-6 rounded-xl bg-white border-2"
                    style={{ borderColor: '#10B981' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle size={18} style={{ color: '#10B981' }} />
                      <span style={{ color: '#10B981' }}>{session.week}</span>
                    </div>
                    <div className="text-sm">{session.time}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* REMINDERS THAT REDUCE DROP OFFS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Patients show up when reminders are clear</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Patients receive reminders at the right time before each session. No over messaging. No confusion. Just clear expectations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left: Calendar entry */}
            <motion.div
              className="p-8 rounded-2xl bg-white border"
              style={{ borderColor: '#E2E8F0' }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                  <Calendar size={24} style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <div className="mb-1">Monday, Jan 15</div>
                  <div className="text-sm text-[var(--foreground-muted)]">9:00 AM - Physical Therapy</div>
                </div>
              </div>

              <motion.div
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10B981' }} />
                <span className="text-[var(--foreground-muted)]">Reminder sent 24 hours before</span>
              </motion.div>
            </motion.div>

            {/* Right: Message preview */}
            <motion.div
              className="p-8 rounded-2xl"
              style={{ backgroundColor: '#F8FAFC' }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="text-sm text-[var(--foreground-muted)] mb-4">Example reminder</div>
              <div className="p-6 rounded-xl bg-white border" style={{ borderColor: '#2563EB20' }}>
                <p className="text-[var(--foreground-muted)] leading-relaxed">
                  Reminder: You have a physical therapy session tomorrow at 9:00 AM with Sarah Thompson.
                </p>
                <p className="text-[var(--foreground-muted)] leading-relaxed mt-4">
                  Reply CONFIRM or call us to reschedule.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTAKE AND VISIT PREP */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Every session starts prepared</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Forms, exercise instructions, and notes are shared before visits so therapists start sessions informed and on time.
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {[
                { icon: FileText, label: 'Forms sent', detail: 'Patient receives prep' },
                { icon: CheckCircle, label: 'Checklist completed', detail: 'Ready before arrival' },
                { icon: TrendingUp, label: 'Therapist view', detail: 'Context loaded' }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: 'white' }}
                    >
                      <step.icon size={32} style={{ color: '#2563EB' }} />
                    </div>
                    <div className="mb-2" style={{ color: '#2563EB' }}>{step.label}</div>
                    <div className="text-sm text-[var(--foreground-muted)]">{step.detail}</div>
                  </div>
                  {i < 2 && (
                    <ArrowRight className="hidden md:block" size={24} style={{ color: '#94A3B8' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ADMIN AUTOMATION */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">High volume handled quietly</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Admins configure rules once. AXIS handles confirmations, reschedules, and follow ups automatically. Staff only step in for exceptions.
            </p>
          </motion.div>

          {/* Horizontal process flow */}
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
                    className="p-6 rounded-xl w-full transition-all duration-200"
                    style={{
                      backgroundColor: 'white',
                      border: '2px solid #2563EB'
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
                    <Settings className="hidden md:block flex-shrink-0" size={20} style={{ color: '#2563EB' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT CLINICS NOTICE */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">What changes in the first month</h2>
          </motion.div>

          {/* Before and after schedule blocks */}
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
                <div className="space-y-3">
                  {outcomes.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-white border"
                      style={{ borderColor: '#E2E8F0' }}
                    >
                      <div className="text-[var(--foreground-muted)]">{item.before}</div>
                    </div>
                  ))}
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
                <div className="space-y-3">
                  {outcomes.map((item, i) => (
                    <motion.div
                      key={i}
                      className="p-4 rounded-lg bg-white border-2 flex items-center gap-3"
                      style={{ borderColor: '#10B981' }}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    >
                      <CheckCircle size={18} style={{ color: '#10B981' }} className="flex-shrink-0" />
                      <div>{item.after}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGNED FOR MOVEMENT BASED CARE */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">Built for how physiotherapy actually works</h2>
              <p className="text-xl text-[var(--foreground-muted)]">
                AXIS supports high frequency visits, therapist schedules, and patient follow through without adding operational noise.
              </p>
            </motion.div>

            {/* Abstract motion path */}
            <motion.div
              className="max-w-2xl mx-auto p-12 rounded-2xl"
              style={{ backgroundColor: '#F8FAFC' }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <svg viewBox="0 0 400 100" className="w-full h-24">
                <motion.path
                  d="M 20 80 Q 100 80 120 50 T 220 50 T 320 20 T 380 20"
                  stroke="#2563EB"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: flowEasing }}
                />
                <motion.circle
                  cx="380"
                  cy="20"
                  r="8"
                  fill="#10B981"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                />
              </svg>
              <div className="text-sm text-[var(--foreground-muted)] mt-6">Progress forward</div>
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
              <h2 className="mb-6">Keep treatment plans moving</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                See how AXIS supports physiotherapy clinics with real workflows.
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