import React, { useState } from 'react';
import { ReadinessCard } from '../components/intake/ReadinessCard';
import { IntakeTaskCard } from '../components/intake/IntakeTaskCard';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '../components/foundation/Button';

type FilterType = 'all' | 'action' | 'risk' | 'ready';

interface IntakeItem {
  id: string;
  patientName: string;
  appointmentTime: string;
  provider: string;
  visitType: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'overdue';
  progress?: number;
  lastOutreach?: {
    channel: 'sms' | 'call' | 'email';
    timeAgo: string;
    attempts: number;
  };
}

const mockIntakeData: IntakeItem[] = [
  {
    id: '1',
    patientName: 'Emily Johnson',
    appointmentTime: 'In 2 hours',
    provider: 'Dr. Chen',
    visitType: 'Annual checkup',
    status: 'overdue',
    lastOutreach: {
      channel: 'sms',
      timeAgo: '3h ago',
      attempts: 2,
    },
  },
  {
    id: '2',
    patientName: 'Michael Brown',
    appointmentTime: 'In 5 hours',
    provider: 'Dr. Patel',
    visitType: 'Follow-up',
    status: 'not-started',
  },
  {
    id: '3',
    patientName: 'Lisa Anderson',
    appointmentTime: 'Tomorrow 9:00 AM',
    provider: 'Dr. Chen',
    visitType: 'New patient',
    status: 'in-progress',
    progress: 65,
    lastOutreach: {
      channel: 'email',
      timeAgo: '1h ago',
      attempts: 1,
    },
  },
  {
    id: '4',
    patientName: 'Sarah Martinez',
    appointmentTime: 'Tomorrow 10:30 AM',
    provider: 'Dr. Ross',
    visitType: 'Consultation',
    status: 'submitted',
    lastOutreach: {
      channel: 'sms',
      timeAgo: '4h ago',
      attempts: 1,
    },
  },
  {
    id: '5',
    patientName: 'David Kim',
    appointmentTime: 'In 8 hours',
    provider: 'Dr. Patel',
    visitType: 'Follow-up',
    status: 'not-started',
    lastOutreach: {
      channel: 'call',
      timeAgo: '30m ago',
      attempts: 3,
    },
  },
  {
    id: '6',
    patientName: 'Rachel Green',
    appointmentTime: 'Tomorrow 2:00 PM',
    provider: 'Dr. Chen',
    visitType: 'Annual checkup',
    status: 'submitted',
    lastOutreach: {
      channel: 'sms',
      timeAgo: '2h ago',
      attempts: 1,
    },
  },
];

export function IntakeReadinessPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [providerFilter, setProviderFilter] = useState('all');

  // Calculate counts
  const needsAction = mockIntakeData.filter(
    item => item.status === 'not-started' || item.status === 'in-progress'
  ).length;

  const atRisk = mockIntakeData.filter(
    item => item.status === 'overdue'
  ).length;

  const ready = mockIntakeData.filter(
    item => item.status === 'submitted'
  ).length;

  // Filter data
  const getFilteredData = () => {
    if (activeFilter === 'all') return mockIntakeData;
    if (activeFilter === 'action') {
      return mockIntakeData.filter(
        item => item.status === 'not-started' || item.status === 'in-progress'
      );
    }
    if (activeFilter === 'risk') {
      return mockIntakeData.filter(item => item.status === 'overdue');
    }
    if (activeFilter === 'ready') {
      return mockIntakeData.filter(item => item.status === 'submitted');
    }
    return mockIntakeData;
  };

  const filteredData = getFilteredData();

  const handleAction = (id: string) => {
    console.log('Action for intake:', id);
  };

  const handleCardClick = (id: string) => {
    console.log('View intake details:', id);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Page Header */}
      <div className="border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 style={{ color: 'var(--text-primary)' }}>Intake Readiness</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Track patient readiness before appointments
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Date Selector */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                />
              </div>

              {/* Provider Filter */}
              <div className="relative">
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <option value="all">All Providers</option>
                  <option value="chen">Dr. Chen</option>
                  <option value="patel">Dr. Patel</option>
                  <option value="ross">Dr. Ross</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Readiness Overview Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <ReadinessCard
            label="Needs action now"
            subtext="Appointments within 24h"
            count={needsAction}
            variant="action"
            onClick={() => setActiveFilter(activeFilter === 'action' ? 'all' : 'action')}
          />
          <ReadinessCard
            label="At risk"
            subtext="Overdue or no response"
            count={atRisk}
            variant="risk"
            onClick={() => setActiveFilter(activeFilter === 'risk' ? 'all' : 'risk')}
          />
          <ReadinessCard
            label="Ready"
            subtext="All intake complete"
            count={ready}
            variant="ready"
            onClick={() => setActiveFilter(activeFilter === 'ready' ? 'all' : 'ready')}
          />
        </div>

        {/* Active Filter Indicator */}
        {activeFilter !== 'all' && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Filtered by:
            </span>
            <button
              onClick={() => setActiveFilter('all')}
              className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: 'var(--surface-card)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              <span className="ml-2">×</span>
            </button>
          </div>
        )}

        {/* Intake Priority Queue */}
        <div className="space-y-3">
          {filteredData.length === 0 ? (
            <div
              className="rounded-[18px] p-12 text-center"
              style={{ backgroundColor: 'var(--surface-card)' }}
            >
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No intake tasks match the current filter.
              </p>
            </div>
          ) : (
            filteredData.map((item) => (
              <IntakeTaskCard
                key={item.id}
                patientName={item.patientName}
                appointmentTime={item.appointmentTime}
                provider={item.provider}
                visitType={item.visitType}
                status={item.status}
                progress={item.progress}
                lastOutreach={item.lastOutreach}
                onAction={() => handleAction(item.id)}
                onClick={() => handleCardClick(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}