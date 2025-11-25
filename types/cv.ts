export type CVTheme = {
  primary: string;
  secondary: string;
  header: string;
  sidebar: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  badge: string;
};

export type CVTranslation = {
  locale: string;
  title?: string;
  subtitle?: string | null;
  location?: string | null;
  description?: string | null;
  name?: string;
};

export type CVItem = {
  id?: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  order: number;
  isActive?: boolean;
  translations: CVTranslation[];
};

export type CVSection = {
  id?: string;
  type: string;
  icon?: string | null;
  color?: string | null;
  placement?: string;
  layoutType?: string;
  order: number;
  isActive?: boolean;
  translations: CVTranslation[];
  items: CVItem[];
};

export type CVSkill = {
  id?: string;
  category: string;
  level: number;
  showAsBar?: boolean;
  order: number;
  isActive?: boolean;
  translations: CVTranslation[];
};

export type CVSocialLink = {
  id?: string;
  platform: string;
  url: string;
  label?: string | null;
  order: number;
};

export type CVData = {
  id?: string;
  fullName?: string | null;
  badgeFr?: string | null;
  badgeEn?: string | null;
  photo?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  location?: string | null;
  linkedInUrl?: string | null;
  headlineFr?: string | null;
  headlineEn?: string | null;
  bioFr?: string | null;
  bioEn?: string | null;
  layout?: string;
  accentColor?: string;
  showPhoto?: boolean;
  theme?: Partial<CVTheme> | null;
  sections: CVSection[];
  skills: CVSkill[];
  socialLinks: CVSocialLink[];
};
