import React, { useState } from 'react';
import {
  Satellite,
  Radio,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  Waves,
  Sparkles,
  Database,
  Send,
  ChevronDown,
  Globe2,
  Search,
  Check
} from 'lucide-react';
import {
  MapDisplayMode,
  SatelliteSubMode,
  WindSubMode,
  CycloneEvent,
  OceanBasin
} from '../../types';

interface ZoomEarthSidebarProps {
  displayMode: MapDisplayMode;
  onChangeDisplayMode: (mode: MapDisplayMode) => void;
  satelliteSubMode: SatelliteSubMode;
  onChangeSatelliteSubMode: (sub: SatelliteSubMode) => void;
  windSubMode: WindSubMode;
  onChangeWindSubMode: (sub: WindSubMode) => void;
  cyclones: CycloneEvent[];
  activeCyclone: CycloneEvent;
  onSelectCyclone: (c: CycloneEvent) => void;
  showAssets: boolean;
  onToggleAssets: (show: boolean) => void;
  onOpenGeminiDrawer: () => void;
  onOpenDispatches: () => void;
  onOpenRegistry: () => void;
}

export const ZoomEarthSidebar: React.FC<ZoomEarthSidebarProps> = ({
  displayMode,
  onChangeDisplayMode,
  satelliteSubMode,
  onChangeSatelliteSubMode,
  windSubMode,
  onChangeWindSubMode,
  cyclones,
  activeCyclone,
  onSelectCyclone,
  showAssets,
  onToggleAssets,
  onOpenGeminiDrawer,
  onOpenDispatches,
  onOpenRegistry,
}) => {
  const [showCycloneModal, setShowCycloneModal] = useState(false);
  const [basinFilter, setBasinFilter] = useState<OceanBasin | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCyclones = cyclones.filter((c) => {
    const matchesBasin = basinFilter === 'All' || c.basin === basinFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.basin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.landfall.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBasin && matchesSearch;
  });

  return (
    <aside className="fixed top-4 left-4 z-[950] font-sans select-none flex flex-col space-y-2 pointer-events-auto">
      {/* 1. Zoom Earth Brand & Global Storm Selector Pill */}
      <div className="bg-[#121926]/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-2.5 w-48 space-y-2">
        {/* Brand Header */}
        <div className="flex items-center space-x-2 px-1 pt-0.5">
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-sky-500/20">
            <div className="w-full h-full rounded-full bg-[#0a101d] flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-xs tracking-wider text-white">ZOOM</span>
              <span className="font-bold text-xs tracking-wider text-sky-400">EARTH</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 block -mt-0.5 uppercase tracking-wider">
              AI RISK ENGINE
            </span>
          </div>
        </div>

        {/* Global Active Storm Button */}
        <button
          onClick={() => setShowCycloneModal(true)}
          className="w-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer shadow-sm"
        >
          <div className="truncate pr-1">
            <span className="text-[10px] font-mono text-sky-400 block font-semibold truncate">
              {activeCyclone.name.replace('Major Hurricane ', '').replace('Super Typhoon ', '').replace('Severe Cyclonic Storm ', '')}
            </span>
            <span className="text-[9px] font-mono text-slate-400 block truncate">
              {activeCyclone.basin}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
        </button>
      </div>

      {/* 2. Zoom Earth Floating Sidebar Menu (Exact look of Image 1, 2, and 3) */}
      <div className="bg-[#121926]/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-2.5 w-48 space-y-3 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar text-xs">
        {/* LIVE MAPS Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2 block">
            LIVE MAPS
          </span>

          {/* Satellite */}
          <button
            onClick={() => onChangeDisplayMode('satellite')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              displayMode === 'satellite'
                ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span className="flex-1">Satellite</span>
          </button>

          {/* Satellite Sub-options (Live vs HD) if active */}
          {displayMode === 'satellite' && (
            <div className="pl-6 pr-2 py-0.5 space-y-1 text-[11px] font-mono">
              <button
                onClick={() => onChangeSatelliteSubMode('live')}
                className={`w-full flex items-center space-x-1.5 text-left py-0.5 ${
                  satelliteSubMode === 'live' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {satelliteSubMode === 'live' && <Check className="w-3 h-3 text-sky-400" />}
                <span className={satelliteSubMode !== 'live' ? 'pl-4' : ''}>Live</span>
              </button>
              <button
                onClick={() => onChangeSatelliteSubMode('hd')}
                className={`w-full flex items-center space-x-1.5 text-left py-0.5 ${
                  satelliteSubMode === 'hd' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {satelliteSubMode === 'hd' && <Check className="w-3 h-3 text-sky-400" />}
                <span className={satelliteSubMode !== 'hd' ? 'pl-4' : ''}>HD Infrared</span>
              </button>
            </div>
          )}

          {/* Radar */}
          <button
            onClick={() => onChangeDisplayMode('radar')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              displayMode === 'radar'
                ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="flex-1">Radar</span>
          </button>
        </div>

        {/* FORECAST MAPS Section */}
        <div className="space-y-1 pt-1 border-t border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2 block">
            FORECAST MAPS
          </span>

          {/* Precipitation (Image 1 active mode) */}
          <button
            onClick={() => onChangeDisplayMode('precipitation')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              displayMode === 'precipitation'
                ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="flex-1">Precipitation</span>
          </button>

          {/* Wind (Image 3 active mode) */}
          <button
            onClick={() => onChangeDisplayMode('wind')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              displayMode === 'wind'
                ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="flex-1">Wind</span>
          </button>

          {/* Wind Sub-options (Speed vs Gusts) if active */}
          {displayMode === 'wind' && (
            <div className="pl-6 pr-2 py-0.5 space-y-1 text-[11px] font-mono">
              <button
                onClick={() => onChangeWindSubMode('speed')}
                className={`w-full flex items-center space-x-1.5 text-left py-0.5 ${
                  windSubMode === 'speed' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {windSubMode === 'speed' && <Check className="w-3 h-3 text-sky-400" />}
                <span className={windSubMode !== 'speed' ? 'pl-4' : ''}>Wind Speed</span>
              </button>
              <button
                onClick={() => onChangeWindSubMode('gusts')}
                className={`w-full flex items-center space-x-1.5 text-left py-0.5 ${
                  windSubMode === 'gusts' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {windSubMode === 'gusts' && <Check className="w-3 h-3 text-sky-400" />}
                <span className={windSubMode !== 'gusts' ? 'pl-4' : ''}>Wind Gusts</span>
              </button>
            </div>
          )}

          {/* Surge & Flood */}
          <button
            onClick={() => onChangeDisplayMode('surge')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              displayMode === 'surge'
                ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span className="flex-1">Surge & Flood</span>
          </button>

          {/* Temperature */}
          <button
            onClick={() => onChangeDisplayMode('temperature')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              displayMode === 'temperature'
                ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span className="flex-1">Temperature</span>
          </button>

          {/* Humidity */}
          <button
            onClick={() => onChangeDisplayMode('humidity')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              displayMode === 'humidity'
                ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span className="flex-1">Humidity</span>
          </button>

          {/* Pressure */}
          <button
            onClick={() => onChangeDisplayMode('pressure')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              displayMode === 'pressure'
                ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span className="flex-1">Pressure</span>
          </button>
        </div>

        {/* AI & INFRASTRUCTURE Section */}
        <div className="space-y-1 pt-1 border-t border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2 block">
            AI & EXPOSURE
          </span>

          {/* Critical Assets Toggle */}
          <button
            onClick={() => onToggleAssets(!showAssets)}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium transition-all text-left ${
              showAssets
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="flex-1">Critical Assets</span>
            <span className={`w-2 h-2 rounded-full ${showAssets ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
          </button>

          {/* Gemini 3.7 Flash Button */}
          <button
            onClick={onOpenGeminiDrawer}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium text-left bg-gradient-to-r from-sky-600/30 to-indigo-600/30 hover:from-sky-600/50 hover:to-indigo-600/50 border border-sky-500/40 text-sky-200 hover:text-white transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="flex-1 font-semibold">Gemini 3.7 AI</span>
          </button>

          {/* Dispatches */}
          <button
            onClick={onOpenDispatches}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium text-left text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span className="flex-1">Dispatches</span>
          </button>

          {/* Full Registry */}
          <button
            onClick={onOpenRegistry}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl font-medium text-left text-slate-400 hover:bg-slate-800/70 hover:text-white transition-all text-[11px]"
          >
            <span>Asset Registry & CSV</span>
          </button>
        </div>
      </div>

      {/* Global Cyclone Selection Modal Sheet */}
      {showCycloneModal && (
        <div className="fixed inset-0 z-[1500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121926] border border-slate-700 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Globe2 className="w-5 h-5 text-sky-400" />
                <h2 className="text-sm font-bold font-mono text-white tracking-wide">
                  GLOBAL TROPICAL CYCLONE FORECASTER (ALL BASINS)
                </h2>
              </div>
              <button
                onClick={() => setShowCycloneModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {/* Basin Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {['All', 'North Atlantic', 'Western Pacific', 'Bay of Bengal', 'Eastern Pacific', 'South Indian Ocean'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBasinFilter(b as any)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    basinFilter === b
                      ? 'bg-sky-600 text-white border-sky-400 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search global cyclone name, landfall target, or ocean basin..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {/* Cyclone Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto custom-scrollbar pt-1">
              {filteredCyclones.map((c) => {
                const isSelected = c.id === activeCyclone.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCyclone(c);
                      setShowCycloneModal(false);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-500 shadow-md ring-1 ring-sky-500'
                        : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white truncate">{c.name}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">
                        {c.landfall.categoryAtLandfall.replace(' Major Hurricane', '').replace(' Severe Cyclonic Storm', '')}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between mb-1">
                      <span>{c.basin}</span>
                      <span>Peak {c.landfall.maxWindAtLandfallKmh} km/h</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      Target: {c.landfall.locationName}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
