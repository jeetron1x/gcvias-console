import React from 'react';
import { MapDisplayMode } from '../../types';

interface ZoomEarthLegendProps {
  displayMode: MapDisplayMode;
  hoverCoordinates: [number, number];
}

export const ZoomEarthLegend: React.FC<ZoomEarthLegendProps> = ({
  displayMode,
  hoverCoordinates,
}) => {
  const formatCoord = (lat: number, lng: number) => {
    const latDeg = Math.floor(Math.abs(lat));
    const latMin = Math.round((Math.abs(lat) - latDeg) * 60);
    const latDir = lat >= 0 ? 'N' : 'S';

    const lngDeg = Math.floor(Math.abs(lng));
    const lngMin = Math.round((Math.abs(lng) - lngDeg) * 60);
    const lngDir = lng >= 0 ? 'E' : 'W';

    return `${latDeg}° ${latMin.toString().padStart(2, '0')}' ${latDir}  ${lngDeg}° ${lngMin.toString().padStart(2, '0')}' ${lngDir}`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-[950] font-mono select-none pointer-events-auto space-y-1.5 hidden sm:block">
      {/* 1. Contextual Color Ramp Legend */}
      <div className="bg-[#0b101b]/95 border border-slate-700/80 rounded-xl px-2.5 py-1.5 shadow-2xl backdrop-blur-md">
        {displayMode === 'precipitation' && (
          <div className="space-y-1">
            {/* Color Gradient Strip (Exact from Image 1) */}
            <div
              className="h-2 w-56 rounded-sm shadow-inner"
              style={{
                background: 'linear-gradient(to right, #38bdf8 0%, #0284c7 25%, #eab308 50%, #f97316 75%, #dc2626 90%, #db2777 100%)'
              }}
            />
            {/* Labels */}
            <div className="flex justify-between text-[9px] text-slate-300 font-semibold px-0.5">
              <span>Rain</span>
              <span>Light</span>
              <span>Moderate</span>
              <span>Heavy</span>
              <span>Extreme</span>
            </div>
          </div>
        )}

        {displayMode === 'wind' && (
          <div className="space-y-1">
            {/* Color Gradient Strip (Exact from Image 3) */}
            <div
              className="h-2 w-56 rounded-sm shadow-inner"
              style={{
                background: 'linear-gradient(to right, #3b82f6 0%, #10b981 30%, #eab308 60%, #f97316 80%, #dc2626 100%)'
              }}
            />
            {/* Labels (km/h  0  20  40  60  80  100  120) */}
            <div className="flex justify-between text-[9px] text-slate-300 font-semibold px-0.5">
              <span className="text-slate-400">km/h</span>
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
              <span>120+</span>
            </div>
          </div>
        )}

        {displayMode === 'surge' && (
          <div className="space-y-1">
            <div
              className="h-2 w-56 rounded-sm shadow-inner"
              style={{
                background: 'linear-gradient(to right, #22d3ee 0%, #0284c7 35%, #eab308 65%, #dc2626 100%)'
              }}
            />
            <div className="flex justify-between text-[9px] text-slate-300 font-semibold px-0.5">
              <span className="text-slate-400">Surge</span>
              <span>0.5m</span>
              <span>1.5m</span>
              <span>3.0m</span>
              <span>5.0m+</span>
            </div>
          </div>
        )}

        {displayMode === 'temperature' && (
          <div className="space-y-1">
            <div
              className="h-2 w-56 rounded-sm shadow-inner"
              style={{
                background: 'linear-gradient(to right, #60a5fa 0%, #34d399 40%, #fbbf24 70%, #ef4444 100%)'
              }}
            />
            <div className="flex justify-between text-[9px] text-slate-300 font-semibold px-0.5">
              <span className="text-slate-400">°C</span>
              <span>10°</span>
              <span>20°</span>
              <span>30°</span>
              <span>40°+</span>
            </div>
          </div>
        )}

        {(displayMode === 'satellite' || displayMode === 'radar' || displayMode === 'humidity' || displayMode === 'pressure') && (
          <div className="text-[10px] text-slate-300 font-semibold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="capitalize">{displayMode} Feed Active (GEE Sentinel/GOES)</span>
          </div>
        )}
      </div>

      {/* 2. Live Coordinates (Exact styling from Image 1 and 3) */}
      <div className="bg-[#0b101b]/80 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-400 inline-block shadow-md">
        {formatCoord(hoverCoordinates[0], hoverCoordinates[1])}
      </div>
    </div>
  );
};
