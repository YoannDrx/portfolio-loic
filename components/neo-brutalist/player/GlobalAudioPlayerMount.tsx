"use client";

import React from "react";
import { GlobalAudioPlayerBar } from "./GlobalAudioPlayerBar";
import { GlobalAudioPlayerEngine } from "./GlobalAudioPlayerEngine";
import { GlobalAudioPlayerSpacer } from "./GlobalAudioPlayerSpacer";

export const GlobalAudioPlayerMount = () => {
  return (
    <>
      <GlobalAudioPlayerEngine />
      <GlobalAudioPlayerBar />
      <GlobalAudioPlayerSpacer />
    </>
  );
};
