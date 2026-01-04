import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  MessageCircle,
  FileText,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react';

export function MentalHealth() {
  const flowEasing = [0.22, 1, 0.36, 1];

  const struggles = [
    {
      title: 'Missed appointments disrupt care continuity',
      description: 'When patients miss sessions, treatment progress slows and gaps widen.'
    },
    {
      title: 'Patients forget sessions or avoid responding',
      description: 'Busy lives and anxiety mean reminders get missed or ignored.'
    },
    {
      title: 'Front desk spends time following up instead of supporting care',
      description: 'Hours spent on confirmation calls that could go to patient support.'
    },
    {
      title: 'Intake forms arrive incomplete or too late',
      description: 'Clinicians start sessions without context or wait for paperwork at check in.'
    }
  ];

  const workflowSteps = [
    { label: 'Configure', detail: 'Set rules once' },
    { label: 'Run', detail: 'System applies automatically' },
    { label: 'Monitor', detail: 'Clear visibility' },
    { label: 'Step in only when needed', detail: 'Exceptions only' }
  ];

  const beforeAfter = [
    { before: 'Manual confirmation calls', after: 'Automatic confirmations' },
    { before: 'Last minute no shows', after: 'Early reschedule options' },
    { before: 'Incomplete intake forms', after: 'Forms completed ahead of time' },
    { before: 'Time spent on admin', after: 'Time available for care' }
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
              <h1 className="mb-8">Built for mental health clinics where timing and tone matter</h1>
              <p className="text-2xl text-[var(--foreground-muted)] mb-12">
                Appointment confirmations, reminders, and intake happen quietly in the background so staff can focus on care, not chasing responses.
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
                    See how it works for mental health
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
                    Start free trial
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Calm vertical flow */}
            <motion.div
              className="p-12 rounded-2xl"
              style={{ backgroundColor: '#EFF6FF' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: flowEasing, delay: 0.2 }}
            >
              <div className="space-y-6">
                {[
                  { icon: Calendar, label: 'Scheduled session', color: '#2563EB' },
                  { icon: MessageCircle, label: 'Gentle reminder sent', color: '#2563EB' },
                  { icon: CheckCircle, label: 'Patient confirms', color: '#10B981' },
                  { icon: Clock, label: 'Session proceeds', color: '#10B981' }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.15, ease: flowEasing }}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <step.icon size={20} style={{ color: step.color }} />
                    </div>
                    <span className="text-[var(--foreground-muted)]">{step.label}</span>
                    {i < 3 && (
                      <motion.div
                        className="ml-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.15 }}
                      >
                        <ArrowRight size={16} style={{ color: '#94A3B8' }} />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT MENTAL HEALTH CLINICS STRUGGLE WITH */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">The work behind the sessions</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
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
                <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2563EB' }} />
                </div>
                <h3 className="mb-3 text-lg">{struggle.title}</h3>
                <p className="text-[var(--foreground-muted)]">{struggle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW CLINICFLOW FITS MENTAL HEALTH WORKFLOWS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Designed around real clinic behavior</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Clinicflow does not push patients. It communicates clearly, politely, and at the right time. Messages feel human and give patients space to respond without pressure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Left: Timeline */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h3 className="mb-8">Communication timeline</h3>
              <div className="space-y-4">
                {[
                  { time: '7 days before', action: 'Intake form sent' },
                  { time: '3 days before', action: 'Gentle reminder if not completed' },
                  { time: '24 hours before', action: 'Session confirmation request' },
                  { time: '2 hours before', action: 'Final reminder if needed' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[var(--glass-border)]">
                    <div className="text-sm" style={{ color: '#2563EB', minWidth: '120px' }}>{item.time}</div>
                    <div className="text-[var(--foreground-muted)]">{item.action}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Message preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <h3 className="mb-8">Example message</h3>
              <div className="p-8 rounded-2xl" style={{ backgroundColor: '#EFF6FF' }}>
                <div className="mb-6">
                  <div className="text-sm text-[var(--foreground-muted)] mb-2">Message tone</div>
                  <div className="text-lg">Clear and respectful</div>
                </div>
                <div className="p-6 rounded-xl bg-white border border-[#2563EB]/20">
                  <p className="text-[var(--foreground-muted)] leading-relaxed">
                    Hi [Name], this is a reminder about your appointment with Dr. [Provider] on [Date] at [Time].
                  </p>
                  <p className="text-[var(--foreground-muted)] leading-relaxed mt-4">
                    Reply YES to confirm or RESCHEDULE if you need to change the time.
                  </p>
                  <p className="text-[var(--foreground-muted)] leading-relaxed mt-4 text-sm">
                    We're here if you need anything.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* APPOINTMENT CONFIRMATIONS AND REMINDERS */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Fewer missed sessions without extra calls</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Patients receive clear confirmations and reminders before their session. They can confirm or reschedule without calling the clinic. Staff are only involved when something needs attention.
            </p>
          </motion.div>

          {/* Flow diagram */}
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {[
                { label: 'Session booked', icon: Calendar },
                { label: 'Reminder sent', icon: MessageCircle },
                { label: 'Confirm or reschedule', icon: CheckCircle },
                { label: 'Calendar updated', icon: Calendar }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 flex-1">
                  <div 
                    className="p-6 rounded-xl w-full bg-white"
                    style={{ border: '1px solid #2563EB' }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: '#EFF6FF' }}
                      >
                        <step.icon size={20} style={{ color: '#2563EB' }} />
                      </div>
                      <div style={{ color: '#2563EB' }}>{step.label}</div>
                    </div>
                  </div>
                  {i < 3 && (
                    <CheckCircle className="hidden md:block flex-shrink-0" size={20} style={{ color: '#10B981' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTAKE BEFORE THE SESSION */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Arrive prepared, not rushed</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Forms are sent ahead of time and completed at the patient's pace. Clinicians receive a clear summary before the session begins.
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
                { icon: FileText, label: 'Form sent ahead', stage: 'Patient receives intake' },
                { icon: CheckCircle, label: 'Completed at their pace', stage: 'No pressure or rushing' },
                { icon: FileText, label: 'Summary ready', stage: 'Clinician has context' }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <step.icon size={28} style={{ color: '#2563EB' }} />
                    </div>
                    <div className="mb-2" style={{ color: '#2563EB' }}>{step.label}</div>
                    <div className="text-sm text-[var(--foreground-muted)]">{step.stage}</div>
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
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Routine handled quietly</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Admins set communication rules once. Clinicflow runs daily operations automatically. Staff step in only when a patient needs support or a session changes.
            </p>
          </motion.div>

          {/* Four step horizontal flow - matches About page */}
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
        </div>
      </section>

      {/* WHAT CLINICS NOTICE */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">What changes in the first weeks</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {beforeAfter.map((item, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white"
                style={{ border: '1px solid var(--glass-border)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: flowEasing }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm text-[var(--foreground-muted)] uppercase tracking-wider">Before</div>
                  <div className="flex-1 text-[var(--foreground-muted)]">{item.before}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm uppercase tracking-wider" style={{ color: '#10B981' }}>After</div>
                  <div className="flex-1">{item.after}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST AND SENSITIVITY */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">Built with care in mind</h2>
              <p className="text-xl text-[var(--foreground-muted)]">
                Mental health communication requires clarity and respect. Clinicflow avoids aggressive reminders, unnecessary alerts, and anything that feels automated or cold.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Shield, label: 'Privacy first' },
                { icon: MessageCircle, label: 'Respectful tone' },
                { icon: Calendar, label: 'Patient control' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="text-center p-8 rounded-2xl bg-white"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#EFF6FF' }}
                  >
                    <item.icon size={28} style={{ color: '#2563EB' }} />
                  </div>
                  <div className="text-lg">{item.label}</div>
                </motion.div>
              ))}
            </div>
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
              <h2 className="mb-6">Support care without adding noise</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                See how Clinicflow works inside real mental health clinics.
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
                      Start free trial
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