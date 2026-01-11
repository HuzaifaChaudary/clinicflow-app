import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Calendar, 
  Phone, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  CreditCard,
  FileText,
  Clock,
  Bell,
  ChevronDown,
  Minus
} from 'lucide-react';

export function Pricing() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const automationNodes = [
    { icon: Calendar, label: 'Appointments scheduled', detail: 'System checks availability automatically' },
    { icon: Phone, label: 'Confirmations sent', detail: 'Voice calls placed 24-48 hours before' },
    { icon: CheckCircle, label: 'Responses handled', detail: 'Confirms, reschedules, no-shows processed' },
    { icon: Users, label: 'Staff only step in when needed', detail: 'Exceptions and edge cases only' }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      subtitle: 'For single-provider clinics',
      features: [
        'Appointment confirmations',
        'Voice or SMS reminders',
        'Basic rescheduling',
        'Email support'
      ],
      cta: 'Start free',
      link: '/trial'
    },
    {
      name: 'Growth',
      subtitle: 'For multi-provider clinics',
      features: [
        'Voice + SMS automation',
        'Rule based rescheduling',
        'No-show prevention',
        'Admin automation',
        'Priority support'
      ],
      cta: 'Start free',
      link: '/trial',
      recommended: true
    },
    {
      name: 'Scale',
      subtitle: 'For multi-location clinics',
      features: [
        'Everything in Growth',
        'Advanced routing rules',
        'Volume pricing',
        'Dedicated onboarding'
      ],
      cta: 'Join Waitlist',
      link: '/trial'
    }
  ];

  const notPayingFor = [
    'No per-seat fees',
    'No contracts',
    'No setup charges',
    'No forced EHR replacement',
    'No upsells for basics'
  ];

  const roiStats = [
    { value: '40 to 60%', label: 'fewer no-shows' },
    { value: '8 to 12 hours', label: 'saved weekly at front desk' },
    { value: '0', label: 'additional staff needed' }
  ];

  const faqs = [
    {
      question: 'Is there a contract?',
      answer: 'No. AXIS operates on month to month billing. Cancel anytime with no penalty.'
    },
    {
      question: 'Can we start with SMS only?',
      answer: 'Yes. You can start with SMS reminders and add voice confirmations later. The system adapts to your preferences.'
    },
    {
      question: 'Does this replace our EHR?',
      answer: 'No. AXIS works alongside your existing EHR. It handles operational tasks like scheduling and communication, not clinical records.'
    },
    {
      question: 'How long does setup take?',
      answer: 'Initial setup is designed for fast completion without disrupting clinic operations. Enter clinic hours, scheduling rules, and communication preferences. The system handles the rest automatically.'
    },
    {
      question: 'Can we switch plans later?',
      answer: 'Yes. You can upgrade or downgrade at any time. Changes take effect at your next billing cycle.'
    }
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* HERO */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8">Simple pricing that scales with your clinic</h1>
              <p className="text-2xl text-[var(--foreground-muted)] mb-12">
                Pay for what runs automatically.<br />
                No contracts. No hidden fees. No forced upgrades.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link to="/trial">
                  <motion.button
                    className="px-8 py-4 rounded-full text-white"
                    style={{ 
                      backgroundColor: '#2563EB',
                      transition: 'all 200ms ease-out'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E4ED8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                    }}
                  >
                    Join Waitlist
                  </motion.button>
                </Link>

                <Link 
                  to="/how-it-works"
                  className="px-8 py-4 inline-flex items-center gap-2 transition-all duration-200"
                  style={{ color: '#2563EB' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.gap = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.gap = '8px';
                  }}
                >
                  See how it works
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* Right: Blue conversational flow panel */}
            <motion.div
              className="p-10 rounded-2xl"
              style={{ backgroundColor: '#2563EB' }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                {[
                  { icon: Calendar, label: 'Appointment' },
                  { icon: Phone, label: 'Confirmation' },
                  { icon: CheckCircle, label: 'Response' },
                  { icon: Bell, label: 'Updated' }
                ].map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      >
                        <step.icon className="w-5 h-5" style={{ color: 'white' }} />
                      </div>
                      <span className="text-xs text-white/80 text-center hidden sm:block">{step.label}</span>
                    </div>
                    {i < 3 && (
                      <ArrowRight className="mx-2 sm:mx-4" size={16} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW PRICING WORKS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">How pricing works</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left: Explanation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h3 className="mb-6">Per-clinic pricing. Not per user.</h3>
              <p className="text-xl text-[var(--foreground-muted)] mb-6">
                Pricing is based on message volume and automation usage, not staff seats.
              </p>
              <p className="text-lg text-[var(--foreground-muted)]">
                AXIS grows with your clinic without penalizing usage.
              </p>
            </motion.div>

            {/* Right: Vertical flow diagram */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              {automationNodes.map((node, i) => (
                <motion.div
                  key={i}
                  className="p-6 rounded-xl transition-all duration-200 cursor-pointer"
                  style={{ 
                    backgroundColor: 'white',
                    border: '1px solid var(--glass-border)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: flowEasing }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EAF1FF';
                    e.currentTarget.style.borderColor = '#2563EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#EAF1FF' }}
                    >
                      <node.icon size={20} style={{ color: '#2563EB' }} />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1">{node.label}</div>
                      <div className="text-sm text-[var(--foreground-muted)]">{node.detail}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">Choose the level of automation you need</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                className="relative p-10 rounded-2xl transition-all duration-200 group cursor-pointer"
                style={{
                  backgroundColor: 'white',
                  border: '2px solid var(--glass-border)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: flowEasing }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.borderColor = '#2563EB';
                  const title = e.currentTarget.querySelector('.tier-title') as HTMLElement;
                  const subtitle = e.currentTarget.querySelector('.tier-subtitle') as HTMLElement;
                  const features = e.currentTarget.querySelectorAll('.tier-feature');
                  const label = e.currentTarget.querySelector('.tier-label') as HTMLElement;
                  if (title) title.style.color = 'white';
                  if (subtitle) subtitle.style.color = 'rgba(255, 255, 255, 0.8)';
                  if (label) label.style.color = 'rgba(255, 255, 255, 0.9)';
                  features.forEach((feature) => {
                    (feature as HTMLElement).style.color = 'rgba(255, 255, 255, 0.9)';
                  });
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  const title = e.currentTarget.querySelector('.tier-title') as HTMLElement;
                  const subtitle = e.currentTarget.querySelector('.tier-subtitle') as HTMLElement;
                  const features = e.currentTarget.querySelectorAll('.tier-feature');
                  const label = e.currentTarget.querySelector('.tier-label') as HTMLElement;
                  if (title) title.style.color = '';
                  if (subtitle) subtitle.style.color = '';
                  if (label) label.style.color = '';
                  features.forEach((feature) => {
                    (feature as HTMLElement).style.color = '';
                  });
                }}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div 
                      className="px-4 py-1 rounded-full text-xs tier-label"
                      style={{ 
                        backgroundColor: '#EAF1FF',
                        color: '#2563EB',
                        transition: 'all 200ms ease-out'
                      }}
                    >
                      Most clinics choose this
                    </div>
                  </div>
                )}

                <h3 className="mb-2 tier-title" style={{ transition: 'all 200ms ease-out' }}>{tier.name}</h3>
                <p className="text-[var(--foreground-muted)] mb-8 tier-subtitle" style={{ transition: 'all 200ms ease-out' }}>
                  {tier.subtitle}
                </p>

                <div className="space-y-3 mb-10">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Minus size={16} className="mt-1 flex-shrink-0 tier-feature" style={{ color: '#64748B', transition: 'all 200ms ease-out' }} />
                      <span className="tier-feature" style={{ color: '#64748B', transition: 'all 200ms ease-out' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to={tier.link} className="block">
                  <motion.button
                    className="w-full py-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      backgroundColor: 'white',
                      color: '#2563EB'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.cta}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU'RE NOT PAYING FOR */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-12">What you're not paying for</h2>

            <div className="space-y-6">
              {notPayingFor.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-6 rounded-xl border-b border-[var(--glass-border)] last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: flowEasing }}
                >
                  <Minus size={18} style={{ color: '#94A3B8' }} className="flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI FRAMING */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">Clinics usually see</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roiStats.map((stat, i) => (
              <motion.div
                key={i}
                className="p-10 rounded-2xl text-center transition-all duration-200 cursor-default"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--glass-border)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  const value = e.currentTarget.querySelector('.stat-value') as HTMLElement;
                  const label = e.currentTarget.querySelector('.stat-label') as HTMLElement;
                  if (value) value.style.color = 'white';
                  if (label) label.style.color = 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  const value = e.currentTarget.querySelector('.stat-value') as HTMLElement;
                  const label = e.currentTarget.querySelector('.stat-label') as HTMLElement;
                  if (value) value.style.color = '';
                  if (label) label.style.color = '';
                }}
              >
                <div className="text-5xl mb-4 stat-value" style={{ transition: 'all 200ms ease-out' }}>{stat.value}</div>
                <div className="text-lg text-[var(--foreground-muted)] stat-label" style={{ transition: 'all 200ms ease-out' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">Common questions</h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isExpanded = expandedFaq === i;
                
                return (
                  <motion.div
                    key={i}
                    className="rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid var(--glass-border)'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: flowEasing }}
                  >
                    <button
                      className="w-full p-6 text-left flex items-center justify-between"
                      onClick={() => setExpandedFaq(isExpanded ? null : i)}
                    >
                      <span className="text-lg pr-4">{faq.question}</span>
                      <ChevronDown 
                        size={20}
                        className="flex-shrink-0 transition-transform duration-200"
                        style={{
                          color: '#64748B',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      />
                    </button>
                    
                    <div 
                      className="overflow-hidden transition-all duration-200"
                      style={{
                        maxHeight: isExpanded ? '200px' : '0',
                        opacity: isExpanded ? 1 : 0
                      }}
                    >
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-[var(--foreground-muted)]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
              <h2 className="mb-6">See AXIS in action</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                A short walkthrough of real clinic workflows.<br />
                No pressure. No sales scripts.
              </p>

              {/* CTA Block */}
              <div className="max-w-[720px] mx-auto p-10 rounded-3xl" style={{ backgroundColor: '#EAF1FF' }}>
                <Link to="/trial">
                  <motion.button
                    className="w-full px-10 py-5 rounded-full text-lg mb-6"
                    style={{ 
                      backgroundColor: '#2563EB',
                      color: 'white',
                      transition: 'all 200ms ease-out'
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E4ED8';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Join Waitlist
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}