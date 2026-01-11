import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Trial() {
  const flowEasing = [0.22, 1, 0.36, 1];
  
  const [formData, setFormData] = useState({
    clinicType: '',
    otherClinicType: '',
    clinicSize: '',
    painPoints: [] as string[],
    currentSetup: '',
    impactLevel: '',
    willingnessToPay: '',
    priceRange: '',
    solutionWins: [] as string[],
    otherWish: '',
    role: '',
    fullName: '',
    clinicName: '',
    email: '',
    phone: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clinicTypes = [
    { value: 'primary-care', label: 'Primary care', icon: '⚕️' },
    { value: 'specialty', label: 'Specialty clinic', icon: '🏥' },
    { value: 'dental', label: 'Dental', icon: '🦷' },
    { value: 'physical-therapy', label: 'Physical therapy', icon: '💪' },
    { value: 'mental-health', label: 'Mental health', icon: '🧠' },
    { value: 'other', label: 'Other', icon: '📋' },
  ];

  const clinicSizes = [
    { value: 'solo', label: 'Solo provider' },
    { value: '2-5', label: '2 to 5' },
    { value: '6-10', label: '6 to 10' },
    { value: '10plus', label: '10+' },
  ];

  const painPoints = [
    { value: 'no-shows', label: 'No-shows or last-minute cancellations' },
    { value: 'phone-calls', label: 'Too many phone calls' },
    { value: 'manual-scheduling', label: 'Manual scheduling or rescheduling' },
    { value: 'intake-forms', label: 'Chasing intake forms' },
    { value: 'admin-burnout', label: 'Admin burnout' },
    { value: 'doctor-admin', label: 'Doctors spending time on admin work' },
    { value: 'follow-ups', label: 'Follow-ups slipping through the cracks' },
  ];

  const currentSetups = [
    { value: 'front-desk', label: 'Front desk + phone calls' },
    { value: 'simple-tool', label: 'Simple scheduling tool' },
    { value: 'ehr', label: 'EHR scheduling' },
    { value: 'mix', label: 'Mix of tools' },
    { value: 'messy', label: 'Not sure / messy setup' },
  ];

  const impactLevels = [
    { value: 'not-big', label: 'Not a big issue' },
    { value: 'somewhat', label: 'Somewhat painful' },
    { value: 'frustrating', label: 'Actively frustrating' },
    { value: 'hurting', label: 'Hurting revenue or staff morale' },
  ];

  const willingnessOptions = [
    { value: 'yes', label: 'Yes, definitely' },
    { value: 'possibly', label: 'Possibly, depending on price' },
    { value: 'not-now', label: 'Not right now' },
    { value: 'exploring', label: 'Just exploring' },
  ];

  const solutionWins = [
    { value: 'fewer-no-shows', label: 'Fewer no-shows' },
    { value: 'less-admin', label: 'Less admin work for staff' },
    { value: 'prepared-visits', label: 'Doctors starting visits more prepared' },
    { value: 'better-followups', label: 'Better follow-ups' },
    { value: 'fewer-missed-calls', label: 'Fewer missed calls' },
    { value: 'visibility', label: 'Clear visibility into clinic performance' },
  ];

  const togglePainPoint = (value: string) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(value)
        ? prev.painPoints.filter(p => p !== value)
        : [...prev.painPoints, value]
    }));
  };

  const toggleSolutionWin = (value: string) => {
    setFormData(prev => ({
      ...prev,
      solutionWins: prev.solutionWins.includes(value)
        ? prev.solutionWins.filter(w => w !== value)
        : [...prev.solutionWins, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('http://localhost:8001/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit. Please try again.');
      }
      
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showPriceRange = formData.willingnessToPay === 'yes' || formData.willingnessToPay === 'possibly';

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
            <div className="mb-8 text-6xl">🎉</div>
            <h1 className="mb-6">Thanks for joining the waitlist!</h1>
            <p className="text-xl text-[var(--foreground-muted)] mb-4">
              We'll reach out to you soon at <span className="text-[var(--accent-mint)] font-medium">{formData.email}</span> with product updates and early access details.
            </p>
            <p className="text-sm text-[var(--foreground-muted)] mt-8">
              You're now in line for 3 months free access when we launch!
            </p>
            <div className="mt-12">
              <Link to="/">
                <motion.button
                  className="px-8 py-4 rounded-full border-2 border-[var(--glass-border)] hover:border-[var(--accent-mint)] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to home
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: flowEasing }}
        >
          <h1 className="mb-6">Join the AXIS waitlist</h1>
          <p className="text-xl text-[var(--foreground-muted)]">
            We're onboarding clinics in small, intentional batches.<br />
            Tell us a bit about your clinic so we can see if AXIS is a good fit.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: flowEasing }}
        >
          {/* Section 1: Clinic Type */}
          <div>
            <label className="block mb-3 text-lg">
              What kind of clinic do you run? <span className="text-[var(--accent-mint)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              This helps us understand your day-to-day workflow.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {clinicTypes.map((type, index) => (
                <motion.button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, clinicType: type.value })}
                  className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                    formData.clinicType === type.value
                      ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--accent-mint)]/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05, ease: flowEasing }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-3xl mb-3 opacity-40">{type.icon}</div>
                  <div className="text-sm">{type.label}</div>
                </motion.button>
              ))}
            </div>

            {/* Other Clinic Type Input */}
            {formData.clinicType === 'other' && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, ease: flowEasing }}
              >
                <input
                  type="text"
                  value={formData.otherClinicType}
                  onChange={(e) => setFormData({ ...formData, otherClinicType: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                  placeholder="Please specify your clinic type *"
                  required
                />
              </motion.div>
            )}
          </div>

          {/* Section 2: Clinic Size */}
          <div>
            <label className="block mb-3 text-lg">
              How many providers work at your clinic? <span className="text-[var(--accent-mint)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              We use this to understand scheduling complexity and admin load.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {clinicSizes.map((size, index) => (
                <motion.button
                  key={size.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, clinicSize: size.value })}
                  className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                    formData.clinicSize === size.value
                      ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--accent-mint)]/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.05, ease: flowEasing }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-sm">{size.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Section 3: Pain Points */}
          <div>
            <label className="block mb-3 text-lg">
              Where does your team lose the most time today? <span className="text-[var(--accent-mint)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              Select all that apply. There's no right or wrong answer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {painPoints.map((point, index) => (
                <motion.button
                  key={point.value}
                  type="button"
                  onClick={() => togglePainPoint(point.value)}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.painPoints.includes(point.value)
                      ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--accent-mint)]/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.05, ease: flowEasing }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="text-sm">{point.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Section 4: Current Setup */}
          <div>
            <label className="block mb-3 text-lg">
              How are you handling scheduling right now? <span className="text-[var(--accent-mint)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              Just a quick snapshot.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSetups.map((setup, index) => (
                <motion.button
                  key={setup.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, currentSetup: setup.value })}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.currentSetup === setup.value
                      ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--accent-mint)]/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 + index * 0.05, ease: flowEasing }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="text-sm">{setup.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Section 5: Impact & Urgency */}
          <div>
            <label className="block mb-3 text-lg">
              How big of a problem is this for your clinic today? <span className="text-[var(--accent-mint)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              This helps us understand urgency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactLevels.map((level, index) => (
                <motion.button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, impactLevel: level.value })}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.impactLevel === level.value
                      ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--accent-mint)]/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.05, ease: flowEasing }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="text-sm">{level.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Section 6: Willingness to Pay */}
          <div>
            <label className="block mb-3 text-lg">
              If AXIS solved these problems reliably, would you be open to paying for it? <span className="text-[var(--accent-mint)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              Honest answers help us build the right product.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {willingnessOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, willingnessToPay: option.value })}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.willingnessToPay === option.value
                      ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--accent-mint)]/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.05, ease: flowEasing }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="text-sm">{option.label}</div>
                </motion.button>
              ))}
            </div>

            {/* Price Range (Conditional) */}
            {showPriceRange && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, ease: flowEasing }}
              >
                <label className="block mb-3 text-lg">
                  What monthly price range would feel reasonable for your clinic? <span className="text-[var(--foreground-muted)] text-sm font-normal">(Optional)</span>
                </label>
                <select
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                >
                  <option value="">Select a range</option>
                  <option value="under-100">Under $100 / month</option>
                  <option value="100-250">$100 to $250 / month</option>
                  <option value="250-500">$250 to $500 / month</option>
                  <option value="500-plus">$500+ / month</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </motion.div>
            )}
          </div>

          {/* Section 7: Solution Expectations (Optional) */}
          <div>
            <label className="block mb-3 text-lg">
              What would make a solution like this a clear win for you? <span className="text-[var(--foreground-muted)] text-sm font-normal">(Optional)</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              One or two things is enough.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {solutionWins.map((win, index) => (
                <motion.button
                  key={win.value}
                  type="button"
                  onClick={() => toggleSolutionWin(win.value)}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.solutionWins.includes(win.value)
                      ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--accent-mint)]/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 + index * 0.05, ease: flowEasing }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="text-sm">{win.label}</div>
                </motion.button>
              ))}
            </div>
            <div>
              <textarea
                value={formData.otherWish}
                onChange={(e) => setFormData({ ...formData, otherWish: e.target.value })}
                className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg resize-none"
                placeholder="Anything else you wish your current system did?"
                rows={3}
              />
            </div>
          </div>

          {/* Section 8: Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8, ease: flowEasing }}
          >
            <label className="block mb-3 text-lg">
              Where should we reach you? <span className="text-[var(--accent-mint)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              We'll only contact you about waitlist access and early onboarding.
            </p>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    placeholder="Full name *"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    placeholder="Clinic name *"
                    required
                  />
                </div>
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                  placeholder="Work email *"
                  required
                />
              </div>
              <div>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg appearance-none cursor-pointer ${formData.role ? 'text-[var(--foreground)]' : 'text-[#9CA3AF]'}`}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239CA3AF\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.5rem' }}
                  required
                >
                  <option value="" disabled>Your role *</option>
                  <option value="owner">Owner of clinic</option>
                  <option value="admin">Admin of a clinic</option>
                </select>
              </div>
              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                  placeholder="Phone number (optional)"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.0, ease: flowEasing }}
          >
            {submitError && (
              <div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                {submitError}
              </div>
            )}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 rounded-full bg-[var(--blue-primary)] text-white hover:bg-[var(--blue-vivid)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
              transition={{ duration: 0.2 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </motion.button>
            <p className="text-center text-sm text-[var(--foreground-muted)] mt-6 leading-relaxed">
              Joining the waitlist gets you 3 months free when we launch.<br />
              We're talking to a small group of clinics first to build this right.
            </p>
          </motion.div>

        </motion.form>
      </div>
    </div>
  );
}
