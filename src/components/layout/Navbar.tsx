import React from 'react';
import {
  ShieldAlert,
  ChevronDown,
  Layers,
  Database,
  Building2,
  Radio,
  FileCheck
} from 'lucide-react';
import { CycloneEvent, AuthorityRole, AuthorityProfile } from '../../types';

interface NavbarProps {
  cyclones: CycloneEvent[];
  activeCyclone: CycloneEvent;
  onSelectCyclone: (c: CycloneEvent) => void;
  activeRole: AuthorityRole;
  onSelectRole: (role: AuthorityRole) => void;
  currentView: 'console' | 'registry' | 'methodology' | 'dispatches' | 'privacy' | 'terms';
  onNavigate: (view: 'console' | 'registry' | 'methodology' | 'dispatches' | 'privacy' | 'terms') => void;
}

export const AUTHORITY_PROFILES: Record<AuthorityRole, AuthorityProfile> = {
  SDMA: {
    role: 'SDMA',
    roleTitle: 'State Disaster Management Authority (Control Room)',
    jurisdictionName: 'Odisha State Coastal Zone',
    centerCoordinates: [20.45, 86.40],
    defaultZoom: 8,
    availableDistricts: ['Bhadrak', 'Kendrapara', 'Jagatsinghpur', 'Balasore', 'Puri', 'Ganjam'],
  },
  DISTRICT_COLLECTOR: {
    role: 'DISTRICT_COLLECTOR',
    roleTitle: 'District Emergency Operations Center (DEOC)',
    jurisdictionName: 'Bhadrak Coastal District',
    centerCoordinates: [20.85, 86.85],
    defaultZoom: 10,
    availableDistricts: ['Bhadrak'],
  },
  MUNICIPAL_COMMANDER: {
    role: 'MUNICIPAL_COMMANDER',
    roleTitle: 'Municipal Incident Response Team',
    jurisdictionName: 'Dhamra Port & Marine Jurisdiction',
    centerCoordinates: [20.80, 86.92],
    defaultZoom: 12,
    availableDistricts: ['Dhamra Coastal Ward'],
  }
};

export const Navbar: React.FC<NavbarProps> = ({
  cyclones,
  activeCyclone,
  onSelectCyclone,
  activeRole,
  onSelectRole,
  currentView,
  onNavigate,
}) => {
  return (
    <header className="fixed top-4 left-4 z-[950] max-w-lg w-[92%] sm:w-auto font-sans select-none pointer-events-auto">
      {/* Floating Card (Google Maps Style) */}
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md p-2.5 space-y-2">
        {/* Top Operational Status Strip */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          {/* Logo & System Code */}
          <div
            onClick={() => onNavigate('console')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-xs font-bold text-white tracking-wide">GCVIAS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">
                Bay of Bengal Resilience Console
              </span>
            </div>
          </div>

          {/* Storm Selector */}
          <div className="relative">
            <select
              aria-label="Active Cyclone Threat"
              value={activeCyclone.id}
              onChange={(e) => {
                const found = cyclones.find((c) => c.id === e.target.value);
                if (found) onSelectCyclone(found);
              }}
              className="appearance-none bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] font-mono rounded-lg pl-2 pr-6 py-1 focus:outline-none cursor-pointer"
            >
              {cyclones.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Operational Authority Switcher */}
        <div className="flex items-center justify-between text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-lg p-1.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Authority:</span>
          <select
            aria-label="Operational Authority Scope"
            value={activeRole}
            onChange={(e) => onSelectRole(e.target.value as AuthorityRole)}
            className="bg-transparent text-sky-400 font-bold text-xs focus:outline-none cursor-pointer text-right pr-1"
          >
            <option value="SDMA" className="bg-slate-900 text-slate-100">Odisha State SDMA (Statewide)</option>
            <option value="DISTRICT_COLLECTOR" className="bg-slate-900 text-slate-100">District Collector (Bhadrak)</option>
            <option value="MUNICIPAL_COMMANDER" className="bg-slate-900 text-slate-100">Municipal Unit (Dhamra Port)</option>
          </select>
        </div>

        {/* Quick-Navigation Tabs (Google Maps Style Quick Buttons) */}
        <div className="flex items-center space-x-1 pt-0.5 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => onNavigate('console')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'console'
                ? 'bg-sky-600 text-white font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Map</span>
          </button>

          <button
            onClick={() => onNavigate('registry')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'registry'
                ? 'bg-sky-600 text-white font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>Assets</span>
          </button>

          <button
            onClick={() => onNavigate('dispatches')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'dispatches'
                ? 'bg-sky-600 text-white font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Dispatches</span>
          </button>

          <button
            onClick={() => onNavigate('methodology')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'methodology'
                ? 'bg-sky-600 text-white font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Methodology</span>
          </button>

          <button
            onClick={() => onNavigate('privacy')}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'privacy'
                ? 'bg-sky-600 text-white font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Privacy Policy"
          >
            <FileCheck className="w-3 h-3" />
            <span>Legal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
