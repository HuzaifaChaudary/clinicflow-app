import { motion } from 'motion/react';
import { useState } from 'react';

interface Role {
  name: string;
  outcomes: string[];
}

interface RoleBasedOutcomesProps {
  roles: Role[];
}

export function RoleBasedOutcomes({ roles }: RoleBasedOutcomesProps) {
  const [activeRole, setActiveRole] = useState(0);
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="relative w-full">
      {/* Role tabs */}
      <div className="flex gap-4 mb-12 border-b border-[var(--glass-border)]">
        {roles.map((role, index) => (
          <button
            key={index}
            onClick={() => setActiveRole(index)}
            className={`relative px-6 py-4 text-sm transition-colors duration-300 ${
              activeRole === index ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
            }`}
          >
            {role.name}
            {activeRole === index && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent-mint)]"
                layoutId="activeRoleTab"
                transition={{ duration: 0.3, ease: flowEasing }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Role outcomes */}
      <div className="relative min-h-[300px]">
        {roles.map((role, roleIndex) => (
          <motion.div
            key={roleIndex}
            className="space-y-6"
            initial={false}
            animate={{
              opacity: activeRole === roleIndex ? 1 : 0,
              x: activeRole === roleIndex ? 0 : 20,
              display: activeRole === roleIndex ? 'block' : 'none',
            }}
            transition={{ duration: 0.4, ease: flowEasing }}
          >
            {role.outcomes.map((outcome, outcomeIndex) => (
              <motion.div
                key={outcomeIndex}
                className="flex items-start gap-6 p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: outcomeIndex * 0.1, ease: flowEasing }}
              >
                <div className="w-2 h-2 rounded-full bg-[var(--accent-mint)] mt-2 flex-shrink-0" />
                <p className="text-lg leading-relaxed">{outcome}</p>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Flow visualization */}
      <div className="mt-16 flex items-center justify-center gap-4">
        {['Intake', 'Confirm', 'Schedule', 'Session', 'Report'].map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <motion.div
              className="px-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-sm text-[var(--foreground-muted)]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1, ease: flowEasing }}
            >
              {step}
            </motion.div>
            {index < 4 && (
              <motion.div
                className="w-8 h-px bg-[var(--accent-mint)]/30"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2, ease: flowEasing }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
