import { motion } from 'motion/react';

interface StrikeThroughListProps {
  items: string[];
}

export function StrikeThroughList({ items }: StrikeThroughListProps) {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="relative flex items-center gap-6 p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: flowEasing }}
        >
          {/* Strike icon */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2, ease: flowEasing }}
            >
              <svg
                className="w-6 h-6 text-red-500/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          </div>

          {/* Text with strike */}
          <div className="relative flex-1">
            <p className="text-lg text-[var(--foreground-muted)]">{item}</p>
            <motion.div
              className="absolute top-1/2 left-0 h-px bg-red-500/50"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.3, ease: flowEasing }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
