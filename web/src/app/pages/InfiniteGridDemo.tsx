import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { TheInfiniteGrid } from '../components/ui/TheInfiniteGrid';
import { Calendar, MessageSquare, FileText, CircleCheck, ArrowRight, Phone, Clock } from 'lucide-react';
import { useState } from 'react';

export function InfiniteGridDemo() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredNotice, setHoveredNotice] = useState<number | null>(null);

  const capabilities = [
    {
      icon: Calendar,
      title: 'Scheduling',
      description: 'Patients book online. Your schedule fills without phone calls.',
    },
    {
      icon: MessageSquare,
      title: 'Confirmations',
      description: 'Voice calls confirm appointments. No shows decrease automatically.',
    },
    {
      icon: FileText,
      title: 'Intake',
      description: 'Patients complete forms before arriving. Sessions start prepared.',
    },
    {
      icon: CircleCheck,
      title: 'Workflow',
      description: 'Routine tasks handled quietly. Staff focus on care.',
    },
  ];

  const noticeSteps = [
    {
      icon: Phone,
      title: 'Phone calls drop',
      description: 'Patients book online instead of calling. Reception desk quieter within days.',
      step: 1,
    },
    {
      icon: Clock,
      title: 'No shows reduce',
      description: 'Voice confirmations reach patients automatically. Cancellations happen earlier.',
      step: 2,
    },
    {
      icon: CircleCheck,
      title: 'Sessions start prepared',
      description: 'Intake forms completed before arrival. Every appointment begins with context.',
      step: 3,
    },
  ];

  const flowSteps = [
    { label: 'Patient visits site', status: 'start' },
    { label: 'Selects time', status: 'active' },
    { label: 'Confirms via voice', status: 'active' },
    { label: 'Completes forms', status: 'active' },
    { label: 'Arrives prepared', status: 'complete' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Infinite Grid Background */}
      <TheInfiniteGrid className="min-h-screen">
        <section className="relative pt-32 pb-40">
          <div className="max-w-[1400px] mx-auto px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20">
                <span className="text-sm text-[var(--blue-vivid)]">Platform Overview</span>
              </div>
              
              <h1 className="mb-8">
                Clinic operations without the interruptions
              </h1>
              
              <p className="text-2xl text-[var(--foreground-muted)] mb-12 max-w-3xl mx-auto">
                Clinicflow handles scheduling, patient communication, and intake work. Your team focuses on care. Everything else runs quietly in the background.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Link to="/trial">
                  <motion.button
                    className="px-8 py-4 rounded-full bg-[var(--blue-primary)] text-white hover:bg-[var(--blue-vivid)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Access Free Trial
                  </motion.button>
                </Link>
                <Link to="/how-it-works">
                  <motion.button
                    className="px-8 py-4 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl hover:border-[var(--blue-primary)] hover:bg-[var(--glass-blue)] transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    See how it works
                  </motion.button>
                </Link>
              </div>

              {/* Flow Visualization - Vector Logic */}
              <motion.div
                className="mt-20 p-8 rounded-2xl bg-[var(--blue-primary)] relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: flowEasing }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }} />
                </div>

                <div className="relative">
                  <div className="text-white/80 text-sm mb-6">Patient Journey</div>
                  
                  <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
                    {flowSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-4">
                        {/* Step Node */}
                        <motion.div
                          className="flex flex-col items-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            step.status === 'complete' 
                              ? 'bg-[var(--orange-signal)]' 
                              : step.status === 'active'
                              ? 'bg-white'
                              : 'bg-white/20'
                          } border-2 ${
                            step.status === 'complete' 
                              ? 'border-[var(--orange-signal)]' 
                              : 'border-white'
                          }`}>
                            {step.status === 'complete' ? (
                              <CircleCheck className="w-5 h-5 text-white" />
                            ) : (
                              <div className={`text-sm ${step.status === 'active' ? 'text-[var(--blue-primary)]' : 'text-white'}`}>
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div className="text-white text-sm mt-3 text-center max-w-[100px]">
                            {step.label}
                          </div>
                        </motion.div>

                        {/* Connector Arrow */}
                        {index < flowSteps.length - 1 && (
                          <motion.div
                            className="flex-1 h-[2px] bg-white/30 relative min-w-[40px]"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                          >
                            <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </TheInfiniteGrid>

      {/* What Clinics Notice First - Interactive Cards with Vector Cues */}
      <section className="relative py-32 bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-3xl mx-auto mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">What clinics notice first</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Three immediate changes within the first week. No training. No workflow changes.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Step connector line */}
            <div className="absolute left-1/2 top-[280px] bottom-[100px] w-[2px] bg-[var(--blue-primary)]/20 -translate-x-1/2 hidden lg:block" />

            <div className="space-y-8">
              {noticeSteps.map((notice, index) => {
                const Icon = notice.icon;
                const isHovered = hoveredNotice === index;
                
                return (
                  <motion.div
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.6, 
                      ease: flowEasing,
                      delay: index * 0.15 
                    }}
                  >
                    {/* Step Number with Connector */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-10 hidden lg:flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isHovered 
                          ? 'bg-[var(--blue-primary)] border-4 border-[var(--blue-soft)]' 
                          : 'bg-white border-2 border-[var(--blue-primary)]'
                      }`}>
                        <span className={`text-sm transition-colors duration-300 ${
                          isHovered ? 'text-white' : 'text-[var(--blue-primary)]'
                        }`}>
                          {notice.step}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`relative p-10 rounded-2xl transition-all duration-300 cursor-pointer group ${
                        isHovered
                          ? 'bg-[var(--blue-primary)] shadow-[0_8px_24px_rgba(37,99,235,0.3)] scale-[1.02]'
                          : 'bg-[var(--background)] border border-[var(--glass-border)] hover:border-[var(--blue-primary)]/30'
                      }`}
                      onMouseEnter={() => setHoveredNotice(index)}
                      onMouseLeave={() => setHoveredNotice(null)}
                    >
                      <div className="flex items-start gap-8">
                        {/* Icon Container */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isHovered
                            ? 'bg-white/20 border-2 border-white/30'
                            : 'bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20'
                        }`}>
                          <Icon className={`w-7 h-7 transition-colors duration-300 ${
                            isHovered ? 'text-white' : 'text-[var(--blue-primary)]'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className={`mb-3 transition-colors duration-300 ${
                            isHovered ? 'text-white' : 'text-[var(--foreground)]'
                          }`}>
                            {notice.title}
                          </h3>
                          <p className={`text-lg transition-colors duration-300 ${
                            isHovered ? 'text-white/90' : 'text-[var(--foreground-muted)]'
                          }`}>
                            {notice.description}
                          </p>
                        </div>

                        {/* Active Indicator - Orange Signal */}
                        <motion.div
                          className={`flex-shrink-0 w-3 h-3 rounded-full transition-all duration-300 ${
                            isHovered ? 'bg-[var(--orange-signal)] shadow-[0_0_12px_rgba(249,115,22,0.6)]' : 'bg-transparent'
                          }`}
                          animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section - Interactive Cards */}
      <section className="relative py-32 bg-[var(--background)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-3xl mx-auto mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">Built for daily clinic operations</h2>
            <p className="text-xl text-[var(--foreground-muted)]">
              Four core systems working together. No complexity. No training required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              const isHovered = hoveredCard === index;
              
              return (
                <motion.div
                  key={capability.title}
                  className={`relative p-8 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isHovered
                      ? 'bg-[var(--blue-primary)] shadow-[0_8px_24px_rgba(37,99,235,0.3)] scale-[1.02]'
                      : 'bg-[var(--background-elevated)] border border-[var(--glass-border)] hover:border-[var(--blue-primary)]/30'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    ease: flowEasing,
                    delay: index * 0.1 
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Icon marker */}
                  <div className={`mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                    isHovered
                      ? 'bg-white/20 border-2 border-white/30'
                      : 'bg-[var(--blue-soft)] border border-[var(--blue-primary)]/20'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${
                      isHovered ? 'text-white' : 'text-[var(--blue-primary)]'
                    }`} />
                  </div>

                  <h3 className={`mb-3 transition-colors duration-300 ${
                    isHovered ? 'text-white' : 'text-[var(--foreground)]'
                  }`}>
                    {capability.title}
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    isHovered ? 'text-white/90' : 'text-[var(--foreground-muted)]'
                  }`}>
                    {capability.description}
                  </p>

                  {/* Active indicator dot - Orange */}
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-300 ${
                    isHovered ? 'bg-[var(--orange-signal)] shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-transparent'
                  }`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Proposition Section - Blue Accent Background */}
      <section className="relative py-32 bg-gradient-to-br from-[var(--blue-soft)] to-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">Your clinic runs smoother without adding staff</h2>
              <div className="space-y-6 text-lg text-[var(--foreground-muted)]">
                <p>
                  Clinicflow handles the operational work that pulls your team away from patient care.
                </p>
                <p>
                  Patients book appointments online. Voice confirmations reduce no shows. Intake forms get completed before arrival. Your schedule fills without constant phone interruptions.
                </p>
                <p>
                  The system works quietly. Your team notices less chaos. Patients experience better service.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              {/* Visual anchor - Blue background metrics panel */}
              <div className="p-10 rounded-2xl bg-[var(--blue-primary)] border border-[var(--blue-vivid)] relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }} />
                </div>

                <div className="relative space-y-8">
                  <div className="pb-6 border-b border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--orange-signal)] shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                      <div className="text-sm text-white/80">Average reduction</div>
                    </div>
                    <div className="text-4xl text-white mb-1">40% fewer calls</div>
                    <div className="text-sm text-white/70">Daily phone interruptions</div>
                  </div>
                  
                  <div className="pb-6 border-b border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--orange-signal)] shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                      <div className="text-sm text-white/80">Appointment preparation</div>
                    </div>
                    <div className="text-4xl text-white mb-1">75% complete</div>
                    <div className="text-sm text-white/70">Intake forms before arrival</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--orange-signal)] shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                      <div className="text-sm text-white/80">No show rate</div>
                    </div>
                    <div className="text-4xl text-white mb-1">Under 8%</div>
                    <div className="text-sm text-white/70">With voice confirmations</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Markers Section */}
      <section className="relative py-32 bg-[var(--background)] border-y border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <div className="group">
                <div className="text-4xl mb-3 text-[var(--blue-primary)] group-hover:text-[var(--blue-vivid)] transition-colors">HIPAA</div>
                <div className="text-[var(--foreground-muted)]">Compliant infrastructure</div>
              </div>
              <div className="group">
                <div className="text-4xl mb-3 text-[var(--blue-primary)] group-hover:text-[var(--blue-vivid)] transition-colors">10 min</div>
                <div className="text-[var(--foreground-muted)]">Average setup time</div>
              </div>
              <div className="group">
                <div className="text-4xl mb-3 text-[var(--blue-primary)] group-hover:text-[var(--blue-vivid)] transition-colors">No training</div>
                <div className="text-[var(--foreground-muted)]">Works immediately</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-40 bg-[var(--background-secondary)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-6">See how it works in your clinic</h2>
            <p className="text-xl text-[var(--foreground-muted)] mb-12">
              Try Clinicflow free for 14 days. No credit card. Full system access.
            </p>
            
            <Link to="/trial">
              <motion.button
                className="px-10 py-5 rounded-full bg-[var(--blue-primary)] text-white hover:bg-[var(--blue-vivid)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Start free trial
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}