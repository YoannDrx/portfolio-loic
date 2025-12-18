"use client";

import { useEffect, useMemo, useState } from "react";

type WaveformSource = "soundcloud" | "fallback" | "none";

type UseSoundCloudWaveformResult = {
  samples: number[] | null;
  source: WaveformSource;
  isLoading: boolean;
};

const waveformCache = new Map<string, number[]>();

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const generateFallbackWaveform = (seed: number, barsCount: number) => {
  const rnd = mulberry32(seed);
  const values = Array.from({ length: barsCount }, () => rnd());

  // Smooth it a bit so it looks like an actual waveform.
  const smoothed = values.map((v, i) => {
    const prev = values[i - 1] ?? v;
    const next = values[i + 1] ?? v;
    return (prev + v * 2 + next) / 4;
  });

  // Boost contrast and clamp.
  return smoothed.map((v) => Math.max(0.08, Math.min(1, v * 1.2)));
};

const resampleMax = (input: number[], barsCount: number) => {
  if (input.length === 0) return Array.from({ length: barsCount }, () => 0);
  if (input.length <= barsCount) {
    const max = Math.max(...input, 1);
    const normalized = input.map((v) => (max ? v / max : 0));
    return [...normalized, ...Array.from({ length: barsCount - input.length }, () => 0)];
  }

  const size = input.length / barsCount;
  const buckets: number[] = [];
  for (let i = 0; i < barsCount; i += 1) {
    const start = Math.floor(i * size);
    const end = Math.floor((i + 1) * size);
    let maxInBucket = 0;
    for (let j = start; j < end; j += 1) {
      maxInBucket = Math.max(maxInBucket, input[j] ?? 0);
    }
    buckets.push(maxInBucket);
  }

  const max = Math.max(...buckets, 1);
  return buckets.map((v) => (max ? v / max : 0));
};

export function useSoundCloudWaveform(
  waveformUrl: string | null | undefined,
  soundId: number | null | undefined,
  barsCount = 96
): UseSoundCloudWaveformResult {
  const [samples, setSamples] = useState<number[] | null>(null);
  const [source, setSource] = useState<WaveformSource>("none");
  const [isLoading, setIsLoading] = useState(false);

  const fallbackSeed = useMemo(() => {
    if (typeof soundId === "number") return soundId;
    if (waveformUrl) return hashString(waveformUrl);
    return 1337;
  }, [soundId, waveformUrl]);

  useEffect(() => {
    const fallback = () => {
      setSamples(generateFallbackWaveform(fallbackSeed, barsCount));
      setSource(waveformUrl ? "fallback" : "none");
      setIsLoading(false);
    };

    if (!waveformUrl) {
      fallback();
      return;
    }

    const cached = waveformCache.get(waveformUrl);
    if (cached) {
      setSamples(cached);
      setSource("soundcloud");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(waveformUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Waveform fetch failed: ${res.status}`);
        return res.json() as Promise<{ samples?: number[] }>;
      })
      .then((data) => {
        const rawSamples = Array.isArray(data.samples) ? data.samples : null;
        if (!rawSamples) {
          fallback();
          return;
        }
        const normalized = resampleMax(rawSamples, barsCount);
        waveformCache.set(waveformUrl, normalized);
        setSamples(normalized);
        setSource("soundcloud");
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        fallback();
      });

    return () => controller.abort();
  }, [barsCount, fallbackSeed, waveformUrl]);

  return { samples, source, isLoading };
}
