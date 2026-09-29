import React, { useState } from 'react';
import {
  AdvisoryPayload,
  AuthorityRole
} from '../../types';
import { speechSynthesizer } from '../../utils/speech';
import {
  Volume2,
  VolumeX,
  Send,
  Printer,
  X,
  AlertTriangle,
  Globe,
  Radio,
  FileCheck2,
  ShieldAlert
} from 'lucide-react';

interface AdvisoryConsoleProps {
  advisory: AdvisoryPayload;
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (channels: string[]) => void;
  activeRole: AuthorityRole;
  selectedLanguage: string;
  onChangeLanguage: (lang: string) => void;
}

export const AdvisoryConsole: React.FC<AdvisoryConsoleProps> = ({
  advisory,
  isOpen,
  onClose,
  onDispatch,
  activeRole,
  selectedLanguage,
  onChangeLanguage,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  if (!isOpen) return null;

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
    onDispatch(['DEOC Wireless Network', 'State Emergency VHF Band 3', 'SMS Cell Broadcast Proxy']);
    setDispatchConfirmed(true);
    setTimeout(() => {
      setDispatchConfirmed(false);
    }, 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-command-950 border border-command-700 rounded-lg max-w-4xl w-full shadow-2xl overflow-hidden font-sans text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-command-900 px-5 py-3.5 border-b border-command-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-hazard-severe/20 border border-hazard-severe/40 text-hazard-severe">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-bold text-white tracking-wide">
                DISASTER EVACUATION ADVISORY & DIRECTIVE
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Bulletin ID: {advisory.advisoryId} | Authority: {activeRole}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-1.5 bg-command-800 hover:bg-command-700 text-slate-300 rounded border border-command-700 transition-colors"
              title="Print Official SitRep"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                speechSynthesizer.stop();
                setIsPlayingAudio(false);
                onClose();
              }}
              className="p-1.5 bg-command-800 hover:bg-command-700 text-slate-300 rounded border border-command-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Language Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded bg-command-900 border border-command-800">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <Globe className="w-4 h-4 text-amber-500" />
              <span>Target Broadcast Language:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { code: 'en', label: 'English' },
                { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
                { code: 'bn', label: 'বাংলা (Bengali)' },
                { code: 'te', label: 'తెలుగు (Telugu)' },
                { code: 'ta', label: 'தமிழ் (Tamil)' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onChangeLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-amber-600 text-white border-amber-500 font-bold'
                      : 'bg-command-800 text-slate-300 border-command-700 hover:bg-command-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Headline Card */}
          <div className="p-3.5 bg-hazard-severe/10 border border-hazard-severe/30 rounded-md">
            <div className="text-[10px] font-mono uppercase text-red-400 font-bold tracking-wider mb-1 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Priority Disaster Directive</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
              {advisory.severityHeadline}
            </h3>
            <div className="mt-2 text-xs text-slate-400 font-mono">
              Target Districts: {advisory.affectedDistricts.join(', ')}
            </div>
          </div>

          {/* Sectoral Operational Directives */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide mb-2">
              Statutory Sector Directives
            </h4>
            <div className="space-y-2">
              {advisory.immediateDirectives.map((d, idx) => (
                <div key={idx} className="p-3 bg-command-900 border border-command-800 rounded-md text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-400">{d.sector}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-command-800 text-slate-300 border border-command-700">
                      {d.targetAuthority}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{d.directive}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Evacuation Facilities */}
          {advisory.priorityFacilities.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide mb-2">
                High-Priority Infrastructure Nodes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {advisory.priorityFacilities.map((fac, idx) => (
                  <div key={idx} className="p-2.5 bg-command-900 border border-command-800 rounded">
                    <div className="font-bold text-white mb-0.5">{fac.assetName}</div>
                    <div className="text-[10px] font-mono text-slate-400 mb-1">
                      {fac.district} | Type: {fac.assetType.toUpperCase()}
                    </div>
                    <div className="text-[11px] text-slate-300 bg-command-950 p-1.5 rounded border border-command-850">
                      {fac.actionRequired}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speech Audio Broadcast Section */}
          <div className="p-3 bg-command-900 border border-command-800 rounded-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded bg-command-800 text-amber-400 border border-command-700">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono">Audio Broadcast Synthesizer</div>
                <div className="text-[11px] text-slate-400">
                  Acoustic warning tone and multilingual text-to-speech for wireless dispatch
                </div>
              </div>
            </div>

            <button
              onClick={handlePlayAudio}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-md border transition-colors ${
                isPlayingAudio
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-command-800 hover:bg-command-700 text-amber-400 border-command-700'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>HALT AUDIO</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>PLAY BROADCAST AUDIO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-command-900 px-5 py-3 border-t border-command-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400">
            {dispatchConfirmed ? (
              <span className="text-emerald-400 flex items-center font-bold">
                <FileCheck2 className="w-3.5 h-3.5 mr-1" />
                DISPATCH COMMITTED TO DEOC EMERGENCY WIRELESS NETWORK
              </span>
            ) : (
              <span>Advisory logged in official audit registry. Click dispatch to broadcast.</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                speechSynthesizer.stop();
                setIsPlayingAudio(false);
                onClose();
              }}
              className="px-3 py-1.5 bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono rounded-md border border-command-700"
            >
              DISMISS
            </button>

            <button
              onClick={handleTriggerDispatch}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-hazard-severe hover:bg-red-700 text-white text-xs font-mono font-bold rounded-md shadow border border-red-500 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>DISPATCH ADVISORY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
