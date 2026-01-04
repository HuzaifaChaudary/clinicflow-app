import { motion } from 'motion/react';

interface BrokenFlowVisualProps {
  gaps?: number[];
  incompleteNodes?: number[];
}

export function BrokenFlowVisual({ gaps = [2, 5], incompleteNodes = [1, 4] }: BrokenFlowVisualProps) {
  const flowEasing = [0.22, 1, 0.36, 1];
  const totalSlots = 8;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      {/* Timeline */}
      <div className="relative w-full max-w-2xl">
        {/* Base line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--glass-border)]" />

        {/* Time slots */}
        <div className="relative flex justify-between items-center">
          {Array.from({ length: totalSlots }).map((_, index) => {
            const isGap = gaps.includes(index);
            const isIncomplete = incompleteNodes.includes(index);

            return (
              <motion.div
                key={index}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: flowEasing }}
              >
                {/* Slot indicator */}
                <motion.div
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${
                    isGap
                      ? 'border-red-500/50 bg-red-500/10'
                      : isIncomplete
                      ? 'border-yellow-500/50 bg-yellow-500/10'
                      : 'border-[var(--accent-mint)]/50 bg-[var(--accent-mint)]/10'
                  }`}
                  animate={
                    isIncomplete
                      ? {
                          opacity: [0.5, 1, 0.5],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: flowEasing,
                  }}
                >
                  {isGap ? (
                    <div className="w-3 h-px bg-red-500/50" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isIncomplete ? 'bg-yellow-500' : 'bg-[var(--accent-mint)]'}`} />
                  )}
                </motion.div>

                {/* Time label */}
                <div className="absolute -bottom-8 text-xs text-[var(--foreground-muted)]">
                  {`${8 + index}:00`}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Gap highlight labels */}
        {gaps.map((gapIndex) => (
          <motion.div
            key={`gap-${gapIndex}`}
            className="absolute text-xs text-red-500/70 tracking-wide"
            style={{
              left: `${(gapIndex / (totalSlots - 1)) * 100}%`,
              top: '-32px',
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: flowEasing }}
          >
            Empty
          </motion.div>
        ))}
      </div>
    </div>
  );
}
