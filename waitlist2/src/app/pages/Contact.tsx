import { motion } from 'motion/react';
import { GlassPanel } from '../components/GlassPanel';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ArrowRight, Gift, Sparkles } from 'lucide-react';

// Get Calendly URL from environment variable
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || '';

export function Contact() {
  const flowEasing = [0.22, 1, 0.36, 1];
  const [showCalendly, setShowCalendly] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    clinicName: '',
    role: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load Calendly widget script
  useEffect(() => {
    if (showCalendly && CALENDLY_URL) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showCalendly]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please check your connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCalendly = () => {
    if (CALENDLY_URL) {
      window.open(CALENDLY_URL, '_blank');
    } else {
      setShowCalendly(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-[800px] mx-auto px-8">
          <motion.div
            className="text-center py-32"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <div className="mb-8 text-6xl">✅</div>
            <h1 className="mb-6">Thanks for reaching out!</h1>
            <p className="text-xl text-[var(--foreground-muted)] mb-4">
              We'll get back to you at <span className="text-[#2563EB] font-medium">{formData.email}</span> within 24 hours.
            </p>
            <p className="text-sm text-[var(--foreground-muted)] mt-8">
              Want to schedule a call right away?
            </p>
            <div className="mt-6">
              <motion.button
                onClick={openCalendly}
                className="px-8 py-4 rounded-full text-white inline-flex items-center gap-2"
                style={{ backgroundColor: '#2563EB' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar size={18} />
                Schedule a Call
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32">
      {/* Reward Banner */}
      <section className="relative pt-8 pb-4">
        <div className="max-w-[1200px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: flowEasing }}
            className="relative overflow-hidden rounded-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)',
              padding: '2px'
            }}
          >
            <div 
              className="relative rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Gift size={28} className="text-yellow-400" />
                </motion.div>
                <Sparkles size={20} className="text-pink-400" />
              </div>
              
              <div className="text-center md:text-left">
                <p className="text-white font-semibold text-lg md:text-xl">
                  🎉 Book a 30-minute call → Get <span className="text-yellow-400">3 months FREE</span>
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Because good things come to those who chat. No strings, just vibes and free software. ✨
                </p>
              </div>
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="hidden md:block"
              >
                <Sparkles size={20} className="text-cyan-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative py-12">
        <div className="max-w-[1400px] mx-auto px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h1 className="mb-8">Talk to our team</h1>
            <p className="text-2xl text-[var(--foreground-muted)]">
              Schedule a demo or send us a message. No sales pressure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="relative py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Schedule a Call */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.1 }}
            >
              <GlassPanel>
                <div className="p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#EAF1FF' }}
                    >
                      <Video size={24} style={{ color: '#2563EB' }} />
                    </div>
                    <h2 className="text-2xl">Schedule a Demo</h2>
                  </div>
                  
                  <p className="text-[var(--foreground-muted)] mb-8">
                    Book a 30-minute call with our team. We'll walk you through Axis and answer any questions.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-[var(--foreground-muted)]">
                      <Clock size={18} style={{ color: '#2563EB' }} />
                      <span>30 minutes</span>
                    </div>
                    <div className="flex items-center gap-3 text-[var(--foreground-muted)]">
                      <Video size={18} style={{ color: '#2563EB' }} />
                      <span>Video call via Google Meet or Zoom</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={openCalendly}
                    className="w-full py-5 rounded-full text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#2563EB' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Calendar size={20} />
                    Book a Time
                    <ArrowRight size={18} />
                  </motion.button>

                  {!CALENDLY_URL && (
                    <p className="text-sm text-center text-[var(--foreground-muted)] mt-4">
                      Calendly integration coming soon. Please use the contact form.
                    </p>
                  )}
                </div>
              </GlassPanel>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
            >
              <GlassPanel>
                <form onSubmit={handleSubmit} className="p-12">
                  <h2 className="text-2xl mb-6">Send us a message</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Your Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl focus:border-[#2563EB] outline-none transition-all duration-300"
                          placeholder="Jane Smith"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Clinic Name *</label>
                        <input
                          type="text"
                          value={formData.clinicName}
                          onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl focus:border-[#2563EB] outline-none transition-all duration-300"
                          placeholder="Your Clinic"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Work Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl focus:border-[#2563EB] outline-none transition-all duration-300"
                        placeholder="jane@clinic.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Your Role *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl focus:border-[#2563EB] outline-none transition-all duration-300"
                        required
                      >
                        <option value="">Select your role</option>
                        <option value="owner">Clinic Owner</option>
                        <option value="admin">Administrative Assistant</option>
                        <option value="practice-manager">Practice Manager</option>
                        <option value="operations-manager">Operations Manager</option>
                        <option value="cto">CTO / IT Director</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl focus:border-[#2563EB] outline-none transition-all duration-300 resize-none"
                        placeholder="Tell us about your clinic and what you're looking for..."
                      />
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center text-sm">
                        {submitError}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full text-white transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: '#2563EB' }}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </div>
                </form>
              </GlassPanel>
            </motion.div>
          </div>

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