import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Trial() {
  const flowEasing = [0.22, 1, 0.36, 1];
  
  const [formData, setFormData] = useState({
    clinicType: '',
    clinicSize: '',
    fullName: '',
    clinicName: '',
    email: '',
    phone: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trial signup:', formData);
    // This will later connect to the dashboard
  };

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
          <h1 className="mb-6">Start your free trial</h1>
          <p className="text-xl text-[var(--foreground-muted)]">
            Tell us a little about your clinic. We will tailor the experience for you.
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
            <label className="block mb-8 text-lg">
              What type of clinic do you run?
            </label>
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
          </div>

          {/* Section 2: Clinic Size */}
          <div>
            <label className="block mb-8 text-lg">
              How many providers work at your clinic?
            </label>
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

          {/* Section 3: Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: flowEasing }}
          >
            <label className="block mb-8 text-lg">
              Your details
            </label>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    placeholder="Clinic name"
                  />
                </div>
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                  placeholder="Work email"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1, ease: flowEasing }}
          >
            <motion.button
              type="submit"
              className="w-full py-6 bg-[var(--accent-mint)] text-[var(--background)] rounded-full hover:bg-[var(--accent-mint)]/90 transition-all duration-300 text-lg"
              whileHover={{ 
                scale: 1.01,
                boxShadow: '0 0 40px rgba(94, 234, 212, 0.4)',
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              Continue to dashboard
            </motion.button>
            <p className="text-center text-sm text-[var(--foreground-muted)] mt-4">
              No credit card required
            </p>
          </motion.div>

          {/* Login Link */}
          <motion.div
            className="text-center pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3, ease: flowEasing }}
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--accent-mint)] hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}