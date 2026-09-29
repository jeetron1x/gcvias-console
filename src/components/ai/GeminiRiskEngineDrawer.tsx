import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  RefreshCw,
  Waves,
  CloudRain,
  ShieldAlert,
  Volume2,
  Download,
  CheckCircle2
} from 'lucide-react';
import {
  CycloneEvent,
  CycloneTrackPoint,
  InfrastructureAsset,
  ExposureSummary,
  GeminiRiskReport,
  DispatchAuditRecord,
  AuthorityRole
} from '../../types';
import { runGeminiRiskAnalysis } from '../../utils/geminiReasoner';
import { speechSynthesizer } from '../../utils/speech';

interface GeminiRiskEngineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCyclone: CycloneEvent;
  currentEye: CycloneTrackPoint;
  assets: InfrastructureAsset[];
  exposure: ExposureSummary;
  onAddDispatchLog: (log: DispatchAuditRecord) => void;
  activeRole: AuthorityRole;
}

export const GeminiRiskEngineDrawer: React.FC<GeminiRiskEngineDrawerProps> = ({
  isOpen,
  onClose,
  activeCyclone,
  currentEye,
  assets,
  exposure,
  onAddDispatchLog,
  activeRole,
}) => {
  const [report, setReport] = useState<GeminiRiskReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // Trigger analysis when opened or cyclone changes
  const executeAnalysis = async () => {
    setLoading(true);
    setDispatchedSuccess(false);
    try {
      const res = await runGeminiRiskAnalysis(
        activeCyclone,
        currentEye,
        assets,
        exposure
      );
      setReport(res);
    } catch (err) {
      console.error('Failed to run Gemini analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      executeAnalysis();
    }
  }, [isOpen, activeCyclone.id, currentEye.offsetHours]);

  if (!isOpen) return null;

  const handlePlayVoice = async () => {
    if (!report) return;
    if (isPlayingAudio) {
      speechSynthesizer.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      await speechSynthesizer.speak(
        report.multilingualAcousticAlert.alertText,
        'en',
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleDispatchOfficialOrders = () => {
    if (!report) return;
    const newLog: DispatchAuditRecord = {
      id: `DISPATCH-GEMINI-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      advisoryId: report.reportId,
      cycloneName: activeCyclone.name,
      dispatchedByRole: activeRole,
      jurisdiction: `${activeCyclone.basin} Unified Command Sector`,
      targetChannels: [
        'National Emergency Wireless Relay',
        'State / Provincial VHF Tactical Net',
        'Municipal Coastal Siren Net',
        'Cell Broadcast SMS Gateway'
      ],
      recipientCount: 124,
      payloadSummary: `Mandatory Stage-4 Evacuation Order based on Gemini 3.7 Flash risk model: ${report.stormSurgeSimulation.hydrodynamicRunupMeters}m surge overtopping coastal corridors.`,
    };
    onAddDispatchLog(newLog);
    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 4000);
  };

  const handleExportJson = () => {
    if (!report) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gemini-3.7-risk-model-${activeCyclone.id}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-[1400] bg-black/75 backdrop-blur-md flex justify-end transition-opacity duration-300 pointer-events-auto font-sans select-none">
      {/* Slide-out Drawer */}
      <div className="w-full max-w-2xl bg-[#0b101b] border-l border-slate-700/80 h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 bg-[#121926] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/40 text-sky-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono text-white tracking-wide">
                  GEMINI 3.7 FLASH MULTIMODAL RISK ENGINE
                </h2>
                <span className="text-[10px] font-mono bg-sky-950/80 text-sky-400 border border-sky-800/80 px-1.5 py-0.2 rounded font-bold">
                  GEE + DEM
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Satellite Feeds (Sentinel-3 SLSTR) • SRTM 30m DEM • Predictive Damage Pathways
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Status & Re-run Banner */}
          <div className="bg-[#121926]/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">
                Target: {activeCyclone.name} ({activeCyclone.basin})
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Landfall: {activeCyclone.landfall.locationName}
              </span>
            </div>
            <button
              onClick={() => executeAnalysis()}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white rounded-lg border border-slate-700 text-xs font-mono font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Simulating...' : 'Re-Run Model'}</span>
            </button>
          </div>

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-xs text-slate-400 uppercase tracking-widest animate-pulse">
                Gemini 3.7 Flash processing GEE satellite imagery & hydrodynamic runup...
              </p>
            </div>
          )}

          {!loading && report && (
            <>
              {/* 1. Telemetry Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase block">Max Sustained Wind</span>
                  <span className="text-sm font-bold text-sky-400">{report.telemetrySummary.maxSustainedWindKmh} km/h</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase block">Central Pressure</span>
                  <span className="text-sm font-bold text-slate-200">{report.telemetrySummary.centralPressureHpa} hPa</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase block">Peak Storm Surge</span>
                  <span className="text-sm font-bold text-red-400">{report.telemetrySummary.peakSurgeHeightMeters} m</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase block">24h Rainfall Total</span>
                  <span className="text-sm font-bold text-amber-400">{report.telemetrySummary.rainAccumulation24hMm} mm</span>
                </div>
              </div>

              {/* 2. Storm Surge Simulation */}
              <div className="bg-[#121926]/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                  <Waves className="w-4 h-4" />
                  <span>1. Hydrodynamic Storm Surge Inundation Simulation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hydrodynamic modeling predicts peak coastal surge of <strong className="text-cyan-300">{report.stormSurgeSimulation.hydrodynamicRunupMeters}m</strong> above astronomical tide. Backwater ingress will extend <strong className="text-cyan-300">{report.stormSurgeSimulation.estuarinePenetrationKm} km</strong> inland via coastal river deltas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Highest Risk Sectors</span>
                    <ul className="space-y-0.5 text-slate-300 list-disc pl-3">
                      {report.stormSurgeSimulation.highestRiskSectors.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Critical Breach Points</span>
                    <ul className="space-y-0.5 text-red-300 list-disc pl-3">
                      {report.stormSurgeSimulation.criticalBreachPoints.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Rainfall Damage Pathways */}
              <div className="bg-[#121926]/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase">
                  <CloudRain className="w-4 h-4" />
                  <span>2. Local Rainfall Damage Pathways & Orographic Flood Model</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Peak hourly precipitation will reach <strong className="text-sky-300">{report.rainfallDamagePathways.peakIntensityMmPerHour} mm/h</strong>, categorized as <strong className="text-red-400">{report.rainfallDamagePathways.flashFloodVulnerability} FLASH FLOOD RISK</strong>. Water runoff along low-gradient terrain will breach unreinforced embankments.
                </p>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Culvert Washout & Road Cutoff Corridors:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.rainfallDamagePathways.culvertWashoutCorridors.map((c, idx) => (
                      <span key={idx} className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-amber-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Critical Damage Pathways (Gemini 3.7 Multimodal Reasoning) */}
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2 text-white font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>3. Multimodal Physical Damage Pathways (Asset-by-Asset Breakdown)</span>
                </div>

                {report.damagePathways.map((dp, idx) => (
                  <div
                    key={idx}
                    className="bg-[#121926]/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{dp.title}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          dp.severity === 'CATASTROPHIC'
                            ? 'bg-red-950/80 text-red-300 border-red-800'
                            : 'bg-amber-950/80 text-amber-300 border-amber-800'
                        }`}
                      >
                        {dp.severity}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-[11px]">{dp.physicalExposureDetail}</p>

                    <div className="p-2 bg-slate-900/90 border border-slate-800 rounded-lg text-[11px] font-mono space-y-1">
                      <div>
                        <span className="text-slate-400">Target Facilities: </span>
                        <span className="text-sky-300">{dp.affectedInfrastructure.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Cascading Failure: </span>
                        <span className="text-amber-300">{dp.cascadingImpact}</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-emerald-400 pt-0.5">
                      <strong>Directive: </strong>{dp.mitigationProtocol}
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. Statutory Early-Warning Dispatches */}
              <div className="bg-[#121926]/90 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <Volume2 className="w-4 h-4" />
                    <span>4. Statutory Early-Warning Dispatches & Voice Broadcast</span>
                  </div>
                  <button
                    onClick={handlePlayVoice}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${
                      isPlayingAudio
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700'
                    }`}
                  >
                    <span>{isPlayingAudio ? 'Stop Alert' : 'Broadcast Voice Alert'}</span>
                  </button>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg">
                    <span className="text-amber-400 font-bold block mb-0.5">State / Federal Emergency Authority (SDMA / FEMA):</span>
                    <p className="text-slate-300 leading-relaxed">{report.statutoryAdvisories.stateFederalDirective}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg">
                    <span className="text-sky-400 font-bold block mb-0.5">District Emergency Operations Center (DEOC):</span>
                    <p className="text-slate-300 leading-relaxed">{report.statutoryAdvisories.districtOperationsDirective}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg">
                    <span className="text-emerald-400 font-bold block mb-0.5">Municipal Harbor & Port Command:</span>
                    <p className="text-slate-300 leading-relaxed">{report.statutoryAdvisories.municipalPortDirective}</p>
                  </div>
                </div>

                {/* Dispatch Button */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={handleDispatchOfficialOrders}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-mono text-xs font-bold py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{dispatchedSuccess ? 'Dispatched Across Channels!' : 'Dispatch Statutory Warning to DEOC Net'}</span>
                  </button>
                  <button
                    onClick={handleExportJson}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                    title="Export Model JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
