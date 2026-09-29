import React from 'react';
import {
  Activity,
  ShieldAlert,
  Layers,
  Compass,
  FileText,
  AlertCircle
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 font-sans text-slate-200">
      {/* Header Banner */}
      <div className="bg-command-900 border border-command-800 rounded-lg p-5 shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded bg-command-800 text-amber-500 border border-command-700">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-white tracking-wide">
              SCIENTIFIC METHODOLOGY & HEURISTIC ARCHITECTURE
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Technical documentation of spatial risk ranking, surge inundation heuristics, and data provenance
            </p>
          </div>
        </div>
      </div>

      {/* Scope Reality Check & Core Philosophy */}
      <div className="bg-command-900 border border-command-800 rounded-lg p-5 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Operational Philosophy & Scientific Scope</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Full physical hydrodynamic modeling of coastal storm surge requires multi-basin shallow water numerical equations (such as ADCIRC or SLOSH) running on supercomputing clusters over several hours. In a rapid tactical response window (T-48 to T-12 hours prior to landfall), District Magistrates, Block Development Officers, and Municipal Incident Commanders do not require sub-centimeter hydraulic convergence; they require a transparent, reliable, explainable risk-ranking heuristic that flags which physical assets will be compromised first.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          GCVIAS operates on an explicit design principle: wherever dynamic fluid simulation is computationally prohibitive, it applies validated rule-based approximations grounded in official India Meteorological Department (IMD) track bulletins and Earth Engine terrain proxies, clearly identifying every metric as an estimated risk band.
        </p>
      </div>

      {/* Mathematical Formulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Storm Surge Heuristic */}
        <div className="bg-command-900 border border-command-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold uppercase">
            <Layers className="w-4 h-4" />
            <span>1. Coastal Surge Inundation Formulation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The peak coastal surge height S is estimated as a function of the central pressure deficit &Delta;P = (P_ambient - P_central), maximum sustained wind speed V_max, forward translation speed V_f, and quadrant orientation relative to the eye:
          </p>
          <div className="bg-command-950 border border-command-800 rounded p-3 font-mono text-xs text-amber-300">
            S = [ 0.01 &times; &Delta;P + &alpha; &times; (V_max / 100)&sup2; ] &times; Q(&theta;) &times; B(x)
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li><strong>&Delta;P</strong>: Atmospheric pressure deficit in hPa (reference P_ambient = 1010 hPa).</li>
            <li><strong>Q(&theta;)</strong>: Coriolis right-front quadrant factor (1.25 for Northern Hemisphere right-of-track onshore winds; 0.75 for offshore left quadrant).</li>
            <li><strong>B(x)</strong>: Bathymetry amplification coefficient for shallow Bay of Bengal shelf waters.</li>
          </ul>
        </div>

        {/* Wind Vortex Model */}
        <div className="bg-command-900 border border-command-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs font-bold uppercase">
            <Compass className="w-4 h-4" />
            <span>2. Modified Rankine Wind Profile</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Surface wind distribution from the cyclone center is evaluated using a modified Rankine vortex distribution parameterized by radius of maximum winds (RMW) and gale radii:
          </p>
          <div className="bg-command-950 border border-command-800 rounded p-3 font-mono text-xs text-amber-300">
            V(r) = V_max &times; (r / R_max)^x &nbsp; [for r &lt; R_max]
            <br />
            V(r) = V_max &times; (R_max / r)^y &nbsp; [for r &ge; R_max]
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li>Core eyewall destruction zone: r &le; R_max (typically 15-30 km).</li>
            <li>Severe gale zone: r &le; R_50 (50-knot / 92 km/h wind threshold).</li>
            <li>Peripheral storm zone: r &le; R_34 (34-knot / 63 km/h tropical storm force).</li>
          </ul>
        </div>
      </div>

      {/* Vulnerability Matrix Table */}
      <div className="bg-command-900 border border-command-800 rounded-lg p-5 space-y-3">
        <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>3. Critical Infrastructure Exposure Categorization</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Every geo-tagged infrastructure asset in the registry is cross-referenced against the instantaneous wind radius, coastal proximity, and terrain elevation above Mean Sea Level (MSL):
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse mt-2">
            <thead>
              <tr className="bg-command-950 text-slate-400 font-mono text-[11px] border-b border-command-800">
                <th className="py-2 px-3">Risk Band</th>
                <th className="py-2 px-3">Wind Field Exposure</th>
                <th className="py-2 px-3">Estimated Surge Inundation</th>
                <th className="py-2 px-3">Mandatory Operational Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-command-800/80 text-xs">
              <tr>
                <td className="py-2 px-3 font-bold text-hazard-severe">Severe</td>
                <td className="py-2 px-3 text-slate-300">&gt; 118 km/h or within Eyewall Core</td>
                <td className="py-2 px-3 text-slate-300">&gt; 1.0m above ground plinth elevation</td>
                <td className="py-2 px-3 text-slate-400">Immediate de-energization, vertical evacuation of ICU/shelter ground floor</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-hazard-high">High</td>
                <td className="py-2 px-3 text-slate-300">89-117 km/h (within R50 radius)</td>
                <td className="py-2 px-3 text-slate-300">0.2m to 1.0m over ground elevation</td>
                <td className="py-2 px-3 text-slate-400">Position emergency repair gangs, verify 72h generator fuel buffer</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-hazard-moderate">Moderate</td>
                <td className="py-2 px-3 text-slate-300">62-88 km/h (within R34 radius)</td>
                <td className="py-2 px-3 text-slate-300">Minor tidal wash (&lt; 0.2m)</td>
                <td className="py-2 px-3 text-slate-400">Pre-position replenishment supplies, notify block control room</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-blue-400">Monitored</td>
                <td className="py-2 px-3 text-slate-300">&lt; 62 km/h peripheral tracking</td>
                <td className="py-2 px-3 text-slate-300">No surge threat</td>
                <td className="py-2 px-3 text-slate-400">Maintain standard operational telemetry monitoring</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Disclaimers */}
      <div className="bg-command-900 border border-command-800 rounded-lg p-5 space-y-2">
        <div className="flex items-center space-x-2 text-slate-200 font-mono text-xs font-bold uppercase">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>Statutory Authority & Non-Goals</span>
        </div>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
          <li><strong>Not an IMD Replacement</strong>: Cyclone track positions, central pressures, and landfall timing are ingested from official RSMC bulletins. GCVIAS does not alter statutory storm trajectories.</li>
          <li><strong>Simulation vs Prediction</strong>: Inundation and wind overlays represent spatial vulnerability rankings intended for prioritizing disaster relief assets and do not constitute certified structural engineering surveys.</li>
          <li><strong>Authorized Personnel Use</strong>: Access to operational dispatch actions is restricted to authorized state, district, and municipal emergency management officers.</li>
        </ul>
      </div>
    </div>
  );
};
