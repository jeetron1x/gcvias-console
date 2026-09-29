import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Wind,
  Gauge,
  Waves,
  Clock
} from 'lucide-react';
import { CycloneTrackPoint } from '../../types';

interface TimelineScrubberProps {
  trackPoints: CycloneTrackPoint[];
  currentOffset: number;
  onOffsetChange: (offset: number) => void;
  landfallEtaHours: number;
  currentEye: CycloneTrackPoint;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  trackPoints,
  currentOffset,
  onOffsetChange,
  landfallEtaHours,
  currentEye,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 4x

  const minOffset = trackPoints.length > 0 ? trackPoints[0].offsetHours : -48;
  const maxOffset = trackPoints.length > 0 ? trackPoints[trackPoints.length - 1].offsetHours : 36;

  // Auto-play interval
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      const intervalMs = Math.round(1500 / playbackSpeed);
      timer = setInterval(() => {
        onOffsetChange(
          currentOffset >= maxOffset ? minOffset : Math.min(maxOffset, currentOffset + 6)
        );
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentOffset, minOffset, maxOffset, onOffsetChange, playbackSpeed]);

  const formatOffsetLabel = (offset: number) => {
    if (offset === 0) return 'T-00h (CURRENT LIVE REF)';
    if (offset < 0) return `T${offset}h (${Math.abs(offset)}h TO LANDFALL)`;
    return `T+${offset}h (FORECAST INLAND)`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[950] w-[95%] max-w-4xl bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md p-3.5 font-sans select-none transition-all duration-200">
      {/* Top Row: Playback Controls & Meteorological Telemetry Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
        {/* Playback Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onOffsetChange(Math.max(minOffset, currentOffset - 6))}
            disabled={currentOffset <= minOffset}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Step Back 6 Hours"
          >
            <Rewind className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>SIMULATE</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOffsetChange(Math.min(maxOffset, currentOffset + 6))}
            disabled={currentOffset >= maxOffset}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Advance 6 Hours"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onOffsetChange(0);
            }}
            className="px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors font-mono flex items-center space-x-1"
            title="Reset to Present"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">NOW</span>
          </button>

          {/* Speed Multiplier Button */}
          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : 1)}
            className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-amber-400 font-mono text-[11px] font-bold rounded-lg border border-slate-700"
            title="Playback Speed"
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Live Telemetry Chips (Zoom Earth Style) */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">{formatOffsetLabel(currentOffset)}</span>
          </div>

          <div className="hidden md:flex items-center space-x-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
            <Wind className="w-3 h-3 text-sky-400" />
            <span>{currentEye.maxWindKmh} km/h</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
            <Gauge className="w-3 h-3 text-blue-400" />
            <span>{currentEye.centralPressureHpa} hPa</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-red-400 font-bold">
            <Waves className="w-3 h-3 text-red-400" />
            <span>Surge {currentEye.surgeEstimateMeters}m</span>
          </div>

          <div className="hidden xl:flex items-center space-x-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-amber-300 font-mono">
            <span>Landfall: T{landfallEtaHours >= 0 ? `+${landfallEtaHours}` : landfallEtaHours}h</span>
          </div>
        </div>
      </div>

      {/* Scrub Range Slider Track */}
      <div className="relative pt-1 pb-1">
        <input
          type="range"
          min={minOffset}
          max={maxOffset}
          step={6}
          value={currentOffset}
          onChange={(e) => onOffsetChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-700 focus:outline-none"
        />

        {/* Ticks and Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5 px-0.5">
          {trackPoints.map((pt) => {
            const isSelected = pt.offsetHours === currentOffset;
            const isZero = pt.offsetHours === 0;

            return (
              <button
                key={pt.timestamp}
                onClick={() => onOffsetChange(pt.offsetHours)}
                className={`flex flex-col items-center group transition-colors ${
                  isSelected ? 'text-sky-400 font-bold' : isZero ? 'text-white' : 'hover:text-slate-200'
                }`}
              >
                <span
                  className={`w-1 h-1.5 rounded-sm mb-0.5 ${
                    isSelected ? 'bg-sky-400' : isZero ? 'bg-white' : 'bg-slate-700'
                  }`}
                ></span>
                <span>{pt.offsetHours >= 0 ? `+${pt.offsetHours}h` : `${pt.offsetHours}h`}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
