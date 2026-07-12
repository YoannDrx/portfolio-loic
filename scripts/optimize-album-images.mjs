import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';

const dataPath = new URL('../seed/data/albums.json', import.meta.url);
const albums = JSON.parse(await readFile(dataPath, 'utf8'));

for (const album of albums) {
  if (!album.img?.startsWith('/img/albums/') || album.img.endsWith('.webp')) continue;
  const input = new URL(`../public${album.img}`, import.meta.url).pathname;
  const outputName = `${album.slug}.webp`;
  const output = join(dirname(input), outputName);
  const metadata = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', input], { encoding: 'utf8' });
  const width = Number(metadata.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(metadata.match(/pixelHeight:\s*(\d+)/)?.[1]);
  const args = ['-quiet', '-q', '82'];
  if (Math.max(width, height) > 1200) {
    if (width >= height) args.push('-resize', '1200', '0');
    else args.push('-resize', '0', '1200');
  }
  args.push(input, '-o', output);
  execFileSync('cwebp', args);
  album.img = `/img/albums/${outputName}`;
  process.stdout.write(`${album.title}: ${width}x${height} -> ${outputName}\n`);
}

await writeFile(dataPath, `${JSON.stringify(albums, null, 2)}\n`);
