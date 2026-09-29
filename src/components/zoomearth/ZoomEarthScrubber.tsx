import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { CycloneTrackPoint } from '../../types';

interface ZoomEarthScrubberProps {
  trackPoints: CycloneTrackPoint[];
  currentOffset: number;
  onOffsetChange: (offset: number) => void;
}

export const ZoomEarthScrubber: React.FC<ZoomEarthScrubberProps> = ({
  trackPoints,
  currentOffset,
  onOffsetChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const minOffset = trackPoints.length > 0 ? trackPoints[0].offsetHours : -48;
  const maxOffset = trackPoints.length > 0 ? trackPoints[trackPoints.length - 1].offsetHours : 36;

  // Auto-play interval
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      const intervalMs = Math.round(1400 / playbackSpeed);
      timer = setInterval(() => {
        onOffsetChange(
          currentOffset >= maxOffset ? minOffset : Math.min(maxOffset, currentOffset + 6)
        );
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentOffset, minOffset, maxOffset, playbackSpeed, onOffsetChange]);

  // Format date and time (e.g. 24 Sep  02 : 30)
  const formatOffsetToDateTime = (offset: number) => {
    const pt = trackPoints.find((p) => p.offsetHours === offset);
    if (pt) {
      const date = new Date(pt.timestamp);
      const day = date.getUTCDate();
      const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return { dayMonth: `${day} ${month}`, time: `${hours} : ${minutes}` };
    }

    // Fallback relative calculation
    const base = new Date('2024-10-24T06:00:00Z');
    base.setHours(base.getHours() + offset);
    const day = base.getUTCDate();
    const month = base.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const hours = base.getUTCHours().toString().padStart(2, '0');
    return { dayMonth: `${day} ${month}`, time: `${hours} : 00` };
  };

  const { dayMonth, time } = formatOffsetToDateTime(currentOffset);

  const stepNext = () => {
    onOffsetChange(Math.min(maxOffset, currentOffset + 6));
  };

  const stepPrev = () => {
    onOffsetChange(Math.max(minOffset, currentOffset - 6));
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[950] font-sans select-none pointer-events-auto">
      {/* Floating Dark Capsule (Exact look of Zoom Earth timeline scrubber from screenshots) */}
      <div className="bg-[#0b101b]/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md px-4 py-2.5 flex flex-col space-y-1.5 w-[330px] sm:w-[410px]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center border border-slate-600 transition-all cursor-pointer shadow-md"
            title={isPlaying ? 'Pause timeline' : 'Play timeline'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Date & Time with Step Arrows (Exact from Zoom Earth) */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-300 font-semibold">{dayMonth}</span>
            <span className="text-white font-bold text-sm tracking-wide bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              {time}
            </span>
            <div className="flex flex-col -space-y-1">
              <button
                onClick={stepNext}
                className="text-slate-400 hover:text-white p-0.5 hover:bg-slate-800 rounded transition-colors"
                title="Step forward 6h"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={stepPrev}
                className="text-slate-400 hover:text-white p-0.5 hover:bg-slate-800 rounded transition-colors"
                title="Step backward 6h"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Action Stack: Skip, Speed, Now */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={stepNext}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Next step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : 1)}
              className="text-[10px] font-mono font-bold text-amber-400 bg-slate-800/80 hover:bg-slate-700 px-1.5 py-1 rounded-md border border-slate-700 transition-colors"
              title="Playback speed"
            >
              {playbackSpeed}x
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                onOffsetChange(0);
              }}
              className="text-[10px] font-mono text-sky-400 hover:text-sky-300 bg-slate-800/80 hover:bg-slate-700 px-1.5 py-1 rounded-md border border-slate-700 transition-colors"
              title="Reset to Present"
            >
              NOW
            </button>
          </div>
        </div>

        {/* Scrub Range Slider */}
        <div className="relative pt-0.5">
          <input
            type="range"
            min={minOffset}
            max={maxOffset}
            step={6}
            value={currentOffset}
            onChange={(e) => onOffsetChange(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-700 focus:outline-none"
          />

          {/* Timeline markers */}
          <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-0.5 px-0.5">
            <span>-48h</span>
            <span>-24h</span>
            <span className="text-sky-400 font-bold">T0 (NOW)</span>
            <span>+18h</span>
            <span>+36h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
