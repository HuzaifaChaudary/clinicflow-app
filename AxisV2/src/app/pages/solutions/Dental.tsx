import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Phone,
  MessageSquare,
  Bell,
  Shield,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function Dental() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [activeTab, setActiveTab] = useState<'new' | 'recall' | 'emergency'>('new');
  const [activeChip, setActiveChip] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  const dentalReality = {
    frontDesk: [
      'Incoming calls for new patient cleanings while checking in arrivals.',
      'Insurance and benefits questions that take time to explain.',
      'Last minute cancellations that leave hygienists with empty slots.'
    ],
    ownersProviders: [
      'Recall lists that never quite get worked down.',
      'Emergency calls squeezed into already full days.',
      'Owners guessing where they are losing production.'
    ]
  };

  const heroTabs = {
    new: {
      calls: [
        { name: 'New patient cleaning', time: '2:00 PM' },
        { name: 'Family dentistry inquiry', time: '3:15 PM' },
        { name: 'Ortho consultation', time: '3:45 PM' }
      ],
      message: {
        incoming: 'Hi, I need to book a cleaning for my family.',
        response: 'Great! I can help with that. How many people and when works best?'
      }
    },
    recall: {
      calls: [
        { name: '6-month recall', time: '2:00 PM' },
        { name: 'Hygiene overdue follow up', time: '3:30 PM' },
        { name: 'Annual checkup reminder', time: '4:00 PM' }
      ],
      message: {
        incoming: 'Is it time for my cleaning yet?',
        response: 'Yes! You are due for your 6-month cleaning. I have Thursday or Friday available.'
      }
    },
    emergency: {
      calls: [
        { name: 'Chipped tooth, urgent', time: '2:15 PM' },
        { name: 'Pain after filling', time: '3:00 PM' },
        { name: 'Lost crown', time: '4:30 PM' }
      ],
      message: {
        incoming: 'I have a bad toothache that just started.',
        response: 'I understand. Let me get you in today. Can you come at 4pm or do you need earlier?'
      }
    }
  };

  const avaChips = [
    {
      title: 'New patient calls',
      points: [
        'Explains services and availability for general, ortho, and specialty care.',
        'Gathers insurance and basic info before booking.',
        'Books initial cleanings and consultations.'
      ]
    },
    {
      title: 'Recall and reminders',
      points: [
        'Works through recall lists with texts and calls.',
        'Sends timely reminders for hygiene and checkups.',
        'Re-engages overdue patients without staff chasing.'
      ]
    },
    {
      title: 'Cancellations and waitlist',
      points: [
        'Handles reschedules and captures reasons.',
        'Fills open hygiene slots from your waitlist automatically.',
        'Reduces same-day gaps that waste chair time.'
      ]
    },
    {
      title: 'After hours and emergencies',
      points: [
        'Answers after hours with emergency triage.',
        'Routes urgent cases per your protocols.',
        'Logs every emergency call for morning review.'
      ]
    }
  ];

  const dentalScenarios = [
    {
      icon: Phone,
      title: 'New patient cleaning',
      exchanges: [
        { speaker: 'Ava', text: 'Hi, are you calling to book a cleaning or a specific concern?' },
        { speaker: 'Caller', text: 'Just a cleaning. I have not been to the dentist in a while.' },
        { speaker: 'Ava', text: 'No problem. Let me check our hygienist availability and get you scheduled.' }
      ],
      outcome: 'Outcome: New patient booked, insurance verified.'
    },
    {
      icon: MessageSquare,
      title: 'Same-day cancellation',
      exchanges: [
        { speaker: 'Patient', text: 'I need to cancel my 3pm cleaning today, sorry.' },
        { speaker: 'Ava', text: 'Can you do tomorrow at the same time instead?' },
        { speaker: 'Ava', text: 'Also offering your slot to recall patients now.' }
      ],
      outcome: 'Outcome: Gap filled, production kept.'
    },
    {
      icon: Bell,
      title: '6-month recall text',
      exchanges: [
        { speaker: 'Ava', text: 'Hi Lisa, it has been 6 months since your last cleaning. Ready to book your next one?' },
        { speaker: 'Patient', text: 'Yes! What do you have next week?' },
        { speaker: 'Ava', text: 'I have Tuesday at 10am or Thursday at 2pm.' }
      ],
      outcome: 'Outcome: Recall patient booked, list worked down.'
    }
  ];

  const metrics = [
    {
      title: 'Hygiene utilization',
      explanation: 'More recall patients booked, fewer gaps in hygiene.'
    },
    {
      title: 'Recall completion rate',
      explanation: 'Patients come back on time instead of going overdue.'
    },
    {
      title: 'Front desk minutes per kept visit',
      explanation: 'Less time chasing confirmations, more time with patients in person.'
    }
  ];

  const boundaries = [
    'No clinical advice, diagnosis, or treatment planning from Ava.',
    'Routes pain, swelling, or post-op concerns to your existing emergency protocols.',
    'Logs every call and message so your team sees what was discussed.',
    'Optional notes and summaries are always reviewed and signed by clinicians when Ava MD is used.'
  ];

  const currentTab = heroTabs[activeTab];

  return (
    <div className="min-h-screen pt-32">
      {/* HERO */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8 font-medium">Axis and Ava for dental clinics.</h1>
              <p className="text-lg text-[var(--foreground-muted)] font-normal mb-10" style={{ lineHeight: '1.75' }}>
                Fewer gaps in the schedule, faster responses, and calmer front desks for general, ortho, and specialty practices.
              </p>

              <Link to="/voice-automation">
                <motion.button
                  className="px-8 py-4 rounded-full bg-[var(--blue-primary)] text-white text-base font-medium"
                  style={{ transition: 'all 150ms ease-out' }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  See Axis and Ava in action
                </motion.button>
              </Link>
            </motion.div>

            {/* Right: Interactive multi-state UI panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="rounded-2xl bg-white border border-[var(--glass-border)] shadow-lg overflow-hidden">
                {/* Tab switcher */}
                <div className="p-6 border-b border-[var(--glass-border)] bg-[var(--background-secondary)]/20">
                  <div className="flex gap-2">
                    {[
                      { key: 'new' as const, label: 'New patient' },
                      { key: 'recall' as const, label: 'Recall' },
                      { key: 'emergency' as const, label: 'Emergency' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: activeTab === tab.key ? 'var(--blue-primary)' : 'transparent',
                          color: activeTab === tab.key ? 'white' : 'var(--foreground-muted)',
                          border: activeTab === tab.key ? 'none' : '1px solid var(--glass-border)'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic content based on active tab */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 border-b border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 mb-5">
                      <Phone className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                      <span className="text-sm font-medium text-[var(--foreground)]">Incoming calls</span>
                    </div>
                    <div className="space-y-2.5">
                      {currentTab.calls.map((call, i) => (
                        <div key={i} className="py-2.5 px-4 rounded-lg bg-[var(--background-secondary)]/30">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-normal text-[var(--foreground)]">{call.name}</span>
                            <span className="text-xs text-[var(--foreground-muted)]">{call.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--background-secondary)]/20">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                      <span className="text-sm font-medium text-[var(--foreground)]">Recent text</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[var(--background-secondary)]/50 p-4 rounded-lg">
                        <p className="text-sm text-[var(--foreground)] font-normal">{currentTab.message.incoming}</p>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-[var(--blue-primary)] text-white p-4 rounded-lg max-w-[280px]">
                          <p className="text-sm font-normal text-white">{currentTab.message.response}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT DENTAL FRONT DESKS JUGGLE */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">What your dental front desk is juggling every day.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Front desk column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h3 className="text-base font-medium text-[var(--foreground)] mb-6">Front desk</h3>
              <div className="space-y-4">
                {dentalReality.frontDesk.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--blue-primary)] mt-2.5 flex-shrink-0" />
                    <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Owners and providers column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <h3 className="text-base font-medium text-[var(--foreground)] mb-6">Owners and providers</h3>
              <div className="space-y-4">
                {dentalReality.ownersProviders.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--blue-primary)] mt-2.5 flex-shrink-0" />
                    <p className="text-base text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHERE AVA PLUGS IN - INTERACTIVE STRIP */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Where Ava steps in without changing how you work.</h2>
            <p className="text-base text-[var(--foreground-muted)] font-normal max-w-3xl mx-auto" style={{ lineHeight: '1.75' }}>
              Ava sits on your main line, recall flows, and reminders.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Chip selector */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {avaChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => setActiveChip(i)}
                  className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: activeChip === i ? 'var(--blue-primary)' : 'white',
                    color: activeChip === i ? 'white' : 'var(--foreground)',
                    border: activeChip === i ? 'none' : '1px solid var(--glass-border)',
                    boxShadow: activeChip === i ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
                  }}
                >
                  {chip.title}
                </button>
              ))}
            </div>

            {/* Active chip content */}
            <motion.div
              key={activeChip}
              className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {avaChips[activeChip].points.map((point, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--blue-primary)] mt-2 flex-shrink-0" />
                    <p className="text-base text-[var(--foreground)] font-normal" style={{ lineHeight: '1.75' }}>
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THREE DENTAL SCENARIOS - CAROUSEL */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">See how Ava handles real dental situations.</h2>
            <p className="text-base text-[var(--foreground-muted)] font-normal max-w-3xl mx-auto" style={{ lineHeight: '1.75' }}>
              Tap through a few common scenarios.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={() => setCurrentScenario((prev) => (prev === 0 ? dentalScenarios.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white border border-[var(--glass-border)] flex items-center justify-center transition-all duration-150 hover:bg-[var(--blue-soft)] hover:border-[var(--blue-primary)]"
              >
                <ChevronLeft className="text-[var(--foreground-muted)]" size={20} />
              </button>
              
              <div className="flex gap-2">
                {dentalScenarios.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentScenario(i)}
                    className="w-2 h-2 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: currentScenario === i ? 'var(--blue-primary)' : '#CBD5E1'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentScenario((prev) => (prev === dentalScenarios.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full bg-white border border-[var(--glass-border)] flex items-center justify-center transition-all duration-150 hover:bg-[var(--blue-soft)] hover:border-[var(--blue-primary)]"
              >
                <ChevronRight className="text-[var(--foreground-muted)]" size={20} />
              </button>
            </div>

            {/* Scenario card */}
            <motion.div
              key={currentScenario}
              className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: flowEasing }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--blue-soft)] flex items-center justify-center">
                  {(() => {
                    const Scenario = dentalScenarios[currentScenario];
                    return <Scenario.icon className="text-[var(--blue-primary)]" size={18} strokeWidth={2} />;
                  })()}
                </div>
                <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  {dentalScenarios[currentScenario].title}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                {dentalScenarios[currentScenario].exchanges.map((exchange, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mt-1 w-16 flex-shrink-0">
                      {exchange.speaker}
                    </div>
                    <p className="text-sm text-[var(--foreground)] font-normal flex-1" style={{ lineHeight: '1.6' }}>
                      {exchange.text}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="pt-4 border-t border-[var(--glass-border)]">
                <p className="text-sm text-[var(--foreground-muted)] font-normal italic">
                  {dentalScenarios[currentScenario].outcome}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE NUMBERS DENTAL OWNERS CARE ABOUT - INTERACTIVE METRICS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">What dental clinics usually see.</h2>
            <p className="text-base text-[var(--foreground-muted)] font-normal max-w-3xl mx-auto" style={{ lineHeight: '1.75' }}>
              Your exact numbers will differ, but these are the levers Ava helps with.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {metrics.map((metric, i) => (
              <motion.div
                key={i}
                className="relative p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm text-center cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                onMouseEnter={() => setHoveredMetric(i)}
                onMouseLeave={() => setHoveredMetric(null)}
                style={{
                  transition: 'all 200ms ease-out'
                }}
              >
                <motion.div
                  animate={{
                    opacity: hoveredMetric === i ? 0 : 1,
                    y: hoveredMetric === i ? -10 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-medium text-[var(--foreground)]">{metric.title}</h3>
                </motion.div>

                <motion.div
                  className="absolute inset-0 p-8 flex items-center justify-center"
                  animate={{
                    opacity: hoveredMetric === i ? 1 : 0,
                    y: hoveredMetric === i ? 0 : 10
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    backgroundColor: '#EAF1FF',
                    pointerEvents: hoveredMetric === i ? 'auto' : 'none'
                  }}
                >
                  <p className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.6' }}>
                    {metric.explanation}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLEAR BOUNDARIES FOR DENTAL CARE */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Ava handles logistics, not dentistry.</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {boundaries.map((boundary, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: flowEasing }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <Shield className="text-[var(--blue-primary)] mt-0.5 flex-shrink-0" size={18} strokeWidth={2} />
                <p className="text-base text-[var(--foreground)] font-normal" style={{ lineHeight: '1.75' }}>
                  {boundary}
                </p>
              </motion.div>
            ))}
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
              <h2 className="mb-6 font-medium">See Ava on your dental lines.</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                Start with hygiene, recall, and cancellations, then expand as you see results.
              </p>

              <div className="max-w-[600px] mx-auto p-10 rounded-3xl bg-[var(--blue-soft)]/40">
                <Link to="/trial">
                  <motion.button
                    className="w-full px-10 py-5 rounded-full text-base bg-[var(--blue-primary)] text-white font-medium mb-4"
                    style={{ transition: 'all 150ms ease-out' }}
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Join the waitlist
                  </motion.button>
                </Link>

                <Link 
                  to="/voice-automation" 
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--blue-primary)] font-normal transition-colors duration-150"
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