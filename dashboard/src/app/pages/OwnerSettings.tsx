import { useState, useEffect } from 'react';
import { CheckCircle2, Building2, Users, CreditCard, BarChart3 } from 'lucide-react';
import { ClinicProfileTab } from '../components/settings/tabs/ClinicProfileTab';
import { UsersPermissionsTab } from '../components/settings/tabs/UsersPermissionsTab';

type OwnerSettingsTab = 'clinic-profile' | 'users' | 'billing' | 'reporting' | 'locations';

export function OwnerSettings() {
  const [activeTab, setActiveTab] = useState<OwnerSettingsTab>('clinic-profile');
  const [showUpdatedToast, setShowUpdatedToast] = useState(false);

  // Show "Updated" toast briefly when tab changes (simulates save)
  useEffect(() => {
    setShowUpdatedToast(true);
    const timer = setTimeout(() => setShowUpdatedToast(false), 2000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const ownerTabs = [
    { id: 'clinic-profile' as OwnerSettingsTab, icon: Building2, label: 'Clinic Profile', description: 'Business information and branding' },
    { id: 'locations' as OwnerSettingsTab, icon: Building2, label: 'Locations', description: 'Manage clinic locations' },
    { id: 'users' as OwnerSettingsTab, icon: Users, label: 'Users & Roles', description: 'Add or remove Admins and Doctors' },
    { id: 'billing' as OwnerSettingsTab, icon: CreditCard, label: 'Billing & Subscription', description: 'Payment and subscription settings' },
    { id: 'reporting' as OwnerSettingsTab, icon: BarChart3, label: 'Reporting Preferences', description: 'KPI targets and report frequency' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clinic-profile':
        return <ClinicProfileTab />;
      case 'users':
        return <UsersPermissionsTab />;
      case 'locations':
        return <LocationsTab />;
      case 'billing':
        return <BillingTab />;
      case 'reporting':
        return <ReportingTab />;
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    const titles: Record<OwnerSettingsTab, string> = {
      'clinic-profile': 'Clinic Profile',
      'locations': 'Locations',
      'users': 'Users & Roles',
      'billing': 'Billing & Subscription',
      'reporting': 'Reporting Preferences',
    };
    return titles[activeTab];
  };

  const getTabDescription = () => {
    const descriptions: Record<OwnerSettingsTab, string> = {
      'clinic-profile': 'Update business information, branding, and clinic details',
      'locations': 'Add, edit, or remove clinic locations',
      'users': 'Manage user accounts and role assignments',
      'billing': 'View subscription details and payment methods',
      'reporting': 'Configure KPI targets and reporting frequency',
    };
    return descriptions[activeTab];
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Internal Left Rail */}
      <div
        className="w-64 border-r flex-shrink-0 overflow-y-auto"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="p-6">
          <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Owner Settings
          </h2>
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Business and subscription controls
          </p>

          <div className="space-y-1">
            {ownerTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-primary-bg)' : 'transparent',
                    color: isActive ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                  }}
                >
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{tab.label}</div>
                    <div className="text-xs opacity-70 line-clamp-1">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Tab Header */}
          <div className="mb-8">
            <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>
              {getTabTitle()}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {getTabDescription()}
            </p>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>

      {/* Updated Toast */}
      {showUpdatedToast && (
        <div
          className="fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-fade-in z-50"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--status-success-bg)' }}
          >
            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Settings updated
          </span>
        </div>
      )}
    </div>
  );
}

// Location Management Tab
function LocationsTab() {
  const locations = [
    { id: 'loc1', name: 'Downtown Clinic', address: '123 Main St, Suite 100', phone: '(555) 123-4567', active: true },
    { id: 'loc2', name: 'Westside Clinic', address: '456 Oak Ave, Building B', phone: '(555) 234-5678', active: true },
    { id: 'loc3', name: 'North Campus', address: '789 Elm Street, Floor 3', phone: '(555) 345-6789', active: false },
  ];

  return (
    <div className="space-y-6">
      <div
        className="p-6 rounded-[18px] border"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Clinic Locations
          </h3>
          <button
            className="px-4 py-2 rounded-full font-medium text-sm transition-all"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
            }}
          >
            Add Location
          </button>
        </div>

        <div className="space-y-3">
          {locations.map((location) => (
            <div
              key={location.id}
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--cf-neutral-20)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {location.name}
                    </h4>
                    {location.active && (
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--status-success-bg)',
                          color: 'var(--status-success)',
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {location.address}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {location.phone}
                  </p>
                </div>
                <button
                  className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    color: 'var(--accent-primary)',
                    backgroundColor: 'transparent',
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Billing & Subscription Tab
function BillingTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div
        className="p-6 rounded-[18px] border"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Current Plan
        </h3>
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <h4 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Professional Plan
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Up to 5 providers • Unlimited patients • Full Voice AI
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              $599
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              per month
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-full font-medium text-sm transition-all"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
            }}
          >
            Upgrade Plan
          </button>
          <button
            className="px-4 py-2 rounded-full font-medium text-sm transition-all border"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            View All Plans
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div
        className="p-6 rounded-[18px] border"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Payment Method
        </h3>
        
        <div
          className="p-4 rounded-xl border flex items-center justify-between"
          style={{
            backgroundColor: 'var(--cf-neutral-20)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold"
              style={{
                backgroundColor: 'var(--accent-primary-bg)',
                color: 'var(--accent-primary-text)',
              }}
            >
              💳
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                •••• •••• •••• 4242
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Expires 12/2027
              </p>
            </div>
          </div>
          <button
            className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: 'var(--accent-primary)',
              backgroundColor: 'transparent',
            }}
          >
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div
        className="p-6 rounded-[18px] border"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Recent Invoices
        </h3>
        
        <div className="space-y-2">
          {[
            { date: 'Jan 1, 2026', amount: '$599.00', status: 'Paid' },
            { date: 'Dec 1, 2025', amount: '$599.00', status: 'Paid' },
            { date: 'Nov 1, 2025', amount: '$599.00', status: 'Paid' },
          ].map((invoice, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {invoice.date}
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {invoice.amount}
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: 'var(--status-success-bg)',
                  color: 'var(--status-success)',
                }}
              >
                {invoice.status}
              </span>
              <button
                className="text-sm font-medium"
                style={{ color: 'var(--accent-primary)' }}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reporting Preferences Tab
function ReportingTab() {
  return (
    <div className="space-y-6">
      {/* KPI Targets */}
      <div
        className="p-6 rounded-[18px] border"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          KPI Targets
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Target No-Show Rate (%)
            </label>
            <input
              type="number"
              defaultValue="5"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Target Utilization Rate (%)
            </label>
            <input
              type="number"
              defaultValue="85"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Target AI Success Rate (%)
            </label>
            <input
              type="number"
              defaultValue="75"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Report Frequency */}
      <div
        className="p-6 rounded-[18px] border"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Report Delivery
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email Reports To
            </label>
            <input
              type="email"
              defaultValue="owner@clinic.com"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Frequency
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}