import React, { useState } from 'react';
import { CycloneMap } from '../components/map/CycloneMap';
import { TimelineScrubber } from '../components/dashboard/TimelineScrubber';
import { TelemetryHUD } from '../components/dashboard/TelemetryHUD';
import { AssetExposureDrawer } from '../components/dashboard/AssetExposureDrawer';
import { AdvisoryConsole } from '../components/advisory/AdvisoryConsole';
import { DispatchLogModal } from '../components/audit/DispatchLogModal';
import {
  CycloneEvent,
  CycloneTrackPoint,
  InfrastructureAsset,
  AuthorityRole,
  DispatchAuditRecord
} from '../types';
import {
  interpolateTrackPoint,
  computeCoastalSurgeHazardZones,
  computeExposureSummary
} from '../utils/geospatial';
import { generateAdvisory } from '../utils/advisoryGenerator';
import { AUTHORITY_PROFILES } from '../components/layout/Navbar';

interface ConsolePageProps {
  activeCyclone: CycloneEvent;
  activeRole: AuthorityRole;
  allAssets: InfrastructureAsset[];
  dispatchLogs: DispatchAuditRecord[];
  onAddDispatchLog: (log: DispatchAuditRecord) => void;
  onNavigate: (view: 'console' | 'registry' | 'methodology' | 'dispatches' | 'privacy' | 'terms') => void;
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
}

export const ConsolePage: React.FC<ConsolePageProps> = ({
  activeCyclone,
  activeRole,
  allAssets,
  dispatchLogs,
  onAddDispatchLog,
  onNavigate,
  selectedAsset,
  onSelectAsset,
}) => {
  // Timeline offset state (-48 to +36 hours)
  const [currentOffsetHours, setCurrentOffsetHours] = useState<number>(0);

  // Advisory modal state
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [advisoryLanguage, setAdvisoryLanguage] = useState('en');

  // Compute interpolated eye telemetry at currentOffsetHours
  const currentEye: CycloneTrackPoint = interpolateTrackPoint(
    activeCyclone.track,
    currentOffsetHours
  );

  // Compute dynamic coastal surge hazard zones
  const surgeZones = computeCoastalSurgeHazardZones(currentEye);

  // Compute exposure summary for all infrastructure
  const exposureSummary = computeExposureSummary(allAssets, currentEye, surgeZones);

  // Generate structured advisory
  const activeAdvisory = generateAdvisory(
    activeCyclone.name,
    currentEye,
    exposureSummary,
    advisoryLanguage
  );

  // Profile configuration for current authority role
  const profile = AUTHORITY_PROFILES[activeRole];

  // Map center: if asset selected, focus on asset, otherwise profile default
  const mapCenter: [number, number] = selectedAsset
    ? [selectedAsset.lat, selectedAsset.lng]
    : profile.centerCoordinates;
  const mapZoom = selectedAsset ? 13 : profile.defaultZoom;

  const handleDispatch = (channels: string[]) => {
    const newLog: DispatchAuditRecord = {
      id: `DISPATCH-${Date.now()}`,
      timestamp: new Date().toISOString(),
      advisoryId: activeAdvisory.advisoryId,
      cycloneName: activeCyclone.name,
      dispatchedByRole: activeRole,
      jurisdiction: profile.jurisdictionName,
      targetChannels: channels,
      recipientCount: 42,
      payloadSummary: activeAdvisory.severityHeadline,
    };
    onAddDispatchLog(newLog);
  };

  return (
    <div className="p-3 sm:p-4 max-w-[1600px] mx-auto space-y-4 font-sans">
      {/* Top Situational Status Bar */}
      <div className="bg-command-900 border border-command-800 rounded-lg p-3 flex flex-wrap items-center justify-between text-xs font-mono gap-2 shadow">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-hazard-severe animate-pulse"></span>
          <span className="font-bold text-slate-100">OPERATIONAL SECTOR: {profile.jurisdictionName.toUpperCase()}</span>
          <span className="text-command-600">|</span>
          <span className="text-slate-400">AUTHORITY: {profile.roleTitle}</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-300">
          <span>COASTLINE STATUS: ADVISORY IN EFFECT</span>
          <span className="text-command-600">|</span>
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="text-amber-400 hover:text-amber-300 underline font-bold"
          >
            DISPATCH LOG ({dispatchLogs.length})
          </button>
        </div>
      </div>

      {/* Main Grid: Map & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left/Main Column: Map & Timeline Scrubber (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-4">
          <CycloneMap
            currentEye={currentEye}
            trackPoints={activeCyclone.track}
            assets={allAssets}
            assessments={exposureSummary.allExposed}
            surgeZones={surgeZones}
            selectedAsset={selectedAsset}
            onSelectAsset={onSelectAsset}
            center={mapCenter}
            zoom={mapZoom}
          />

          <TimelineScrubber
            trackPoints={activeCyclone.track}
            currentOffset={currentOffsetHours}
            onOffsetChange={(offset) => setCurrentOffsetHours(offset)}
            landfallEtaHours={activeCyclone.landfall.estimatedEtaHours}
          />
        </div>

        {/* Right Column: Telemetry HUD & Asset Queue (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <TelemetryHUD
            currentEye={currentEye}
            exposure={exposureSummary}
            onOpenAdvisory={() => setIsAdvisoryOpen(true)}
            onOpenRegistry={() => onNavigate('registry')}
          />

          <div className="h-[430px]">
            <AssetExposureDrawer
              assessments={exposureSummary.allExposed}
              selectedAsset={selectedAsset}
              onSelectAsset={onSelectAsset}
            />
          </div>
        </div>
      </div>

      {/* Advisory Modal */}
      <AdvisoryConsole
        advisory={activeAdvisory}
        isOpen={isAdvisoryOpen}
        onClose={() => setIsAdvisoryOpen(false)}
        onDispatch={handleDispatch}
        activeRole={activeRole}
        selectedLanguage={advisoryLanguage}
        onChangeLanguage={(lang) => setAdvisoryLanguage(lang)}
      />

      {/* Audit Modal */}
      <DispatchLogModal
        logs={dispatchLogs}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
};
