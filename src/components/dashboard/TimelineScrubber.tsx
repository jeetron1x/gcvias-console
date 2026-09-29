import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Clock, FastForward, Rewind } from 'lucide-react';
import { CycloneTrackPoint } from '../../types';

interface TimelineScrubberProps {
  trackPoints: CycloneTrackPoint[];
  currentOffset: number;
  onOffsetChange: (offset: number) => void;
  landfallEtaHours: number;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  trackPoints,
  currentOffset,
  onOffsetChange,
  landfallEtaHours,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const minOffset = trackPoints.length > 0 ? trackPoints[0].offsetHours : -48;
  const maxOffset = trackPoints.length > 0 ? trackPoints[trackPoints.length - 1].offsetHours : 36;

  // Auto-play interval
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        onOffsetChange(
          currentOffset >= maxOffset ? minOffset : Math.min(maxOffset, currentOffset + 6)
        );
      }, 1500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentOffset, minOffset, maxOffset, onOffsetChange]);

  const formatOffsetLabel = (offset: number) => {
    if (offset === 0) return 'T-00h [CURRENT LIVE SITREP]';
    if (offset < 0) return `T${offset}h [${Math.abs(offset)}h PRIOR TO REF]`;
    return `T+${offset}h [FORECAST MODEL]`;
  };

  return (
    <div className="bg-command-900 border border-command-800 rounded-lg p-3.5 shadow-lg font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        {/* Left: Scrubber Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOffsetChange(Math.max(minOffset, currentOffset - 6))}
            disabled={currentOffset <= minOffset}
            className="p-1.5 bg-command-800 hover:bg-command-700 disabled:opacity-40 text-slate-300 rounded-md border border-command-700 transition-colors"
            title="Step Back 6 Hours"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-command-800 hover:bg-command-700 text-amber-400 font-mono text-xs font-bold rounded-md border border-command-700 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-amber-400" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-amber-400" />
                <span>RUN SIMULATION</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOffsetChange(Math.min(maxOffset, currentOffset + 6))}
            disabled={currentOffset >= maxOffset}
            className="p-1.5 bg-command-800 hover:bg-command-700 disabled:opacity-40 text-slate-300 rounded-md border border-command-700 transition-colors"
            title="Advance 6 Hours"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onOffsetChange(0);
            }}
            className="flex items-center space-x-1 px-2 py-1.5 bg-command-800 hover:bg-command-700 text-slate-300 text-xs rounded-md border border-command-700 transition-colors font-mono"
            title="Reset to Present"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">NOW</span>
          </button>
        </div>

        {/* Center/Right: Current Timestamp & Landfall ETA */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-300 bg-command-950 px-2.5 py-1 rounded border border-command-800">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold text-amber-400">{formatOffsetLabel(currentOffset)}</span>
          </div>

          <div className="text-slate-400 hidden md:block">
            LANDFALL ETA: <span className="text-white font-bold">{Math.max(0, landfallEtaHours - currentOffset)} HOURS</span>
          </div>
        </div>
      </div>

      {/* Range Slider Track */}
      <div className="relative pt-1 pb-3">
        <input
          type="range"
          min={minOffset}
          max={maxOffset}
          step={6}
          value={currentOffset}
          onChange={(e) => onOffsetChange(Number(e.target.value))}
          className="w-full h-2 bg-command-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-command-800"
        />

        {/* 6-hour interval tick labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
          {trackPoints.map((pt) => {
            const isSelected = pt.offsetHours === currentOffset;
            const isZero = pt.offsetHours === 0;
            return (
              <button
                key={pt.timestamp}
                onClick={() => onOffsetChange(pt.offsetHours)}
                className={`flex flex-col items-center group transition-colors ${
                  isSelected ? 'text-amber-400 font-bold' : isZero ? 'text-white' : 'hover:text-slate-200'
                }`}
              >
                <span className={`w-1 h-2 rounded-sm mb-1 ${
                  isSelected ? 'bg-amber-400' : isZero ? 'bg-white' : 'bg-command-700'
                }`}></span>
                <span>{pt.offsetHours >= 0 ? `+${pt.offsetHours}h` : `${pt.offsetHours}h`}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
