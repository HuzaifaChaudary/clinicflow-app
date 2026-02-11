import { motion } from 'motion/react';
import { GlassPanel } from '../components/GlassPanel';
import { useState } from 'react';

export function Contact() {
  const flowEasing = [0.22, 1, 0.36, 1];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    clinicName: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    // Form data available in formData state for backend integration
  };

  return (
    <div className="min-h-screen pt-32">
      {/* Hero */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h1 className="mb-8">Try Ava Voice assistant</h1>
            <p className="text-2xl text-[var(--foreground-muted)]">
              A short walkthrough. Real clinic workflows. No sales pressure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative py-32">
        <div className="max-w-[900px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
          >
            <GlassPanel>
              <form onSubmit={handleSubmit} className="p-16">
                <div className="space-y-8">
                  <div>
                    <label className="block mb-3 text-[var(--foreground-muted)]">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] outline-none transition-all duration-300 backdrop-blur-xl"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-[var(--foreground-muted)]">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] outline-none transition-all duration-300 backdrop-blur-xl"
                      placeholder="jane@clinic.com"
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-[var(--foreground-muted)]">Clinic Name</label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full px-6 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] outline-none transition-all duration-300 backdrop-blur-xl"
                      placeholder="Your Clinic Name"
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-[var(--foreground-muted)]">
                      Tell us about your clinic
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-6 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] outline-none transition-all duration-300 backdrop-blur-xl resize-none"
                      placeholder="Number of practitioners, patient volume, current challenges..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-5 bg-[var(--accent-mint)] text-[var(--background)] rounded-full hover:bg-[var(--accent-mint)]/90 transition-all duration-300"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(94, 234, 212, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Request a demo
                  </motion.button>
                </div>
              </form>
            </GlassPanel>
          </motion.div>

          <motion.div
            className="mt-12 text-center text-[var(--foreground-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: flowEasing }}
          >
            <p>
              We typically respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}