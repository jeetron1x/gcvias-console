import React, { useState } from 'react';
import {
  Star,
  X,
  Settings,
  Info,
  Share2,
  Sparkles,
  Sun,
  CloudRain,
  Waves,
  ArrowUpRight,
  ArrowRight,
  ArrowUp,
  ArrowDownRight
} from 'lucide-react';
import {
  CycloneTrackPoint,
  CycloneEvent,
  MapDisplayMode,
  InfrastructureAsset
} from '../../types';

interface ZoomEarthForecastCardProps {
  currentEye: CycloneTrackPoint;
  activeCyclone: CycloneEvent;
  displayMode: MapDisplayMode;
  selectedAsset: InfrastructureAsset | null;
  onClearAsset: () => void;
  onOpenGeminiDrawer: () => void;
  onOpenMethodology: () => void;
  onOpenPrivacy: () => void;
}

export const ZoomEarthForecastCard: React.FC<ZoomEarthForecastCardProps> = ({
  currentEye,
  activeCyclone,
  displayMode,
  selectedAsset,
  onClearAsset,
  onOpenGeminiDrawer,
  onOpenMethodology,
  onOpenPrivacy,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [starred, setStarred] = useState(true);

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-[950] flex flex-col space-y-2 pointer-events-auto">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#121926]/95 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-2.5 shadow-2xl text-slate-300 hover:text-white transition-all cursor-pointer flex items-center space-x-2 font-mono text-xs"
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Show Forecast</span>
        </button>
      </div>
    );
  }

  // Format coordinates (e.g. 18° 00' N, 85° 40' E)
  const formatCoord = (lat: number, lng: number) => {
    const latDeg = Math.floor(Math.abs(lat));
    const latMin = Math.round((Math.abs(lat) - latDeg) * 60);
    const latDir = lat >= 0 ? 'N' : 'S';

    const lngDeg = Math.floor(Math.abs(lng));
    const lngMin = Math.round((Math.abs(lng) - lngDeg) * 60);
    const lngDir = lng >= 0 ? 'E' : 'W';

    return `${latDeg}° ${latMin.toString().padStart(2, '0')}' ${latDir}, ${lngDeg}° ${lngMin.toString().padStart(2, '0')}' ${lngDir}`;
  };

  const locationTitle = selectedAsset
    ? selectedAsset.name
    : `${formatCoord(currentEye.lat, currentEye.lng)}`;

  // Forecast rows: Days of week with mode-specific values
  const forecastDays = [
    { day: 'Today', minTemp: 28, maxTemp: 30, windMin: 4, windMax: 13, arrow: ArrowRight, rainRate: 6, surgeM: 1.2 },
    { day: 'Wed', minTemp: 28, maxTemp: 30, windMin: 4, windMax: 15, arrow: ArrowUpRight, rainRate: 18, surgeM: 2.4 },
    { day: 'Thu', minTemp: 28, maxTemp: 30, windMin: 12, windMax: 35, arrow: ArrowUp, rainRate: 45, surgeM: 3.8 },
    { day: 'Fri', minTemp: 27, maxTemp: 29, windMin: 8, windMax: 22, arrow: ArrowUpRight, rainRate: 24, surgeM: 2.1 },
    { day: 'Sat', minTemp: 28, maxTemp: 29, windMin: 7, windMax: 17, arrow: ArrowDownRight, rainRate: 8, surgeM: 1.0 },
  ];

  return (
    <div className="fixed top-4 right-4 z-[950] flex items-start space-x-2 pointer-events-auto select-none font-sans">
      {/* 1. Main Floating Card (Exact look of Zoom Earth) */}
      <div className="bg-[#121926]/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-3 w-80 space-y-2.5">
        {/* Header Strip with Star, Title, Close */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 truncate pr-2">
            <button
              onClick={() => setStarred(!starred)}
              className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
            >
              <Star className={`w-4 h-4 ${starred ? 'fill-amber-400' : ''}`} />
            </button>
            <span className="font-mono text-xs font-bold text-white tracking-wide truncate">
              {locationTitle}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {selectedAsset && (
              <button
                onClick={onClearAsset}
                className="text-[10px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5 bg-slate-800 rounded"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Selected Asset Mini-Banner if focused on an asset */}
        {selectedAsset && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-400 uppercase font-bold">{selectedAsset.type}</span>
              <span className="text-slate-400">{selectedAsset.elevationMeters}m MSL</span>
            </div>
            <div className="text-[11px] text-slate-300">
              {selectedAsset.block}, {selectedAsset.district}, {selectedAsset.country}
            </div>
          </div>
        )}

        {/* Mode-Adaptive Forecast Table (Exact Zoom Earth layout from screenshots) */}
        <div className="space-y-1.5 text-xs font-mono">
          {/* Table Header */}
          <div className="grid grid-cols-4 text-[10px] text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-800/80">
            <span>DAY UTC</span>
            <span className="text-center">
              {displayMode === 'wind' ? 'DIR' : displayMode === 'precipitation' ? 'RAIN' : displayMode === 'surge' ? 'TIDE' : 'MIN'}
            </span>
            <span className="text-center">
              {displayMode === 'wind' ? 'WIND km/h' : displayMode === 'precipitation' ? 'RATE mm/h' : displayMode === 'surge' ? 'SURGE m' : 'TEMP °C'}
            </span>
            <span className="text-right">MAX</span>
          </div>

          {/* Table Rows */}
          {forecastDays.map((row, idx) => {
            const ArrowComp = row.arrow;
            return (
              <div
                key={idx}
                className="grid grid-cols-4 items-center px-1 py-1 hover:bg-slate-800/50 rounded-lg transition-colors text-[11px]"
              >
                {/* Day name */}
                <span className="text-slate-200 font-medium">{row.day}</span>

                {/* Mode Icon / Arrow */}
                <div className="flex items-center justify-center">
                  {displayMode === 'wind' ? (
                    <ArrowComp className="w-3.5 h-3.5 text-sky-400" />
                  ) : displayMode === 'precipitation' ? (
                    <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  ) : displayMode === 'surge' ? (
                    <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>

                {/* Min / Value + Visual Bar */}
                <div className="flex items-center space-x-1.5 justify-center">
                  <span className="text-slate-300">
                    {displayMode === 'wind'
                      ? row.windMin
                      : displayMode === 'precipitation'
                      ? `${row.rainRate}`
                      : displayMode === 'surge'
                      ? `${row.surgeM}m`
                      : `${row.minTemp}°`}
                  </span>

                  {/* Gradient horizontal bar (exact from Zoom Earth) */}
                  <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        displayMode === 'wind'
                          ? 'bg-gradient-to-r from-emerald-400 to-amber-500'
                          : displayMode === 'precipitation'
                          ? 'bg-gradient-to-r from-sky-400 to-blue-600'
                          : displayMode === 'surge'
                          ? 'bg-gradient-to-r from-cyan-400 to-red-500'
                          : 'bg-gradient-to-r from-amber-400 to-orange-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (idx === 2 ? 95 : idx === 1 ? 65 : 40))}%`
                      }}
                    />
                  </div>
                </div>

                {/* Max Value */}
                <span className="text-right text-slate-100 font-bold">
                  {displayMode === 'wind'
                    ? `${row.windMax}`
                    : displayMode === 'precipitation'
                    ? `${row.rainRate * 2}`
                    : displayMode === 'surge'
                    ? `${(row.surgeM * 1.3).toFixed(1)}`
                    : `${row.maxTemp}°`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Storm Eye Telemetry Chips */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800 text-[10px] font-mono">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex items-center justify-between">
            <span className="text-slate-400">Eye Wind</span>
            <span className="text-sky-400 font-bold">{currentEye.maxWindKmh} km/h</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex items-center justify-between">
            <span className="text-slate-400">Pressure</span>
            <span className="text-slate-200 font-bold">{currentEye.centralPressureHpa} hPa</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex items-center justify-between">
            <span className="text-slate-400">Peak Surge</span>
            <span className="text-red-400 font-bold">{currentEye.surgeEstimateMeters} m</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex items-center justify-between">
            <span className="text-slate-400">Landfall</span>
            <span className="text-amber-400 font-bold">
              T{activeCyclone.landfall.estimatedEtaHours >= 0 ? `+${activeCyclone.landfall.estimatedEtaHours}` : activeCyclone.landfall.estimatedEtaHours}h
            </span>
          </div>
        </div>

        {/* Gemini 3.7 Flash Call to Action Button */}
        <button
          onClick={onOpenGeminiDrawer}
          className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-98 text-white font-mono text-xs font-bold py-2 px-3 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-200" />
          <span>Simulate Damage Pathways (Gemini 3.7)</span>
        </button>
      </div>

      {/* 2. Vertical Mini-Toolbar (Exact icons from Zoom Earth right edge) */}
      <div className="bg-[#121926]/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md p-1.5 flex flex-col space-y-1.5">
        <button
          onClick={onOpenMethodology}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Methodology & Data Heuristics"
        >
          <Info className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenPrivacy}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Data Privacy & Terms"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'GCVIAS Zoom Earth AI Console',
                url: window.location.href,
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Console URL copied to clipboard');
            }
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Share Console"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
