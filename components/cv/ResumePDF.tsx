import React from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Path, Circle, Image } from '@react-pdf/renderer';
import path from 'path';

interface ResumeData {
  settings: any;
  entries: any[];
  sections: any[];
  profile: any;
  theme: any;
  locale: string;
}

type Palette = {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  sidebar: string;
  divider: string;
  tagBg: string;
  tagText: string;
  gradientFrom: string;
  gradientTo: string;
};

const buildPalette = (theme: any): Palette => ({
  primary: theme?.primary || '#1bd99a',
  secondary: theme?.secondary || '#5dd6ff',
  accent: theme?.accent || '#ff6bd6',
  muted: theme?.muted || '#6b7280',
  sidebar: theme?.sidebar || '#f5f7fb',
  divider: theme?.divider || '#e5e7eb',
  tagBg: theme?.tagBg || '#eef2ff',
  tagText: theme?.tagText || '#0b1021',
  gradientFrom: theme?.gradientFrom || '#1bd99a',
  gradientTo: theme?.gradientTo || '#5dd6ff',
});

const createStyles = (palette: Palette) =>
  StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
      padding: 24,
      position: 'relative',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
      position: 'relative',
      overflow: 'hidden',
    },
    headerGraphic: {
      position: 'absolute',
      top: -12,
      right: -10,
      width: 280,
      height: 140,
    },
    medallion: {
      width: 96,
      height: 96,
      borderRadius: 48,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: palette.primary,
      marginRight: 18,
      backgroundColor: '#ffffff',
    },
    nameBlock: {
      flex: 1,
    },
    name: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#111827',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    role: {
      fontSize: 11,
      color: palette.accent,
      letterSpacing: 2,
      marginTop: 4,
      marginBottom: 6,
      textTransform: 'uppercase',
    },
    headline: {
      fontSize: 10,
      color: '#374151',
      lineHeight: 1.4,
      maxWidth: 360,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      marginRight: -6,
    },
    contactChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f9fafb',
      borderRadius: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: palette.divider,
      marginRight: 6,
      marginBottom: 6,
    },
    contactText: {
      fontSize: 8,
      color: '#111827',
      marginLeft: 4,
    },
    layout: {
      flexDirection: 'row',
      marginHorizontal: -7,
    },
    sidebar: {
      width: '32%',
      backgroundColor: palette.sidebar,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: palette.divider,
      minHeight: 640,
    },
    main: {
      flex: 1,
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#0b1021',
      letterSpacing: 1,
      marginBottom: 6,
      textTransform: 'uppercase',
      borderBottomWidth: 2,
      borderBottomColor: palette.primary,
      paddingBottom: 4,
    },
    sidebarTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#111827',
      marginTop: 10,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      borderBottomWidth: 1,
      borderBottomColor: palette.accent,
      paddingBottom: 3,
    },
    tagGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginRight: -6,
    },
    tag: {
      paddingVertical: 3,
      paddingHorizontal: 6,
      borderRadius: 4,
      backgroundColor: palette.tagBg,
      borderWidth: 1,
      borderColor: palette.divider,
      marginRight: 6,
      marginBottom: 6,
    },
    tagText: {
      fontSize: 8,
      color: palette.tagText,
      fontWeight: 'bold',
    },
    skillItem: {
      marginBottom: 8,
    },
    skillHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skillName: {
      fontSize: 9,
      color: '#1f2937',
      fontWeight: 'bold',
    },
    skillValue: {
      fontSize: 8,
      color: palette.muted,
    },
    skillBar: {
      height: 4,
      backgroundColor: '#e5e7eb',
      borderRadius: 4,
      marginTop: 3,
      overflow: 'hidden',
    },
    skillFill: {
      height: 4,
      borderRadius: 4,
      backgroundColor: palette.primary,
    },
    timelineSection: {
      marginBottom: 14,
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: palette.divider,
    },
    timelineItem: {
      marginBottom: 10,
      position: 'relative',
      paddingLeft: 12,
    },
    timelineDot: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
      left: -16,
      top: 3,
      backgroundColor: '#ffffff',
      borderWidth: 2,
      borderColor: palette.primary,
    },
    entryTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    entryTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#0b1021',
    },
    entryDate: {
      fontSize: 9,
      color: palette.muted,
      marginLeft: 6,
    },
    entrySubtitle: {
      fontSize: 10,
      color: palette.accent,
      marginTop: 2,
      marginBottom: 2,
      fontWeight: 'bold',
    },
    entryDesc: {
      fontSize: 9,
      color: '#374151',
      lineHeight: 1.35,
      textAlign: 'justify',
    },
    divider: {
      height: 1,
      backgroundColor: palette.divider,
      marginVertical: 6,
    },
  });

