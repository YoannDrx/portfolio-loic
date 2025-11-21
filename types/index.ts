import type { ReactNode } from 'react';

/**
 * Sidebar navigation item
 */
export interface SidebarItem {
  id: number;
  icon: string;
  menuName: string;
  routePath: string;
}

/**
 * Video categories for filtering
 */
export type VideoType =
  | 'OriginalMusic'
  | 'Sync'
  | 'MusicToPicture';

/**
 * Video project item
 */
export interface Video {
  id: number;
  img: string;
  type: VideoType;
  videoId: string; // YouTube video ID
  title: string;
  detail: string;
  date: string;
}

/**
 * Service offered (Composition, Production, etc.)
 */
export interface Service {
  id: number;
  no: string; // "01", "02", etc. for display
  title: string;
  text: string; // Short description
  largeImg: string;
  largeTitle: string;
  poster: string;
  date: string;
  author: string; // Author name for blog-style display
  fullDescription: string; // Full text description for modal
  descriptions: ReactNode; // Full JSX content with formatting
}

/**
 * Music album/project
 */
export interface Album {
  id: number;
  title: string;
  img: string;
  poster: string;
  date: string; // Display date (e.g., "Avril 2024")
  sortedDate: string; // Sortable date format (e.g., "04-2024")
  style: string; // Music genre/style
  listenLink: string; // External listening link (Spotify, YouTube, etc.)
  collabName?: string; // Optional collaborator name
  collabLink?: string; // Optional collaborator link
  descriptions: ReactNode; // Full JSX content with formatting
}

/**
 * Contact form data
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Testimonial data for about page
 */
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  quote: string;
  rating?: number;
}

/**
 * Filter option for albums/videos
 */
export interface FilterOption {
  id: string;
  label: string;
  value: string;
}
