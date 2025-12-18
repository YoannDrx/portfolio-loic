"use client";

import React from "react";
import { GlobalAudioPlayerBar } from "./GlobalAudioPlayerBar";
import { GlobalAudioPlayerEngine } from "./GlobalAudioPlayerEngine";

export const GlobalAudioPlayerMount = () => {
  return (
    <>
      <GlobalAudioPlayerEngine />
      <GlobalAudioPlayerBar />
    </>
  );
};
