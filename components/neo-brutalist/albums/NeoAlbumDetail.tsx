"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Disc,
  Users,
  ArrowLeft,
  Eye,
  Headphones,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoCard } from "../ui/NeoCard";
import { NeoTag } from "../ui/NeoTag";
import { GridBackground } from "../ui/GridBackground";

// Type pour les props des icônes
interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

// Icônes des plateformes de streaming
const SpotifyIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleMusicIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.401-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.6-1.965-1.483-.18-.965.39-1.92 1.343-2.22.263-.083.54-.13.814-.172.41-.063.82-.116 1.226-.18.368-.056.62-.27.715-.636a2.17 2.17 0 00.053-.476c.003-1.603 0-3.203 0-4.806v-.212l-5.5 1.26v6.53c0 .418-.054.83-.234 1.217-.29.614-.78 1.004-1.434 1.175-.343.09-.694.136-1.05.15-.972.037-1.843-.6-1.983-1.525-.153-1.01.46-1.96 1.445-2.22.263-.07.534-.1.802-.142.438-.067.878-.12 1.31-.202.39-.075.628-.31.717-.7.026-.104.04-.212.04-.318.002-2.574.003-5.147 0-7.72 0-.15.018-.296.054-.44.1-.394.4-.638.8-.727.236-.053.478-.086.718-.12l5.054-.875c.39-.067.782-.13 1.172-.197.273-.046.55-.034.778.144.177.138.282.32.313.538.013.09.02.18.02.27v5.056z" />
  </svg>
);

const DeezerIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38h-5.19zm12.54 0v3.027H24V8.38h-5.19zM6.27 12.594v3.027h5.189v-3.027h-5.19zm6.271 0v3.027h5.19v-3.027h-5.19zm6.27 0v3.027H24v-3.027h-5.19zM0 16.81v3.029h5.19v-3.03H0zm6.27 0v3.029h5.189v-3.03h-5.19zm6.271 0v3.029h5.19v-3.03h-5.19zm6.27 0v3.029H24v-3.03h-5.19z" />
  </svg>
);

const TidalIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l4.004-4.004L20.02 12l4.004-4.004-4.004-4.004-4.004 4.004-4.004-4.004zm0 8.008l-4.004 4.004L4.004 12 0 16.004l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004z" />
  </svg>
);

const SoundCloudIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.102-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.19-1.308-.192-1.332c-.01-.057-.045-.094-.09-.094zm1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.104.106.104.061 0 .12-.044.12-.104l.24-2.458-.24-2.563c0-.06-.059-.104-.12-.104zm.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.138l.225-2.544-.225-2.64c-.016-.075-.075-.135-.15-.135zm1.065.42c-.09 0-.149.075-.164.165l-.166 2.099.18 2.483c.016.09.075.164.164.164.091 0 .15-.074.166-.164l.193-2.483-.209-2.099c-.015-.09-.075-.165-.164-.165zm1.035-.165c-.105 0-.166.09-.18.179l-.165 2.264.18 2.475c.014.091.074.18.18.18.104 0 .164-.089.178-.18l.195-2.475-.195-2.264c-.014-.089-.074-.179-.179-.179zm1.109-.135c-.12 0-.195.104-.21.209l-.149 2.4.149 2.46c.016.105.091.21.21.21.12 0 .194-.105.21-.21l.165-2.46-.165-2.4c-.016-.105-.09-.209-.21-.209zm1.095-.045c-.135 0-.225.119-.225.238l-.149 2.444.149 2.444c.016.121.09.24.225.24.135 0 .21-.119.226-.24l.165-2.444-.15-2.444c-.015-.119-.105-.238-.24-.238zm1.139-.075c-.149 0-.24.135-.255.271l-.135 2.519.135 2.43c.015.135.105.271.255.271.149 0 .24-.136.255-.271l.15-2.43-.15-2.519c-.015-.136-.105-.271-.255-.271zm1.125.015c-.165 0-.271.15-.285.3l-.12 2.504.12 2.4c.015.149.12.3.285.3.165 0 .27-.151.285-.3l.135-2.4-.135-2.504c-.015-.15-.12-.3-.285-.3zm1.095.18c-.18 0-.301.165-.301.345l-.104 2.279.104 2.369c0 .18.12.345.301.345.18 0 .3-.165.3-.345l.12-2.369-.12-2.279c0-.18-.12-.345-.3-.345zm1.125.359c-.194 0-.33.18-.33.39l-.091 1.919.091 2.339c0 .21.135.391.33.391.194 0 .329-.181.329-.391l.105-2.339-.105-1.919c0-.21-.135-.39-.329-.39zm1.095.75c-.21 0-.36.195-.36.42l-.074 1.17.074 2.309c0 .225.149.42.36.42.209 0 .359-.195.359-.42l.09-2.309-.09-1.17c0-.225-.15-.42-.359-.42zm1.124.9c-.224 0-.39.21-.39.45l-.061.72.061 2.28c0 .24.166.45.391.45.225 0 .39-.21.39-.45l.075-2.28-.075-.72c0-.24-.165-.45-.391-.45zm1.126.405c-.24 0-.42.225-.42.479l-.045.256.045 2.295c0 .255.18.48.42.48.239 0 .42-.225.42-.48l.06-2.295-.06-.256c0-.254-.181-.479-.42-.479zm1.125.569c-.255 0-.449.24-.449.51v.002l-.03.016.03 2.265c0 .27.194.51.449.51.254 0 .449-.24.449-.51l.045-2.282-.045-.001c0-.27-.195-.51-.449-.51zm1.109-.089c-.27 0-.48.256-.48.54v1.802c0 .285.21.54.48.54.27 0 .479-.255.479-.54V15.28c0-.284-.209-.54-.479-.54zm1.139-.254c-.284 0-.509.27-.509.57v2.056c0 .3.225.57.509.57.285 0 .51-.27.51-.57V14.01c0-.3-.225-.57-.51-.57zm2.851-.044c-.3 0-.54.285-.54.6v2.056c0 .315.24.6.54.6.3 0 .54-.285.54-.6V14.01c0-.315-.24-.6-.54-.6zm-1.426.045c-.3 0-.525.27-.525.585v2.056c0 .315.225.585.525.585.3 0 .525-.27.525-.585V14.01c0-.315-.225-.585-.525-.585zm2.851-.045c-.315 0-.57.3-.57.63v2.056c0 .33.255.63.57.63.315 0 .569-.3.569-.63V14.01c0-.33-.254-.63-.569-.63z" />
  </svg>
);

const YouTubeMusicIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
  </svg>
);

const QobuzIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c1.942 0 3.778-.463 5.4-1.284l-1.025-1.775A9.96 9.96 0 0112 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10a9.96 9.96 0 01-1.284 4.875l1.775 1.025A11.96 11.96 0 0024 12c0-6.627-5.373-12-12-12zm0 4a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z" />
  </svg>
);

const AmazonMusicIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.963 14.865c-.222-.315-.474-.387-.843-.315-1.578.537-3.192.852-4.843.852-2.496 0-4.843-.654-6.87-1.947-.148-.098-.315-.074-.474.024-.148.098-.222.263-.148.431.876 2.046 3.025 3.373 5.454 3.88.278.049.561.074.85.098.593.049 1.186.024 1.779-.073.315-.049.63-.098.945-.172.371-.098.741-.196 1.088-.343.593-.244 1.162-.537 1.67-.902.148-.098.222-.269.222-.439-.024-.195-.098-.366-.245-.513-.148-.146-.296-.292-.444-.439-.148-.145-.315-.291-.463-.436z M21.593 17.218c-.098-.389-.296-.73-.593-.998-.593-.534-1.407-.73-2.221-.584-.593.098-1.137.34-1.63.681-.049.024-.073.073-.049.122.024.049.073.073.122.073.444-.049.888-.024 1.333.073.37.073.741.22 1.037.462.222.195.37.462.37.779 0 .146-.024.293-.073.414-.098.195-.222.365-.395.487-.296.22-.642.365-1.012.462-.815.195-1.654.22-2.469.073-1.037-.195-2.024-.584-2.913-1.143-1.852-1.143-3.284-2.798-4.224-4.843-.593-1.29-.986-2.652-1.135-4.063-.074-.73-.074-1.46.024-2.19.049-.365.122-.705.22-1.046.098-.34.222-.656.395-.949.296-.511.691-.949 1.185-1.29.37-.268.79-.462 1.234-.584.37-.098.765-.122 1.16-.098.518.049 1.012.195 1.456.462.148.098.222.073.296-.073.074-.195.148-.365.222-.56.074-.195.148-.389.222-.584.049-.146 0-.268-.122-.365-.222-.195-.469-.341-.741-.462-.593-.268-1.234-.414-1.9-.462-.889-.049-1.753.098-2.569.414-.889.365-1.654.902-2.295 1.607-.667.73-1.16 1.582-1.481 2.53-.37 1.07-.518 2.189-.444 3.332.074 1.216.345 2.384.79 3.503.518 1.29 1.234 2.457 2.123 3.503 1.012 1.192 2.221 2.165 3.604 2.92 1.16.632 2.395 1.07 3.703 1.29.593.098 1.186.146 1.779.122.815-.024 1.605-.195 2.345-.511.518-.22.986-.511 1.382-.876.296-.293.518-.632.667-1.022.122-.365.148-.754.074-1.143z" />
  </svg>
);

// Liste des plateformes de streaming avec leurs icônes et couleurs (8 pour avoir 4+4)
const streamingPlatforms = [
  { name: "Spotify", icon: SpotifyIcon, color: "#1DB954" },
  { name: "Apple Music", icon: AppleMusicIcon, color: "#FA243C" },
  { name: "Deezer", icon: DeezerIcon, color: "#FEAA2D" },
  { name: "Tidal", icon: TidalIcon, color: "#000000" },
  { name: "SoundCloud", icon: SoundCloudIcon, color: "#FF5500" },
  { name: "YouTube Music", icon: YouTubeMusicIcon, color: "#FF0000" },
  { name: "Qobuz", icon: QobuzIcon, color: "#1A8FE3" },
  { name: "Amazon Music", icon: AmazonMusicIcon, color: "#00A8E1" },
];

interface Album {
  id: string;
  title: string;
  img: string;
  poster: string;
  date: string;
  sortedDate: string;
  style: string;
  listenLink: string;
  spotifyEmbed: string | null;
  youtubeEmbed: string | null;
  collabName: string | null;
  collabLink: string | null;
  descriptionsFr: string;
  descriptionsEn: string;
  published: boolean;
}

