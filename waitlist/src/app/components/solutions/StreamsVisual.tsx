import { motion } from 'motion/react';

export function StreamsVisual() {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[var(--accent-mint)]/5 rounded-3xl blur-3xl" />
      
      {/* Multiple streams - high volume, fast-moving slots */}
      <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
        {/* Left streams */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-12">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`left-${index}`}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: flowEasing }}
            >
              {/* Node with faster pulse */}
              <motion.div
                className="w-8 h-8 rounded-full border border-[var(--accent-mint)]/50 bg-[var(--accent-mint)]/10 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2,
                  repeat: Infinity,
                  ease: flowEasing,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[var(--accent-mint)]" />
              </motion.div>
              
              {/* Line */}
              <motion.div
                className="h-px bg-[var(--accent-mint)]/30"
                style={{ width: '120px' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: flowEasing }}
              />
            </motion.div>
          ))}
        </div>

        {/* Center hub with faster pulse */}
        <motion.div
          className="relative z-10 w-32 h-32 rounded-2xl border-2 border-[var(--accent-mint)] bg-[var(--background)] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            boxShadow: [
              '0 0 0 rgba(94,234,212,0.2)',
              '0 0 40px rgba(94,234,212,0.5)',
              '0 0 0 rgba(94,234,212,0.2)',
            ],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.4, ease: flowEasing },
            scale: { duration: 0.5, delay: 0.4, ease: flowEasing },
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: flowEasing,
            },
          }}
        >
          <div className="w-12 h-12 rounded-lg bg-[var(--accent-mint)]/20 border border-[var(--accent-mint)]/50" />
        </motion.div>

        {/* Right streams */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-12">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`right-${index}`}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.15, ease: flowEasing }}
            >
              {/* Line */}
              <motion.div
                className="h-px bg-[var(--accent-mint)]/30"
                style={{ width: '120px' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 + 0.15, ease: flowEasing }}
              />
              
              {/* Node with faster pulse */}
              <motion.div
                className="w-8 h-8 rounded-full border border-[var(--accent-mint)]/50 bg-[var(--accent-mint)]/10 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2 + 0.15,
                  repeat: Infinity,
                  ease: flowEasing,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[var(--accent-mint)]" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}