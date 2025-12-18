"use client";

import React from "react";
import { useGlobalAudioPlayer } from "@/lib/player/globalAudioPlayer";

export const GlobalAudioPlayerSpacer = () => {
  const { hasStarted } = useGlobalAudioPlayer();
  if (!hasStarted) return null;

  return <div aria-hidden="true" className="h-[calc(160px+env(safe-area-inset-bottom))]" />;
};
