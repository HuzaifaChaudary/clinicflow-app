import { ReactNode } from 'react';

interface SettingCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  metadata?: {
    updatedBy: string;
    updatedAt: string;
  };
}

export function SettingCard({ title, description, children, metadata }: SettingCardProps) {
  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          {description && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          )}
        </div>
        {metadata && (
          <p className="text-xs ml-4 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
            Last updated by {metadata.updatedBy} · {metadata.updatedAt}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}