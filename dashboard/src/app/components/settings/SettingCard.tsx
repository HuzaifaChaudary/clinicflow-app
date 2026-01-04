import { ReactNode } from 'react';

interface SettingCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingCard({ title, description, children }: SettingCardProps) {
  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="mb-4">
        <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        {description && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}