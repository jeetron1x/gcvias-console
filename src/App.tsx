import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ConsolePage } from './pages/ConsolePage';
import { InfrastructureRegistryPage } from './pages/InfrastructureRegistryPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DispatchLogModal } from './components/audit/DispatchLogModal';

import { ACTIVE_CYCLONE_EVENTS } from './data/cycloneData';
import { COASTAL_INFRASTRUCTURE } from './data/infrastructureData';
import { CycloneEvent, AuthorityRole, InfrastructureAsset, DispatchAuditRecord } from './types';

export const App: React.FC = () => {
  const [activeCyclone, setActiveCyclone] = useState<CycloneEvent>(ACTIVE_CYCLONE_EVENTS[0]);
  const [activeRole, setActiveRole] = useState<AuthorityRole>('SDMA');
  const [currentView, setCurrentView] = useState<
    'console' | 'registry' | 'methodology' | 'dispatches' | 'privacy' | 'terms'
  >('console');

  // Audit Dispatch Logs
  const [dispatchLogs, setDispatchLogs] = useState<DispatchAuditRecord[]>([
    {
      id: 'DISPATCH-SEED-01',
      timestamp: '2024-10-24T06:30:00Z',
      advisoryId: 'ADV-BOB-DANA-001',
      cycloneName: 'Severe Cyclonic Storm DANA',
      dispatchedByRole: 'SDMA',
      jurisdiction: 'Odisha State Coastal Zone',
      targetChannels: ['DEOC Wireless Net', 'State VHF Band', 'Coastal Siren Net'],
      recipientCount: 84,
      payloadSummary: 'Mandatory evacuation order issued for coastal wards in Dhamra and Rajnagar blocks.',
    },
    {
      id: 'DISPATCH-SEED-02',
      timestamp: '2024-10-24T00:15:00Z',
      advisoryId: 'ADV-BOB-DANA-002',
      cycloneName: 'Severe Cyclonic Storm DANA',
      dispatchedByRole: 'DISTRICT_COLLECTOR',
      jurisdiction: 'Bhadrak Coastal District',
      targetChannels: ['DEOC Wireless Net', 'Block SMS Relay'],
      recipientCount: 36,
      payloadSummary: 'Pre-positioning of heavy tree-cutting teams and emergency diesel generators along NH-16 corridor.',
    }
  ]);

  // Selected asset for mapping
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);

  const handleAddDispatchLog = (log: DispatchAuditRecord) => {
    setDispatchLogs((prev) => [log, ...prev]);
  };

  const handleSelectAssetOnMap = (asset: InfrastructureAsset) => {
    setSelectedAsset(asset);
    setCurrentView('console');
  };

  return (
    <div className="min-h-screen flex flex-col bg-command-950 text-slate-100 font-sans selection:bg-command-700 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        cyclones={ACTIVE_CYCLONE_EVENTS}
        activeCyclone={activeCyclone}
        onSelectCyclone={(c) => setActiveCyclone(c)}
        activeRole={activeRole}
        onSelectRole={(r) => setActiveRole(r)}
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'console' && (
          <ConsolePage
            activeCyclone={activeCyclone}
            activeRole={activeRole}
            allAssets={COASTAL_INFRASTRUCTURE}
            dispatchLogs={dispatchLogs}
            onAddDispatchLog={handleAddDispatchLog}
            onNavigate={(v) => setCurrentView(v)}
            selectedAsset={selectedAsset}
            onSelectAsset={setSelectedAsset}
          />
        )}

        {currentView === 'registry' && (
          <InfrastructureRegistryPage
            assets={COASTAL_INFRASTRUCTURE}
            onSelectAssetOnMap={handleSelectAssetOnMap}
          />
        )}

        {currentView === 'methodology' && <MethodologyPage />}

        {currentView === 'privacy' && <PrivacyPolicyPage />}

        {currentView === 'terms' && <TermsPage />}

        {currentView === 'dispatches' && (
          <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <DispatchLogModal
              logs={dispatchLogs}
              isOpen={true}
              onClose={() => setCurrentView('console')}
            />
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <Footer onNavigate={(v) => setCurrentView(v)} />
    </div>
  );
};
