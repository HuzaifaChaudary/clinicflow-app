import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Phone,
  MessageSquare,
  FileText,
  Shield,
  GitBranch,
  Users,
  ChevronDown,
  Activity,
  Calendar
} from 'lucide-react';

export function Pricing() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const pricingTiers = [
    {
      name: 'Starter',
      description: 'For small clinics or single-location practices.',
      pricing: 'Talk to us for pricing',
      features: [
        'Ava handles inbound calls and reminders for your main line.',
        'Axis intake and scheduling workflows for 1-3 providers.',
        'Optional Ava MD notes for clinicians.',
        'Owner dashboards for no-shows and utilization.'
      ],
      recommended: false
    },
    {
      name: 'Growth',
      description: 'For multi-provider or multi-location groups.',
      pricing: 'Talk to us for pricing',
      features: [
        'Ava handles inbound calls and reminders across all locations.',
        'Axis intake and scheduling workflows for 4-10 providers.',
        'Optional Ava MD notes for clinicians.',
        'Owner dashboards for no-shows and utilization.',
        'Priority support and custom workflow tuning.'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      description: 'For larger networks or custom workflows.',
      pricing: 'Talk to us for pricing',
      features: [
        'Ava and Axis for unlimited providers and locations.',
        'Custom call routing and workflows.',
        'Dedicated onboarding and account management.',
        'Advanced analytics and custom reporting.',
        'Volume pricing and flexible billing.'
      ],
      recommended: false
    }
  ];

  const everyPlanIncludes = [
    {
      icon: Users,
      title: 'Ava for admins and front desk',
      description: 'Handles calls, reminders, and intake for all staff.'
    },
    {
      icon: FileText,
      title: 'Ava MD for clinicians',
      description: 'Optional AI scribe and suggested care plans.'
    },
    {
      icon: Activity,
      title: 'Axis owner dashboards',
      description: 'No-shows, utilization, and admin minutes per visit.'
    },
    {
      icon: Shield,
      title: 'HIPAA-ready architecture',
      description: 'Audit logs, consent flows, and secure data handling.'
    },
    {
      icon: GitBranch,
      title: 'EHR integration',
      description: 'Connect via API or controlled browser agent.'
    },
    {
      icon: Phone,
      title: 'Implementation and support',
      description: 'Guided onboarding and ongoing quarterly check-ins.'
    }
  ];

  const faqs = [
    {
      question: 'Does Axis replace our EHR?',
      answer: 'No. Axis works alongside your existing EHR to manage scheduling, communications, and operational workflows. It does not handle clinical records.'
    },
    {
      question: 'Can we start in one location or with a few providers?',
      answer: 'Yes. You can start small and expand Ava and Axis as you grow. Plans are designed to scale with your clinic.'
    },
    {
      question: 'Is there an implementation fee?',
      answer: 'Implementation is included in all plans. Our team helps you set up call flows, reminders, and intake scripts during onboarding.'
    },
    {
      question: 'How are contracts and renewals handled?',
      answer: 'Plans are annual agreements with options to adjust as your clinic grows. We review usage and outcomes with you before renewal.'
    }
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* HERO */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8 font-medium">Simple pricing for real clinics.</h1>
              <p className="text-lg text-[var(--foreground-muted)] font-normal mb-10" style={{ lineHeight: '1.75' }}>
                Pick a plan based on your size today and expand Ava and Axis as you grow.
              </p>

              {/* Primary CTA */}
              <Link to="/trial">
                <motion.button
                  className="px-8 py-4 rounded-full bg-[var(--blue-primary)] text-white text-base font-medium mb-4"
                  style={{ transition: 'all 150ms ease-out' }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join the waitlist
                </motion.button>
              </Link>

              <div>
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

      {/* PLAN CARDS */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                className="relative p-8 rounded-xl bg-white border transition-all duration-150 cursor-pointer"
                style={{
                  borderColor: tier.recommended ? 'var(--blue-primary)' : 'var(--glass-border)',
                  borderWidth: tier.recommended ? '2px' : '1px',
                  boxShadow: tier.recommended ? '0 4px 16px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: flowEasing }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.4)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div 
                      className="px-4 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: 'var(--blue-primary)',
                        color: 'white'
                      }}
                    >
                      Most popular
                    </div>
                  </div>
                )}

                <h3 className="text-2xl font-medium text-[var(--foreground)] mb-2">{tier.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] font-normal mb-6" style={{ lineHeight: '1.6' }}>
                  {tier.description}
                </p>

                <div className="mb-8">
                  <p className="text-base text-[var(--foreground-muted)] font-normal">{tier.pricing}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Calendar className="text-[var(--blue-primary)] mt-0.5 flex-shrink-0" size={16} strokeWidth={2} />
                      <span className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.6' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[var(--glass-border)]">
                  <p className="text-xs text-[var(--foreground-muted)] font-normal">
                    Annual agreement, billed monthly or annually.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT EVERY PLAN INCLUDES */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Every plan includes:</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {everyPlanIncludes.map((item, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: flowEasing }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--blue-soft)] flex items-center justify-center mb-4">
                  <item.icon className="text-[var(--blue-primary)]" size={20} strokeWidth={2} />
                </div>
                <h3 className="text-base font-medium text-[var(--foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.6' }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPLEMENTATION AND SUPPORT */}
      <section className="relative py-20 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h3 className="text-xl font-medium text-[var(--foreground)] mb-8 text-center">Implementation and support.</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                'Guided onboarding with our team.',
                'Help setting up call flows, reminders, and intake scripts.',
                'Ongoing support and quarterly check-ins.'
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-6 rounded-xl bg-[var(--blue-soft)]/30 border border-[var(--blue-primary)]/20 text-center transition-all duration-150 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                  whileHover={{
                    backgroundColor: '#EAF1FF',
                    borderColor: 'rgba(37, 99, 235, 0.3)',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                  }}
                >
                  <p className="text-sm text-[var(--foreground)] font-normal" style={{ lineHeight: '1.6' }}>
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              <h2 className="mb-6 font-medium">Pricing FAQ</h2>
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
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-[var(--background-secondary)]/30 transition-colors duration-150"
                      onClick={() => setExpandedFaq(isExpanded ? null : i)}
                    >
                      <span className="text-base font-normal text-[var(--foreground)] pr-4">{faq.question}</span>
                      <ChevronDown 
                        size={20}
                        className="flex-shrink-0 transition-transform duration-200"
                        style={{
                          color: 'var(--blue-primary)',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      />
                    </button>
                    
                    <div 
                      className="overflow-hidden transition-all duration-200"
                      style={{
                        maxHeight: isExpanded ? '300px' : '0',
                        opacity: isExpanded ? 1 : 0
                      }}
                    >
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.7' }}>
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
              <h2 className="mb-6 font-medium">Ready to try Ava?</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                Talk to our team or try Ava to see how Axis works for your clinic.
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