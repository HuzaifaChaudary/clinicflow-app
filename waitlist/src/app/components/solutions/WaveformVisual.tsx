import { motion } from 'motion/react';

export function WaveformVisual() {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[var(--accent-soft)]/5 rounded-3xl blur-3xl" />
      
      {/* Waveform bars - calm, steady pulses, fewer interruptions */}
      <div className="relative flex items-center gap-3">
        {Array.from({ length: 24 }).map((_, index) => {
          const heights = [50, 55, 60, 65, 60, 55, 50, 55, 60, 65, 60, 55, 60, 65, 60, 55, 50, 55, 60, 55, 50, 55, 60, 50];
          const delay = index * 0.08;
          
          return (
            <motion.div
              key={index}
              className="w-2 rounded-full bg-[var(--accent-primary)]"
              style={{ height: `${heights[index]}px`, opacity: 0.6 }}
              initial={{ scaleY: 0.5, opacity: 0.3 }}
              animate={{
                scaleY: [0.5, 1, 0.5],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                delay: delay,
                repeat: Infinity,
                ease: flowEasing,
              }}
            />
          );
        })}
      </div>

      {/* Center highlight line */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--accent-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: flowEasing,
        }}
      />
    </div>
  );
}