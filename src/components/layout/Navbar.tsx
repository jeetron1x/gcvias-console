import React from 'react';
import {
  ShieldAlert,
  Radio,
  Layers,
  FileText,
  Database,
  Building2,
  ChevronDown
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
    <header className="border-b border-command-800 bg-command-950 text-slate-200 sticky top-0 z-50 shadow-md">
      {/* Top Telemetry Strip */}
      <div className="bg-command-900 border-b border-command-800/80 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-slate-300">
            <Radio className="w-3.5 h-3.5 mr-1.5 text-emerald-500 animate-pulse" />
            TELEMETRY LINK: ONLINE
          </span>
          <span className="hidden sm:inline-block text-command-600">|</span>
          <span className="hidden sm:inline-block">IMD BULLETIN REF: RSMC-BOB/08</span>
          <span className="hidden md:inline-block text-command-600">|</span>
          <span className="hidden md:inline-block">DATUM: WGS-84 / UTM ZONE 45N</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-amber-400 font-medium">SECURITY LEVEL: RESTRICTED OFFICIAL USE</span>
          <span className="text-command-600">|</span>
          <span>NODE: BOB-EAST-01</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & System Code */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('console')}>
          <div className="w-10 h-10 bg-command-900 border border-command-700 rounded-md flex items-center justify-center text-amber-500 shadow-inner">
            <ShieldAlert className="w-6 h-6 text-hazard-severe" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-wide text-white font-mono">GCVIAS</span>
              <span className="text-xs bg-command-800 text-slate-300 px-2 py-0.5 rounded border border-command-700">v1.4-PROD</span>
            </div>
            <p className="text-xs text-slate-400 tracking-tight hidden sm:block">
              Geospatial Cyclone Vulnerability & Infrastructure Assessment System
            </p>
          </div>
        </div>

        {/* Cyclone Selector & Role Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Cyclone Dropdown */}
          <div className="relative">
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-mono mb-0.5">Active Storm Threat</label>
            <div className="relative">
              <select
                aria-label="Active Storm Threat"
                value={activeCyclone.id}
                onChange={(e) => {
                  const found = cyclones.find((c) => c.id === e.target.value);
                  if (found) onSelectCyclone(found);
                }}
                className="appearance-none bg-command-900 border border-command-700 text-slate-100 text-xs rounded-md pl-2.5 pr-8 py-1.5 focus:outline-none focus:border-command-500 font-mono cursor-pointer"
              >
                {cyclones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.landfall.categoryAtLandfall})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Authority Scope Dropdown */}
          <div className="relative">
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-mono mb-0.5">Operating Authority</label>
            <div className="relative">
              <select
                aria-label="Operating Authority"
                value={activeRole}
                onChange={(e) => onSelectRole(e.target.value as AuthorityRole)}
                className="appearance-none bg-command-900 border border-command-700 text-slate-100 text-xs rounded-md pl-2.5 pr-8 py-1.5 focus:outline-none focus:border-command-500 font-mono cursor-pointer"
              >
                <option value="SDMA">State Disaster Management Authority (State)</option>
                <option value="DISTRICT_COLLECTOR">District Collector (Bhadrak District)</option>
                <option value="MUNICIPAL_COMMANDER">Municipal Response Unit (Dhamra)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Primary Navigation Buttons */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onNavigate('console')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
              currentView === 'console'
                ? 'bg-command-800 text-white border-command-600'
                : 'text-slate-400 hover:text-white border-transparent hover:bg-command-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GIS Console</span>
          </button>

          <button
            onClick={() => onNavigate('registry')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
              currentView === 'registry'
                ? 'bg-command-800 text-white border-command-600'
                : 'text-slate-400 hover:text-white border-transparent hover:bg-command-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Infrastructure</span>
          </button>

          <button
            onClick={() => onNavigate('dispatches')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
              currentView === 'dispatches'
                ? 'bg-command-800 text-white border-command-600'
                : 'text-slate-400 hover:text-white border-transparent hover:bg-command-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dispatch Log</span>
          </button>

          <button
            onClick={() => onNavigate('methodology')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
              currentView === 'methodology'
                ? 'bg-command-800 text-white border-command-600'
                : 'text-slate-400 hover:text-white border-transparent hover:bg-command-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
