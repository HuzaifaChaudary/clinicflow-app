import React, { useState } from 'react';
import { IntakeReadinessPage } from './IntakeReadinessPage';
import { PatientIntakeFormPage } from './PatientIntakeFormPage';
import { Button } from '../components/foundation/Button';
import { Users, FileText } from 'lucide-react';

type DemoView = 'admin' | 'patient';

export function IntakeSystemDemo() {
  const [view, setView] = useState<DemoView>('admin');

  return (
    <div className="relative min-h-screen">
      {/* Demo Switcher (Floating) */}
      <div
        className="fixed top-4 right-4 z-50 rounded-full p-2 flex items-center gap-2"
        style={{
          backgroundColor: 'var(--surface-primary)',
          boxShadow: '0px 4px 16px rgba(30, 41, 59, 0.15)',
          border: '1px solid var(--border-default)',
        }}
      >
        <Button
          variant={view === 'admin' ? 'primary' : 'ghost'}
          size="sm"
          icon={Users}
          onClick={() => setView('admin')}
        >
          Admin View
        </Button>
        <Button
          variant={view === 'patient' ? 'primary' : 'ghost'}
          size="sm"
          icon={FileText}
          onClick={() => setView('patient')}
        >
          Patient View
        </Button>
      </div>

      {/* Render Current View */}
      {view === 'admin' ? <IntakeReadinessPage /> : <PatientIntakeFormPage />}
    </div>
  );
}