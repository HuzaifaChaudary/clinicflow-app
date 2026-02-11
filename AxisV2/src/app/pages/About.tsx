import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Users,
  FileText,
  BarChart3,
  Shield,
  UserCheck,
  ClipboardCheck,
  Lock
} from 'lucide-react';

export function About() {
  const flowEasing = [0.22, 1, 0.36, 1];

  const beliefs = [
    'Clinics run on phone calls, forms, and follow ups that are still mostly manual.',
    'Staff and clinicians are stretched thin with work that does not require their license.',
    'AI can take on this operational work while keeping humans in control.'
  ];

  const whatWeDoToday = [
    {
      icon: Users,
      title: 'For admins and front desk',
      description: 'Ava handles calls, reminders, and intake workflows.'
    },
    {
      icon: FileText,
      title: 'For clinicians',
      description: 'Ava MD drafts notes and suggests care plans, always reviewed and signed by clinicians.'
    },
    {
      icon: BarChart3,
      title: 'For owners and practice leaders',
      description: 'Dashboards track no-shows, utilization, and admin minutes per visit.'
    }
  ];

  const principles = [
    {
      icon: UserCheck,
      title: 'Patients and staff stay in control',
      description: 'Ava escalates to humans and never makes clinical decisions alone.'
    },
    {
      icon: ClipboardCheck,
      title: 'Clinicians sign every note',
      description: 'Ava MD drafts, clinicians edit and sign.'
    },
    {
      icon: Lock,
      title: 'Safety and compliance first',
      description: 'HIPAA-ready, audit logs for calls, texts, and notes.'
    },
    {
      icon: Shield,
      title: 'Start small, prove value, then expand',
      description: 'Begin with a few lines or providers and measure the impact.'
    }
  ];

  const team = [
    {
      name: 'Alex Chen',
      role: 'Co-Founder & CEO',
      background: 'Previously product at Epic, engineering at Google Health.'
    },
    {
      name: 'Sarah Martinez',
      role: 'Co-Founder & CTO',
      background: 'Previously engineering lead at Athenahealth, ML at OpenAI.'
    },
    {
      name: 'Dr. Michael Park',
      role: 'Head of Clinical Product',
      background: 'Primary care physician, previously at One Medical.'
    },
    {
      name: 'Jessica Liu',
      role: 'Head of Operations',
      background: 'Previously operations at Carbon Health, strategy at McKinsey.'
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
              <h1 className="mb-8 font-medium">We are building the operating system for clinic work.</h1>
              <p className="text-lg text-[var(--foreground-muted)] font-normal mb-4" style={{ lineHeight: '1.75' }}>
                Axis and Ava help real clinics handle calls, intake, follow ups, and documentation so staff and clinicians can focus on care.
              </p>
              <p className="text-sm text-[var(--foreground-muted)] font-normal mb-10">
                Based in San Francisco, working with clinics across the United States.
              </p>

              {/* Primary CTA */}
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
          </div>
        </div>
      </section>

      {/* MISSION AND BELIEF */}
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
              <h2 className="mb-8 font-medium">Why we are building Axis.</h2>
              <div className="space-y-6">
                {beliefs.map((belief, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: flowEasing }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--blue-primary)] mt-2.5 flex-shrink-0" />
                    <p className="text-lg text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.75' }}>
                      {belief}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT AXIS AND AVA DO TODAY */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">What Axis and Ava do for clinics today.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whatWeDoToday.map((item, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: flowEasing }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--blue-soft)] flex items-center justify-center mb-6">
                  <item.icon className="text-[var(--blue-primary)]" size={24} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.7' }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">How we think about AI in clinics.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm transition-all duration-150 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: flowEasing }}
                whileHover={{
                  backgroundColor: '#EAF1FF',
                  borderColor: 'rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--blue-soft)] flex items-center justify-center flex-shrink-0">
                    <principle.icon className="text-[var(--blue-primary)]" size={20} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-[var(--foreground)] mb-2">{principle.title}</h3>
                    <p className="text-sm text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.7' }}>
                      {principle.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]/40">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6 font-medium">Who is behind Axis.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-white border border-[var(--glass-border)] shadow-sm text-center transition-all duration-150 cursor-pointer"
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
                {/* Placeholder for photo - clean circle */}
                <div className="w-20 h-20 rounded-full bg-[var(--blue-soft)] mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-[var(--blue-primary)]" size={32} strokeWidth={2} />
                </div>
                <h3 className="text-base font-medium text-[var(--foreground)] mb-1">{member.name}</h3>
                <p className="text-sm text-[var(--blue-primary)] font-normal mb-3">{member.role}</p>
                <p className="text-xs text-[var(--foreground-muted)] font-normal" style={{ lineHeight: '1.6' }}>
                  {member.background}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BACKING / CREDIBILITY */}
      <section className="relative py-20 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">Backed by people who know clinics and AI.</h3>
            <p className="text-sm text-[var(--foreground-muted)] font-normal">
              Supported by investors and advisors from Y Combinator, a16z Bio + Health, and leading healthcare operators.
            </p>
          </motion.div>
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
              <h2 className="mb-6 font-medium">See if Axis is a fit for your clinic.</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                We start with a handful of lines or providers and help you measure the impact before expanding.
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
