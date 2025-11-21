import Hero from '@/components/home/Hero';
import ServicesPreview from '@/components/home/ServicesPreview';
import FeaturedAlbums from '@/components/home/FeaturedAlbums';
import LatestVideos from '@/components/home/LatestVideos';

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Three.js */}
      <Hero />

      {/* Services Preview */}
      <ServicesPreview />

      {/* Featured Albums */}
      <FeaturedAlbums />

      {/* Latest Videos */}
      <LatestVideos />
    </>
  );
}
