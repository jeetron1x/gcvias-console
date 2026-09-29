import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  Circle,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import {
  CycloneTrackPoint,
  InfrastructureAsset,
  RiskBand,
  AssetExposureAssessment,
  MapDisplayMode,
  SatelliteSubMode,
  WindSubMode
} from '../../types';
import {
  generateForecastConePolygon,
  CoastalHazardZone
} from '../../utils/geospatial';
import { WindParticlesLayer } from './WindParticlesLayer';
import { PrecipitationRadarLayer } from './PrecipitationRadarLayer';
import {
  Plus,
  Minus,
  LocateFixed,
  Layers
} from 'lucide-react';

interface CycloneMapProps {
  currentEye: CycloneTrackPoint;
  trackPoints: CycloneTrackPoint[];
  assets: InfrastructureAsset[];
  assessments: AssetExposureAssessment[];
  surgeZones: CoastalHazardZone[];
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
  center: [number, number];
  zoom: number;
  displayMode: MapDisplayMode;
  satelliteSubMode: SatelliteSubMode;
  windSubMode: WindSubMode;
  showAssets: boolean;
  onHoverCoordinates: (coords: [number, number]) => void;
}

// Map Controller for smooth flyTo panning
const MapViewController: React.FC<{
  center: [number, number];
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
};

