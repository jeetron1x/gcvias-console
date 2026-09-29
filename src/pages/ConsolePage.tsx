import React, { useState } from 'react';
import { CycloneMap } from '../components/map/CycloneMap';
import { ZoomEarthSidebar } from '../components/zoomearth/ZoomEarthSidebar';
import { ZoomEarthForecastCard } from '../components/zoomearth/ZoomEarthForecastCard';
import { ZoomEarthScrubber } from '../components/zoomearth/ZoomEarthScrubber';
import { ZoomEarthLegend } from '../components/zoomearth/ZoomEarthLegend';
import { GeminiRiskEngineDrawer } from '../components/ai/GeminiRiskEngineDrawer';
import {
  CycloneEvent,
  CycloneTrackPoint,
  InfrastructureAsset,
  AuthorityRole,
  DispatchAuditRecord,
  MapDisplayMode,
  SatelliteSubMode,
  WindSubMode
} from '../types';
import {
  interpolateTrackPoint,
  computeCoastalSurgeHazardZones,
  computeExposureSummary
} from '../utils/geospatial';

interface ConsolePageProps {
  activeCyclone: CycloneEvent;
  onSelectCyclone: (c: CycloneEvent) => void;
  cyclones: CycloneEvent[];
  activeRole: AuthorityRole;
  allAssets: InfrastructureAsset[];
  onAddDispatchLog: (log: DispatchAuditRecord) => void;
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
  onNavigate: (view: 'console' | 'registry' | 'methodology' | 'dispatches' | 'privacy' | 'terms') => void;
}

export const ConsolePage: React.FC<ConsolePageProps> = ({
  activeCyclone,
  onSelectCyclone,
  cyclones,
  activeRole,
  allAssets,
  onAddDispatchLog,
  selectedAsset,
  onSelectAsset,
  onNavigate,
}) => {
  // Zoom Earth display modes (default to 'precipitation' matching user's Image 1)
  const [displayMode, setDisplayMode] = useState<MapDisplayMode>('precipitation');
  const [satelliteSubMode, setSatelliteSubMode] = useState<SatelliteSubMode>('live');
  const [windSubMode, setWindSubMode] = useState<WindSubMode>('speed');
  const [showAssets, setShowAssets] = useState<boolean>(true);
  const [isGeminiDrawerOpen, setIsGeminiDrawerOpen] = useState<boolean>(false);

  // Timeline offset state (-48 to +36 hours)
  const [currentOffsetHours, setCurrentOffsetHours] = useState<number>(0);

  // Hover coordinates for Zoom Earth bottom-left legend
  const [hoverCoords, setHoverCoords] = useState<[number, number]>([
    activeCyclone.centerCoordinates[0],
    activeCyclone.centerCoordinates[1],
  ]);

  // Compute interpolated eye telemetry at currentOffsetHours
  const currentEye: CycloneTrackPoint = interpolateTrackPoint(
    activeCyclone.track,
    currentOffsetHours
  );

  // Compute dynamic coastal surge hazard zones
  const surgeZones = computeCoastalSurgeHazardZones(currentEye);

  // Filter assets relevant to the active storm's region or global set
  const regionAssets = allAssets.filter((a) => {
    // If asset is within 600km of cyclone track or center
    const dLat = Math.abs(a.lat - activeCyclone.centerCoordinates[0]);
    const dLng = Math.abs(a.lng - activeCyclone.centerCoordinates[1]);
    return dLat < 6.0 && dLng < 8.0;
  });

  const activeAssetPool = regionAssets.length > 0 ? regionAssets : allAssets;

  // Compute exposure summary for infrastructure
  const exposureSummary = computeExposureSummary(activeAssetPool, currentEye, surgeZones);

  // Center on selected asset or storm center
  const mapCenter: [number, number] = selectedAsset
    ? [selectedAsset.lat, selectedAsset.lng]
    : [currentEye.lat, currentEye.lng];
  const mapZoom = selectedAsset ? 12 : activeCyclone.defaultZoom;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#070C14]">
      {/* 1. Full-Bleed Map Canvas with Animated Streamlines & Radar Overlays */}
      <CycloneMap
        currentEye={currentEye}
        trackPoints={activeCyclone.track}
        assets={activeAssetPool}
        assessments={exposureSummary.allExposed}
        surgeZones={surgeZones}
        selectedAsset={selectedAsset}
        onSelectAsset={onSelectAsset}
        center={mapCenter}
        zoom={mapZoom}
        displayMode={displayMode}
        satelliteSubMode={satelliteSubMode}
        windSubMode={windSubMode}
        showAssets={showAssets}
        onHoverCoordinates={(coords) => setHoverCoords(coords)}
      />

      {/* 2. Zoom Earth Left Floating Glass Sidebar (Exact look of Image 1, 2, 3) */}
      <ZoomEarthSidebar
        displayMode={displayMode}
        onChangeDisplayMode={(mode) => setDisplayMode(mode)}
        satelliteSubMode={satelliteSubMode}
        onChangeSatelliteSubMode={(sub) => setSatelliteSubMode(sub)}
        windSubMode={windSubMode}
        onChangeWindSubMode={(sub) => setWindSubMode(sub)}
        cyclones={cyclones}
        activeCyclone={activeCyclone}
        onSelectCyclone={(c) => {
          onSelectCyclone(c);
          setCurrentOffsetHours(0);
          onSelectAsset(null);
        }}
        showAssets={showAssets}
        onToggleAssets={(s) => setShowAssets(s)}
        onOpenGeminiDrawer={() => setIsGeminiDrawerOpen(true)}
        onOpenDispatches={() => onNavigate('dispatches')}
        onOpenRegistry={() => onNavigate('registry')}
      />

      {/* 3. Zoom Earth Top-Right Location & 5-Day Forecast Card (Exact look of Image 1, 2, 3) */}
      <ZoomEarthForecastCard
        currentEye={currentEye}
        activeCyclone={activeCyclone}
        displayMode={displayMode}
        selectedAsset={selectedAsset}
        onClearAsset={() => onSelectAsset(null)}
        onOpenGeminiDrawer={() => setIsGeminiDrawerOpen(true)}
        onOpenMethodology={() => onNavigate('methodology')}
        onOpenPrivacy={() => onNavigate('privacy')}
      />

      {/* 4. Zoom Earth Bottom-Center Timeline Scrubber (Exact look of Image 1, 2, 3) */}
      <ZoomEarthScrubber
        trackPoints={activeCyclone.track}
        currentOffset={currentOffsetHours}
        onOffsetChange={(offset) => setCurrentOffsetHours(offset)}
      />

      {/* 5. Zoom Earth Bottom-Left Contextual Legend & Coordinates */}
      <ZoomEarthLegend
        displayMode={displayMode}
        hoverCoordinates={hoverCoords}
      />

      {/* 6. Gemini 3.7 Flash Multimodal Risk & Damage Pathways Drawer */}
      <GeminiRiskEngineDrawer
        isOpen={isGeminiDrawerOpen}
        onClose={() => setIsGeminiDrawerOpen(false)}
        activeCyclone={activeCyclone}
        currentEye={currentEye}
        assets={activeAssetPool}
        exposure={exposureSummary}
        onAddDispatchLog={onAddDispatchLog}
        activeRole={activeRole}
      />
    </div>
  );
};
