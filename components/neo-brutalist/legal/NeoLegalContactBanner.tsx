"use client";

import React from "react";

export interface ContactChannel {
  label: string;
  value: string;
  href?: string;
  subtitle?: string;
}

interface NeoLegalContactBannerProps {
  contactTitle: string;
  pageTitle: string;
  contactIntro: string;
  contactChannels: ContactChannel[];
}

export const NeoLegalContactBanner: React.FC<NeoLegalContactBannerProps> = ({
  contactTitle,
  pageTitle,
  contactIntro,
  contactChannels,
}) => {
  return (
    <div className="border-2 border-neo-border bg-neo-accent text-neo-text p-8 md:p-10 shadow-[8px_8px_0px_0px_var(--neo-border)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-neo-accent">
            {contactTitle}
          </p>
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text mt-2">
            {pageTitle}
          </h3>
          <p className="mt-5 text-sm md:text-base leading-relaxed text-white">{contactIntro}</p>
        </div>

        <div className="flex w-full flex-col items-end gap-4 md:w-auto md:flex-shrink-0">
          {contactChannels.map((channel) => (
            <a
              key={channel.value}
              href={channel.href || "#"}
              className="flex w-full max-w-xs flex-col gap-2 rounded-sm border-2 border-neo-border bg-white px-6 py-5 text-right text-neo-text shadow-[6px_6px_0px_0px_var(--neo-border)] transition-transform hover:-translate-y-1"
            >
              {channel.subtitle && (
                <span className="text-[0.55rem] uppercase tracking-[0.5em] text-neo-text/60">
                  {channel.subtitle}
                </span>
              )}
              <span className="text-xl font-black uppercase leading-tight text-neo-text/80">
                {channel.label}
              </span>
              <span className="text-base font-medium tracking-tight">{channel.value}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
