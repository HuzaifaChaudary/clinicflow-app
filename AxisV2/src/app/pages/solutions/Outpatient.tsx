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

export function Outpatient() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [activeTab, setActiveTab] = useState<'newpatient' | 'followup' | 'results'>('newpatient');
  const [activeChip, setActiveChip] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  const outpatientReality = {
    frontDeskAccess: [
      'Phones ringing for new patients, refills, and follow ups at the same time.',
      'Patients on hold while staff checks insurance or referrals.',
      'Same-day cancellations and no-shows breaking up the schedule.'
    ],
    cliniciansOperations: [
      'Follow ups and labs that slip through the cracks.',
      'Providers running behind while messages pile up in the inbox.',
      'Owners guessing where access is blocked and capacity is wasted.'
    ]
  };

  const heroTabs = {
    newpatient: {
      calls: [
        { name: 'New patient PCP visit', time: '2:00 PM' },
        { name: 'Specialist consultation', time: '3:15 PM' },
        { name: 'First visit cardiology', time: '4:00 PM' }
      ],
      message: {
        incoming: 'Hi, I need to see a primary care doctor for the first time.',
        response: 'I can help with that. Let me get some basic information and find a time that works for you.'
      }
    },
    followup: {
      calls: [
        { name: 'Follow up reschedule', time: '2:15 PM' },
        { name: 'Lab review booking', time: '3:30 PM' },
        { name: 'Post-visit check-in', time: '4:15 PM' }
      ],
      message: {
        incoming: 'I need to reschedule my follow up visit next week.',
        response: 'No problem. What day works better for you?'
      }
    },
    results: {
      calls: [
        { name: 'Lab results question', time: '2:30 PM' },
        { name: 'Imaging follow up', time: '3:00 PM' },
        { name: 'Post-visit clarification', time: '4:30 PM' }
      ],
      message: {
        incoming: 'I got my lab results back. Do I need to come in to review them?',
        response: 'Let me check with your provider and get back to you today.'
      }
    }
  };

  const avaChips = [
    {
      title: 'New patient calls',
      points: [
        'Collects basic info, checks reason for visit, and books with the right provider.',
        'Verifies insurance and referral requirements.',
        'Routes complex cases or urgent symptoms to your triage protocols.'
      ]
    },
    {
      title: 'Scheduling and reschedules',
      points: [
        'Handles appointment changes over voice and text.',
        'Offers alternative times that work for patients.',
        'Fills cancellations to keep provider schedules productive.'
      ]
    },
    {
      title: 'Reminders and follow ups',
      points: [
        'Confirms appointments, moves them when needed.',
        'Prompts patients to book follow up visits after initial appointments.',
        'Reduces no-shows with timely, clear reminders.'
      ]
    },
    {
      title: 'After-visit questions',
      points: [
        'Answers basic questions about lab results, next steps, and timing.',
        'Routes clinical questions and urgent concerns to providers.',
        'Logs every interaction so your team sees what was discussed.'
      ]
    }
  ];

  const outpatientScenarios = [
    {
      icon: Phone,
      title: 'New patient primary care visit',
      exchanges: [
        { speaker: 'Ava', text: 'Hi, are you looking to schedule a visit with one of our providers?' },
        { speaker: 'Caller', text: 'Yes, I need a primary care doctor. This is my first visit.' },
        { speaker: 'Ava', text: 'Great. Let me get your demographics and reason for visit, then find a time that works for you.' }
      ],
      outcome: 'Outcome: New patient booked with appropriate provider.'
    },
    {
      icon: MessageSquare,
      title: 'Follow up and labs',
      exchanges: [
        { speaker: 'Ava', text: 'Hi James, you had labs done last week. Would you like to schedule a follow up to review them with Dr. Chen?' },
        { speaker: 'Patient', text: 'Yes, what do you have next week?' }
      ],
      outcome: 'Outcome: Follow up booked, labs reviewed on schedule.'
    },
    {
      icon: Bell,
      title: 'Same-day cancellation',
      exchanges: [
        { speaker: 'Patient', text: 'I need to cancel my 3pm appointment today, sorry.' },
        { speaker: 'Ava', text: 'Can you do Friday at the same time instead?' },
        { speaker: 'Ava', text: 'Also offering your slot to patients waiting for earlier appointments.' }
      ],
      outcome: 'Outcome: Same-day cancellation back-filled, provider time kept productive.'
    }
  ];

  const outcomes = [
    {
      title: 'Shorter hold times',
      explanation: 'More calls answered immediately, fewer patients hanging up.'
    },
    {
      title: 'Fewer no-shows and gaps',
      explanation: 'Reminders and reschedules keep the day full.'
    },
    {
      title: 'Less admin time per kept visit',
      explanation: 'Intake, reminders, and follow ups handled without extra staff.'
    }
  ];

  const boundaries = [
    'No diagnosis, treatment, or triage decisions from Ava.',
    'Routes urgent symptoms and red-flags to your existing triage protocols.',
    'Logs calls, texts, and notes so your team sees every interaction.',
    'Any notes drafted with Ava MD are reviewed and signed by clinicians.'
  ];

  const currentTab = heroTabs[activeTab];

  return (
    <div className="min-h-screen pt-32">
      {/* HERO */}
      <section className="relative py-16 sm:py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
              className="order-1"
            >
              <h1 className="mb-6 sm:mb-8 font-medium text-3xl sm:text-4xl lg:text-5xl">Axis and Ava for outpatient clinics.</h1>
              <p className="text-base sm:text-lg text-[var(--foreground-muted)] font-normal mb-8 sm:mb-10" style={{ lineHeight: '1.75' }}>
                For multi-specialty and primary care clinics with busy phones, packed schedules, and constant follow ups.
              </p>

              <Link to="/voice-automation" className="inline-block w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[var(--blue-primary)] text-white text-base font-medium"
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
              className="order-2"
            >
              <div className="rounded-2xl bg-white border border-[var(--glass-border)] shadow-lg overflow-hidden">
                {/* Tab switcher */}
                <div className="p-4 sm:p-6 border-b border-[var(--glass-border)] bg-[var(--background-secondary)]/20">
                  <div className="flex flex-col sm:flex-row gap-2">
                    {[
                      { key: 'newpatient' as const, label: 'New patient' },
                      { key: 'followup' as const, label: 'Follow up' },
                      { key: 'results' as const, label: 'Results' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="flex-1 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
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
                  <div className="p-4 sm:p-6 border-b border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 mb-4 sm:mb-5">
                      <Phone className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                      <span className="text-xs sm:text-sm font-medium text-[var(--foreground)]\">Incoming calls</span>
                    </div>
                    <div className="space-y-2.5">
                      {currentTab.calls.map((call, i) => (
                        <div key={i} className="py-2.5 px-3 sm:px-4 rounded-lg bg-[var(--background-secondary)]/30">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs sm:text-sm font-normal text-[var(--foreground)] truncate">{call.name}</span>
                            <span className="text-xs text-[var(--foreground-muted)] flex-shrink-0">{call.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-[var(--background-secondary)]/20">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="text-[var(--blue-primary)]" size={16} strokeWidth={2} />
                      <span className="text-xs sm:text-sm font-medium text-[var(--foreground)]\">Recent message</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[var(--background-secondary)]/50 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-[var(--foreground)] font-normal">{currentTab.message.incoming}</p>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-[var(--blue-primary)] text-white p-3 sm:p-4 rounded-lg max-w-[280px]">
                          <p className="text-xs sm:text-sm font-normal text-white">{currentTab.message.response}</p>
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

      {/* WHAT OUTPATIENT CLINICS ARE JUGGLING */}
      <section className="relative py-16 sm:py-24 lg:py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium text-2xl sm:text-3xl lg:text-4xl">What your outpatient clinic is juggling every day.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
            {/* Front desk / access */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h3 className="text-base font-medium text-[var(--foreground)] mb-6">Front desk / access</h3>
              <div className="space-y-4">
                {outpatientReality.frontDeskAccess.map((item, i) => (
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

            {/* Clinicians / operations */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <h3 className="text-base font-medium text-[var(--foreground)] mb-6">Clinicians / operations</h3>
              <div className="space-y-4">
                {outpatientReality.cliniciansOperations.map((item, i) => (
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
            <h2 className="mb-6 font-medium">Where Ava fits into your outpatient workflow.</h2>
            <p className="text-base text-[var(--foreground-muted)] font-normal max-w-3xl mx-auto" style={{ lineHeight: '1.75' }}>
              Ava handles the intake and follow up work around your EHR, not the medicine itself.
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

      {/* SCENARIO CAROUSEL */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">How Ava behaves in real outpatient situations.</h2>
            <p className="text-base text-[var(--foreground-muted)] font-normal max-w-3xl mx-auto" style={{ lineHeight: '1.75' }}>
              A few concrete examples from multi-specialty and primary care clinics.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={() => setCurrentScenario((prev) => (prev === 0 ? outpatientScenarios.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white border border-[var(--glass-border)] flex items-center justify-center transition-all duration-150 hover:bg-[var(--blue-soft)] hover:border-[var(--blue-primary)]"
              >
                <ChevronLeft className="text-[var(--foreground-muted)]" size={20} />
              </button>
              
              <div className="flex gap-2">
                {outpatientScenarios.map((_, i) => (
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
                onClick={() => setCurrentScenario((prev) => (prev === outpatientScenarios.length - 1 ? 0 : prev + 1))}
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
                    const Scenario = outpatientScenarios[currentScenario];
                    return <Scenario.icon className="text-[var(--blue-primary)]" size={18} strokeWidth={2} />;
                  })()}
                </div>
                <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  {outpatientScenarios[currentScenario].title}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                {outpatientScenarios[currentScenario].exchanges.map((exchange, i) => (
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
                  {outpatientScenarios[currentScenario].outcome}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT OUTPATIENT CLINICS NOTICE - INTERACTIVE HOVER */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">What outpatient clinics usually notice.</h2>
            <p className="text-base text-[var(--foreground-muted)] font-normal max-w-3xl mx-auto" style={{ lineHeight: '1.75' }}>
              Your exact numbers will differ, but these are the levers Ava helps with.
            </p>
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

      {/* CLEAR BOUNDARIES FOR OUTPATIENT CARE */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Ava handles logistics, not clinical decisions.</h2>
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
              <h2 className="mb-6 font-medium">See Ava on your outpatient lines.</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                We usually start with a few lines or providers to prove impact, then expand.
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