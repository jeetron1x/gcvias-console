import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/layout/SplashScreen';
import { ConsolePage } from './pages/ConsolePage';
import { InfrastructureRegistryPage } from './pages/InfrastructureRegistryPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DispatchLogModal } from './components/audit/DispatchLogModal';
import { ArrowLeft } from 'lucide-react';

import { ACTIVE_CYCLONE_EVENTS } from './data/cycloneData';
import { COASTAL_INFRASTRUCTURE } from './data/infrastructureData';
import { CycloneEvent, AuthorityRole, InfrastructureAsset, DispatchAuditRecord } from './types';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeCyclone, setActiveCyclone] = useState<CycloneEvent>(ACTIVE_CYCLONE_EVENTS[0]);
  const [activeRole] = useState<AuthorityRole>('SDMA');
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
      jurisdiction: 'Bay of Bengal Coastal Zone',
      targetChannels: ['DEOC Wireless Net', 'State VHF Band', 'Coastal Siren Net'],
      recipientCount: 84,
      payloadSummary: 'Mandatory evacuation order issued for coastal wards in Dhamra and Rajnagar blocks.',
    },
    {
      id: 'DISPATCH-SEED-02',
      timestamp: '2024-10-09T18:00:00Z',
      advisoryId: 'ADV-NATL-MILTON-001',
      cycloneName: 'Major Hurricane MILTON',
      dispatchedByRole: 'SDMA',
      jurisdiction: 'Tampa Bay Unified Command',
      targetChannels: ['NOAA Weather Radio', 'State Emergency Wireless Net'],
      recipientCount: 156,
      payloadSummary: 'Immediate mandatory evacuation of Zone A & B barrier islands and low-lying coastal corridors.',
    }
  ]);

  // Selected asset for mapping
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);

  // Esc key listener to return to live map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentView !== 'console') {
        setCurrentView('console');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  const handleAddDispatchLog = (log: DispatchAuditRecord) => {
    setDispatchLogs((prev) => [log, ...prev]);
  };

  const handleSelectAssetOnMap = (asset: InfrastructureAsset) => {
    setSelectedAsset(asset);
    setCurrentView('console');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070C14] text-slate-100 font-sans select-none">
      {/* 1. Minimalist Meteorological Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. Persistent Full-Bleed Zoom Earth Map Canvas */}
      <ConsolePage
        activeCyclone={activeCyclone}
        onSelectCyclone={(c) => setActiveCyclone(c)}
        cyclones={ACTIVE_CYCLONE_EVENTS}
        activeRole={activeRole}
        allAssets={COASTAL_INFRASTRUCTURE}
        onAddDispatchLog={handleAddDispatchLog}
        selectedAsset={selectedAsset}
        onSelectAsset={setSelectedAsset}
        onNavigate={(v) => setCurrentView(v)}
      />

      {/* 3. Dispatch Log Modal Overlay */}
      {currentView === 'dispatches' && (
        <DispatchLogModal
          logs={dispatchLogs}
          isOpen={true}
          onClose={() => setCurrentView('console')}
        />
      )}

      {/* 4. Smooth Secondary Views Overlay (Registry, Methodology, Privacy, Terms) */}
      {currentView !== 'console' && currentView !== 'dispatches' && (
        <div className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-start p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-6xl my-auto py-4">
            {/* Header Return Bar */}
            <div className="flex items-center justify-between mb-3 bg-[#121926]/95 border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-2.5 font-mono text-xs text-slate-300">
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
                <span className="font-bold text-white uppercase tracking-wider">{currentView}</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400 text-[11px]">ZOOM EARTH AI RESILIENCE CONSOLE</span>
              </div>
              <button
                onClick={() => setCurrentView('console')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white rounded-lg border border-slate-600 text-xs font-mono transition-all cursor-pointer shadow"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Live Map</span>
              </button>
            </div>

            {/* Dynamic View Component */}
            <div className="bg-[#121926]/90 border border-slate-800 rounded-xl shadow-2xl p-4 sm:p-6 max-h-[82vh] overflow-y-auto custom-scrollbar">
              {currentView === 'registry' && (
                <InfrastructureRegistryPage
                  assets={COASTAL_INFRASTRUCTURE}
                  onSelectAssetOnMap={handleSelectAssetOnMap}
                />
              )}
              {currentView === 'methodology' && <MethodologyPage />}
              {currentView === 'privacy' && <PrivacyPolicyPage />}
              {currentView === 'terms' && <TermsPage />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
