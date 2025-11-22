import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Play } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import VideoCard from '@/components/videos/VideoCard';
import { prisma } from '@/lib/prisma';

export default async function LatestVideos() {
  const t = await getTranslations('home.latestVideos');

  // Get the 3 most recent published videos
  const latestVideos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
    take: 3,
  });

  const totalCount = await prisma.video.count({
    where: { published: true },
  });

  return (
    <section className="py-24 bg-gradient-to-b from-obsidian-50 to-obsidian">
      <div className="container-custom">
        {/* Section Header */}
        <AnimatedSection variant="fadeIn" className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-neon-purple/10 border border-neon-purple/30 rounded-full mb-6">
            <Play className="w-5 h-5 text-neon-purple" />
            <span className="text-neon-purple font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gradient-neon mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </AnimatedSection>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {latestVideos.map((video, index) => (
            <AnimatedSection
              key={video.id}
              variant="slideUp"
              delay={index * 0.1}
            >
              <VideoCard video={video} />
            </AnimatedSection>
          ))}
        </div>

        {/* View All Link */}
        <AnimatedSection variant="fadeIn" delay={0.4} className="text-center">
          <Link
            href="/videos"
            className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-neon-purple rounded-lg font-semibold text-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300"
          >
            <span>{t('viewAll', { count: totalCount })}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </AnimatedSection>

        {/* Notable Placements */}
        <AnimatedSection variant="fadeIn" delay={0.6} className="mt-20">
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl glass-card-neon p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              {t('notablePlacements')}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                'BBC',
                'ESPN',
                'WWE',
                'NBA',
                'NHL',
                'National Geographic',
              ].map((platform) => (
                <div
                  key={platform}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all duration-300"
                >
                  <span className="text-lg font-semibold text-gray-200">
                    {platform}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
