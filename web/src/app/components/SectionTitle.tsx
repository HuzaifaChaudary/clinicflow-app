import { motion } from 'motion/react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({ title, subtitle, align = 'left' }: SectionTitleProps) {
  return (
    <div className={`mb-24 ${align === 'center' ? 'text-center' : ''}`}>
      <motion.h2
        className="mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className={`text-xl max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
