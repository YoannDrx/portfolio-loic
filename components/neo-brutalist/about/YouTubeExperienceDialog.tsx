"use client";

import { ExternalLink, Play, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConsentGate } from "../legal/ConsentGate";
import { useGlobalAudioPlayer } from "@/lib/player/globalAudioPlayer";

interface YouTubeExperienceDialogProps {
  project: { name: string; link: string };
  triggerLabel: string;
}

const getYouTubeId = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || null;
  } catch {
    return null;
  }
};

export const YouTubeExperienceDialog = ({
  project,
  triggerLabel,
}: YouTubeExperienceDialogProps) => {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("about.musicianExperience");
  const { actions, isPlaying } = useGlobalAudioPlayer();
  const shouldResumeAudioRef = useRef(false);
  const videoId = getYouTubeId(project.link);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !open) {
      shouldResumeAudioRef.current = isPlaying;
      if (isPlaying) actions.pause();
    } else if (!nextOpen && open) {
      if (shouldResumeAudioRef.current) actions.play();
      shouldResumeAudioRef.current = false;
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mt-auto inline-flex w-fit items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-neo-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-accent"
        >
          <span className="flex h-10 w-10 items-center justify-center border-2 border-current transition-transform group-hover:rotate-6">
            <Play className="h-4 w-4" />
          </span>
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent
        size="xl"
        hideCloseButton
        className="w-[calc(100vw-2rem)] max-w-5xl gap-0 overflow-hidden rounded-none border-4 border-neo-border bg-neo-bg p-0 shadow-[14px_14px_0px_0px_var(--neo-accent)]"
      >
        <div className="flex items-center justify-between gap-4 border-b-4 border-neo-border bg-neo-text p-4 text-neo-text-inverse md:p-5">
          <div className="min-w-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neo-accent">
              {t("videoPlayerEyebrow")}
            </span>
            <DialogTitle className="mt-1 truncate text-xl font-black uppercase tracking-tight text-white md:text-3xl">
              {project.name || t("videoPlayerTitle")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t("videoPlayerDescription", { project: project.name })}
            </DialogDescription>
          </div>
          <DialogClose className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-white bg-neo-accent text-neo-on-accent shadow-[3px_3px_0px_0px_white] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <X className="h-5 w-5" />
            <span className="sr-only">{t("closeVideo")}</span>
          </DialogClose>
        </div>

        <ConsentGate
          category="media"
          variant="plain"
          minHeight={260}
          className="aspect-video w-full"
        >
          {open && videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&hl=${locale}`}
              title={`${project.name} — YouTube`}
              className="aspect-video w-full bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-neo-text text-neo-accent">
              <Play className="h-14 w-14" />
            </div>
          )}
        </ConsentGate>

        <div className="flex items-center justify-between gap-4 border-t-4 border-neo-border bg-neo-surface px-4 py-3 md:px-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neo-text/60">
            {t("videoPlayerHint")}
          </p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neo-text hover:text-neo-accent"
          >
            YouTube <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
