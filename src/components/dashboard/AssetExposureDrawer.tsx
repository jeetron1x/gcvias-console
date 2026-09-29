import React from 'react';
import {
  AssetExposureAssessment,
  InfrastructureAsset,
  RiskBand
} from '../../types';
import {
  AlertOctagon,
  Zap,
  Building2,
  Home,
  Navigation,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface AssetExposureDrawerProps {
  assessments: AssetExposureAssessment[];
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset) => void;
}

export const AssetExposureDrawer: React.FC<AssetExposureDrawerProps> = ({
  assessments,
  selectedAsset,
  onSelectAsset,
}) => {
  const getRiskBadge = (risk: RiskBand) => {
    switch (risk) {
      case 'Severe':
        return 'bg-hazard-severe text-white';
      case 'High':
        return 'bg-hazard-high text-white';
      case 'Moderate':
        return 'bg-hazard-moderate text-white';
      case 'Low':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'substation':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'hospital':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'shelter':
        return <Home className="w-4 h-4 text-emerald-400" />;
      default:
        return <Navigation className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="bg-command-900 border border-command-800 rounded-lg p-4 shadow-xl font-sans h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-command-800 mb-3">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-hazard-high" />
          <h3 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wide">
            Infrastructure Vulnerability Queue ({assessments.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Ranked by Exposure Severity</span>
      </div>

      {/* Asset Cards List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[560px] pr-1.5 custom-scrollbar flex-1">
        {assessments.map((item) => {
          const isSelected = selectedAsset?.id === item.asset.id;

          return (
            <div
              key={item.asset.id}
              onClick={() => onSelectAsset(item.asset)}
              className={`p-3 rounded-md border cursor-pointer transition-all text-xs ${
                isSelected
                  ? 'bg-command-800 border-hazard-severe ring-1 ring-hazard-severe shadow-md'
                  : 'bg-command-950/80 border-command-800 hover:border-command-700 hover:bg-command-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-command-900 border border-command-800">
                    {getAssetIcon(item.asset.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs leading-snug">{item.asset.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.asset.district} ({item.asset.block})
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getRiskBadge(item.riskBand)}`}>
                  {item.riskBand}
                </span>
              </div>

              {/* Asset Technical Details */}
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 font-mono my-2 pt-1 border-t border-command-900">
                <div>Distance: <span className="text-white">{item.distanceToTrackKm} km</span></div>
                <div>Elevation: <span className="text-white">{item.asset.elevationMeters}m MSL</span></div>
                {item.asset.type === 'shelter' && (
                  <>
                    <div>Capacity: <span className="text-white">{item.asset.designCapacity} persons</span></div>
                    <div className="flex items-center space-x-1">
                      <span>Solar Power:</span>
                      {item.asset.solarGeneratorPower ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                  </>
                )}
                {item.asset.type === 'substation' && (
                  <>
                    <div>Voltage: <span className="text-white">{item.asset.voltageKv} kV</span></div>
                    <div className="flex items-center space-x-1">
                      <span>Plinth Barrier:</span>
                      {item.asset.hasPlinthProtection ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                  </>
                )}
                {item.asset.type === 'hospital' && (
                  <>
                    <div>Beds: <span className="text-white">{item.asset.bedCapacity} (ICU: {item.asset.icuBeds})</span></div>
                    <div>Oxygen Buffer: <span className="text-white">{item.asset.oxygenBufferDays} days</span></div>
                  </>
                )}
              </div>

              {/* Action Directive */}
              <div className="mt-2 p-2 rounded bg-command-900 border border-command-800 text-[11px] text-slate-300">
                <span className="font-semibold text-amber-400">Directive: </span>
                {item.recommendedAction}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
