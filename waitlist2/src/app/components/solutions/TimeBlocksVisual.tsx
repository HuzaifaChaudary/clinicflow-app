import { motion } from 'motion/react';

export function TimeBlocksVisual() {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[var(--accent-mint)]/5 rounded-3xl blur-3xl" />
      
      {/* Calendar grid - longer session blocks, back-to-back flow */}
      <div className="relative grid grid-cols-5 gap-3">
        {Array.from({ length: 15 }).map((_, index) => {
          const isActive = [0, 1, 5, 6, 10, 11].includes(index);
          const delay = index * 0.06;
          
          return (
            <motion.div
              key={index}
              className={`w-16 h-24 rounded-lg border ${
                isActive 
                  ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)]/10' 
                  : 'border-[var(--glass-border)] bg-[var(--glass-bg)]'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                boxShadow: isActive 
                  ? [
                      '0 0 0 rgba(94,234,212,0)',
                      '0 0 20px rgba(94,234,212,0.4)',
                      '0 0 0 rgba(94,234,212,0)',
                    ]
                  : '0 0 0 rgba(94,234,212,0)',
              }}
              transition={{
                duration: 0.3,
                delay: delay,
                ease: flowEasing,
                boxShadow: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: flowEasing,
                },
              }}
            >
              {isActive && (
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: flowEasing,
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-mint)]" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}