const HeaderGraphic = ({ palette, style }: { palette: Palette; style: any }) => (
  <Svg style={style} viewBox="0 0 280 140">
    <Path d="M0 0 L180 0 L120 80 Z" fill={palette.gradientFrom} opacity={0.25} />
    <Path d="M70 10 L250 0 L210 110 Z" fill={palette.gradientTo} opacity={0.3} />
    <Path d="M110 40 L260 30 L200 140 Z" fill={palette.accent} opacity={0.15} />
    <Circle cx="230" cy="28" r="18" stroke={palette.secondary} strokeWidth="1.2" fill="none" opacity={0.35} />
    <Circle cx="200" cy="90" r="10" stroke={palette.primary} strokeWidth="1" fill="none" opacity={0.5} />
    <Path d="M10 30 L120 20 L60 90 Z" fill={palette.primary} opacity={0.08} />
  </Svg>
);

const ContactIcon = ({ color }: { color: string }) => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path fill={color} d="M12 12.713L1.5 6V18h21V6L12 12.713zM12 11L22.5 4h-21L12 11z" />
  </Svg>
);

const PinIcon = ({ color }: { color: string }) => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path fill={color} d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 112.5-2.5 2.5 2.5 0 01-2.5 2.5z" />
  </Svg>
);

const PhoneIcon = ({ color }: { color: string }) => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M20 15.5c-1.23 0-2.42-.2-3.53-.56a1 1 0 00-1.02.25l-1.6 1.58a14.6 14.6 0 01-6.62-6.62l1.58-1.6a1 1 0 00.25-1.02A11.75 11.75 0 005.5 4h-2A1.5 1.5 0 002 5.5C2 14 10 22 18.5 22a1.5 1.5 0 001.5-1.5v-2a1 1 0 00-1-1z"
    />
  </Svg>
);

const GlobeIcon = ({ color }: { color: string }) => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm-1 17.93A8 8 0 014.07 13H9v2a2 2 0 002 2zM13 13v-2a2 2 0 00-2-2H8V7h2a2 2 0 002-2V4.07A8 8 0 0119.93 11H15a2 2 0 00-2 2z"
    />
  </Svg>
);

const resolveSectionEntries = (section: any, entries: any[]) => {
  if (!section) return [];
  if (section.entryIds && Array.isArray(section.entryIds) && section.entryIds.length > 0) {
    return entries.filter((e) => section.entryIds.includes(e.id));
  }
  if (section.entryType) {
    return entries.filter((e) => e.type === section.entryType);
  }
  return [];
};

