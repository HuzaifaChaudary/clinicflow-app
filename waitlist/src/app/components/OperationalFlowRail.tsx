import { ArrowRight } from 'lucide-react';

export type NodeType = 'human' | 'system' | 'decision' | 'outcome';

export interface FlowNode {
  type: NodeType;
  label: string;
  // New 3-line structure (max 10-12 words each)
  happening?: string;    // Line 1: What's happening
  problem?: string;      // Line 2: Why it's a problem
  changes?: string;      // Line 3: What changes
  outcome?: {
    label: string;       // Max 3 words
    icon?: string;
  };
  branches?: {
    label: string;
    outcome: string;
  }[];
}

interface OperationalFlowRailProps {
  nodes: FlowNode[];
  variant?: 'homepage' | 'product' | 'voice' | 'how-it-works';
}

export function OperationalFlowRail({ nodes, variant = 'product' }: OperationalFlowRailProps) {
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'decision':
        return '◆';
      default:
        return '●';
    }
  };

  const getNodeStyle = (type: NodeType, isActive: boolean = true) => {
    const baseStyle = {
      borderWidth: '2px',
      borderStyle: type === 'decision' ? 'dashed' : 'solid',
    };

    if (isActive) {
      return {
        ...baseStyle,
        borderColor: 'var(--blue-primary)',
        backgroundColor: 'var(--blue-soft)',
        color: 'var(--blue-vivid)',
      };
    }

    return {
      ...baseStyle,
      borderColor: 'var(--glass-border)',
      backgroundColor: 'transparent',
      color: 'var(--foreground-muted)',
    };
  };

  return (
    <div className="space-y-24">
      {nodes.map((node, index) => (
        <div
          key={index}
          className="relative grid grid-cols-12 gap-16 items-start"
        >
          {/* Left Rail - 88px approx = col-span-1 */}
          <div className="col-span-1 flex flex-col items-center">
            {/* Vertical line connector with arrow (except for first node) */}
            {index > 0 && (
              <div className="relative w-px h-24 -mt-24 bg-[var(--blue-primary)]">
                {/* Arrow at bottom of line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M4 0 L0 4 L8 4 Z" fill="var(--blue-primary)" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Flow Node - 32px × 32px */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200"
              style={getNodeStyle(node.type, true)}
            >
              {getNodeIcon(node.type)}
            </div>

            {/* Node Label */}
            <div className="text-xs text-[var(--foreground-muted)] mt-3 text-center whitespace-nowrap">
              {node.label}
            </div>

            {/* Branching paths for decision nodes */}
            {node.type === 'decision' && node.branches && (
              <div className="mt-4 flex gap-2">
                {node.branches.slice(0, 2).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-px h-8 bg-[var(--blue-primary)]"
                    style={{ opacity: 0.4 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Horizontal arrow connecting to outcome */}
          {node.outcome && (
            <div className="absolute left-[calc((100%/12)*6)] top-[16px] w-[calc((100%/12)*2)] flex items-center justify-center z-0">
              <div className="w-full h-[2px] bg-[var(--blue-primary)] relative">
                {/* Arrow head pointing right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <ArrowRight className="w-4 h-4 text-[var(--blue-primary)]" />
                </div>
              </div>
            </div>
          )}

          {/* Main Copy Column - 44% approx = col-span-5 */}
          <div className="col-span-5 relative z-10">
            <div className="space-y-3">
              {/* Line 1: What's happening (Bold) */}
              {node.happening && (
                <p className="text-lg leading-relaxed">
                  <strong>{node.happening}</strong>
                </p>
              )}
              
              {/* Line 2: Why it's a problem */}
              {node.problem && (
                <p className="text-lg leading-relaxed text-[var(--foreground-muted)]">
                  {node.problem}
                </p>
              )}
              
              {/* Line 3: What changes (BLUE text, not teal) */}
              {node.changes && (
                <p className="text-lg leading-relaxed text-[var(--blue-primary)]">
                  {node.changes}
                </p>
              )}

              {/* Branching display for decision nodes */}
              {node.branches && (
                <div className="space-y-2 mt-6 pt-6 border-t border-[var(--glass-border)]">
                  {node.branches.map((branch, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[var(--blue-primary)] mt-0.5">→</span>
                      <span>
                        <strong>{branch.label}:</strong> {branch.outcome}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Outcome Column - 30% approx = col-span-4, offset 2 for gap */}
          <div className="col-span-4 col-start-9 relative z-10">
            {node.outcome && (
              <div className="h-full flex items-center">
                {/* Outcome card with blue border and orange icon for final states */}
                <div 
                  className={`w-full p-6 rounded-2xl backdrop-blur-xl text-center transition-all duration-300 ${
                    node.type === 'outcome' 
                      ? 'bg-[var(--blue-primary)] border-2 border-[var(--blue-vivid)]' 
                      : 'bg-[var(--glass-bg)] border-2 border-[var(--blue-primary)]/30'
                  }`}
                >
                  {node.outcome.icon && (
                    <div className={`text-2xl mb-3 ${
                      node.type === 'outcome' ? 'filter brightness-110' : ''
                    }`}>
                      {/* Use orange for completion states */}
                      {node.type === 'outcome' ? (
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--orange-signal)]">
                          {node.outcome.icon}
                        </span>
                      ) : (
                        node.outcome.icon
                      )}
                    </div>
                  )}
                  <div className={`text-sm ${
                    node.type === 'outcome' ? 'text-white' : 'text-[var(--blue-primary)]'
                  }`}>
                    {node.outcome.label}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
