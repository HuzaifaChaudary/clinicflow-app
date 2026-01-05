import { motion } from 'motion/react';

interface Layer {
  name: string;
  description: string;
}

const layers: Layer[] = [
  { 
    name: 'Scheduling',
    description: 'Appointments stay organized. Availability stays accurate. Changes are handled without chaos.',
  },
  { 
    name: 'Patient Communication',
    description: 'Patients are contacted at the right time. Confirmations and reminders happen without staff chasing responses.',
  },
  { 
    name: 'Intake and Summaries',
    description: 'Information is collected before the visit. Doctors walk in prepared.',
  },
  { 
    name: 'Admin Automation',
    description: 'Routine tasks run quietly. Staff only step in when attention is needed.',
  },
];

export function SystemCapabilityStack() {
  const flowEasing = [0.22, 1, 0.36, 1];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className="p-10 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.1, 
            ease: flowEasing 
          }}
          whileHover={{
            borderColor: 'rgba(94, 234, 212, 0.3)',
            boxShadow: '0 0 30px rgba(94, 234, 212, 0.1)',
          }}
        >
          <h3 className="mb-6">{layer.name}</h3>
          <p className="text-[var(--foreground-muted)]">
            {layer.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}