"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Link2,
  Music,
  Youtube,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AlbumLinks {
  id: string;
  title: string;
  listenLink: string | null;
  spotifyEmbed: string | null;
  youtubeEmbed: string | null;
  published: boolean;
}

interface AlbumsLinksMonitorProps {
  locale: string;
}

export function AlbumsLinksMonitor({ locale }: AlbumsLinksMonitorProps) {
  const [albums, setAlbums] = useState<AlbumLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("/api/admin/albums?limit=100", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Erreur");
        const data = await response.json();
        setAlbums(data.items || []);
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const stats = {
    total: albums.length,
    withListen: albums.filter((a) => a.listenLink).length,
    withSpotify: albums.filter((a) => a.spotifyEmbed).length,
    withYoutube: albums.filter((a) => a.youtubeEmbed).length,
    complete: albums.filter((a) => a.listenLink && a.spotifyEmbed && a.youtubeEmbed).length,
    incomplete: albums.filter((a) => !a.listenLink || !a.spotifyEmbed || !a.youtubeEmbed).length,
  };

  const getCompletionStatus = (album: AlbumLinks) => {
    const count = [album.listenLink, album.spotifyEmbed, album.youtubeEmbed].filter(Boolean).length;
    return { count, total: 3 };
  };

  if (loading) {
    return (
      <div className="border-2 border-neo-border bg-neo-surface p-4 shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-5 h-5 bg-neo-border" />
          <div className="h-4 w-40 bg-neo-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-neo-border bg-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-neo-surface transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-neo-accent border-2 border-neo-border">
            <Link2 className="h-5 w-5 text-neo-text-inverse" />
          </div>
          <div className="text-left">
            <h3 className="font-black text-neo-text uppercase tracking-tight">Monitoring Liens</h3>
            <p className="text-xs font-mono text-neo-text/60">
              {stats.complete}/{stats.total} albums complets
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Quick stats badges */}
          <div className="hidden sm:flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-1 text-xs font-mono font-bold border-2 border-neo-border",
                stats.incomplete > 0 ? "bg-[#FF006E] text-white" : "bg-[#00F0FF] text-neo-text"
              )}
            >
              {stats.incomplete} incomplets
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-neo-text/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-neo-text/60" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t-2 border-neo-border">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neo-border">
            <StatCard
              icon={Link2}
              label="Fanlink"
              value={stats.withListen}
              total={stats.total}
              color="#00F0FF"
            />
            <StatCard
              icon={Music}
              label="Spotify"
              value={stats.withSpotify}
              total={stats.total}
              color="#1DB954"
            />
            <StatCard
              icon={Youtube}
              label="YouTube"
              value={stats.withYoutube}
              total={stats.total}
              color="#FF0000"
            />
            <StatCard
              icon={CheckCircle2}
              label="Complets"
              value={stats.complete}
              total={stats.total}
              color="#D5FF0A"
            />
          </div>

          {/* Albums List */}
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-neo-surface border-b-2 border-neo-border">
                <tr>
                  <th className="px-4 py-2 text-left font-mono text-xs font-bold uppercase tracking-wider text-neo-text">
                    Album
                  </th>
                  <th className="px-4 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider text-neo-text">
                    <Link2 className="h-4 w-4 inline" />
                  </th>
                  <th className="px-4 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider text-neo-text">
                    <Music className="h-4 w-4 inline" />
                  </th>
                  <th className="px-4 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider text-neo-text">
                    <Youtube className="h-4 w-4 inline" />
                  </th>
                  <th className="px-4 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider text-neo-text">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {albums.map((album, index) => {
                  const completion = getCompletionStatus(album);
                  return (
                    <tr
                      key={album.id}
                      className={cn(
                        "border-b border-neo-border/50 hover:bg-neo-surface transition-colors",
                        index % 2 === 0 ? "bg-neo-bg" : "bg-neo-bg-alt/30"
                      )}
                    >
                      <td className="px-4 py-2">
                        <Link
                          href={`/${locale}/admin/albums/${album.id}`}
                          className="flex items-center gap-2 text-sm font-bold text-neo-text hover:text-neo-accent transition-colors group"
                        >
                          <span className="uppercase truncate max-w-[200px]">{album.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <LinkIndicator hasLink={!!album.listenLink} url={album.listenLink} />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <LinkIndicator hasLink={!!album.spotifyEmbed} />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <LinkIndicator hasLink={!!album.youtubeEmbed} />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={cn(
                            "px-2 py-0.5 text-xs font-mono font-bold border-2 border-neo-border",
                            completion.count === 3
                              ? "bg-[#D5FF0A] text-neo-text"
                              : completion.count >= 1
                                ? "bg-neo-surface text-neo-text"
                                : "bg-[#FF006E] text-white"
                          )}
                        >
                          {completion.count}/{completion.total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  total,
  color,
}: {
  icon: typeof Link2;
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-neo-bg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neo-text/60">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-neo-text">{value}</span>
        <span className="text-sm text-neo-text/40">/{total}</span>
      </div>
      <div className="mt-2 h-1 bg-neo-border">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function LinkIndicator({ hasLink, url }: { hasLink: boolean; url?: string | null }) {
  if (hasLink) {
    return url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-6 h-6 bg-[#00F0FF] border-2 border-neo-border hover:scale-110 transition-transform"
      >
        <CheckCircle2 className="h-4 w-4 text-neo-text" />
      </a>
    ) : (
      <div className="inline-flex items-center justify-center w-6 h-6 bg-[#00F0FF] border-2 border-neo-border">
        <CheckCircle2 className="h-4 w-4 text-neo-text" />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center justify-center w-6 h-6 bg-neo-surface border-2 border-neo-border">
      <XCircle className="h-4 w-4 text-neo-text/30" />
    </div>
  );
}

export default AlbumsLinksMonitor;
