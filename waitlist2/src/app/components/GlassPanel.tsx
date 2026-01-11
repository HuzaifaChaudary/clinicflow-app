import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassPanel({ children, className = '', delay = 0 }: GlassPanelProps) {
  return (
    <motion.div
      className={`relative rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[32px] shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        borderColor: 'rgba(94, 234, 212, 0.3)',
        boxShadow: '0 0 30px rgba(94, 234, 212, 0.1)',
      }}
    >
      {children}
    </motion.div>
  );
}