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

export function MentalHealth() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [activeTab, setActiveTab] = useState<'inquiry' | 'reschedule' | 'missed'>('inquiry');
  const [activeChip, setActiveChip] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  const dailyReality = {
    frontDesk: [
      'Phones ringing nonstop while staff is already on calls.',
      'New therapy inquiries needing empathy and routing.',
      'Patients rescheduling therapy sessions at the last minute.',
      'Insurance and medication questions that interrupt other work.'
    ],
    cliniciansOwners: [
      'No-shows and late cancellations breaking up the schedule.',
      'Notes and follow ups eating into evenings.',
      'Patients quietly dropping out without explanation.'
    ]
  };

  const heroTabs = {
    inquiry: {
      calls: [
        { name: 'New therapy inquiry', time: '2:15 PM' },
        { name: 'Psychiatry consultation', time: '3:30 PM' },
        { name: 'Group therapy question', time: '4:00 PM' }
      ],
      message: {
        incoming: 'Hi, I am interested in starting therapy.',
        response: 'Thank you for reaching out. Let me get some basic information and find an intake time that works for you.'
      }
    },
    reschedule: {
      calls: [
        { name: 'Move recurring session', time: '2:00 PM' },
        { name: 'Medication check-in change', time: '3:15 PM' },
        { name: 'Therapy time adjustment', time: '4:30 PM' }
      ],
      message: {
        incoming: 'I need to move my Thursday session to next week.',
        response: 'No problem. What day next week works best for you?'
      }
    },
    missed: {
      calls: [
        { name: 'No-show follow up', time: '2:30 PM' },
        { name: 'Missed medication check', time: '3:45 PM' },
        { name: 'Session drop-off outreach', time: '4:15 PM' }
      ],
      message: {
        incoming: 'This is Ava from Dr. Smith office. We noticed you were not able to make your appointment today.',
        response: 'Would you like to reschedule or is everything okay?'
      }
    }
  };

  const avaChips = [
    {
      title: 'New inquiries',
      points: [
        'Answers calls with empathy and gathers basic information.',
        'Routes to the right therapist or psychiatrist based on needs.',
        'Books intake appointments without making callers wait.'
      ]
    },
    {
      title: 'Reschedules',
      points: [
        'Handles recurring session changes over voice and text.',
        'Updates future appointments automatically.',
        'Keeps therapist schedules filled with minimal gaps.'
      ]
    },
    {
      title: 'Medication check-ins',
      points: [
        'Schedules medication management appointments.',
        'Answers basic questions about timing and availability.',
        'Routes clinical medication questions to providers.'
      ]
    },
    {
      title: 'Missed sessions',
      points: [
        'Follows up after no-shows with gentle outreach.',
        'Offers reschedule options or closes the loop.',
        'Captures reasons when patients decide to pause care.'
      ]
    }
  ];

  const scenarios = [
    {
      icon: Phone,
      title: 'New therapy inquiry',
      exchanges: [
        { speaker: 'Ava', text: 'Hi, thanks for calling. Are you looking for therapy or psychiatry services?' },
        { speaker: 'Caller', text: 'Therapy. I am interested in starting with someone.' },
        { speaker: 'Ava', text: 'Great. Let me get some basic information and find an intake time that works for you.' }
      ],
      outcome: 'Outcome: Inquiry converted to scheduled intake.'
    },
    {
      icon: MessageSquare,
      title: 'Recurring session reschedule over text',
      exchanges: [
        { speaker: 'Patient', text: 'I need to move my Thursday session to next week.' },
        { speaker: 'Ava', text: 'No problem. What day works best for you next week?' },
        { speaker: 'Patient', text: 'Tuesday at the same time?' }
      ],
      outcome: 'Outcome: Session rescheduled without a phone call.'
    },
    {
      icon: Bell,
      title: 'Missed appointment follow up',
      exchanges: [
        { speaker: 'Ava', text: 'Hi Sarah, this is Ava from Dr. Smith office. We noticed you were not able to make your appointment today. Would you like to reschedule?' },
        { speaker: 'Patient', text: 'Yes, sorry about that. Can we do next Monday?' }
      ],
      outcome: 'Outcome: No-show converted into a rescheduled visit.'
    }
  ];

  const outcomes = [
    {
      title: 'More kept appointments',
      explanation: 'Fewer no-shows and drop-offs because reminders and reschedules just happen.'
    },
    {
      title: 'Calmer front desk',
      explanation: 'Staff spend less time chasing calls and more time helping patients in front of them.'
    },
    {
      title: 'Less after-hours documentation',
      explanation: 'Ava MD drafts notes and follow ups so evenings are not all documentation.'
    }
  ];

  const safetyPrinciples = [
    'No diagnosis, no treatment, no crisis counselling.',
    'Escalates risk language and complex questions to humans using your protocols.',
    'Consent-gated recording and transcription when Ava MD is used.',
    'Clinicians review and sign every note and suggestion.'
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
              <h1 className="mb-8 font-medium">Axis and Ava for mental health clinics.</h1>
              <p className="text-lg text-[var(--foreground-muted)] font-normal mb-10" style={{ lineHeight: '1.75' }}>
                For outpatient therapy, psychiatry, and group practices juggling full schedules, reschedules, and risk.
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
                      { key: 'inquiry' as const, label: 'New inquiry' },
                      { key: 'reschedule' as const, label: 'Reschedule' },
                      { key: 'missed' as const, label: 'Missed session' }
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
            <h2 className="mb-6 font-medium">What your mental health clinic is juggling every day.</h2>
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
                {dailyReality.frontDesk.map((item, i) => (
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

            {/* Clinicians and owners */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <h3 className="text-base font-medium text-[var(--foreground)] mb-6">Clinicians and owners</h3>
              <div className="space-y-4">
                {dailyReality.cliniciansOwners.map((item, i) => (
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

      {/* WHERE AVA STEPS IN - INTERACTIVE STRIP */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Where Ava steps into your workflow.</h2>
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
            <h2 className="mb-6 font-medium">How Ava behaves in real situations.</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={() => setCurrentScenario((prev) => (prev === 0 ? scenarios.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white border border-[var(--glass-border)] flex items-center justify-center transition-all duration-150 hover:bg-[var(--blue-soft)] hover:border-[var(--blue-primary)]"
              >
                <ChevronLeft className="text-[var(--foreground-muted)]" size={20} />
              </button>
              
              <div className="flex gap-2">
                {scenarios.map((_, i) => (
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
                onClick={() => setCurrentScenario((prev) => (prev === scenarios.length - 1 ? 0 : prev + 1))}
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
                    const Scenario = scenarios[currentScenario];
                    return <Scenario.icon className="text-[var(--blue-primary)]" size={18} strokeWidth={2} />;
                  })()}
                </div>
                <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  {scenarios[currentScenario].title}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                {scenarios[currentScenario].exchanges.map((exchange, i) => (
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
                  {scenarios[currentScenario].outcome}
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
            <h2 className="mb-6 font-medium">What clinics usually notice.</h2>
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

      {/* BOUNDARIES AND SAFETY */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Ava is not a therapist.</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {safetyPrinciples.map((principle, i) => (
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
                  {principle}
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
              <h2 className="mb-6 font-medium">See if Ava fits your mental health clinic.</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                We usually start with a few lines or providers and measure the impact together.
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