interface NeoAlbumDetailProps {
  album: Album;
  allAlbums: Album[];
  locale: string;
  isPreview?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function NeoAlbumDetail({
  album,
  allAlbums,
  locale,
  isPreview = false,
}: NeoAlbumDetailProps) {
  const t = useTranslations("albums.detail");

  // Find previous and next albums for navigation
  const currentIndex = allAlbums.findIndex((a) => a.id === album.id);
  const prevAlbum =
    currentIndex > 0 ? allAlbums[currentIndex - 1] : allAlbums[allAlbums.length - 1];
  const nextAlbum =
    currentIndex < allAlbums.length - 1 ? allAlbums[currentIndex + 1] : allAlbums[0];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <GridBackground withAccentGlow />
      <NeoNavbar />

      <main className="relative z-10 pt-24 pb-24">
        {/* Preview Banner */}
        {isPreview && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-4 py-2 bg-neo-accent text-neo-text-inverse border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
              <Eye className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase">
                Prévisualisation - {album.published ? "Publié" : "Brouillon"}
              </span>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t("backToAlbums")}
            </Link>
          </motion.div>

          {/* ==================== MAIN HERO SECTION ==================== */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-12 lg:mb-16"
          >
            {/* Grid: Cover | Info | Listen Button */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[320px_1fr_300px] gap-6 lg:gap-8 items-stretch">
              {/* Left Column - Album Cover */}
              <motion.div variants={fadeInUp} className="relative mx-auto lg:mx-0">
                <NeoCard
                  hover="lift"
                  padding="none"
                  className="overflow-hidden shadow-[8px_8px_0px_0px_var(--neo-shadow)] border-4"
                >
                  <div className="aspect-square relative overflow-hidden group">
                    <Image
                      src={album.img}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                      sizes="(max-width: 1024px) 280px, 320px"
                    />
                  </div>
                </NeoCard>

                {/* Album badge */}
                <div className="absolute -bottom-3 -right-3 bg-neo-text text-neo-accent w-12 h-12 flex items-center justify-center border-3 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-accent)]">
                  <Disc className="w-6 h-6" />
                </div>
              </motion.div>

              {/* Center Column - Album Info */}
              <motion.div variants={fadeInUp} className="flex flex-col justify-between">
                {/* Top: Title & Tag */}
                <div>
                  <NeoTag variant="accent" size="md" className="inline-flex mb-4">
                    <Disc className="w-3 h-3 mr-1.5" />
                    {album.style}
                  </NeoTag>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-neo-text mb-4">
                    {album.title}
                  </h1>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b-2 border-neo-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neo-accent" />
                      <span className="font-mono text-sm">{album.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neo-accent" />
                      <span className="font-mono text-sm">{album.poster}</span>
                    </div>
                    {album.collabName && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-neo-accent" />
                        <span className="font-mono text-sm text-neo-text/70">
                          + {album.collabName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1">
                  <h2 className="font-mono text-xs uppercase text-neo-text/50 mb-2">
                    {t("about")}
                  </h2>
                  <div
                    className="prose prose-sm max-w-none text-neo-text
                      prose-p:font-mono prose-p:leading-relaxed prose-p:text-sm prose-p:mb-2
                      prose-strong:text-neo-accent prose-strong:font-bold
                      prose-a:text-neo-accent prose-a:no-underline hover:prose-a:underline
                      line-clamp-6 lg:line-clamp-none"
                    dangerouslySetInnerHTML={{
                      __html: locale === "fr" ? album.descriptionsFr : album.descriptionsEn,
                    }}
                  />
                </div>
              </motion.div>

              {/* Right Column - Listen Card (Neo-brutalist style) */}
              {album.listenLink && (
                <motion.div variants={fadeInUp} className="flex">
                  <div className="relative w-full">
                    {/* Decorative background offset */}
                    <div className="absolute inset-0 bg-neo-accent translate-x-2 translate-y-2" />

                    {/* Main card */}
                    <div className="relative bg-neo-bg border-4 border-neo-border p-5 flex flex-col justify-between h-full">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <div className="w-14 h-14 bg-neo-text mx-auto flex items-center justify-center rotate-3 mb-3 shadow-[4px_4px_0px_0px_var(--neo-accent)]">
                          <Headphones className="w-7 h-7 text-neo-accent" />
                        </div>
                        <h3 className="font-black text-xl uppercase tracking-tight text-neo-text">
                          {t("listen")}
                        </h3>
                      </div>

                      {/* Platform Icons - Grid 4x2 */}
                      <div className="py-4 border-y-4 border-neo-border">
                        <p className="font-mono text-[10px] uppercase text-neo-text/50 mb-4 text-center">
                          {t("availableOn")}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {streamingPlatforms.map((platform) => (
                            <div
                              key={platform.name}
                              className="group relative aspect-square flex items-center justify-center bg-neo-bg border-2 border-neo-border shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:shadow-[3px_3px_0px_0px_var(--neo-accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-default overflow-hidden"
                            >
                              {/* Icon - visible by default, hidden on hover */}
                              <platform.icon
                                className="w-5 h-5 group-hover:opacity-0 group-hover:scale-75 transition-all duration-150"
                                style={{ color: platform.color }}
                              />
                              {/* Name - hidden by default, visible on hover */}
                              <span
                                className="absolute font-mono text-[8px] font-bold uppercase leading-tight text-center px-1 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150"
                                style={{ color: platform.color }}
                              >
                                {platform.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Big Play Button + CTA */}
                      <div className="mt-4 flex flex-col items-center gap-3">
                        {/* Big round Play button */}
                        <a
                          href={album.listenLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group w-16 h-16 rounded-full bg-neo-text flex items-center justify-center
                            border-4 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-accent)]
                            hover:bg-neo-accent hover:shadow-[5px_5px_0px_0px_var(--neo-shadow)]
                            hover:-translate-y-1 transform transition-all duration-150"
                        >
                          <Play className="w-7 h-7 text-neo-accent group-hover:text-neo-text-inverse fill-current ml-1" />
                        </a>

                        {/* Text label */}
                        <a
                          href={album.listenLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] font-bold uppercase text-neo-text/70 hover:text-neo-accent transition-colors text-center leading-tight"
                        >
                          {t("listenOnPlatforms")}
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* If no listen link, show empty placeholder on desktop */}
              {!album.listenLink && <div className="hidden lg:block" />}
            </div>
          </motion.section>

          {/* ==================== ALBUM NAVIGATION ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Previous Album */}
              <Link
                href={{ pathname: "/albums/[id]", params: { id: prevAlbum.id } }}
                className="group"
              >
                <NeoCard hover="lift" padding="none" className="h-full border-4 overflow-hidden">
                  <div className="flex items-stretch h-full">
                    {/* Arrow */}
                    <div className="flex items-center justify-center w-14 md:w-16 bg-neo-text group-hover:bg-neo-accent transition-colors flex-shrink-0">
                      <ChevronLeft className="w-6 h-6 text-neo-accent group-hover:text-neo-text transition-colors" />
                    </div>
                    {/* Content */}
                    <div className="flex items-center gap-3 p-3 flex-1 min-w-0">
                      <div className="w-14 h-14 md:w-16 md:h-16 relative flex-shrink-0 border-2 border-neo-border">
                        <Image
                          src={prevAlbum.img}
                          alt={prevAlbum.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] uppercase text-neo-text/60 block">
                          {t("previousAlbum")}
                        </span>
                        <h3 className="font-black text-base md:text-lg uppercase truncate text-neo-text group-hover:text-neo-accent transition-colors">
                          {prevAlbum.title}
                        </h3>
                        <span className="font-mono text-[10px] text-neo-text/50">
                          {prevAlbum.style}
                        </span>
                      </div>
                    </div>
                  </div>
                </NeoCard>
              </Link>

              {/* Next Album */}
              <Link
                href={{ pathname: "/albums/[id]", params: { id: nextAlbum.id } }}
                className="group"
              >
                <NeoCard hover="lift" padding="none" className="h-full border-4 overflow-hidden">
                  <div className="flex items-stretch h-full flex-row-reverse">
                    {/* Arrow */}
                    <div className="flex items-center justify-center w-14 md:w-16 bg-neo-text group-hover:bg-neo-accent transition-colors flex-shrink-0">
                      <ChevronRight className="w-6 h-6 text-neo-accent group-hover:text-neo-text transition-colors" />
                    </div>
                    {/* Content */}
                    <div className="flex items-center gap-3 p-3 flex-1 min-w-0 flex-row-reverse text-right">
                      <div className="w-14 h-14 md:w-16 md:h-16 relative flex-shrink-0 border-2 border-neo-border">
                        <Image
                          src={nextAlbum.img}
                          alt={nextAlbum.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] uppercase text-neo-text/60 block">
                          {t("nextAlbum")}
                        </span>
                        <h3 className="font-black text-base md:text-lg uppercase truncate text-neo-text group-hover:text-neo-accent transition-colors">
                          {nextAlbum.title}
                        </h3>
                        <span className="font-mono text-[10px] text-neo-text/50">
                          {nextAlbum.style}
                        </span>
                      </div>
                    </div>
                  </div>
                </NeoCard>
              </Link>
            </div>

            {/* Back to albums link */}
            <div className="mt-8 text-center">
              <Link
                href="/albums"
                className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("backToAlbums")}
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      <NeoFooter />
    </div>
  );
}
