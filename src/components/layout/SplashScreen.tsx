import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // 1.6s display, then 400ms fade out transition
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        onFinish();
      }, 400);
    }, 1600);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#070C14] flex flex-col items-center justify-center transition-all duration-400 ease-out select-none ${
        fadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Centered Minimalist Meteorological Radar Glyph */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Pulsing Concentric Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping opacity-40"></div>
        <div className="absolute inset-2 rounded-full border border-sky-500/30 animate-pulse"></div>
        <div className="absolute inset-5 rounded-full border border-sky-500/50"></div>

        {/* Minimalist Radar Vector SVG */}
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" className="relative z-10">
          <circle cx="32" cy="32" r="28" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="32" cy="32" r="18" stroke="#334155" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="8" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="4" y1="32" x2="60" y2="32" stroke="#1E293B" strokeWidth="1" />
          <line x1="32" y1="4" x2="32" y2="60" stroke="#1E293B" strokeWidth="1" />
          <path
            d="M 32 18 C 42 18 46 28 42 36 C 39 42 31 44 26 40 C 22 36 22 28 28 24 C 33 21 38 23 39 27 C 40 31 37 34 33 34"
            stroke="#D97706"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="32" cy="32" r="3" fill="#DC2626" />
        </svg>
      </div>

      {/* System Identifier */}
      <div className="text-center space-y-1.5">
        <h1 className="text-xl font-bold font-mono tracking-widest text-white">
          GCVIAS
        </h1>
        <p className="text-xs font-mono text-slate-400 tracking-wider uppercase">
          Geospatial Cyclone Vulnerability & Infrastructure Assessment System
        </p>
      </div>

      {/* Minimalist Telemetry Initialization Line */}
      <div className="mt-8 flex flex-col items-center space-y-2">
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-sky-500 rounded-full animate-[progress_1.6s_ease-in-out_infinite]"></div>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Synchronizing RSMC Telemetry
        </span>
      </div>
    </div>
  );
};
