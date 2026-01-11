import { motion } from 'motion/react';

interface ProofStatementsProps {
  statements: string[];
}

export function ProofStatements({ statements }: ProofStatementsProps) {
  const flowEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {statements.map((statement, index) => (
        <motion.div
          key={index}
          className="p-8 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: flowEasing }}
        >
          <div className="flex items-start gap-4">
            <div className="w-1 h-1 rounded-full bg-[var(--accent-mint)] mt-2 flex-shrink-0" />
            <p className="text-base text-[var(--foreground-muted)] leading-relaxed">{statement}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
