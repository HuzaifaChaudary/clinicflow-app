import { motion } from 'motion/react';

export function ConfirmationFlow() {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[var(--accent-mint)]/5 rounded-3xl blur-3xl" />
      
      {/* Chair utilization blocks - decisive confirmations, locked time slots */}
      <div className="relative flex items-center gap-16">
        {[
          { label: 'Empty', delay: 0, opacity: 0.2, filled: false },
          { label: 'Confirmed', delay: 0.15, opacity: 1, filled: true },
          { label: 'Refilled', delay: 0.3, opacity: 1, filled: true },
        ].map((state, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: state.delay, ease: flowEasing }}
          >
            {/* Chair block */}
            <motion.div
              className={`relative w-24 h-24 rounded-xl border-2 flex items-center justify-center ${
                state.filled ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/10' : 'border-[var(--glass-border)] bg-[var(--glass-bg)]'
              }`}
              style={{ opacity: state.opacity }}
              animate={
                state.filled
                  ? {
                      scale: [1, 1.03, 1],
                      boxShadow: [
                        '0 0 0 rgba(94,234,212,0.3)',
                        '0 0 25px rgba(94,234,212,0.5)',
                        '0 0 0 rgba(94,234,212,0.3)',
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: flowEasing,
              }}
            >
              {state.filled && <div className="w-3 h-3 rounded-full bg-[var(--accent-mint)]" />}
            </motion.div>

            {/* Label */}
            <div className="text-xs text-[var(--foreground-muted)] tracking-widest uppercase">
              {state.label}
            </div>

            {/* Connecting line */}
            {index < 2 && (
              <motion.div
                className="absolute top-12 h-px bg-[var(--accent-mint)]/30"
                style={{
                  left: index === 0 ? '50%' : 'auto',
                  right: index === 1 ? '50%' : 'auto',
                  width: '64px',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: state.delay + 0.2, ease: flowEasing }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}