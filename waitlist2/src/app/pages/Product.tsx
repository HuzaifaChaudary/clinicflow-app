import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SystemCapabilityStack } from '../components/SystemCapabilityStack';
import { ClinicDayFlow } from '../components/ClinicDayFlow';

export function Product() {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="min-h-screen pt-32">
      {/* Hero with Scroll-Activated Visualization */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start relative">
            {/* Left: Scroll-Activated Clinic Day Flow */}
            <div className="relative">
              <ClinicDayFlow />
            </div>

            {/* Right: Hero Content */}
            <motion.div
              className="lg:pt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h1 className="mb-8">Run your clinic without constant interruptions</h1>
              <p className="text-2xl text-[var(--foreground-muted)] mb-12">
                Axis handles the operational work that pulls your team away from care. Workflows execute with clear ownership. Work gets done without chasing or interruptions.
              </p>
              
              <div className="flex items-center gap-4">
                <Link to="/trial">
                  <motion.button
                    className="px-8 py-4 rounded-full bg-[var(--accent-mint)] text-[var(--background)] hover:bg-[var(--accent-mint)]/90 transition-all duration-300"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(94, 234, 212, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Join Waitlist
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">How the day actually runs</h2>
              <p className="text-xl text-[var(--foreground-muted)] max-w-3xl">
                Every clinic day follows the same pattern. Appointments. Patients. Paperwork. Follow ups. Axis supports each step with clear execution and visibility.
              </p>
            </motion.div>
          </div>

          <SystemCapabilityStack />
        </div>
      </section>

      {/* What clinics notice first */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h2 className="mb-20">What clinics notice first</h2>
          </motion.div>

          <div className="space-y-32">
            {/* Scheduling */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing }}
              >
                <h3 className="mb-6">Scheduling</h3>
                <p className="text-xl text-[var(--foreground-muted)]">
                  Appointments stay organized with full system visibility. Availability stays accurate. Changes are handled with clear ownership.
                </p>
              </motion.div>

              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              >
                <div 
                  className="p-10 rounded-2xl bg-white border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EAF1FF';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30, 64, 175, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  style={{
                    transition: 'all 200ms ease-out'
                  }}
                >
                  <div className="text-sm text-[var(--foreground-muted)] mb-8">
                    One shared calendar. Patients book online. Admins can override anything.
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Patient Communication */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <motion.div
                className="lg:col-span-3 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing }}
              >
                <div 
                  className="p-10 rounded-2xl bg-white border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EAF1FF';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30, 64, 175, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  style={{
                    transition: 'all 200ms ease-out'
                  }}
                >
                  <div className="text-sm mb-4 text-[var(--accent-mint)]">Example confirmation call</div>
                  <p className="text-lg italic text-[var(--foreground-muted)] mb-8">
                    "Hi, this is Axis calling to confirm your appointment with Dr. Smith tomorrow at 2 PM. Press 1 to confirm, or press 2 to reschedule."
                  </p>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    Clear. Professional. Patients respond.
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="lg:col-span-2 lg:order-2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              >
                <h3 className="mb-6">Patient Communication</h3>
                <p className="text-xl text-[var(--foreground-muted)]">
                  Patients are contacted at the right time with clear follow through. Confirmations and reminders execute automatically with full tracking.
                </p>
              </motion.div>
            </div>

            {/* Intake & Summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing }}
              >
                <h3 className="mb-6">Intake and Summaries</h3>
                <p className="text-xl text-[var(--foreground-muted)]">
                  Information is collected before the visit with clear tracking. Doctors walk in prepared with full context.
                </p>
              </motion.div>

              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              >
                <div 
                  className="p-10 rounded-2xl bg-white border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EAF1FF';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0px 8px 24px rgba(30, 64, 175, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  style={{
                    transition: 'all 200ms ease-out'
                  }}
                >
                  <div className="text-sm mb-4 text-[var(--foreground-muted)]">Pre session summary</div>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-[var(--foreground-muted)]">Patient:</span> Sarah Chen, 34</p>
                    <p><span className="text-[var(--foreground-muted)]">Visit type:</span> Follow up consultation, 45 min</p>
                    <p><span className="text-[var(--foreground-muted)]">Context:</span> Persistent lower back pain for 3 weeks</p>
                    <p><span className="text-[var(--foreground-muted)]">Documents:</span> All forms completed</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Admin Automation */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <motion.div
                className="lg:col-span-3 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing }}
              >
                {/* System Status List */}
                <div className="relative py-8 px-10 rounded-2xl" style={{ backgroundColor: '#F7FAFF' }}>
                  {/* Vertical connector line */}
                  <div 
                    className="absolute left-[3.25rem] top-12 bottom-12 w-px" 
                    style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)' }}
                  />
                  
                  <div className="space-y-0">
                    {[
                      { task: 'Appointment confirmations', status: 'Automated', type: 'automated' },
                      { task: 'Reminder scheduling', status: 'Automated', type: 'automated' },
                      { task: 'Follow-up tracking', status: 'Automated', type: 'automated' },
                      { task: 'Staff intervention', status: 'Only when needed', type: 'manual' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="relative flex items-center justify-between py-6 transition-all duration-200"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.06, ease: flowEasing }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#EAF1FF';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.borderRadius = '12px';
                          e.currentTarget.style.paddingLeft = '16px';
                          e.currentTarget.style.paddingRight = '16px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.paddingLeft = '0';
                          e.currentTarget.style.paddingRight = '0';
                        }}
                        style={{
                          transition: 'all 180ms ease-out',
                          borderBottom: i < 3 ? '1px solid rgba(15, 23, 42, 0.06)' : 'none'
                        }}
                      >
                        {/* System Indicator Dot */}
                        <div className="flex items-center gap-4 flex-1">
                          <div 
                            className="w-[10px] h-[10px] rounded-full flex-shrink-0 relative z-10"
                            style={{
                              backgroundColor: item.type === 'automated' ? '#2563EB' : 'transparent',
                              border: item.type === 'manual' ? '2px solid #2563EB' : 'none'
                            }}
                          />
                          <span className="text-base">{item.task}</span>
                        </div>

                        {/* Status Pill */}
                        <div 
                          className="px-4 py-1.5 rounded-lg text-sm font-medium"
                          style={{
                            backgroundColor: item.type === 'automated' ? '#EAF1FF' : 'transparent',
                            border: item.type === 'manual' ? '1px solid rgba(37, 99, 235, 0.35)' : 'none',
                            color: '#1D4ED8'
                          }}
                        >
                          {item.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="lg:col-span-2 lg:order-2 relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              >
                {/* Subtle background pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #2563EB 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />
                
                <div className="relative" style={{ lineHeight: '1.7' }}>
                  <h3 className="mb-6">Admin Automation</h3>
                  <p className="text-xl text-[var(--foreground-muted)]">
                    Routine workflows execute quietly with clear ownership. Staff only step in when specific attention is needed.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning Statement */}
      <section className="relative py-32 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-8">Not another marketplace. Not another EHR.</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-16">
                Axis does not replace your systems. It provides an execution and operations layer that works alongside what you already use.
              </p>

              {/* Visual Comparison Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {/* Marketplace Tools */}
                <motion.div
                  className="p-8 rounded-2xl text-center"
                  style={{ backgroundColor: '#F5F9FF' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1, ease: flowEasing }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(148, 163, 184, 0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 22V12H15V22" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="mb-2" style={{ color: '#64748B' }}>Marketplace tools</div>
                  <div className="text-sm" style={{ color: '#94A3B8' }}>
                    Adds another system. More logins. More complexity.
                  </div>
                </motion.div>

                {/* Traditional EHR */}
                <motion.div
                  className="p-8 rounded-2xl text-center"
                  style={{ backgroundColor: '#F5F9FF' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: flowEasing }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(148, 163, 184, 0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#94A3B8" strokeWidth="2"/>
                      <path d="M3 9H21" stroke="#94A3B8" strokeWidth="2"/>
                      <path d="M9 21V9" stroke="#94A3B8" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="mb-2" style={{ color: '#64748B' }}>Traditional EHR</div>
                  <div className="text-sm" style={{ color: '#94A3B8' }}>
                    Heavy and rigid. Forces clinics to change how they work.
                  </div>
                </motion.div>

                {/* Axis */}
                <motion.div
                  className="p-8 rounded-2xl text-center transition-all duration-200 cursor-default"
                  style={{ backgroundColor: '#F5F9FF' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, ease: flowEasing }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EAF1FF';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F9FF';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2563EB" strokeWidth="2"/>
                      <path d="M12 16V12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 8H12.01" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="mb-2" style={{ color: '#2563EB' }}>Axis</div>
                  <div className="text-sm" style={{ color: '#64748B' }}>
                    Execution and operations layer. Works alongside what you already use.
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6">See Axis in action</h2>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                A short walkthrough. Real clinic workflows.
              </p>

              {/* CTA Block */}
              <div className="max-w-[720px] mx-auto p-10 rounded-3xl" style={{ backgroundColor: '#EAF1FF' }}>
                <p className="text-sm mb-8" style={{ color: '#64748B' }}>
                  No sales pressure. Real workflows. Your questions answered.
                </p>

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

                <Link 
                  to="/how-it-works"
                  className="text-sm transition-all duration-200 inline-block"
                  style={{ color: '#2563EB' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Or explore how it works
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}