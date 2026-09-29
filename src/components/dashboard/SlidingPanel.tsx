import React, { useState } from 'react';
import {
  CycloneTrackPoint,
  ExposureSummary,
  InfrastructureAsset,
  AdvisoryPayload,
  AuthorityRole
} from '../../types';
import { speechSynthesizer } from '../../utils/speech';
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Wind,
  Gauge,
  Waves,
  Building2,
  Users,
  Megaphone,
  Printer,
  Volume2,
  VolumeX,
  Send,
  Zap,
  Home,
  Navigation,
  Globe,
  FileCheck2
} from 'lucide-react';

interface SlidingPanelProps {
  currentEye: CycloneTrackPoint;
  exposure: ExposureSummary;
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
  advisory: AdvisoryPayload;
  selectedLanguage: string;
  onChangeLanguage: (lang: string) => void;
  onDispatch: (channels: string[]) => void;
  activeRole: AuthorityRole;
}

export const SlidingPanel: React.FC<SlidingPanelProps> = ({
  currentEye,
  exposure,
  selectedAsset,
  onSelectAsset,
  advisory,
  selectedLanguage,
  onChangeLanguage,
  onDispatch,
  activeRole,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'situation' | 'assets' | 'advisory'>('situation');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      speechSynthesizer.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      await speechSynthesizer.speak(
        advisory.speechText,
        selectedLanguage,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleTriggerDispatch = () => {
    onDispatch(['DEOC Wireless Network', 'State VHF Band 3', 'SMS Cell Broadcast']);
    setDispatchStatus('ADVISORY DISPATCHED SUCCESSFULLY');
    setTimeout(() => setDispatchStatus(null), 3500);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'substation':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'hospital':
        return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'shelter':
        return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Navigation className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[920] h-[calc(100vh-6.5rem)] flex items-start transition-transform duration-300 ease-in-out select-none pointer-events-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-2.5rem)]'
      }`}
    >
      {/* Collapse/Expand Toggle Handle (Google Maps Style) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-l-xl shadow-2xl flex items-center justify-center -mr-[1px] transition-colors mt-2"
        title={isOpen ? 'Collapse Panel' : 'Expand Panel'}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Main Drawer Sheet */}
      <div className="w-[360px] sm:w-[410px] h-full bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-slate-100 font-sans">
        {/* Drawer Header & Tabs */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Command Situational Report
              </span>
              <h2 className="text-xs font-bold font-mono text-white tracking-wide">
                {currentEye.category.toUpperCase()}
              </h2>
            </div>
            <div className="text-right font-mono text-[11px] text-amber-400 font-bold">
              {exposure.totalAssetsExposed} Nodes At Risk
            </div>
          </div>

          {/* Segmented Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('situation')}
              className={`py-1.5 px-2 rounded-md transition-all font-mono text-[11px] ${
                activeTab === 'situation'
                  ? 'bg-sky-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Situation
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`py-1.5 px-2 rounded-md transition-all font-mono text-[11px] ${
                activeTab === 'assets'
                  ? 'bg-sky-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Exposure ({exposure.totalAssetsExposed})
            </button>
            <button
              onClick={() => setActiveTab('advisory')}
              className={`py-1.5 px-2 rounded-md transition-all font-mono text-[11px] ${
                activeTab === 'advisory'
                  ? 'bg-sky-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Advisories
            </button>
          </div>
        </div>

        {/* Tab 1: Situation & Telemetry */}
        {activeTab === 'situation' && (
          <div className="p-4 space-y-3.5 overflow-y-auto custom-scrollbar flex-1 animate-in fade-in duration-150">
            {/* Meteorological Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-mono uppercase">Wind Speed</span>
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-base font-bold font-mono text-white">
                  {currentEye.maxWindKmh} <span className="text-xs text-slate-400 font-normal">km/h</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{currentEye.maxWindKnots} knots</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-mono uppercase">Pressure</span>
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-base font-bold font-mono text-white">
                  {currentEye.centralPressureHpa} <span className="text-xs text-slate-400 font-normal">hPa</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Deficit ~{1010 - currentEye.centralPressureHpa} hPa</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-mono uppercase">Surge Est.</span>
                  <Waves className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="text-base font-bold font-mono text-red-400">
                  {exposure.peakSurgeBandMaxMeters.toFixed(1)} <span className="text-xs text-slate-400 font-normal">meters</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Above high tide</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-mono uppercase">Exposed Pop.</span>
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-base font-bold font-mono text-white">
                  {(exposure.estimatedAffectedPopulation / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-normal">est.</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Coastal zone buffer</span>
              </div>
            </div>

            {/* Quick Sector Breakdown */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-2 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Sector Exposure Summary
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <Zap className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                  <div className="font-bold text-white">{exposure.byAssetType.substation}</div>
                  <div className="text-[10px] text-slate-400">Power</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <Home className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <div className="font-bold text-white">{exposure.byAssetType.shelter}</div>
                  <div className="text-[10px] text-slate-400">Shelters</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                  <div className="font-bold text-white">{exposure.byAssetType.hospital}</div>
                  <div className="text-[10px] text-slate-400">Medical</div>
                </div>
              </div>
            </div>

            {/* Headline Callout */}
            <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-red-400 font-mono font-bold text-[11px] uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Directive in Effect</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed font-sans">
                {advisory.severityHeadline}
              </p>
            </div>

            {/* Call to Action */}
            <button
              onClick={() => setActiveTab('advisory')}
              className="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>REVIEW & BROADCAST ADVISORY</span>
            </button>
          </div>
        )}

        {/* Tab 2: Infrastructure Exposure Queue */}
        {activeTab === 'assets' && (
          <div className="p-3 space-y-2 overflow-y-auto custom-scrollbar flex-1 animate-in fade-in duration-150">
            {exposure.allExposed.map((item) => {
              const isSelected = selectedAsset?.id === item.asset.id;

              return (
                <div
                  key={item.asset.id}
                  onClick={() => onSelectAsset(item.asset)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 ring-1 ring-sky-500 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5 mb-1">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded bg-slate-900 border border-slate-800">
                        {getAssetIcon(item.asset.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs leading-snug">{item.asset.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.asset.district} ({item.asset.block})
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded text-white ${
                        item.riskBand === 'Severe'
                          ? 'bg-red-600'
                          : item.riskBand === 'High'
                          ? 'bg-orange-600'
                          : item.riskBand === 'Moderate'
                          ? 'bg-amber-600'
                          : 'bg-blue-600'
                      }`}
                    >
                      {item.riskBand}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 font-mono mt-1.5 pt-1 border-t border-slate-800/80">
                    <div>Eye Dist: <span className="text-white">{item.distanceToTrackKm}km</span></div>
                    <div>Elevation: <span className="text-white">{item.asset.elevationMeters}m</span></div>
                  </div>

                  <div className="mt-2 p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-amber-400 font-semibold">Action: </span>
                    {item.recommendedAction}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Advisory & Broadcast Dispatch */}
        {activeTab === 'advisory' && (
          <div className="p-4 space-y-3.5 overflow-y-auto custom-scrollbar flex-1 animate-in fade-in duration-150 text-xs">
            {/* Language Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Globe className="w-3 h-3 text-sky-400" />
                <span>Advisory Language</span>
              </label>
              <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'or', label: 'ଓଡ଼ିଆ' },
                  { code: 'bn', label: 'বাংলা' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'hi', label: 'हिन्दी' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onChangeLanguage(lang.code)}
                    className={`py-1 px-1.5 rounded-lg border text-center transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-sky-600 text-white border-sky-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Directives List */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Statutory Directives
                </span>
                <span className="text-[10px] font-mono text-sky-400 font-bold bg-sky-950/60 border border-sky-800/80 px-1.5 py-0.5 rounded">
                  {activeRole} Command
                </span>
              </div>
              {advisory.immediateDirectives.map((d, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-xs">{d.sector}</span>
                    <span className="text-[10px] font-mono text-slate-400">{d.urgency}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{d.directive}</p>
                </div>
              ))}
            </div>

            {/* Speech Audio Broadcast */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs font-bold text-white flex items-center space-x-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Acoustic Voice Alert</span>
                </div>
                <button
                  onClick={handlePlayAudio}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-colors ${
                    isPlayingAudio
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700'
                  }`}
                >
                  {isPlayingAudio ? (
                    <span className="flex items-center space-x-1">
                      <VolumeX className="w-3 h-3" />
                      <span>Stop</span>
                    </span>
                  ) : (
                    <span>Play Audio</span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Plays dual-tone alert chime followed by synthesized voice dispatch in selected dialect.
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              {dispatchStatus && (
                <div className="p-2 rounded bg-emerald-950/80 border border-emerald-600 text-emerald-300 font-mono text-[11px] flex items-center space-x-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{dispatchStatus}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-mono text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print SitRep</span>
                </button>

                <button
                  onClick={handleTriggerDispatch}
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-mono text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