// Map Hover Listener to capture cursor coordinates
const MapCoordinatesTracker: React.FC<{
  onHoverCoordinates: (coords: [number, number]) => void;
}> = ({ onHoverCoordinates }) => {
  useMapEvents({
    mousemove(e) {
      onHoverCoordinates([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

// Custom Zoom FAB Controls with Layer Toggle
const ZoomFabControls: React.FC<{
  onRecenter: () => void;
  currentLayer: string;
  onToggleLayer: () => void;
}> = ({ onRecenter, currentLayer, onToggleLayer }) => {
  const map = useMap();

  return (
    <div className="fixed bottom-4 right-4 z-[950] flex flex-col space-y-1.5 select-none pointer-events-auto">
      <div className="bg-[#121926]/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md p-1 flex flex-col space-y-1">
        <button
          onClick={() => map.zoomIn()}
          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="h-[1px] bg-slate-800 mx-1"></div>
        <button
          onClick={() => map.zoomOut()}
          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onToggleLayer}
        className="w-9 h-9 flex items-center justify-center bg-[#121926]/95 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md transition-all cursor-pointer"
        title={`Current basemap: ${currentLayer}. Click to toggle (Dark / OSM / Satellite).`}
      >
        <Layers className="w-4 h-4 text-emerald-400" />
      </button>

      <button
        onClick={onRecenter}
        className="w-9 h-9 flex items-center justify-center bg-[#121926]/95 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md transition-all cursor-pointer"
        title="Center on storm eye"
      >
        <LocateFixed className="w-4 h-4 text-sky-400" />
      </button>
    </div>
  );
};

export const CycloneMap: React.FC<CycloneMapProps> = ({
  currentEye,
  trackPoints,
  assets,
  assessments,
  surgeZones,
  selectedAsset,
  onSelectAsset,
  center,
  zoom,
  displayMode,
  satelliteSubMode,
  showAssets,
  onHoverCoordinates,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState<number>(zoom);
  const [tileOverride, setTileOverride] = useState<'auto' | 'dark' | 'osm' | 'satellite'>('auto');

  useEffect(() => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [center, zoom]);

  // Track coordinates for Polyline
  const fullTrackCoords: [number, number][] = trackPoints.map((pt) => [pt.lat, pt.lng]);

  // Dynamic Uncertainty Forecast Cone
  const conePolygon = generateForecastConePolygon(trackPoints, currentEye.offsetHours);

  // Robust, zero-key, unblocked tile endpoints
  const getTileConfig = () => {
    if (tileOverride === 'osm') {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        subdomains: 'abc',
        attribution: '© OpenStreetMap contributors'
      };
    }
    if (tileOverride === 'satellite' || (tileOverride === 'auto' && displayMode === 'satellite')) {
      return {
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        subdomains: undefined,
        attribution: `Satellite © GEE Sentinel / ESRI (${satelliteSubMode === 'hd' ? 'HD Infrared' : 'Composite'})`
      };
    }
    // High reliability Dark Basemap with subdomains
    return {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      subdomains: 'abcd',
      attribution: '© OpenStreetMap, © CartoDB, GEE Meteorological Feeds'
    };
  };

  const handleCycleLayer = () => {
    setTileOverride((prev) => {
      if (prev === 'auto') return 'osm';
      if (prev === 'osm') return 'satellite';
      if (prev === 'satellite') return 'dark';
      return 'auto';
    });
  };

  const tileConfig = getTileConfig();

  // Custom storm center eye icon with green/amber Zoom Earth tooltip badge
  const createEyeMarkerIcon = () => {
    const isMajor = currentEye.maxWindKmh >= 180;
    const badgeBg = isMajor ? 'bg-red-600 border-red-400' : 'bg-emerald-600 border-emerald-400';

    return L.divIcon({
      className: 'custom-eye-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <!-- Pulse ring -->
          <div class="absolute w-12 h-12 rounded-full border-2 border-sky-400/80 animate-ping opacity-75"></div>
          <div class="absolute w-8 h-8 rounded-full border border-sky-500/90 animate-pulse bg-sky-500/20"></div>
          <!-- Storm Center Dot -->
          <div class="w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-600 shadow-xl z-20"></div>
          <!-- Zoom Earth Tooltip Badge (Exact from Image 3) -->
          <div class="absolute left-6 -top-5 z-30 pointer-events-auto ${badgeBg} text-white px-2 py-1 rounded-lg shadow-xl font-mono text-[10px] leading-tight border flex flex-col whitespace-nowrap min-w-[110px]">
            <span class="font-bold text-[11px]">${currentEye.category}</span>
            <span class="text-slate-100 font-semibold">${currentEye.maxWindKmh} km/h • ${currentEye.centralPressureHpa} hPa</span>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Asset marker icon generator
  const getAssetMarkerIcon = (asset: InfrastructureAsset, riskBand: RiskBand) => {
    let color = '#38bdf8'; // Blue
    if (riskBand === 'Severe') color = '#dc2626'; // Red
    else if (riskBand === 'High') color = '#f97316'; // Orange
    else if (riskBand === 'Moderate') color = '#eab308'; // Yellow

    let symbol = '⚡';
    if (asset.type === 'hospital') symbol = '🏥';
    else if (asset.type === 'shelter') symbol = '🛡️';
    else if (asset.type === 'highway') symbol = '🛣️';

    return L.divIcon({
      className: 'custom-asset-marker',
      html: `
        <div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 6px; border: 1.5px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-size: 11px;">
          ${symbol}
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#070C14] select-none">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        zoomControl={false}
        className="w-full h-full z-0 bg-[#070C14]"
      >
        <MapViewController center={mapCenter} zoom={mapZoom} />
        <MapCoordinatesTracker onHoverCoordinates={onHoverCoordinates} />

        {/* 1. Underlying Satellite or Dark Basemap */}
        <TileLayer
          key={tileConfig.url}
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          subdomains={tileConfig.subdomains || 'abc'}
          maxZoom={19}
        />

        {/* 2. Interactive Wind Vector Particles (60fps Canvas Animation when Wind mode active) */}
        <WindParticlesLayer
          currentEye={currentEye}
          enabled={displayMode === 'wind'}
        />

        {/* 3. Convective Precipitation Radar Layer (when Precipitation or Radar active) */}
        <PrecipitationRadarLayer
          currentEye={currentEye}
          enabled={displayMode === 'precipitation' || displayMode === 'radar'}
        />

        {/* 4. Forecast Uncertainty Cone */}
        {conePolygon.length > 2 && (
          <Polygon
            positions={conePolygon}
            pathOptions={{
              color: '#38bdf8',
              weight: 1.5,
              dashArray: '4 4',
              fillColor: '#0284c7',
              fillOpacity: 0.12,
            }}
          />
        )}

        {/* 5. Cyclone Past & Forecast Track Line */}
        {fullTrackCoords.length > 1 && (
          <Polyline
            positions={fullTrackCoords}
            pathOptions={{
              color: '#10b981',
              weight: 2.5,
              opacity: 0.9,
            }}
          />
        )}

        {/* 6. Track Waypoint Dots */}
        {trackPoints.map((pt, idx) => {
          const isPast = pt.phase === 'past';

          return (
            <Circle
              key={idx}
              center={[pt.lat, pt.lng]}
              radius={isPast ? 12000 : 16000}
              pathOptions={{
                color: isPast ? '#059669' : '#0284c7',
                fillColor: isPast ? '#10b981' : '#38bdf8',
                fillOpacity: 0.85,
                weight: 1.5,
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="font-mono text-xs p-1 space-y-1 text-slate-200">
                  <div className="font-bold text-white text-[11px]">{pt.category}</div>
                  <div className="text-[10px] text-slate-400">T{pt.offsetHours >= 0 ? `+${pt.offsetHours}` : pt.offsetHours}h</div>
                  <div>Wind: <span className="text-sky-400 font-bold">{pt.maxWindKmh} km/h</span></div>
                  <div>Pressure: <span className="text-slate-200">{pt.centralPressureHpa} hPa</span></div>
                  <div>Surge: <span className="text-red-400">{pt.surgeEstimateMeters} m</span></div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* 7. Storm Surge Inundation Zones (active in Surge mode or default) */}
        {(displayMode === 'surge' || displayMode === 'precipitation') &&
          surgeZones.map((zone) => {
            let fillColor = '#0284c7';
            if (zone.riskBand === 'Severe') fillColor = '#dc2626';
            else if (zone.riskBand === 'High') fillColor = '#ea580c';
            else if (zone.riskBand === 'Moderate') fillColor = '#ca8a04';

            return (
              <Polygon
                key={zone.segmentId}
                positions={zone.polygon}
                pathOptions={{
                  fillColor,
                  fillOpacity: 0.28,
                  weight: 1,
                  color: fillColor,
                }}
              >
                <Popup>
                  <div className="font-mono text-xs p-1">
                    <div className="font-bold text-white">{zone.name}</div>
                    <div className="text-red-400">Peak Surge: {zone.estimatedSurgeHeightMeters}m</div>
                    <div className="text-slate-300">Runup Reach: {zone.peakInundationDistanceKm} km</div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* 8. Active Storm Center Eye Marker with Zoom Earth Tooltip */}
        <Marker
          position={[currentEye.lat, currentEye.lng]}
          icon={createEyeMarkerIcon()}
        />

        {/* 9. Interactive Precipitation Tooltip pinned nearby (Image 1 style) */}
        {displayMode === 'precipitation' && (
          <Marker
            position={[currentEye.lat + 0.8, currentEye.lng - 0.6]}
            icon={L.divIcon({
              className: 'custom-rain-tooltip',
              html: `
                <div class="bg-[#121926]/95 border border-slate-700/80 rounded-xl px-2.5 py-1.5 shadow-2xl backdrop-blur-md text-white font-mono text-[10px] space-y-0.5 whitespace-nowrap">
                  <div class="flex items-center space-x-1 font-bold text-sky-400">
                    <span>🌧 Moderate Rain</span>
                  </div>
                  <div class="text-slate-300 text-[9px]">6 mm/h (Forecast)</div>
                </div>
              `,
              iconSize: [120, 40],
              iconAnchor: [60, 45],
            })}
          />
        )}

        {/* 10. Critical Infrastructure Asset Markers */}
        {showAssets &&
          assets.map((asset) => {
            const assessment = assessments.find((a) => a.asset.id === asset.id);
            const riskBand: RiskBand = assessment ? assessment.riskBand : 'Low';
            const isSelected = selectedAsset && selectedAsset.id === asset.id;

            return (
              <React.Fragment key={asset.id}>
                {isSelected && (
                  <Circle
                    center={[asset.lat, asset.lng]}
                    radius={1200}
                    pathOptions={{
                      color: '#38bdf8',
                      fillColor: '#38bdf8',
                      fillOpacity: 0.35,
                      weight: 2,
                    }}
                  />
                )}
                <Marker
                  position={[asset.lat, asset.lng]}
                  icon={getAssetMarkerIcon(asset, riskBand)}
                  eventHandlers={{
                    click: () => onSelectAsset(asset),
                  }}
                >
                  <Popup>
                    <div className="font-mono text-xs p-1 space-y-1">
                      <div className="font-bold text-white">{asset.name}</div>
                      <div className="text-amber-400 uppercase text-[10px]">{asset.type} • {asset.elevationMeters}m MSL</div>
                      <div className="text-slate-300 text-[10px]">{asset.block}, {asset.district}</div>
                      <div className="text-sky-400 font-bold">Risk: {riskBand}</div>
                      <button
                        onClick={() => onSelectAsset(asset)}
                        className="w-full mt-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 px-2 rounded text-[10px]"
                      >
                        Focus Facility
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {/* Floating Zoom Controls (+/- & Recenter & Layer Toggle) */}
        <ZoomFabControls
          onRecenter={() => setMapCenter([currentEye.lat, currentEye.lng])}
          currentLayer={tileOverride}
          onToggleLayer={handleCycleLayer}
        />
      </MapContainer>

      {/* Model & Satellite Feed Chips (Bottom Right, matching Zoom Earth screenshots) */}
      <div className="fixed bottom-4 right-16 z-[900] hidden sm:flex items-center space-x-2 font-mono text-[10px] select-none pointer-events-auto">
        <div className="bg-[#121926]/90 border border-slate-700/80 px-2 py-1 rounded-lg text-slate-300 shadow-md">
          GEE SENTINEL-3 / GOES-16
        </div>
        <div className="bg-[#121926]/90 border border-slate-700/80 px-2 py-1 rounded-lg text-sky-400 font-bold shadow-md">
          GEMINI 3.7 FLASH
        </div>
        <div className="bg-[#121926]/90 border border-slate-700/80 px-2 py-1 rounded-lg text-slate-400 shadow-md">
          ECMWF / GFS
        </div>
      </div>
    </div>
  );
};
