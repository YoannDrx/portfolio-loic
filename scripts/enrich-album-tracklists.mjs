import { readFile, writeFile } from 'node:fs/promises';

const dataPath = new URL('../seed/data/albums.json', import.meta.url);
const albums = JSON.parse(await readFile(dataPath, 'utf8'));

const decodeHtml = (value) =>
  value
    .replace(/<[^>]+>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&nbsp;', ' ')
    .replaceAll(' ', ' ')
    .replace(/\s+/g, ' ')
    .trim();

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const removeLegacyTracklist = (html) =>
  html.replace(
    /<p class="bigger tracklist-title">[\s\S]*?<\/p>\s*<ul class="[^"]*tracklist[^"]*">[\s\S]*?<\/ul>/gi,
    ''
  );

const parseTracks = (html) => {
  const rows = [...html.matchAll(/<li[^>]*data-testid="tracklist-row-[^"]+"[^>]*>([\s\S]*?)<\/li>/g)];

  return rows.map(([, row], index) => {
    const titleMatch = row.match(/<h3[^>]*class="[^"]*TracklistRow_title[^"]*"[^>]*>([\s\S]*?)<\/h3>/);
    const artistsMatch = row.match(/<h4[^>]*class="[^"]*TracklistRow_subtitle[^"]*"[^>]*>([\s\S]*?)<\/h4>/);
    const durationMatch = row.match(/data-testid="duration-cell">\s*(\d{1,2}):(\d{2})\s*</);
    const title = titleMatch ? decodeHtml(titleMatch[1]) : '';
    const artists = artistsMatch ? decodeHtml(artistsMatch[1]) : null;
    const durationSeconds = durationMatch
      ? Number(durationMatch[1]) * 60 + Number(durationMatch[2])
      : null;

    if (!title) throw new Error(`Missing title for track ${index + 1}`);

    return {
      position: index + 1,
      discNumber: 1,
      title,
      artists,
      durationSeconds,
      explicit: /explicit/i.test(row),
    };
  });
};

for (const album of albums) {
  const spotifyId = album.spotifyEmbed?.match(/album\/([a-zA-Z0-9]+)/)?.[1];
  if (!spotifyId) throw new Error(`No Spotify album URL for ${album.title}`);

  const sourceUrl = `https://open.spotify.com/album/${spotifyId}`;
  const response = await fetch(`https://open.spotify.com/embed/album/${spotifyId}`);
  if (!response.ok) throw new Error(`Spotify returned ${response.status} for ${album.title}`);

  const tracks = parseTracks(await response.text());
  if (!tracks.length) throw new Error(`No tracks found for ${album.title}`);

  album.slug = slugify(album.title);
  album.releaseType = album.title === 'Obsession' ? 'EP' : 'Album';
  album.tracklistSourceUrl = sourceUrl;
  album.tracklistVerifiedAt = '2026-07-11T00:00:00.000Z';
  album.tracks = tracks;
  album.descriptionsFr = removeLegacyTracklist(album.descriptionsFr);
  album.descriptionsEn = removeLegacyTracklist(album.descriptionsEn);

  if (album.title === 'K-STYLE') {
    album.releaseDate = '2026-06-25T00:00:00.000Z';
    album.label = 'Justement Music';
    album.publisher = 'Montmorency Music Agency (MYMA)';
  }

  if (album.title === 'Obsession') {
    album.releaseDate = '2026-05-22T00:00:00.000Z';
    album.label = 'Superama Records';
    album.publisher = 'Montmorency Music Agency (MYMA)';
  }

  process.stdout.write(`${album.title}: ${tracks.length} tracks\n`);
}

await writeFile(dataPath, `${JSON.stringify(albums, null, 2)}\n`);

const servicesPath = new URL('../seed/data/services.json', import.meta.url);
const services = JSON.parse(await readFile(servicesPath, 'utf8'));
for (const service of services) service.slug = slugify(service.title);
await writeFile(servicesPath, `${JSON.stringify(services, null, 2)}\n`);
