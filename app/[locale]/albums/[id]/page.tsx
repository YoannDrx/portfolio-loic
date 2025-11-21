import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { albumsData } from '@/data/albumsData';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Calendar, Disc, ExternalLink, Users, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return albumsData.map((album) => ({
    id: album.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const album = albumsData.find((a) => a.id.toString() === id);

  if (!album) {
    return {
      title: 'Album non trouvé',
    };
  }

  return {
    title: `${album.title} | Loïc Ghanem`,
    description: `Album ${album.style} sorti en ${album.date}`,
  };
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const { id } = await params;
  const album = albumsData.find((a) => a.id.toString() === id);

  if (!album) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian via-obsidian-50 to-obsidian py-20">
      <div className="container-custom">
        {/* Back Button */}
        <AnimatedSection variant="fadeIn" className="mb-8">
          <Link
            href="/albums"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Retour aux albums</span>
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Album Cover */}
          <div className="lg:col-span-2">
            <AnimatedSection variant="slideUp">
              <GlassCard variant="neon" className="overflow-hidden sticky top-24">
                <div className="relative aspect-square w-full">
                  <Image
                    src={album.img}
                    alt={album.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                {/* Listen Link */}
                {album.listenLink && (
                  <div className="p-6">
                    <a
                      href={album.listenLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Écouter l'album</span>
                    </a>
                  </div>
                )}
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Album Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Title & Meta */}
            <AnimatedSection variant="slideUp" delay={0.1}>
              <GlassCard variant="default">
                <GlassCardContent className="p-8">
                  <h1 className="text-4xl md:text-5xl font-black text-gradient-neon mb-6">
                    {album.title}
                  </h1>

                  <div className="space-y-4">
                    {/* Style */}
                    <div className="flex items-center gap-3">
                      <Disc className="w-5 h-5 text-neon-purple flex-shrink-0" />
                      <span className="text-lg">
                        <span className="text-gray-400">Genre:</span>{' '}
                        <span className="text-white font-semibold">{album.style}</span>
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                      <span className="text-lg">
                        <span className="text-gray-400">Date de sortie:</span>{' '}
                        <span className="text-white font-semibold">{album.date}</span>
                      </span>
                    </div>

                    {/* Poster */}
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-neon-magenta flex-shrink-0" />
                      <span className="text-lg">
                        <span className="text-gray-400">Artiste:</span>{' '}
                        <span className="text-white font-semibold">{album.poster}</span>
                      </span>
                    </div>

                    {/* Collaborators */}
                    {album.collabName && (
                      <div className="flex items-start gap-3 pt-2">
                        <Users className="w-5 h-5 text-neon-purple flex-shrink-0 mt-1" />
                        <div>
                          <div className="text-gray-400 mb-1">Collaborateurs:</div>
                          <div className="text-white">{album.collabName}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </AnimatedSection>

            {/* Description */}
            <AnimatedSection variant="slideUp" delay={0.2}>
              <GlassCard variant="subtle">
                <GlassCardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">À propos de l'album</h2>
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div className="text-gray-300 leading-relaxed space-y-4 album-descriptions">
                      {album.descriptions}
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </AnimatedSection>

            {/* CTA */}
            {album.listenLink && (
              <AnimatedSection variant="fadeIn" delay={0.3}>
                <GlassCard variant="neon" className="text-center">
                  <GlassCardContent className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Prêt à découvrir cet album ?
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Écoutez "{album.title}" sur toutes les plateformes de streaming.
                    </p>
                    <a
                      href={album.listenLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Écouter maintenant</span>
                    </a>
                  </GlassCardContent>
                </GlassCard>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
