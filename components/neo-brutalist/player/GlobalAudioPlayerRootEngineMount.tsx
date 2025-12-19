"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { GlobalAudioPlayerEngine } from "./GlobalAudioPlayerEngine";

const isBlockedRoute = (pathname: string | null) => {
  const path = pathname ?? "";
  return /^\/(admin|login)(\/|$)/.test(path) || /^\/(en|fr)\/(admin|login)(\/|$)/.test(path);
};

export const GlobalAudioPlayerRootEngineMount = () => {
  const pathname = usePathname();
  if (isBlockedRoute(pathname)) return null;
  return <GlobalAudioPlayerEngine />;
};
