import React from 'react';
import { DispatchAuditRecord } from '../../types';
import { ShieldCheck, Download, X, Clock, Radio } from 'lucide-react';

interface DispatchLogModalProps {
  logs: DispatchAuditRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export const DispatchLogModal: React.FC<DispatchLogModalProps> = ({
  logs,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gcvias-dispatch-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-command-950 border border-command-700 rounded-lg max-w-4xl w-full shadow-2xl overflow-hidden font-sans text-slate-200">
        <div className="bg-command-900 px-5 py-3.5 border-b border-command-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-mono text-sm font-bold text-white tracking-wide">
                OFFICIAL DISPATCH AUDIT REGISTRY
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Statutory log of emergency advisories dispatched across government operational channels
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-command-800 hover:bg-command-700 text-xs font-mono text-slate-200 rounded border border-command-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>EXPORT JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-command-800 hover:bg-command-700 text-slate-300 rounded border border-command-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              NO DISPATCH EVENTS RECORDED IN CURRENT SESSION.
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-command-900 border border-command-800 rounded-md font-sans text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-command-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-amber-400">{log.advisoryId}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-command-800 text-slate-300 border border-command-700">
                        {log.dispatchedByRole}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                    <div>Jurisdiction: <span className="text-white">{log.jurisdiction}</span></div>
                    <div>Storm Threat: <span className="text-white">{log.cycloneName}</span></div>
                  </div>

                  <div className="text-slate-300 text-xs bg-command-950 p-2 rounded border border-command-850">
                    {log.payloadSummary}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400 pt-1">
                    <Radio className="w-3 h-3 text-emerald-400 mr-0.5" />
                    <span>Transmitted to:</span>
                    {log.targetChannels.map((ch, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-command-800 text-slate-300 border border-command-700"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-command-900 px-5 py-3 border-t border-command-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-command-800 hover:bg-command-700 text-slate-200 text-xs font-mono rounded border border-command-700"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
