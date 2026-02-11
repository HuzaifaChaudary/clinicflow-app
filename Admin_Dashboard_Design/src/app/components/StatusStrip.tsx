interface StatusIndicator {
  label: string;
  value: number;
  id: string;
}

interface StatusStripProps {
  indicators: StatusIndicator[];
  onIndicatorClick?: (id: string) => void;
  activeFilter?: string;
}

export function StatusStrip({ indicators, onIndicatorClick, activeFilter }: StatusStripProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center gap-8">
        {indicators.map((indicator) => {
          const isActive = activeFilter === indicator.id;
          
          return (
            <button
              key={indicator.id}
              onClick={() => onIndicatorClick?.(indicator.id)}
              className={`flex flex-col gap-1 transition-colors ${
                isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`text-3xl ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                {indicator.value}
              </div>
              <div className="text-gray-600">{indicator.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