export const ResumePDF = ({ data }: { data: ResumeData }) => {
  const { entries, settings, locale, profile, theme, sections } = data;
  const isFr = locale === 'fr';
  const palette = buildPalette(theme);
  const styles = createStyles(palette);

  const defaultSections = [
    { slug: 'experience', titleEn: 'Experience', titleFr: 'Expérience', type: 'TIMELINE', entryType: 'EXPERIENCE', order: 1, published: true },
    { slug: 'awards', titleEn: 'Awards', titleFr: 'Récompenses', type: 'TIMELINE', entryType: 'AWARD', order: 2, published: true },
    { slug: 'skills', titleEn: 'Skills', titleFr: 'Compétences', type: 'SKILL_BARS', entryType: 'SKILL', order: 3, published: true },
    { slug: 'clients', titleEn: 'Clients & Sync', titleFr: 'Clients & Sync', type: 'TAG_CLOUD', entryType: 'CLIENT', order: 4, published: true },
    { slug: 'languages', titleEn: 'Languages', titleFr: 'Langues', type: 'SIDEBAR_LIST', entryType: 'LANGUAGE', order: 5, published: true },
    { slug: 'interests', titleEn: 'Interests', titleFr: "Centres d'intérêt", type: 'TAG_CLOUD', entryType: 'INTEREST', order: 6, published: true },
  ];

  const resolvedSections = (sections && sections.length > 0 ? sections : defaultSections).filter((s: any) => s.published !== false);
  const sortedSections = [...resolvedSections].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  const sidebarSections = sortedSections.filter((s: any) => ['SKILL_BARS', 'TAG_CLOUD', 'SIDEBAR_LIST'].includes(s.type));
  const timelineSections = sortedSections.filter((s: any) => s.type === 'TIMELINE');

  const textFor = (entry: any, field: string) => {
    const val = entry?.[`${field}${isFr ? 'Fr' : 'En'}`];
    return val || entry?.[`${field}En`] || '';
  };

  const phone = profile.phone || settings?.contactPhone;
  const location = profile.location || settings?.location;
  const website = profile.website || 'loicghanem.com';
  const email = profile.email || settings?.contactEmail || 'contact@loicghanem.com';

  const resolvedPhoto =
    profile.photo && profile.photo.startsWith('http')
      ? profile.photo
      : path.resolve(`./public${profile.photo || '/img/slider/loic-studio-front.jpg'}`);

  const renderTimelineSection = (section: any) => {
    const list = resolveSectionEntries(section, entries);
    if (!list || list.length === 0) return null;
    return (
      <View style={styles.timelineSection} key={section.slug || section.titleEn}>
        <Text style={styles.sectionTitle}>{isFr ? section.titleFr || section.titleEn : section.titleEn || section.titleFr}</Text>
        {list.map((item: any) => (
          <View style={styles.timelineItem} key={item.id}>
            <View style={styles.timelineDot} />
            <View style={styles.entryTitleRow}>
              <Text style={styles.entryTitle}>{textFor(item, 'title')}</Text>
              {textFor(item, 'dateRange') && <Text style={styles.entryDate}>{textFor(item, 'dateRange')}</Text>}
            </View>
            {textFor(item, 'subtitle') && <Text style={styles.entrySubtitle}>{textFor(item, 'subtitle')}</Text>}
            {textFor(item, 'description') && <Text style={styles.entryDesc}>{textFor(item, 'description')}</Text>}
          </View>
        ))}
      </View>
    );
  };

  const renderSidebarSection = (section: any) => {
    const list = resolveSectionEntries(section, entries);
    if (!list || list.length === 0) return null;

    if (section.type === 'SKILL_BARS') {
      return (
        <View key={section.slug || section.titleEn}>
          <Text style={styles.sidebarTitle}>{isFr ? section.titleFr || section.titleEn : section.titleEn || section.titleFr}</Text>
          {list.map((skill: any) => (
            <View key={skill.id} style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{textFor(skill, 'title')}</Text>
                {skill.value !== null && skill.value !== undefined && <Text style={styles.skillValue}>{skill.value}%</Text>}
              </View>
              {skill.value !== null && skill.value !== undefined && (
                <View style={styles.skillBar}>
                  <View style={{ ...styles.skillFill, width: `${skill.value}%` }} />
                </View>
              )}
            </View>
          ))}
        </View>
      );
    }

    if (section.type === 'SIDEBAR_LIST') {
      return (
        <View key={section.slug || section.titleEn}>
          <Text style={styles.sidebarTitle}>{isFr ? section.titleFr || section.titleEn : section.titleEn || section.titleFr}</Text>
          {list.map((item: any) => (
            <View key={item.id} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#111827' }}>{textFor(item, 'title')}</Text>
              {textFor(item, 'description') && <Text style={{ fontSize: 9, color: palette.muted }}>{textFor(item, 'description')}</Text>}
            </View>
          ))}
        </View>
      );
    }

    // TAG_CLOUD
    return (
      <View key={section.slug || section.titleEn}>
        <Text style={styles.sidebarTitle}>{isFr ? section.titleFr || section.titleEn : section.titleEn || section.titleFr}</Text>
        <View style={styles.tagGrid}>
          {list.map((item: any) => (
            <View key={item.id} style={styles.tag}>
              <Text style={styles.tagText}>{textFor(item, 'title')}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <HeaderGraphic palette={palette} style={styles.headerGraphic} />
          <View style={styles.medallion}>
            <Image src={resolvedPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.role}>{isFr ? profile.roleFr || profile.roleEn : profile.roleEn || profile.roleFr}</Text>
            {profile.headlineEn || profile.headlineFr ? (
              <Text style={styles.headline}>{isFr ? profile.headlineFr || profile.headlineEn : profile.headlineEn || profile.headlineFr}</Text>
            ) : null}
            <View style={styles.contactRow}>
              <View style={styles.contactChip}>
                <ContactIcon color={palette.primary} />
                <Text style={styles.contactText}>{email}</Text>
              </View>
              <View style={styles.contactChip}>
                <GlobeIcon color={palette.secondary} />
                <Text style={styles.contactText}>{website}</Text>
              </View>
              {phone && (
                <View style={styles.contactChip}>
                  <PhoneIcon color={palette.accent} />
                  <Text style={styles.contactText}>{phone}</Text>
                </View>
              )}
              {location && (
                <View style={styles.contactChip}>
                  <PinIcon color={palette.primary} />
                  <Text style={styles.contactText}>{location}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.layout}>
          <View style={styles.sidebar}>
            {sidebarSections.map((section: any) => (
              <View key={section.slug || section.titleEn}>{renderSidebarSection(section)}</View>
            ))}
          </View>

          <View style={styles.main}>
            {timelineSections.map((section: any, idx: number) => (
              <View key={section.slug || section.titleEn}>
                {renderTimelineSection(section)}
                {idx < timelineSections.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
