import React from 'react';
import { Shield, FileCheck, ExternalLink, Activity } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'console' | 'registry' | 'methodology' | 'dispatches' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-command-800 bg-command-950 text-slate-400 text-xs py-6 px-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-slate-100 font-bold font-mono mb-2">
            <Shield className="w-4 h-4 text-hazard-moderate" />
            <span>GCVIAS RESILIENCE CONSOLE</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Operational anticipatory governance platform providing spatial exposure modeling, vulnerability ranking, and structured evacuation directives for coastal disaster authorities.
          </p>
          <div className="mt-3 text-[11px] font-mono text-slate-500">
            Node ID: IN-OD-BOB-01 | Release 2026.2
          </div>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold font-mono text-xs uppercase tracking-wider mb-2">
            Geospatial & Hydro Data
          </h4>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span>
              <span>IMD RSMC Cyclone Best-Track Telemetry</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span>
              <span>OpenStreetMap Critical Infrastructure Nodes</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span>
              <span>USGS SRTM GL1 30m Digital Elevation</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span>
              <span>ESA WorldCover Coastal Land Use Proxy</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold font-mono text-xs uppercase tracking-wider mb-2">
            Governance & Protocols
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button
                onClick={() => onNavigate('privacy')}
                className="text-slate-400 hover:text-slate-200 transition-colors flex items-center space-x-1"
              >
                <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Geospatial Data Privacy Policy</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('terms')}
                className="text-slate-400 hover:text-slate-200 transition-colors flex items-center space-x-1"
              >
                <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Terms & Operational Conditions</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('methodology')}
                className="text-slate-400 hover:text-slate-200 transition-colors flex items-center space-x-1"
              >
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span>Risk Heuristics & Modeling Principles</span>
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold font-mono text-xs uppercase tracking-wider mb-2">
            Statutory Disclaimer
          </h4>
          <p className="text-[11px] text-slate-500 leading-normal">
            Cyclone track advisories ingested by GCVIAS are synchronized with official bulletins. Surge inundation polygons represent rule-based vulnerability risk bands for pre-disaster resource staging and do not replace statutory forecasts issued by the India Meteorological Department.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-command-900 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
        <div>
          (C) 2026 Geospatial Cyclone Vulnerability & Infrastructure Assessment System. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-slate-400">
            <span>Production Server</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </span>
          <span>Domain: gcvias.resilience.gov.in</span>
        </div>
      </div>
    </footer>
  );
};
