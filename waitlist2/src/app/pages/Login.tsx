import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Login() {
  const flowEasing = [0.22, 1, 0.36, 1];
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
    // This will later connect to authentication
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center">
      <div className="max-w-[500px] mx-auto px-8 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: flowEasing }}
        >
          <h1 className="mb-6">Log in</h1>
          <p className="text-xl text-[var(--foreground-muted)]">
            Access your clinic dashboard
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: flowEasing }}
        >
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
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-6 py-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl focus:border-[var(--accent-mint)] focus:shadow-[0_0_20px_rgba(94,234,212,0.2)] outline-none transition-all duration-300 backdrop-blur-xl text-lg"
              placeholder="Password"
              required
            />
          </div>

          <div className="pt-4">
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
              Log in
            </motion.button>
          </div>

          <div className="text-center pt-8">
            <p className="text-sm text-[var(--foreground-muted)]">
              Don't have an account?{' '}
              <Link to="/trial" className="text-[var(--accent-mint)] hover:underline">
                Join Waitlist
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}