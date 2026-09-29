import React from 'react';
import {
  Wind,
  Gauge,
  Waves,
  Compass,
  AlertTriangle,
  Zap,
  Building2,
  Home,
  Users,
  FileSpreadsheet,
  Megaphone
} from 'lucide-react';
import { CycloneTrackPoint, ExposureSummary } from '../../types';

interface TelemetryHUDProps {
  currentEye: CycloneTrackPoint;
  exposure: ExposureSummary;
  onOpenAdvisory: () => void;
  onOpenRegistry: () => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  currentEye,
  exposure,
  onOpenAdvisory,
  onOpenRegistry,
}) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Super Cyclonic Storm':
        return 'bg-purple-950 text-red-400 border-red-500';
      case 'Extremely Severe Cyclonic Storm':
      case 'Very Severe Cyclonic Storm':
        return 'bg-red-950/80 text-red-300 border-red-700';
      case 'Severe Cyclonic Storm':
        return 'bg-amber-950/80 text-amber-300 border-amber-600';
      case 'Cyclonic Storm':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-600';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-700';
    }
  };

  return (
    <div className="bg-command-900 border border-command-800 rounded-lg p-4 shadow-xl font-sans space-y-4">
      {/* Top Banner: Category and Eye Coordinates */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-command-800">
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Operational Classification</div>
          <div className={`mt-1 inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-bold border ${getCategoryColor(currentEye.category)}`}>
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            <span>{currentEye.category.toUpperCase()}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Vortex Center (WGS-84)</div>
          <div className="text-xs font-mono text-white font-bold mt-1">
            {currentEye.lat.toFixed(2)} deg N, {currentEye.lng.toFixed(2)} deg E
          </div>
        </div>
      </div>

      {/* Grid of Meteorological Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Wind Speed */}
        <div className="bg-command-950 border border-command-800/80 rounded p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Sustained Wind</span>
            <Wind className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-base font-mono font-bold text-white">
            {currentEye.maxWindKmh} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            {currentEye.maxWindKnots} knots | Beaufort 12
          </div>
        </div>

        {/* Central Pressure */}
        <div className="bg-command-950 border border-command-800/80 rounded p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Central Pressure</span>
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-base font-mono font-bold text-white">
            {currentEye.centralPressureHpa} <span className="text-xs text-slate-400 font-normal">hPa</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Pressure Deficit: ~{1010 - currentEye.centralPressureHpa} hPa
          </div>
        </div>

        {/* Peak Surge */}
        <div className="bg-command-950 border border-command-800/80 rounded p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Estimated Surge</span>
            <Waves className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-base font-mono font-bold text-hazard-severe">
            {exposure.peakSurgeBandMaxMeters.toFixed(1)} <span className="text-xs text-slate-400 font-normal">meters</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Over Astronomical Tide
          </div>
        </div>

        {/* Forward Speed */}
        <div className="bg-command-950 border border-command-800/80 rounded p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Forward Speed</span>
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-mono font-bold text-white">
            {currentEye.forwardSpeedKmh} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Eye Diameter: {currentEye.eyeRadiusKm * 2} km
          </div>
        </div>
      </div>

      {/* Critical Infrastructure Exposure Counters */}
      <div className="bg-command-950 border border-command-800 rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">
            Infrastructure in High/Severe Danger Envelope
          </div>
          <span className="text-xs font-mono font-bold text-hazard-high bg-hazard-high/10 px-2 py-0.5 rounded border border-hazard-high/30">
            {exposure.totalAssetsExposed} Nodes At Risk
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center space-x-2 bg-command-900 p-2 rounded border border-command-800">
            <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-mono">Substations</div>
              <div className="font-bold text-white font-mono">{exposure.byAssetType.substation}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-command-900 p-2 rounded border border-command-800">
            <div className="p-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-mono">Hospitals/CHCs</div>
              <div className="font-bold text-white font-mono">{exposure.byAssetType.hospital}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-command-900 p-2 rounded border border-command-800">
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Home className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-mono">Cyclone Shelters</div>
              <div className="font-bold text-white font-mono">{exposure.byAssetType.shelter}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-command-900 p-2 rounded border border-command-800">
            <div className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-mono">Exposed Pop.</div>
              <div className="font-bold text-white font-mono">{(exposure.estimatedAffectedPopulation / 1000).toFixed(0)}k</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={onOpenAdvisory}
          className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-hazard-severe hover:bg-red-700 text-white font-mono text-xs font-bold rounded-md shadow-md transition-colors border border-red-500"
        >
          <Megaphone className="w-4 h-4" />
          <span>GENERATE EVACUATION ADVISORY</span>
        </button>

        <button
          onClick={onOpenRegistry}
          className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-command-800 hover:bg-command-700 text-slate-200 font-mono text-xs font-bold rounded-md border border-command-700 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-400" />
          <span>INSPECT INFRASTRUCTURE REGISTRY</span>
        </button>
      </div>
    </div>
  );
};
