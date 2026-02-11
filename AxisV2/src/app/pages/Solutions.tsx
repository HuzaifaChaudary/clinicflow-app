import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Calendar,
  MessageCircle,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Repeat,
  Activity,
  FileText
} from 'lucide-react';
import { 
  ClinicTypeSelector, 
  AnimatedClinicContent,
  AnimatedText,
  AnimatedVisual,
  AnimatedIcon,
  type ClinicType 
} from '../components/ClinicTypeSelector';

export function Solutions() {
  const [selectedClinic, setSelectedClinic] = useState<ClinicType>('mental-health');
  const flowEasing = [0.22, 1, 0.36, 1];

  // Clinic-specific content
  const clinicContent = {
    'mental-health': {
      headline: 'Built for mental health clinics where timing and tone matter',
      subtext: 'Appointment workflows execute quietly in the background with clear ownership so staff can focus on care without chasing responses.',
      primaryCTA: 'See how it works for mental health',
      icon: MessageCircle,
      accentColor: '#2563EB',
      struggles: [
        'Missed appointments disrupt care continuity',
        'Patients forget sessions or avoid responding',
        'Front desk spends time following up instead of supporting care',
        'Intake forms arrive incomplete or too late'
      ],
      benefits: [
        'Fewer no shows',
        'Less follow up work',
        'More consistent patient responses',
        'Staff time reclaimed'
      ]
    },
    'physiotherapy': {
      headline: 'Built for physiotherapy clinics that run on consistency',
      subtext: 'Recurring sessions, reminders, and follow ups execute on track automatically with full visibility so therapists focus on recovery.',
      primaryCTA: 'See how it works for physiotherapy',
      icon: Repeat,
      accentColor: '#2563EB',
      struggles: [
        'Patients forget follow up visits',
        'Long treatment plans break due to missed sessions',
        'Staff manually rebook recurring appointments',
        'Schedule gaps appear late and waste therapist time'
      ],
      benefits: [
        'Fewer cancelled sessions',
        'More completed treatment plans',
        'Less manual rescheduling',
        'Better therapist utilization'
      ]
    },
    'dental': {
      headline: 'Built for dental clinics that run on full chairs',
      subtext: 'Confirmations, reminders, and follow ups execute automatically with clear tracking so chair time stays protected and schedules stay tight.',
      primaryCTA: 'See how it works for dental clinics',
      icon: Calendar,
      accentColor: '#2563EB',
      struggles: [
        'Last minute no shows',
        'Patients forget hygiene or follow up visits',
        'Treatment plans stall after the first visit',
        'Front desk spends the day calling confirmations'
      ],
      benefits: [
        'Fewer empty chairs',
        'Higher confirmation rates',
        'Better hygiene recall compliance',
        'Less manual calling'
      ]
    },
    'outpatient': {
      headline: 'Built for clinics that never stop moving',
      subtext: 'Axis keeps outpatient schedules flowing with clear execution. Confirmations, reminders, and intake happen automatically so staff can focus on patients.',
      primaryCTA: 'See how it works for outpatient clinics',
      icon: Activity,
      accentColor: '#2563EB',
      struggles: [
        'Mixed visit lengths cause schedule drift',
        'Walk ins disrupt planned appointments',
        'Missed confirmations create idle staff time',
        'Front desk handles constant status checks'
      ],
      benefits: [
        'Fewer stalled schedules',
        'Faster patient turnover',
        'Reduced front desk interruptions',
        'More predictable daily flow'
      ]
    }
  };

  const content = clinicContent[selectedClinic];
  const IconComponent = content.icon;

  return (
    <div className="min-h-screen pt-32">
      {/* HERO */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8">Solutions for every clinic type</h1>
              <p className="text-2xl text-[var(--foreground-muted)]">
                Choose your clinic type to see how Axis fits your workflow
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CLINIC TYPE SELECTOR */}
      <ClinicTypeSelector 
        selected={selectedClinic} 
        onChange={setSelectedClinic}
      />

      {/* DYNAMIC CONTENT SECTION */}
      <AnimatedClinicContent clinicType={selectedClinic}>
        <section className="relative py-32 border-t border-[var(--glass-border)]">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div>
                <AnimatedText clinicType={selectedClinic} as="h2">
                  <h2 className="mb-8">{content.headline}</h2>
                </AnimatedText>
                
                <AnimatedText clinicType={selectedClinic} as="p">
                  <p className="text-xl text-[var(--foreground-muted)] mb-12">
                    {content.subtext}
                  </p>
                </AnimatedText>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/solutions/${selectedClinic}`}>
                    <motion.button
                      className="px-8 py-4 rounded-full text-lg"
                      style={{ 
                        backgroundColor: content.accentColor,
                        color: 'white',
                        transition: 'all 200ms ease-out'
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1E4ED8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = content.accentColor;
                      }}
                    >
                      {content.primaryCTA}
                    </motion.button>
                  </Link>

                  <Link to="/trial">
                    <motion.button
                      className="px-8 py-4 rounded-full text-lg border-2"
                      style={{ 
                        backgroundColor: 'transparent',
                        borderColor: content.accentColor,
                        color: content.accentColor,
                        transition: 'all 200ms ease-out'
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = content.accentColor;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = content.accentColor;
                      }}
                    >
                      Start free trial
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Right: Icon Visual */}
              <AnimatedVisual clinicType={selectedClinic}>
                <div 
                  className="p-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <AnimatedIcon clinicType={selectedClinic}>
                    <div 
                      className="w-32 h-32 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: content.accentColor }}
                    >
                      <IconComponent size={64} style={{ color: 'white' }} />
                    </div>
                  </AnimatedIcon>
                </div>
              </AnimatedVisual>
            </div>
          </div>
        </section>

        {/* STRUGGLES SECTION */}
        <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
          <div className="max-w-[1400px] mx-auto px-8">
            <AnimatedText clinicType={selectedClinic} as="h2">
              <h2 className="mb-16">What {selectedClinic.replace('-', ' ')} clinics deal with</h2>
            </AnimatedText>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              {content.struggles.map((struggle, i) => (
                <motion.div
                  key={`${selectedClinic}-${i}`}
                  className="p-8 rounded-2xl bg-white"
                  style={{ border: '1px solid var(--glass-border)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: flowEasing }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: content.accentColor }}
                    />
                    <p className="text-lg">{struggle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW AXIS HELPS */}
        <section className="relative py-32 border-t border-[var(--glass-border)]">
          <div className="max-w-[1400px] mx-auto px-8">
            <AnimatedText clinicType={selectedClinic} as="h2">
              <h2 className="mb-16">How Axis helps</h2>
            </AnimatedText>

            <div className="max-w-4xl mx-auto">
              <AnimatedVisual clinicType={selectedClinic} className="p-10 rounded-2xl bg-white">
                <div className="space-y-6">
                  {/* Workflow visualization */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {[
                      { label: 'Configure', detail: 'Set rules once' },
                      { label: 'Execute', detail: 'System runs automatically' },
                      { label: 'Monitor', detail: 'Clear visibility' },
                      { label: 'Step in', detail: 'Exceptions only' }
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-4 flex-1">
                        <motion.div
                          className="p-6 rounded-xl w-full"
                          style={{
                            backgroundColor: '#EFF6FF',
                            border: `1px solid ${content.accentColor}`
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1, ease: flowEasing }}
                        >
                          <div className="text-center">
                            <div className="mb-2" style={{ color: content.accentColor }}>
                              {step.label}
                            </div>
                            <div className="text-sm text-[var(--foreground-muted)]">
                              {step.detail}
                            </div>
                          </div>
                        </motion.div>
                        {i < 3 && (
                          <ArrowRight 
                            className="hidden md:block flex-shrink-0" 
                            size={20} 
                            style={{ color: content.accentColor }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedVisual>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="relative py-32 border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
          <div className="max-w-[1400px] mx-auto px-8">
            <AnimatedText clinicType={selectedClinic} as="h2">
              <h2 className="mb-16">What changes in the first weeks</h2>
            </AnimatedText>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {content.benefits.map((benefit, i) => (
                <motion.div
                  key={`${selectedClinic}-benefit-${i}`}
                  className="p-6 rounded-xl bg-white flex items-center gap-4"
                  style={{ border: '1px solid var(--glass-border)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: flowEasing }}
                >
                  <CheckCircle size={24} style={{ color: '#10B981' }} />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPLORE FULL PAGE CTA */}
        <section className="relative py-32 border-t border-[var(--glass-border)]">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="max-w-3xl mx-auto text-center">
              <AnimatedText clinicType={selectedClinic} as="h2">
                <h2 className="mb-6">See the full picture</h2>
              </AnimatedText>
              
              <AnimatedText clinicType={selectedClinic} as="p">
                <p className="text-xl text-[var(--foreground-muted)] mb-12">
                  Explore detailed workflows, visualizations, and outcomes specific to {selectedClinic.replace('-', ' ')} clinics.
                </p>
              </AnimatedText>

              <Link to={`/solutions/${selectedClinic}`}>
                <motion.button
                  className="px-10 py-5 rounded-full text-lg"
                  style={{ 
                    backgroundColor: content.accentColor,
                    color: 'white',
                    transition: 'all 200ms ease-out'
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E4ED8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = content.accentColor;
                  }}
                >
                  View full {selectedClinic.replace('-', ' ')} page
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedClinicContent>
    </div>
  );
}