import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Phone,
  MessageSquare,
  Bell,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function Physiotherapy() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [activeTab, setActiveTab] = useState<'assessment' | 'cancellation' | 'dropoff'>('assessment');
  const [activeChip, setActiveChip] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  const ptReality = {
    frontDesk: [
      'Phones ringing while patients are checking in and out.',
      'Same-day cancellations that leave therapists with gaps.',
      'New referrals calling in while lines are already busy.',
      'Insurance verification questions interrupting patient flow.'
    ],
    therapistsOwners: [
      'Patients dropping out after two or three sessions.',
      'Plans of care that never reach the planned visit count.',
      'No clear view of utilization across therapists and locations.'
    ]
  };

  const heroTabs = {
    assessment: {
      calls: [
        { name: 'New injury assessment', time: '2:00 PM' },
        { name: 'Post-op evaluation', time: '3:15 PM' },
        { name: 'Referral intake', time: '3:45 PM' }
      ],
      message: {
        incoming: 'I hurt my shoulder and my doctor gave me a referral.',
        response: 'Got it. Let me verify your insurance and find an assessment time that works for you.'
      }
    },
    cancellation: {
      calls: [
        { name: 'Reschedule PT session', time: '2:15 PM' },
        { name: 'Same-day cancellation', time: '3:00 PM' },
        { name: 'Move follow-up visit', time: '4:30 PM' }
      ],
      message: {
        incoming: 'I need to cancel my 2pm session today, sorry.',
        response: 'No problem. Can you do Thursday at the same time instead?'
      }
    },
    dropoff: {
      calls: [
        { name: 'Plan of care check-in', time: '2:30 PM' },
        { name: 'Overdue follow-up', time: '3:45 PM' },
        { name: 'Re-engagement outreach', time: '4:15 PM' }
      ],
      message: {
        incoming: 'Hi Michael, we noticed you have not booked your next session.',
        response: 'Would you like to continue your shoulder program?'
      }
    }
  };

  const avaChips = [
    {
      title: 'New referrals',
      points: [
        'Answers new patient calls and gathers injury information.',
        'Verifies insurance and referral requirements.',
        'Books initial assessments with available therapists.'
      ]
    },
    {
      title: 'Cancellations and reschedules',
      points: [
        'Handles same-day and advance cancellations.',
        'Offers alternative times that work for the patient.',
        'Updates recurring sessions automatically.'
      ]
    },
    {
      title: 'Waitlist filling',
      points: [
        'Maintains your waitlist of patients ready to come in sooner.',
        'Offers open slots to waitlist patients automatically.',
        'Fills gaps before therapist time is wasted.'
      ]
    },
    {
      title: 'Plan-of-care follow ups',
      points: [
        'Tracks visit counts against planned sessions.',
        'Reaches out when patients stop booking.',
        'Captures reasons if patients decide to pause treatment.'
      ]
    }
  ];

  const ptScenarios = [
    {
      icon: Phone,
      title: 'New injury assessment call',
      exchanges: [
        { speaker: 'Ava', text: 'Hi, are you calling to book a new physio appointment?' },
        { speaker: 'Caller', text: 'Yes, I hurt my shoulder and my doctor gave me a referral.' },
        { speaker: 'Ava', text: 'Got it. Let me verify your insurance and find an assessment time that works for you.' }
      ],
      outcome: 'Outcome: New patient booked with referral verified.'
    },
    {
      icon: MessageSquare,
      title: 'Same-day cancellation',
      exchanges: [
        { speaker: 'Patient', text: 'I need to cancel my 2pm session today, sorry.' },
        { speaker: 'Ava', text: 'No problem. Can you do Thursday at the same time instead?' },
        { speaker: 'Ava', text: 'Also offering your slot to waitlist patients now.' }
      ],
      outcome: 'Outcome: Same-day cancellation back-filled, therapist stays booked.'
    },
    {
      icon: Bell,
      title: 'Plan of care drop-off',
      exchanges: [
        { speaker: 'Ava', text: 'Hi Michael, we noticed you have not booked your next session. Would you like to continue your shoulder program?' },
        { speaker: 'Patient', text: 'Yes, I just got busy. Can we do next Tuesday?' }
      ],
      outcome: 'Outcome: Patient re-engaged before dropping from plan of care.'
    }
  ];

  const outcomes = [
    {
      title: 'More completed plans of care',
      explanation: 'Patients finish the visits you planned, instead of disappearing after a few sessions.'
    },
    {
      title: 'Higher therapist utilization',
      explanation: 'Cancellations get back-filled automatically from your waitlist.'
    },
    {
      title: 'Less time on the phone',
      explanation: 'Front desk spends more time with patients in front of them and less time chasing calls.'
    }
  ];

  const boundaries = [
    'No diagnosis, no exercise prescription, no clinical advice.',
    'Routes pain changes, post-op concerns, and red-flag symptoms to therapists.',
    'Logs calls and messages so your team sees every interaction.',
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
              <h1 className="mb-8 font-medium">Axis and Ava for physiotherapy clinics.</h1>
              <p className="text-lg text-[var(--foreground-muted)] font-normal mb-10" style={{ lineHeight: '1.75' }}>
                For PT and physio practices dealing with cancellations, uneven schedules, and unfinished plans of care.
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
                      { key: 'assessment' as const, label: 'New assessment' },
                      { key: 'cancellation' as const, label: 'Cancellation' },
                      { key: 'dropoff' as const, label: 'Drop-off' }
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
                      <span className="text-sm font-medium text-[var(--foreground)]">Recent message</span>
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

      {/* WHAT YOUR CLINIC IS JUGGLING */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">What your physio clinic is juggling every week.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Front desk */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h3 className="text-base font-medium text-[var(--foreground)] mb-6">Front desk</h3>
              <div className="space-y-4">
                {ptReality.frontDesk.map((item, i) => (
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

            {/* Therapists and owners */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <h3 className="text-base font-medium text-[var(--foreground)] mb-6">Therapists and owners</h3>
              <div className="space-y-4">
                {ptReality.therapistsOwners.map((item, i) => (
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

      {/* WHERE AVA FITS IN - INTERACTIVE STRIP */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Where Ava fits into your PT workflow.</h2>
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

      {/* SCENARIOS CAROUSEL */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">How Ava behaves in real physio situations.</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={() => setCurrentScenario((prev) => (prev === 0 ? ptScenarios.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white border border-[var(--glass-border)] flex items-center justify-center transition-all duration-150 hover:bg-[var(--blue-soft)] hover:border-[var(--blue-primary)]"
              >
                <ChevronLeft className="text-[var(--foreground-muted)]" size={20} />
              </button>
              
              <div className="flex gap-2">
                {ptScenarios.map((_, i) => (
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
                onClick={() => setCurrentScenario((prev) => (prev === ptScenarios.length - 1 ? 0 : prev + 1))}
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
                    const Scenario = ptScenarios[currentScenario];
                    return <Scenario.icon className="text-[var(--blue-primary)]" size={18} strokeWidth={2} />;
                  })()}
                </div>
                <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  {ptScenarios[currentScenario].title}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                {ptScenarios[currentScenario].exchanges.map((exchange, i) => (
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
                  {ptScenarios[currentScenario].outcome}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUTCOME TILES - INTERACTIVE HOVER */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">What PT clinics usually notice.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {outcomes.map((outcome, i) => (
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
                  <h3 className="text-lg font-medium text-[var(--foreground)]">{outcome.title}</h3>
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
                    {outcome.explanation}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLEAR BOUNDARIES FOR PT */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Ava does not replace your therapists.</h2>
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
              <h2 className="mb-6 font-medium">See Ava on your physio lines.</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                We usually start with cancellations, reschedules, and reminders for a few therapists, then expand.
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