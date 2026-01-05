import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
  Activity,
  Settings,
  Layers
} from 'lucide-react';

export function Outpatient() {
  const flowEasing = [0.22, 1, 0.36, 1];

  const struggles = [
    {
      title: 'Mixed visit lengths cause schedule drift',
      description: 'Short and long appointments create unpredictable timing that compounds throughout the day.'
    },
    {
      title: 'Walk ins disrupt planned appointments',
      description: 'Unplanned arrivals create conflicts with confirmed visits and strain capacity.'
    },
    {
      title: 'Missed confirmations create idle staff time',
      description: 'No shows discovered too late leave providers waiting and schedules empty.'
    },
    {
      title: 'Front desk handles constant status checks',
      description: 'Staff interruptions from providers asking who confirmed and who is coming next.'
    }
  ];

  const workflowSteps = [
    { label: 'Configure', detail: 'Set rules once' },
    { label: 'Run', detail: 'System applies automatically' },
    { label: 'Monitor', detail: 'Clear visibility' },
    { label: 'Intervene', detail: 'Exceptions only' }
  ];

  const outcomes = [
    'Fewer stalled schedules',
    'Faster patient turnover',
    'Reduced front desk interruptions',
    'More predictable daily flow'
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
              <h1 className="mb-8">Built for clinics that never stop moving</h1>
              <p className="text-2xl text-[var(--foreground-muted)] mb-12">
                Clinicflow keeps outpatient schedules flowing. Confirmations, reminders, and intake happen automatically so staff can focus on patients, not logistics.
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
                    See how it works for outpatient clinics
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
                    Join Waitlist for 3 Months Free Access
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Wide horizontal patient flow lane */}
            <motion.div
              className="p-10 rounded-2xl"
              style={{ backgroundColor: '#F8FAFC' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="space-y-8">
                <div className="text-sm text-[var(--foreground-muted)]">Patient flow - steady movement</div>

                {/* Flow lane */}
                <div className="relative">
                  {/* Lane background */}
                  <div 
                    className="h-20 rounded-xl relative overflow-hidden"
                    style={{ backgroundColor: '#E2E8F0' }}
                  >
                    {/* Patients moving through */}
                    {[
                      { position: 10, delay: 0.4, stage: 'Arrival' },
                      { position: 35, delay: 0.6, stage: 'Check in' },
                      { position: 60, delay: 0.8, stage: 'Visit' },
                      { position: 85, delay: 1.0, stage: 'Complete' }
                    ].map((patient, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{ left: `${patient.position}%` }}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: patient.delay,
                          ease: flowEasing 
                        }}
                      >
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: i === 3 ? '#10B981' : '#2563EB'
                          }}
                        >
                          <Users size={20} style={{ color: 'white' }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stage labels */}
                  <div className="flex justify-between mt-4">
                    {['Arrival', 'Check in', 'Visit', 'Complete'].map((stage, i) => (
                      <motion.div
                        key={i}
                        className="text-xs text-center"
                        style={{ color: i === 3 ? '#10B981' : '#64748B' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.2 }}
                      >
                        {stage}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-[var(--foreground-muted)]">
                  No congestion. No spikes.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIGH VOLUME CREATES FRICTION */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">High volume creates friction</h2>
          </motion.div>

          {/* Timeline with uneven blocks */}
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

                {/* Uneven blocks causing bottlenecks */}
                <div className="flex items-end gap-1 h-24">
                  {(() => {
                    // Different patterns for each struggle
                    const patterns = [
                      [3, 1, 5, 2, 6, 1, 4], // Mixed lengths
                      [4, 4, 2, 4, 4, 2, 4], // Walk-in disruptions (2-height blocks are walk-ins)
                      [5, 0, 4, 0, 5, 0, 4], // Gaps from no-shows (0-height = empty)
                      [3, 3, 3, 3, 3, 3, 3]  // Constant interruptions
                    ];
                    
                    return patterns[i].map((height, idx) => (
                      <motion.div
                        key={idx}
                        className="flex-1 rounded-t"
                        style={{
                          height: `${height * 16}%`,
                          backgroundColor: height === 0 ? 'transparent' : 
                                         height === 2 ? '#F59E0B' : // Walk-ins in orange
                                         '#2563EB',
                          border: height === 0 ? '2px dashed #EF4444' : 'none',
                          minHeight: height === 0 ? '20%' : undefined
                        }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.3 + idx * 0.05,
                          ease: flowEasing 
                        }}
                      />
                    ));
                  })()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGNED FOR THROUGHPUT */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Flow over perfection</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Outpatient clinics succeed when patient movement stays predictable. Clinicflow stabilizes schedules by confirming visits, preparing patients, and reducing last minute uncertainty.
            </p>
          </motion.div>

          {/* Timeline smooths out */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="space-y-8">
              {/* Before - uneven */}
              <div>
                <div className="text-sm text-[var(--foreground-muted)] mb-4">Before</div>
                <div className="flex items-end gap-1 h-24 p-6 rounded-xl" style={{ backgroundColor: '#FEF2F2' }}>
                  {[3, 1, 5, 0, 6, 1, 4, 2, 5].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${height * 14}%`,
                        backgroundColor: height === 0 ? 'transparent' : '#94A3B8',
                        border: height === 0 ? '2px dashed #EF4444' : 'none',
                        minHeight: height === 0 ? '20%' : undefined
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <ArrowRight size={32} style={{ color: '#10B981', transform: 'rotate(90deg)' }} />
                </motion.div>
              </div>

              {/* After - smooth rhythm */}
              <div>
                <div className="text-sm mb-4" style={{ color: '#10B981' }}>After</div>
                <div className="flex items-end gap-1 h-24 p-6 rounded-xl" style={{ backgroundColor: '#DCFCE7' }}>
                  {[4, 4, 4, 4, 4, 4, 4, 4, 4].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${height * 14}%`,
                        backgroundColor: '#10B981'
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.6 + i * 0.05,
                        ease: flowEasing 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* APPOINTMENT CONFIRMATIONS AT SCALE */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Confirm hundreds of visits without calling hundreds of patients</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Clinicflow confirms appointments automatically across SMS and voice. Patients respond quickly. Staff does not chase responses.
            </p>
          </motion.div>

          {/* Multiple confirmation signals in parallel */}
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="p-10 rounded-2xl bg-white">
              <div className="grid grid-cols-5 gap-4 mb-8">
                {/* Confirmation signals firing */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: '#EFF6FF',
                      border: '2px solid #2563EB'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.3 + i * 0.05,
                      ease: flowEasing 
                    }}
                  >
                    <Activity size={20} style={{ color: '#2563EB' }} />
                  </motion.div>
                ))}
              </div>

              {/* Responses lighting up */}
              <div className="space-y-2">
                {[
                  { time: '0.2s', count: '12 responses' },
                  { time: '1.4s', count: '9 responses' },
                  { time: '3.1s', count: '7 responses' }
                ].map((batch, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-lg"
                    style={{ backgroundColor: '#DCFCE7' }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.2 }}
                  >
                    <CheckCircle size={20} style={{ color: '#10B981' }} />
                    <span className="text-sm">{batch.count}</span>
                    <span className="text-sm text-[var(--foreground-muted)]">received in {batch.time}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-center text-sm text-[var(--foreground-muted)] mt-6">
                Parallel processing. Fast responses.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VISIT TYPE AWARE REMINDERS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Not every visit needs the same reminder</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Short consults, procedures, and follow ups each follow different reminder logic. Clinicflow adapts automatically.
            </p>
          </motion.div>

          {/* Three visit lanes */}
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="space-y-6">
              {[
                { 
                  type: 'Short consult', 
                  timing: '24 hours before',
                  color: '#10B981',
                  pattern: [0, 0, 0, 1, 0]
                },
                { 
                  type: 'Procedure', 
                  timing: '3 days + 24 hours before',
                  color: '#2563EB',
                  pattern: [0, 1, 0, 1, 0]
                },
                { 
                  type: 'Follow up', 
                  timing: '7 days + 24 hours before',
                  color: '#F59E0B',
                  pattern: [1, 0, 1, 0, 1]
                }
              ].map((lane, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white"
                  style={{ border: '1px solid var(--glass-border)' }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="mb-1" style={{ color: lane.color }}>{lane.type}</div>
                      <div className="text-sm text-[var(--foreground-muted)]">{lane.timing}</div>
                    </div>
                  </div>

                  {/* Timeline showing when reminders fire */}
                  <div className="flex items-center gap-2">
                    {lane.pattern.map((active, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          className="w-full h-12 rounded flex items-center justify-center"
                          style={{
                            backgroundColor: active ? `${lane.color}20` : '#F8FAFC',
                            border: active ? `2px solid ${lane.color}` : '1px solid #E2E8F0'
                          }}
                          initial={{ opacity: 0, scaleY: 0.5 }}
                          whileInView={{ opacity: 1, scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.4, 
                            delay: 0.3 + i * 0.1 + idx * 0.05,
                            ease: flowEasing 
                          }}
                        >
                          {active && <Clock size={18} style={{ color: lane.color }} />}
                        </motion.div>
                        <div className="text-xs text-[var(--foreground-muted)]">
                          {idx === 0 ? '7d' : idx === 1 ? '5d' : idx === 2 ? '3d' : idx === 3 ? '1d' : 'Visit'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTAKE BEFORE ARRIVAL */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Patients arrive ready, not confused</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Forms and instructions are completed before arrival. Providers start visits on time. Waiting rooms stay controlled.
            </p>
          </motion.div>

          {/* Pre-visit checklist gates entry */}
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
                  { item: 'Registration form', complete: true, delay: 0.3 },
                  { item: 'Medical history', complete: true, delay: 0.4 },
                  { item: 'Insurance verified', complete: true, delay: 0.5 },
                  { item: 'Visit instructions reviewed', complete: true, delay: 0.6 }
                ].map((task, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-xl bg-white flex items-center gap-3"
                    style={{ border: '1px solid var(--glass-border)' }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: task.delay }}
                  >
                    <CheckCircle size={20} style={{ color: '#10B981' }} />
                    <span>{task.item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Right: Gate opens when complete */}
              <motion.div
                className="relative"
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="p-12 rounded-2xl text-center" style={{ backgroundColor: '#DCFCE7' }}>
                  <motion.div
                    className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: '#10B981' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Users size={56} style={{ color: 'white' }} />
                  </motion.div>
                  <div className="text-lg mb-2" style={{ color: '#10B981' }}>Entry cleared</div>
                  <div className="text-sm text-[var(--foreground-muted)]">Patient ready for check in</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WALK IN AND OVERFLOW HANDLING */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-8">Unexpected visits without chaos</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Clinicflow absorbs walk ins by maintaining clarity around confirmed, pending, and flexible slots.
            </p>
          </motion.div>

          {/* Flexible blocks expand and contract */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <div className="p-10 rounded-2xl bg-white">
              <div className="space-y-4">
                {[
                  { type: 'Confirmed', locked: true, width: 100 },
                  { type: 'Flexible', locked: false, width: 60 },
                  { type: 'Confirmed', locked: true, width: 100 },
                  { type: 'Flexible - Walk in absorbed', locked: false, width: 100, expanded: true },
                  { type: 'Confirmed', locked: true, width: 100 }
                ].map((slot, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-[var(--foreground-muted)]">{slot.type}</div>
                    <motion.div
                      className="h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: slot.locked ? '#2563EB' : 
                                       slot.expanded ? '#F59E0B' : '#E2E8F0',
                        width: `${slot.width}%`,
                        border: slot.locked ? 'none' : '2px dashed #94A3B8'
                      }}
                      initial={{ width: slot.expanded ? '60%' : `${slot.width}%` }}
                      whileInView={{ width: `${slot.width}%` }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.4 + i * 0.1,
                        ease: flowEasing 
                      }}
                    >
                      {slot.locked && <CheckCircle size={18} style={{ color: 'white' }} />}
                      {slot.expanded && <AlertCircle size={18} style={{ color: 'white' }} />}
                    </motion.div>
                  </div>
                ))}
              </div>

              <div className="text-center text-sm text-[var(--foreground-muted)] mt-8">
                Confirmed visits stay locked. Flexible slots adapt.
              </div>
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
            <h2 className="mb-8">Operations run quietly in the background</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Admins set rules once. Clinicflow enforces confirmations, reminders, and follow ups automatically. Staff intervene only when exceptions occur.
            </p>
          </motion.div>

          {/* Simple operational loop */}
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
                    className="p-8 rounded-2xl w-full bg-white"
                    style={{
                      border: '2px solid #2563EB'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: flowEasing }}
                  >
                    <div className="text-center">
                      <div className="mb-3" style={{ color: '#2563EB' }}>{step.label}</div>
                      <div className="text-sm text-[var(--foreground-muted)]">{step.detail}</div>
                    </div>
                  </motion.div>
                  {i < workflowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block flex-shrink-0" size={24} style={{ color: '#2563EB' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT CLINICS NOTICE FIRST */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">The first changes clinics feel</h2>
          </motion.div>

          {/* Before and after day view */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Before */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing }}
              >
                <div className="text-sm text-[var(--foreground-muted)] uppercase tracking-wider mb-6">Before</div>
                <div className="p-8 rounded-2xl" style={{ backgroundColor: '#FEF2F2' }}>
                  <div className="space-y-3">
                    {[
                      { active: true, idle: false },
                      { active: false, idle: true },
                      { active: true, idle: false },
                      { active: false, idle: true },
                      { active: true, idle: false },
                      { active: false, idle: true },
                      { active: true, idle: false },
                      { active: true, idle: false }
                    ].map((slot, i) => (
                      <div
                        key={i}
                        className="h-10 rounded flex items-center px-4"
                        style={{
                          backgroundColor: slot.idle ? '#FEE2E2' : '#DBEAFE',
                          border: slot.idle ? '2px dashed #EF4444' : 'none'
                        }}
                      >
                        {slot.idle && (
                          <span className="text-sm" style={{ color: '#EF4444' }}>Idle gap</span>
                        )}
                      </div>
                    ))}
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
                  <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-10 rounded flex items-center justify-center"
                        style={{ backgroundColor: '#10B981' }}
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                      >
                        <Activity size={16} style={{ color: 'white' }} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Outcomes */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {outcomes.map((outcome, i) => (
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

      {/* BUILT TO SUPPORT BUSY CLINICS */}
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
              <h2 className="mb-8">Supports how outpatient clinics already work</h2>
              <p className="text-xl text-[var(--foreground-muted)]">
                Clinicflow does not replace systems. It supports the operational layer that keeps clinics running smoothly at scale.
              </p>
            </motion.div>

            {/* Layered system graphic */}
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="space-y-4 p-12 rounded-2xl bg-white">
                {[
                  { label: 'Scheduling systems', color: '#94A3B8' },
                  { label: 'Clinicflow operational layer', color: '#2563EB', highlight: true },
                  { label: 'Staff and patients', color: '#94A3B8' }
                ].map((layer, i) => (
                  <motion.div
                    key={i}
                    className="p-6 rounded-xl flex items-center justify-center gap-3"
                    style={{
                      backgroundColor: layer.highlight ? '#EFF6FF' : '#F8FAFC',
                      border: layer.highlight ? '2px solid #2563EB' : '1px solid #E2E8F0'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                  >
                    {layer.highlight && <Layers size={20} style={{ color: '#2563EB' }} />}
                    <span style={{ color: layer.color }}>{layer.label}</span>
                  </motion.div>
                ))}
              </div>
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
              <h2 className="mb-6">Keep patients moving without burning out staff</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                See how Clinicflow supports high volume outpatient clinics.
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