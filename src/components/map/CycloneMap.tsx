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
  Layers,
  Map as MapIcon,
  ShieldAlert
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

// Controller component to smoothly fly/pan map when center or zoom changes
const MapViewController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Custom SVG-based DivIcons for Leaflet
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
  const border = isSelected ? 'border-2 border-white shadow-lg ring-2 ring-hazard-severe' : 'border border-slate-900 shadow';

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
           class="flex items-center justify-center rounded-md ${border} transition-transform hover:scale-110">
        ${iconSvg}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Cyclone Eye Marker DivIcon
const createEyeIcon = (_category: string) => {
  return L.divIcon({
    className: 'custom-cyclone-eye',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        <div class="absolute w-10 h-10 rounded-full border-2 border-red-500 bg-red-950/40 animate-ping opacity-60"></div>
        <div class="relative w-8 h-8 rounded-full bg-red-900 border-2 border-white shadow-xl flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FDE047" stroke-width="2.5">
            <circle cx="12" cy="12" r="9" stroke="#DC2626"/>
            <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round"/>
            <path d="M12 21a9 9 0 0 1-9-9" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
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
  // Tile provider toggle
  const [tileProvider, setTileProvider] = useState<'cartoDark' | 'esriSatellite' | 'osm'>('cartoDark');

  // Layer toggles
  const [showTrack, setShowTrack] = useState(true);
  const [showCone, setShowCone] = useState(true);
  const [showSurge, setShowSurge] = useState(true);
  const [showWindRadii, setShowWindRadii] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  // Tile sources
  const tileUrls = {
    cartoDark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    esriSatellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{y}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const tileAttributions = {
    cartoDark: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
    esriSatellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    osm: '&copy; OpenStreetMap contributors',
  };

  // Forecast uncertainty cone polygon points
  const conePolygon = generateForecastConePolygon(trackPoints, currentEye.offsetHours);

  // Past track coordinates vs forecast track coordinates
  const pastCoords: [number, number][] = trackPoints
    .filter((p) => p.offsetHours <= currentEye.offsetHours)
    .map((p) => [p.lat, p.lng]);

  const forecastCoords: [number, number][] = trackPoints
    .filter((p) => p.offsetHours >= currentEye.offsetHours)
    .map((p) => [p.lat, p.lng]);

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    if (filterType === 'all') return true;
    return asset.type === filterType;
  });

  return (
    <div className="relative w-full h-[620px] bg-command-950 border border-command-800 rounded-lg overflow-hidden shadow-2xl">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', backgroundColor: '#070C14' }}
        zoomControl={false}
      >
        <MapViewController center={center} zoom={zoom} />

        {/* Tile Layer */}
        <TileLayer
          url={tileUrls[tileProvider]}
          attribution={tileAttributions[tileProvider]}
          maxZoom={18}
        />

        {/* Forecast Cone Overlay */}
        {showCone && conePolygon.length > 2 && (
          <Polygon
            positions={conePolygon}
            pathOptions={{
              color: '#F59E0B',
              weight: 1.5,
              dashArray: '4 4',
              fillColor: '#F59E0B',
              fillOpacity: 0.15,
            }}
          />
        )}

        {/* Coastal Storm Surge Risk Hazard Bands */}
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
                  fillOpacity: 0.45,
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 text-xs font-sans text-slate-900">
                    <div className="font-bold text-sm mb-1">{zone.name}</div>
                    <div className="mb-0.5">Estimated Coastal Surge: <strong>{zone.estimatedSurgeHeightMeters}m</strong></div>
                    <div className="mb-0.5">Risk Rating: <span className="font-bold text-red-600">{zone.riskBand}</span></div>
                    <div>Inundation Depth Infiltration: <strong>{zone.peakInundationDistanceKm} km</strong> inland</div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* Past Track Line */}
        {showTrack && pastCoords.length > 1 && (
          <Polyline
            positions={pastCoords}
            pathOptions={{
              color: '#94A3B8',
              weight: 3,
              dashArray: '3 6',
              opacity: 0.8,
            }}
          />
        )}

        {/* Forecast Track Line */}
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

        {/* Track Step Nodes */}
        {showTrack &&
          trackPoints.map((pt) => {
            const isEye = pt.offsetHours === currentEye.offsetHours;
            if (isEye) return null;

            return (
              <Circle
                key={pt.timestamp}
                center={[pt.lat, pt.lng]}
                radius={pt.offsetHours > currentEye.offsetHours ? 6000 : 4000}
                pathOptions={{
                  color: pt.offsetHours > currentEye.offsetHours ? '#F59E0B' : '#94A3B8',
                  fillColor: pt.offsetHours > currentEye.offsetHours ? '#F59E0B' : '#64748B',
                  fillOpacity: 0.8,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div className="p-2 text-xs font-sans text-slate-900">
                    <div className="font-bold text-xs">{pt.category}</div>
                    <div>Time Offset: T{pt.offsetHours >= 0 ? `+${pt.offsetHours}h` : `${pt.offsetHours}h`}</div>
                    <div>Max Winds: {pt.maxWindKmh} km/h ({pt.maxWindKnots} kts)</div>
                    <div>Central Pressure: {pt.centralPressureHpa} hPa</div>
                    <div>Estimated Surge: {pt.surgeEstimateMeters} m</div>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {/* Wind Radii Circles around Current Eye */}
        {showWindRadii && (
          <>
            {/* Core R50 High Wind Zone */}
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
            {/* Gale R34 Zone */}
            <Circle
              center={[currentEye.lat, currentEye.lng]}
              radius={currentEye.windRadiiR34Km.ne * 1000}
              pathOptions={{
                color: '#F59E0B',
                weight: 1.5,
                dashArray: '3 6',
                fillColor: '#F59E0B',
                fillOpacity: 0.04,
              }}
            />
          </>
        )}

        {/* Active Cyclone Eye Marker */}
        <Marker
          position={[currentEye.lat, currentEye.lng]}
          icon={createEyeIcon(currentEye.category)}
        >
          <Popup>
            <div className="p-2 text-xs font-sans text-slate-900">
              <div className="font-bold text-sm text-red-600 mb-1">
                {currentEye.category.toUpperCase()}
              </div>
              <div className="mb-0.5">Central Pressure: <strong>{currentEye.centralPressureHpa} hPa</strong></div>
              <div className="mb-0.5">Sustained Winds: <strong>{currentEye.maxWindKmh} km/h</strong> ({currentEye.maxWindKnots} kts)</div>
              <div className="mb-0.5">Forward Speed: <strong>{currentEye.forwardSpeedKmh} km/h</strong></div>
              <div>Eye Radius: <strong>{currentEye.eyeRadiusKm} km</strong></div>
            </div>
          </Popup>
        </Marker>

        {/* Infrastructure Asset Markers */}
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
                <div className="p-2.5 text-xs font-sans text-slate-900 max-w-[240px]">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
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
                      {risk} Risk
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1">{asset.name}</h4>
                  <div className="text-slate-600 text-xs mb-1">
                    District: {asset.district} ({asset.block} Block)
                  </div>
                  <div className="text-slate-600 text-xs mb-2">
                    Elevation: {asset.elevationMeters}m MSL | Distance to Eye: {assessment?.distanceToTrackKm || 0}km
                  </div>
                  {assessment && (
                    <div className="p-2 bg-slate-100 rounded text-[11px] border border-slate-300 text-slate-800">
                      <strong>Directive:</strong> {assessment.recommendedAction}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Layer Controls (Top Left) */}
      <div className="absolute top-3 left-3 z-[1000] bg-command-900/95 border border-command-700/80 rounded-md p-2.5 backdrop-blur-md shadow-xl text-xs font-sans text-slate-200 w-52">
        <div className="flex items-center space-x-1.5 text-slate-100 font-mono font-bold text-xs uppercase tracking-wider mb-2 pb-1.5 border-b border-command-800">
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>Layer Visibility</span>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showTrack}
              onChange={(e) => setShowTrack(e.target.checked)}
              className="rounded bg-command-800 border-command-600 text-amber-500 focus:ring-0"
            />
            <span>Cyclone Track & Eye</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showCone}
              onChange={(e) => setShowCone(e.target.checked)}
              className="rounded bg-command-800 border-command-600 text-amber-500 focus:ring-0"
            />
            <span>Uncertainty Cone</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showSurge}
              onChange={(e) => setShowSurge(e.target.checked)}
              className="rounded bg-command-800 border-command-600 text-amber-500 focus:ring-0"
            />
            <span>Coastal Storm Surge Buffers</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showWindRadii}
              onChange={(e) => setShowWindRadii(e.target.checked)}
              className="rounded bg-command-800 border-command-600 text-amber-500 focus:ring-0"
            />
            <span>Gale Wind Radii (R34 / R50)</span>
          </label>
        </div>

        {/* Asset Type Filter */}
        <div className="mt-3 pt-2 border-t border-command-800">
          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Asset Filter</label>
          <select
            aria-label="Asset Filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-command-800 border border-command-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Critical Assets ({assets.length})</option>
            <option value="substation">Power Substations</option>
            <option value="hospital">Hospitals & CHCs</option>
            <option value="shelter">Cyclone Shelters (MCS)</option>
            <option value="highway">Highways & Bridges</option>
          </select>
        </div>

        {/* Basemap Switcher */}
        <div className="mt-3 pt-2 border-t border-command-800">
          <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1 flex items-center space-x-1">
            <MapIcon className="w-3 h-3 text-slate-400" />
            <span>Basemap Provider</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setTileProvider('cartoDark')}
              className={`py-1 text-[10px] rounded border ${
                tileProvider === 'cartoDark'
                  ? 'bg-command-700 text-white border-command-500 font-bold'
                  : 'bg-command-800 text-slate-400 border-command-700 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setTileProvider('esriSatellite')}
              className={`py-1 text-[10px] rounded border ${
                tileProvider === 'esriSatellite'
                  ? 'bg-command-700 text-white border-command-500 font-bold'
                  : 'bg-command-800 text-slate-400 border-command-700 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setTileProvider('osm')}
              className={`py-1 text-[10px] rounded border ${
                tileProvider === 'osm'
                  ? 'bg-command-700 text-white border-command-500 font-bold'
                  : 'bg-command-800 text-slate-400 border-command-700 hover:text-white'
              }`}
            >
              Topo/OSM
            </button>
          </div>
        </div>
      </div>

      {/* Floating Tactical Legend (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-command-900/95 border border-command-700/80 rounded-md p-2.5 backdrop-blur-md shadow-xl text-xs font-sans text-slate-300">
        <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3 text-hazard-severe" />
          <span>Vulnerability Exposure Key</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-hazard-severe"></span>
            <span>Severe Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-hazard-high"></span>
            <span>High Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-hazard-moderate"></span>
            <span>Moderate Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-hazard-monitored"></span>
            <span>Monitored</span>
          </div>
        </div>
      </div>
    </div>
  );
};
