"use client";

import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SoundCloudWaveformProps = {
  samples: number[] | null;
  progress: number;
  disabled?: boolean;
  onSeek?: (ratio: number) => void;
  className?: string;
  height?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const SoundCloudWaveform: React.FC<SoundCloudWaveformProps> = ({
  samples,
  progress,
  disabled = false,
  onSeek,
  className,
  height = 36,
}) => {
  const clipId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const bars = useMemo(() => {
    if (!samples || samples.length === 0) return Array.from({ length: 72 }, () => 0.25);
    return samples;
  }, [samples]);

  const viewWidth = bars.length;
  const safeProgress = clamp01(progress);

  const seekFromEvent = useCallback(
    (event: React.PointerEvent) => {
      if (!containerRef.current || !onSeek || disabled) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const ratio = rect.width ? x / rect.width : 0;
      onSeek(clamp01(ratio));
    },
    [disabled, onSeek]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full select-none touch-none",
        !disabled && onSeek ? "cursor-pointer" : "cursor-default",
        className
      )}
      style={{ height }}
      onPointerDown={(e) => {
        if (!onSeek || disabled) return;
        setIsDragging(true);
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        seekFromEvent(e);
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;
        seekFromEvent(e);
      }}
      onPointerUp={(e) => {
        if (!isDragging) return;
        setIsDragging(false);
        try {
          (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
        } catch {
          // noop
        }
      }}
      onPointerCancel={() => setIsDragging(false)}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewWidth} 1`}
        preserveAspectRatio="none"
        className="block"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={viewWidth * safeProgress} height="1" />
          </clipPath>
        </defs>

        {/* Background bars */}
        {bars.map((value, i) => {
          const h = Math.max(0.06, Math.min(1, value));
          const y = (1 - h) / 2;
          return (
            <rect
              key={`bg-${i}`}
              x={i + 0.15}
              y={y}
              width={0.7}
              height={h}
              rx={0.2}
              fill="currentColor"
              opacity={disabled ? 0.15 : 0.25}
              className="text-neo-text"
            />
          );
        })}

        {/* Progress bars */}
        <g clipPath={`url(#${clipId})`}>
          {bars.map((value, i) => {
            const h = Math.max(0.06, Math.min(1, value));
            const y = (1 - h) / 2;
            return (
              <rect
                key={`fg-${i}`}
                x={i + 0.15}
                y={y}
                width={0.7}
                height={h}
                rx={0.2}
                fill="currentColor"
                opacity={disabled ? 0.4 : 0.95}
                className="text-neo-accent"
              />
            );
          })}
        </g>

        {/* Playhead */}
        <rect
          x={viewWidth * safeProgress - 0.35}
          y={0}
          width={0.7}
          height={1}
          fill="currentColor"
          className="text-neo-accent"
          opacity={disabled ? 0.35 : 0.9}
        />
      </svg>
    </div>
  );
};
