import { NextResponse } from "next/server";

const SOUNDCLOUD_PROFILE_URL = "https://soundcloud.com/loic-ghanem";
const CACHE_TTL_SECONDS = 3600; // 1 hour

type SoundCloudTrack = {
  id: number;
  title: string;
  permalink_url: string;
  artwork_url: string | null;
  waveform_url: string | null;
  duration: number;
  created_at: string;
  display_date?: string;
  release_date?: string;
  user: {
    username: string;
    avatar_url?: string;
  };
};

type SoundCloudTracksResponse = {
  collection: SoundCloudTrack[];
  next_href?: string;
};

type SoundCloudUser = {
  id: number;
  username: string;
  track_count: number;
};

async function extractClientId(): Promise<string | null> {
  try {
    const pageRes = await fetch("https://soundcloud.com", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    if (!pageRes.ok) return null;

    const html = await pageRes.text();

    // Find script URLs in the HTML
    const scriptMatches = html.match(/https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+\.js/g);
    if (!scriptMatches || scriptMatches.length === 0) return null;

    // Check last few scripts (client_id is usually in the last ones)
    for (let i = scriptMatches.length - 1; i >= Math.max(0, scriptMatches.length - 5); i--) {
      const scriptUrl = scriptMatches[i];
      try {
        const scriptRes = await fetch(scriptUrl);
        if (!scriptRes.ok) continue;
        const scriptText = await scriptRes.text();

        // Look for client_id pattern
        const clientIdMatch = scriptText.match(/client_id[:=]["']([a-zA-Z0-9]{32})["']/);
        if (clientIdMatch?.[1]) {
          return clientIdMatch[1];
        }

        // Alternative pattern
        const altMatch = scriptText.match(/\?client_id=([a-zA-Z0-9]{32})/);
        if (altMatch?.[1]) {
          return altMatch[1];
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch {
    return null;
  }
}

let cachedClientId: string | null = null;
let clientIdFetchedAt = 0;
const CLIENT_ID_TTL = 24 * 60 * 60 * 1000; // 24h

async function getClientId(): Promise<string | null> {
  const now = Date.now();
  if (cachedClientId && now - clientIdFetchedAt < CLIENT_ID_TTL) {
    return cachedClientId;
  }

  const newClientId = await extractClientId();
  if (newClientId) {
    cachedClientId = newClientId;
    clientIdFetchedAt = now;
  }
  return cachedClientId;
}

async function resolveUser(clientId: string): Promise<SoundCloudUser | null> {
  const url = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(
    SOUNDCLOUD_PROFILE_URL
  )}&client_id=${clientId}`;

  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function fetchAllTracks(userId: number, clientId: string): Promise<SoundCloudTrack[]> {
  const allTracks: SoundCloudTrack[] = [];
  const limit = 200;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api-v2.soundcloud.com/users/${userId}/tracks?client_id=${clientId}&limit=${limit}&offset=${offset}&linked_partitioning=1`;
    const res = await fetch(url);

    if (!res.ok) break;

    const data: SoundCloudTracksResponse = await res.json();
    if (data.collection && data.collection.length > 0) {
      allTracks.push(...data.collection);
      offset += data.collection.length;
      hasMore = !!data.next_href && data.collection.length === limit;
    } else {
      hasMore = false;
    }

    // Safety limit
    if (allTracks.length > 1000) break;
  }

  return allTracks;
}

function mapTrack(track: SoundCloudTrack) {
  return {
    id: track.id,
    title: track.title,
    artist: track.user?.username ?? "Unknown",
    artworkUrl: track.artwork_url,
    waveformUrl: track.waveform_url,
    permalinkUrl: track.permalink_url,
    durationMs: track.duration,
    createdAt: track.created_at,
    displayDate: track.display_date,
    releaseDate: track.release_date,
  };
}

export async function GET() {
  try {
    const clientId = await getClientId();
    if (!clientId) {
      return NextResponse.json(
        { error: "Unable to retrieve SoundCloud client ID" },
        { status: 503 }
      );
    }

    const user = await resolveUser(clientId);
    if (!user) {
      return NextResponse.json({ error: "Unable to resolve SoundCloud user" }, { status: 404 });
    }

    const tracks = await fetchAllTracks(user.id, clientId);

    // Sort by date (most recent first)
    const sortedTracks = tracks.sort((a, b) => {
      const dateA = new Date(a.release_date || a.display_date || a.created_at).getTime();
      const dateB = new Date(b.release_date || b.display_date || b.created_at).getTime();
      return dateB - dateA;
    });

    const mappedTracks = sortedTracks.map(mapTrack);

    return NextResponse.json(
      {
        tracks: mappedTracks,
        total: mappedTracks.length,
        user: {
          id: user.id,
          username: user.username,
          trackCount: user.track_count,
        },
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("SoundCloud API error:", error);
    return NextResponse.json({ error: "Failed to fetch SoundCloud tracks" }, { status: 500 });
  }
}
