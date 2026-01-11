import { motion } from 'motion/react';

interface TimelineEvent {
  time: string;
  description: string;
  status: 'confirmed' | 'refilled' | 'completed' | 'pending';
}

interface DayTimelineProps {
  events: TimelineEvent[];
}

export function DayTimeline({ events }: DayTimelineProps) {
  const flowEasing = [0.22, 1, 0.36, 1];

  const statusColors = {
    confirmed: 'bg-[var(--accent-mint)]',
    refilled: 'bg-blue-500',
    completed: 'bg-green-500',
    pending: 'bg-yellow-500',
  };

  return (
    <div className="relative w-full py-12">
      {/* Desktop: Horizontal timeline */}
      <div className="hidden md:block relative">
        {/* Base line */}
        <div className="absolute top-20 left-0 right-0 h-px bg-[var(--glass-border)]" />

        {/* Events */}
        <div className="relative flex justify-between">
          {events.map((event, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15, ease: flowEasing }}
            >
              {/* Description above */}
              <div className="mb-8 max-w-[140px] text-center">
                <p className="text-sm text-[var(--foreground-muted)]">{event.description}</p>
              </div>

              {/* Node */}
              <motion.div
                className={`relative w-8 h-8 rounded-full border-2 border-[var(--glass-border)] flex items-center justify-center z-10`}
                animate={{
                  boxShadow: [
                    '0 0 0 rgba(94,234,212,0)',
                    '0 0 20px rgba(94,234,212,0.4)',
                    '0 0 0 rgba(94,234,212,0)',
                  ],
                }}
                transition={{
                  duration: 3,
                  delay: index * 0.3,
                  repeat: Infinity,
                  ease: flowEasing,
                }}
              >
                <div className={`w-3 h-3 rounded-full ${statusColors[event.status]}`} />
              </motion.div>

              {/* Time below */}
              <div className="mt-6 text-xs tracking-widest text-[var(--accent-mint)]">{event.time}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="md:hidden space-y-6">
        {events.map((event, index) => (
          <motion.div
            key={index}
            className="flex gap-6 items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: flowEasing }}
          >
            {/* Time + Node */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-xs tracking-widest text-[var(--accent-mint)]">{event.time}</div>
              <div className={`w-3 h-3 rounded-full ${statusColors[event.status]}`} />
            </div>

            {/* Description */}
            <div className="flex-1 p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--foreground-muted)]">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
