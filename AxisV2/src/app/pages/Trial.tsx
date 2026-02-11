import { motion } from 'motion/react';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

export function Trial() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
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
    ownerEmail: '',
    numberOfDoctors: '',
    numberOfLocations: '',
    doctorEmails: '',
    locationAddresses: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [calendlyScheduled, setCalendlyScheduled] = useState(false);

  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitted]);

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Listen for Calendly scheduling event
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data?.event === 'calendly.event_scheduled') {
        setCalendlyScheduled(true);
      }
    };
    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, []);

  const formatUSPhone = useCallback((value: string) => {
    // Strip non-digits
    const digits = value.replace(/\D/g, '');
    // Remove leading 1 if present
    const cleaned = digits.startsWith('1') ? digits.slice(1) : digits;
    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }, []);

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
    { value: '2-5', label: '2–5' },
    { value: '6-10', label: '6–10' },
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
    setSubmitError('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const requiredFields: Record<string, string> = {
      clinicType: formData.clinicType,
      clinicSize: formData.clinicSize,
      painPoints: formData.painPoints.length ? 'ok' : '',
      currentSetup: formData.currentSetup,
      impactLevel: formData.impactLevel,
      willingnessToPay: formData.willingnessToPay,
      priceRange: formData.priceRange,
      fullName: formData.fullName,
      clinicName: formData.clinicName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      numberOfDoctors: formData.numberOfDoctors,
      numberOfLocations: formData.numberOfLocations,
    };

    if (formData.clinicType === 'other') {
      requiredFields.otherClinicType = formData.otherClinicType;
    }

    if (formData.role && formData.role !== 'owner') {
      requiredFields.ownerEmail = formData.ownerEmail;
    }

    const missing = Object.entries(requiredFields)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missing.length) {
      setSubmitError('Please complete all required fields (everything marked * except phone and optional doctor/location lists).');
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address (e.g., name@clinic.com).');
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    const cleanPhone = phoneDigits.startsWith('1') ? phoneDigits.slice(1) : phoneDigits;
    if (cleanPhone.length !== 10) {
      setSubmitError('Please enter a valid US phone number (10 digits).');
      return;
    }

    if (formData.solutionWins.length === 0) {
      setSubmitError('Please select at least one outcome that would make this a win.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      console.log('Submitting to:', `${apiUrl}/api/waitlist`);
      
      const response = await fetch(`${apiUrl}/api/waitlist`, {
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
      console.error('Waitlist submission error:', error);
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

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-[800px] mx-auto px-8">
          <div className="text-center py-32">
            <div className="mb-8 text-6xl">✓</div>
            <h1 className="mb-6">You're on the waitlist!</h1>
            <p className="text-xl text-[var(--foreground-muted)] mb-4">
              Thanks for joining. We'll reach out to <span className="text-[var(--blue-primary)] font-medium">{formData.email}</span> when your clinic is ready for onboarding.
            </p>
            <p className="text-base text-[var(--foreground-muted)] mt-6">
              You'll receive dashboard access at this email once we begin your setup.
            </p>
            <p className="text-sm text-[var(--foreground-muted)] mt-8 opacity-70">
              Early access is prioritized based on clinic size and operational needs.
            </p>
            <div className="mt-12">
              <Link to="/">
                <motion.button
                  className="px-8 py-4 rounded-full border-2 border-[var(--glass-border)] hover:border-[var(--blue-primary)] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to home
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-[var(--blue-soft)] text-[var(--blue-primary)] text-sm font-medium">
            🎉 First 3 months free for early adopters
          </div>
          <h1 className="mb-6">Join the Axis waitlist</h1>
          <p className="text-xl text-[var(--foreground-muted)]">
            We're talking to a small group of clinics first to build this right.<br />
            Joining the waitlist doesn't lock you into anything.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Section 1: Clinic Type */}
          <div>
            <label className="block mb-3 text-lg">
              What kind of clinic do you run? <span className="text-[var(--blue-primary)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              This helps us understand your day-to-day workflow.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {clinicTypes.map((type) => (
                <motion.button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, clinicType: type.value })}
                  className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                    formData.clinicType === type.value
                      ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--blue-primary)]/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-3xl mb-3 opacity-40">{type.icon}</div>
                  <div className="text-sm">{type.label}</div>
                </motion.button>
              ))}
            </div>

            {formData.clinicType === 'other' && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  value={formData.otherClinicType}
                  onChange={(e) => setFormData({ ...formData, otherClinicType: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                  placeholder="Please specify your clinic type *"
                  required
                />
              </motion.div>
            )}
          </div>

          {/* Section 2: Clinic Size */}
          <div>
            <label className="block mb-3 text-lg">
              How many providers work at your clinic? <span className="text-[var(--blue-primary)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              We use this to understand scheduling complexity and admin load.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {clinicSizes.map((size) => (
                <motion.button
                  key={size.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, clinicSize: size.value })}
                  className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                    formData.clinicSize === size.value
                      ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--blue-primary)]/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-sm">{size.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Section 2.5: Clinic Details - Doctors and Locations */}
          <div>
            <label className="block mb-3 text-lg">
              Tell us more about your clinic <span className="text-[var(--blue-primary)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              This helps us understand your clinic's scale and setup.
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Number of doctors *</label>
                  <select
                    value={formData.numberOfDoctors}
                    onChange={(e) => setFormData({ ...formData, numberOfDoctors: e.target.value })}
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1 doctor</option>
                    <option value="2-5">2-5 doctors</option>
                    <option value="6-10">6-10 doctors</option>
                    <option value="11-20">11-20 doctors</option>
                    <option value="21-50">21-50 doctors</option>
                    <option value="50+">50+ doctors</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Number of locations *</label>
                  <select
                    value={formData.numberOfLocations}
                    onChange={(e) => setFormData({ ...formData, numberOfLocations: e.target.value })}
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1 location</option>
                    <option value="2-3">2-3 locations</option>
                    <option value="4-5">4-5 locations</option>
                    <option value="6-10">6-10 locations</option>
                    <option value="10+">10+ locations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Doctor emails (optional)</label>
                <textarea
                  value={formData.doctorEmails}
                  onChange={(e) => setFormData({ ...formData, doctorEmails: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg resize-none"
                  placeholder="Enter doctor emails, one per line"
                  rows={3}
                />
                <p className="text-xs text-[var(--foreground-muted)] mt-2">
                  We'll invite them to join when your clinic is set up.
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm text-[var(--foreground-muted)]">Location addresses (optional)</label>
                <textarea
                  value={formData.locationAddresses}
                  onChange={(e) => setFormData({ ...formData, locationAddresses: e.target.value })}
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg resize-none"
                  placeholder="Enter location addresses, one per line"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pain Points */}
          <div>
            <label className="block mb-3 text-lg">
              Where does your team lose the most time today? <span className="text-[var(--blue-primary)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              Select all that apply. There's no right or wrong answer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {painPoints.map((point) => (
                <motion.button
                  key={point.value}
                  type="button"
                  onClick={() => togglePainPoint(point.value)}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.painPoints.includes(point.value)
                      ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--blue-primary)]/50'
                  }`}
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
              How are you handling scheduling right now? <span className="text-[var(--blue-primary)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              Just a quick snapshot.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSetups.map((setup) => (
                <motion.button
                  key={setup.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, currentSetup: setup.value })}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.currentSetup === setup.value
                      ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--blue-primary)]/50'
                  }`}
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
              How big of a problem is this for your clinic today? <span className="text-[var(--blue-primary)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              This helps us understand urgency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactLevels.map((level) => (
                <motion.button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, impactLevel: level.value })}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.impactLevel === level.value
                      ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--blue-primary)]/50'
                  }`}
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
              If Axis solved these problems reliably, would you be open to paying for it? <span className="text-[var(--blue-primary)]">*</span>
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              Honest answers help us build the right product.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {willingnessOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, willingnessToPay: option.value })}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.willingnessToPay === option.value
                      ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--blue-primary)]/50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="text-sm">{option.label}</div>
                </motion.button>
              ))}
            </div>

            {/* Price Range (Required) */}
            <div className="mt-8">
              <label className="block mb-3 text-lg">
                What monthly price range would feel reasonable for your clinic? <span className="text-[var(--blue-primary)]">*</span>
              </label>
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                required
              >
                <option value="">Select a range *</option>
                <option value="under-100">Under $100 / month</option>
                <option value="100-250">$100–$250 / month</option>
                <option value="250-500">$250–$500 / month</option>
                <option value="500-plus">$500+ / month</option>
                <option value="not-sure">Not sure yet</option>
              </select>
            </div>
          </div>

          {/* Section 7: Solution Expectations */}
          <div>
            <label className="block mb-3 text-lg">
              What would make a solution like this a clear win for you?
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              One or two things is enough.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {solutionWins.map((win) => (
                <motion.button
                  key={win.value}
                  type="button"
                  onClick={() => toggleSolutionWin(win.value)}
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
                    formData.solutionWins.includes(win.value)
                      ? 'border-[var(--blue-primary)] bg-[var(--blue-primary)]/5'
                      : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--blue-primary)]/50'
                  }`}
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
                className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg resize-none"
                placeholder="Anything else you wish your current system did?"
                rows={3}
              />
            </div>
          </div>

          {/* Section 8: Contact Details */}
          <div>
            <label className="block mb-3 text-lg">
              Where should we reach you? <span className="text-[var(--blue-primary)]">*</span>
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
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    placeholder="Full name *"
                    required
                  />
                </div>
                <div>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg appearance-none cursor-pointer ${formData.role ? 'text-[var(--foreground)]' : 'text-[#9CA3AF]'}`}
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239CA3AF\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.5rem' }}
                    required
                  >
                    <option value="" disabled>Your role *</option>
                    <option value="owner">Clinic Owner</option>
                    <option value="admin">Administrative Assistant</option>
                    <option value="practice-manager">Practice Manager</option>
                    <option value="operations-manager">Operations Manager</option>
                    <option value="cto">CTO / IT Director</option>
                  </select>
                </div>
                <div>
              {formData.role && formData.role !== 'owner' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    placeholder="Clinic owner's email *"
                    required
                  />
                  <p className="text-sm text-[var(--foreground-muted)] mt-2">
                    We'll need the owner's approval to set up your clinic.
                  </p>
                </motion.div>
              )}
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
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
                  className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                  placeholder="Work email *"
                  required
                />
              </div>
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--foreground-muted)] select-none">+1</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatUSPhone(e.target.value) })}
                    className="w-full pl-12 pr-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--blue-primary)] focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
                    placeholder="(555) 555-0123 *"
                    required
                    maxLength={16}
                  />
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-2">US numbers only</p>
              </div>
            </div>
          </div>

          {/* Calendly Section */}
          <div>
            <label className="block mb-3 text-lg">
              Book a walkthrough with our team
            </label>
            <p className="text-sm text-[var(--foreground-muted)] mb-8">
              Pick a time that works for you. We'll walk you through the dashboard and show you how Axis solves your clinic's problems.
            </p>
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/axis-founders/15min?hide_event_type_details=1&hide_gdpr_banner=1"
              style={{ width: '100%', minWidth: '320px', height: '660px' }}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            {submitError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm text-center">
                {submitError}
              </div>
            )}
            <motion.button
              type="submit"
              disabled={isSubmitting || !calendlyScheduled}
              className={`w-full py-6 font-medium rounded-full transition-all duration-200 text-lg disabled:cursor-not-allowed ${
                calendlyScheduled
                  ? 'bg-[var(--blue-primary)] text-white hover:bg-[var(--blue-vivid)] shadow-[0_2px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)]'
                  : 'bg-gray-300 text-gray-500'
              }`}
              whileHover={{ scale: isSubmitting || !calendlyScheduled ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting || !calendlyScheduled ? 1 : 0.99 }}
            >
              {isSubmitting ? 'Submitting...' : !calendlyScheduled ? 'Book a time above to continue' : 'Join the waitlist'}
            </motion.button>
            <p className="text-center text-sm text-[var(--foreground-muted)] mt-6 leading-relaxed">
              Joining the waitlist gets you 3 months free when we launch.<br />
              We're talking to a small group of clinics first to build this right.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
