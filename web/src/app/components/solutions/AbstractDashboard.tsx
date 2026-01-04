import { motion } from 'motion/react';

export function AbstractDashboard() {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Admin view */}
        <motion.div
          className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: flowEasing }}
        >
          <div className="text-xs text-[var(--foreground-muted)] mb-6 tracking-widest uppercase">Admin</div>
          
          {/* Alert count */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-mint)]" />
            <div className="text-2xl">3</div>
            <div className="text-sm text-[var(--foreground-muted)]">alerts</div>
          </div>

          {/* Schedule blocks */}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((_, index) => (
              <motion.div
                key={index}
                className="h-2 rounded-full bg-[var(--accent-mint)]/20"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1, ease: flowEasing }}
              />
            ))}
          </div>
        </motion.div>

        {/* Doctor view */}
        <motion.div
          className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: flowEasing }}
        >
          <div className="text-xs text-[var(--foreground-muted)] mb-6 tracking-widest uppercase">Doctor</div>
          
          {/* Today's schedule */}
          <div className="space-y-3">
            {[
              { time: '09:00', confirmed: true },
              { time: '11:00', confirmed: true },
              { time: '14:00', confirmed: true },
              { time: '16:00', confirmed: true },
            ].map((slot, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-[var(--background)]/50"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1, ease: flowEasing }}
              >
                <div className="text-xs text-[var(--foreground-muted)] w-12">{slot.time}</div>
                <div className="flex-1 h-1 rounded-full bg-[var(--glass-border)]" />
                <div className="w-2 h-2 rounded-full bg-[var(--accent-mint)]" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Owner view */}
        <motion.div
          className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: flowEasing }}
        >
          <div className="text-xs text-[var(--foreground-muted)] mb-6 tracking-widest uppercase">Owner</div>
          
          {/* Utilization */}
          <div className="mb-6">
            <div className="text-3xl mb-2">94%</div>
            <div className="text-xs text-[var(--foreground-muted)]">Utilization</div>
          </div>

          {/* Week view */}
          <div className="flex gap-2">
            {[80, 90, 85, 95, 94].map((value, index) => (
              <motion.div
                key={index}
                className="flex-1 rounded-full bg-[var(--accent-mint)]/20 overflow-hidden"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: flowEasing }}
              >
                <motion.div
                  className="w-full bg-[var(--accent-mint)]"
                  style={{ height: `${value}%` }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2, ease: flowEasing }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom description */}
      <motion.div
        className="mt-12 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4, ease: flowEasing }}
      >
        <p className="text-lg text-[var(--foreground-muted)] leading-relaxed">
          Admins see fewer alerts. Doctors see cleaner schedules. Owners see filled days.
        </p>
      </motion.div>
    </div>
  );
}
