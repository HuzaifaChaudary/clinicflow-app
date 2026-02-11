import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function NotFound() {
  const flowEasing = [0.22, 1, 0.36, 1];
  
  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: flowEasing }}
        >
          <div className="text-8xl mb-8 text-[var(--accent-mint)] opacity-30">404</div>
          <h1 className="mb-6">Page not found</h1>
          <p className="text-xl text-[var(--foreground-muted)] mb-12">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/">
            <motion.button
              className="px-10 py-5 rounded-full bg-[var(--accent-mint)] text-[var(--background)] hover:bg-[var(--accent-mint)]/90 transition-all duration-300"
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(94, 234, 212, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Return Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}