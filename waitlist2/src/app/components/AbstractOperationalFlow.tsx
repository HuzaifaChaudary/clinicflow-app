import { motion } from 'motion/react';

export function AbstractOperationalFlow() {
  const nodes = [
    { label: 'Scheduling', x: 20, y: 20 },
    { label: 'Communication', x: 75, y: 35 },
    { label: 'Intake', x: 25, y: 65 },
    { label: 'Visit', x: 70, y: 80 },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ];

  return (
    <div className="relative w-full aspect-square">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Connection Lines */}
        {connections.map((conn, i) => {
          const from = nodes[conn.from];
          const to = nodes[conn.to];
          return (
            <motion.line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#lineGradient)"
              strokeWidth="0.15"
              strokeOpacity="0.3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                duration: 2, 
                delay: 0.5 + i * 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            {/* Outer glow */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="3"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="0.1"
              opacity="0.2"
              initial={{ r: 0, opacity: 0 }}
              animate={{ 
                r: [3, 4, 3],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Inner node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="1.5"
              fill="var(--accent-mint)"
              opacity="0.6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 0.6
              }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.2,
                ease: [0.22, 1, 0.36, 1]
              }}
            />

            {/* Label */}
            <motion.text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill="var(--foreground-muted)"
              fontSize="2.5"
              opacity="0.4"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5 + i * 0.2,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-mint)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--accent-mint)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent-mint)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Background blur layers for depth */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(94, 234, 212, 0.03) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(94, 234, 212, 0.02) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
    </div>
  );
}