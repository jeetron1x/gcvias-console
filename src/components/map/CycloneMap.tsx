import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  Circle,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  CycloneTrackPoint,
  InfrastructureAsset,
  RiskBand,
  AssetExposureAssessment,
  AssetType
} from '../../types';
import {
  generateForecastConePolygon,
  CoastalHazardZone
} from '../../utils/geospatial';
import {
  Plus,
  Minus,
  LocateFixed,
  Layers,
  Map as MapIcon,
  Eye,
  CheckCircle2,
  XCircle
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
}

// Map Controller for smooth flyTo panning
const MapViewController: React.FC<{
  center: [number, number];
  zoom: number;
  triggerCenter?: number;
}> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.4,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
};

// Custom Zoom and Recenter Toolbar inside MapContainer
const MapCustomControls: React.FC<{
  onRecenter: () => void;
}> = ({ onRecenter }) => {
  const map = useMap();

  return (
    <div className="leaflet-bottom leaflet-right !mb-28 !mr-4 z-[900] flex flex-col space-y-1.5 pointer-events-auto">
      {/* Recenter Button */}
      <button
        onClick={onRecenter}
        className="w-10 h-10 bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg shadow-xl flex items-center justify-center transition-colors"
        title="Focus Cyclone Eye"
      >
        <LocateFixed className="w-4 h-4 text-sky-400" />
      </button>

      {/* Zoom In */}
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-t-lg shadow-xl flex items-center justify-center transition-colors"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-b-lg shadow-xl flex items-center justify-center transition-colors"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
};

// Custom Marker DivIcon
const createAssetIcon = (type: AssetType, risk: RiskBand, isSelected: boolean) => {
  const colorMap: Record<RiskBand, string> = {
    Severe: '#DC2626',
    High: '#EA580C',
    Moderate: '#D97706',
    Low: '#CA8A04',
    Monitored: '#0284C7',
  };

  const bg = colorMap[risk] || '#64748B';
  const size = isSelected ? 34 : 26;
  const ring = isSelected ? 'ring-2 ring-white shadow-2xl scale-110' : 'shadow-md';

  let iconSvg = '';
  if (type === 'substation') {
    iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  } else if (type === 'hospital') {
    iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12M6 12h12"/></svg>`;
  } else if (type === 'shelter') {
    iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  } else {
    iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M3 12h18"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background-color: ${bg}; width: ${size}px; height: ${size}px;" 
           class="flex items-center justify-center rounded-lg border border-slate-900/60 ${ring} transition-all duration-200">
        ${iconSvg}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Cyclone Eye Vortex DivIcon
const createEyeIcon = () => {
  return L.divIcon({
    className: 'custom-cyclone-eye',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12">
        <div class="absolute w-12 h-12 rounded-full border-2 border-red-500 bg-red-950/40 animate-ping opacity-75"></div>
        <div class="relative w-9 h-9 rounded-full bg-red-900 border-2 border-white shadow-2xl flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDE047" stroke-width="2.5">
            <circle cx="12" cy="12" r="8" stroke="#DC2626"/>
            <path d="M12 4a8 8 0 0 1 8 8" stroke-linecap="round"/>
            <path d="M12 20a8 8 0 0 1-8-8" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
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
}) => {
  // Tile Providers: Verified public zero-key high reliability endpoints
  const [tileProvider, setTileProvider] = useState<'satellite' | 'voyager' | 'dark' | 'osm'>('satellite');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Overlay layer toggles
  const [showTrack, setShowTrack] = useState(true);
  const [showCone, setShowCone] = useState(true);
  const [showSurge, setShowSurge] = useState(true);
  const [showWindRadii, setShowWindRadii] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  const tileUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    voyager: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    dark: 'https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
    osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const tileAttributions = {
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    voyager: '&copy; CARTO &copy; OpenStreetMap contributors',
    dark: '&copy; CARTO &copy; OpenStreetMap contributors',
    osm: '&copy; OpenStreetMap contributors',
  };

  const conePolygon = generateForecastConePolygon(trackPoints, currentEye.offsetHours);

  const pastCoords: [number, number][] = trackPoints
    .filter((p) => p.offsetHours <= currentEye.offsetHours)
    .map((p) => [p.lat, p.lng]);

  const forecastCoords: [number, number][] = trackPoints
    .filter((p) => p.offsetHours >= currentEye.offsetHours)
    .map((p) => [p.lat, p.lng]);

  const filteredAssets = assets.filter((asset) => {
    if (filterType === 'all') return true;
    return asset.type === filterType;
  });

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 bg-[#070C14] overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', backgroundColor: '#070C14' }}
        zoomControl={false}
      >
        <MapViewController center={center} zoom={zoom} />
        <MapCustomControls onRecenter={() => onSelectAsset(null)} />

        {/* Base Tile Layer */}
        <TileLayer
          key={tileProvider}
          url={tileUrls[tileProvider]}
          attribution={tileAttributions[tileProvider]}
          maxZoom={19}
        />

        {/* Forecast Uncertainty Cone */}
        {showCone && conePolygon.length > 2 && (
          <Polygon
            positions={conePolygon}
            pathOptions={{
              color: '#F59E0B',
              weight: 1.5,
              dashArray: '4 4',
              fillColor: '#F59E0B',
              fillOpacity: 0.18,
            }}
          />
        )}

        {/* Coastal Storm Surge Buffers */}
        {showSurge &&
          surgeZones.map((zone) => {
            let fillColor = '#0284C7';
            if (zone.riskBand === 'Severe') fillColor = '#DC2626';
            else if (zone.riskBand === 'High') fillColor = '#EA580C';
            else if (zone.riskBand === 'Moderate') fillColor = '#D97706';

            return (
              <Polygon
                key={zone.segmentId}
                positions={zone.polygon}
                pathOptions={{
                  color: fillColor,
                  weight: 1,
                  fillColor: fillColor,
                  fillOpacity: 0.42,
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-3 text-xs font-sans text-slate-100 bg-slate-900 border border-slate-700 rounded-lg">
                    <div className="font-bold text-sm text-white mb-1">{zone.name}</div>
                    <div className="text-slate-300 mb-0.5">
                      Estimated Surge: <strong className="text-amber-400">{zone.estimatedSurgeHeightMeters}m</strong>
                    </div>
                    <div className="text-slate-300 mb-0.5">
                      Risk Rating:{' '}
                      <span className="font-bold text-red-400">{zone.riskBand}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Inland penetration depth: {zone.peakInundationDistanceKm} km
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* Past Track */}
        {showTrack && pastCoords.length > 1 && (
          <Polyline
            positions={pastCoords}
            pathOptions={{
              color: '#94A3B8',
              weight: 3,
              dashArray: '3 6',
              opacity: 0.85,
            }}
          />
        )}

        {/* Forecast Track */}
        {showTrack && forecastCoords.length > 1 && (
          <Polyline
            positions={forecastCoords}
            pathOptions={{
              color: '#DC2626',
              weight: 4,
              opacity: 0.95,
            }}
          />
        )}

        {/* Historical Track Step Markers */}
        {showTrack &&
          trackPoints.map((pt) => {
            if (pt.offsetHours === currentEye.offsetHours) return null;

            return (
              <Circle
                key={pt.timestamp}
                center={[pt.lat, pt.lng]}
                radius={pt.offsetHours > currentEye.offsetHours ? 6000 : 4000}
                pathOptions={{
                  color: pt.offsetHours > currentEye.offsetHours ? '#F59E0B' : '#94A3B8',
                  fillColor: pt.offsetHours > currentEye.offsetHours ? '#F59E0B' : '#64748B',
                  fillOpacity: 0.85,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div className="p-2.5 text-xs font-sans text-slate-100 bg-slate-900 border border-slate-700 rounded-lg">
                    <div className="font-bold text-xs text-white">{pt.category}</div>
                    <div className="text-slate-400 text-[11px] font-mono">
                      T{pt.offsetHours >= 0 ? `+${pt.offsetHours}h` : `${pt.offsetHours}h`}
                    </div>
                    <div className="text-slate-300 mt-1">Wind: {pt.maxWindKmh} km/h ({pt.maxWindKnots} kts)</div>
                    <div className="text-slate-300">Pressure: {pt.centralPressureHpa} hPa</div>
                    <div className="text-slate-300">Surge: {pt.surgeEstimateMeters} m</div>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {/* Wind Radii Circles */}
        {showWindRadii && (
          <>
            <Circle
              center={[currentEye.lat, currentEye.lng]}
              radius={currentEye.windRadiiR50Km.ne * 1000}
              pathOptions={{
                color: '#EF4444',
                weight: 1.5,
                dashArray: '2 4',
                fillColor: '#EF4444',
                fillOpacity: 0.08,
              }}
            />
            <Circle
              center={[currentEye.lat, currentEye.lng]}
              radius={currentEye.windRadiiR34Km.ne * 1000}
              pathOptions={{
                color: '#F59E0B',
                weight: 1.5,
                dashArray: '3 6',
                fillColor: '#F59E0B',
                fillOpacity: 0.05,
              }}
            />
          </>
        )}

        {/* Cyclone Eye Marker */}
        <Marker
          position={[currentEye.lat, currentEye.lng]}
          icon={createEyeIcon()}
        >
          <Popup>
            <div className="p-3 text-xs font-sans text-slate-100 bg-slate-900 border border-slate-700 rounded-lg min-w-[210px]">
              <div className="font-bold text-sm text-red-400 mb-1">
                {currentEye.category.toUpperCase()}
              </div>
              <div className="text-slate-300">Central Pressure: <strong>{currentEye.centralPressureHpa} hPa</strong></div>
              <div className="text-slate-300">Sustained Winds: <strong>{currentEye.maxWindKmh} km/h</strong></div>
              <div className="text-slate-300">Eye Diameter: <strong>{currentEye.eyeRadiusKm * 2} km</strong></div>
              <div className="text-slate-400 text-[11px] mt-1 font-mono">
                {currentEye.lat.toFixed(2)}N, {currentEye.lng.toFixed(2)}E
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Critical Infrastructure Markers */}
        {filteredAssets.map((asset) => {
          const assessment = assessments.find((a) => a.asset.id === asset.id);
          const risk: RiskBand = assessment ? assessment.riskBand : 'Monitored';
          const isSelected = selectedAsset?.id === asset.id;

          return (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              icon={createAssetIcon(asset.type, risk, isSelected)}
              eventHandlers={{
                click: () => onSelectAsset(asset),
              }}
            >
              <Popup>
                <div className="p-3 text-xs font-sans text-slate-100 bg-slate-900 border border-slate-700 rounded-lg max-w-[250px]">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {asset.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                        risk === 'Severe'
                          ? 'bg-red-600'
                          : risk === 'High'
                          ? 'bg-orange-600'
                          : risk === 'Moderate'
                          ? 'bg-amber-600'
                          : 'bg-blue-600'
                      }`}
                    >
                      {risk}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white leading-snug mb-1">{asset.name}</h4>
                  <div className="text-slate-400 text-xs mb-1">
                    {asset.district} ({asset.block} Block)
                  </div>
                  <div className="text-slate-400 text-[11px] mb-2 font-mono">
                    Elevation: {asset.elevationMeters}m MSL | Eye Dist: {assessment?.distanceToTrackKm || 0}km
                  </div>

                  {asset.type === 'substation' && (
                    <div className="text-slate-300 text-[11px] mb-2 flex items-center space-x-1">
                      <span>Plinth Barrier:</span>
                      {asset.hasPlinthProtection ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 inline" />
                      )}
                    </div>
                  )}

                  {assessment && (
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-200">
                      <strong className="text-amber-400">Directive:</strong> {assessment.recommendedAction}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Basemap & Layer Control FAB (Google Maps / Zoom Earth style, top-right) */}
      <div className="fixed top-4 right-4 z-[950] flex flex-col items-end space-y-2">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-200 text-xs font-medium"
        >
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="font-mono uppercase text-[11px]">Map Layers</span>
        </button>

        {/* Expandable Layer Panel */}
        {showLayerMenu && (
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-sans text-slate-200 w-64 animate-in fade-in zoom-in-95 duration-150 space-y-3">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <MapIcon className="w-3 h-3 text-sky-400" />
                <span>Base Imagery</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setTileProvider('satellite')}
                  className={`py-1.5 px-2 rounded-lg border text-left transition-colors ${
                    tileProvider === 'satellite'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Satellite (HD)
                </button>
                <button
                  onClick={() => setTileProvider('voyager')}
                  className={`py-1.5 px-2 rounded-lg border text-left transition-colors ${
                    tileProvider === 'voyager'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Google Clean
                </button>
                <button
                  onClick={() => setTileProvider('dark')}
                  className={`py-1.5 px-2 rounded-lg border text-left transition-colors ${
                    tileProvider === 'dark'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Dark Radar
                </button>
                <button
                  onClick={() => setTileProvider('osm')}
                  className={`py-1.5 px-2 rounded-lg border text-left transition-colors ${
                    tileProvider === 'osm'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Topographic
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Hazard Overlays</span>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer hover:text-white text-xs">
                <input
                  type="checkbox"
                  checked={showTrack}
                  onChange={(e) => setShowTrack(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-0"
                />
                <span>Cyclone Track & Center</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:text-white text-xs">
                <input
                  type="checkbox"
                  checked={showCone}
                  onChange={(e) => setShowCone(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-0"
                />
                <span>Uncertainty Cone</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:text-white text-xs">
                <input
                  type="checkbox"
                  checked={showSurge}
                  onChange={(e) => setShowSurge(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-0"
                />
                <span>Storm Surge Inundation</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:text-white text-xs">
                <input
                  type="checkbox"
                  checked={showWindRadii}
                  onChange={(e) => setShowWindRadii(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-0"
                />
                <span>Gale Wind Radii (R34/R50)</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Filter Infrastructure
              </label>
              <select
                aria-label="Filter Infrastructure"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Infrastructure ({assets.length})</option>
                <option value="substation">Power Substations</option>
                <option value="hospital">Hospitals & Health Units</option>
                <option value="shelter">Cyclone Shelters (MCS)</option>
                <option value="highway">Highways & Bridges</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
