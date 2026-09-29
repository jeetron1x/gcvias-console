import React, { useState } from 'react';
import { CycloneMap } from '../components/map/CycloneMap';
import { TimelineScrubber } from '../components/dashboard/TimelineScrubber';
import { SlidingPanel } from '../components/dashboard/SlidingPanel';
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
  onAddDispatchLog: (log: DispatchAuditRecord) => void;
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
}

export const ConsolePage: React.FC<ConsolePageProps> = ({
  activeCyclone,
  activeRole,
  allAssets,
  onAddDispatchLog,
  selectedAsset,
  onSelectAsset,
}) => {
  // Timeline offset state (-48 to +36 hours)
  const [currentOffsetHours, setCurrentOffsetHours] = useState<number>(0);
  const [advisoryLanguage, setAdvisoryLanguage] = useState<string>('en');

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
      recipientCount: 48,
      payloadSummary: activeAdvisory.severityHeadline,
    };
    onAddDispatchLog(newLog);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#070C14]">
      {/* 1. Full-Bleed Google Maps & Zoom Earth Viewport */}
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

      {/* 2. Floating Zoom Earth Timeline Scrubber (Docked at Bottom Center) */}
      <TimelineScrubber
        trackPoints={activeCyclone.track}
        currentOffset={currentOffsetHours}
        onOffsetChange={(offset) => setCurrentOffsetHours(offset)}
        landfallEtaHours={activeCyclone.landfall.estimatedEtaHours}
        currentEye={currentEye}
      />

      {/* 3. Floating Google Maps Style Sliding Drawer (Right Side) */}
      <SlidingPanel
        currentEye={currentEye}
        exposure={exposureSummary}
        selectedAsset={selectedAsset}
        onSelectAsset={onSelectAsset}
        advisory={activeAdvisory}
        selectedLanguage={advisoryLanguage}
        onChangeLanguage={(lang) => setAdvisoryLanguage(lang)}
        onDispatch={handleDispatch}
        activeRole={activeRole}
      />
    </div>
  );
};
