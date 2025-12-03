import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Link, Svg, Polygon } from "@react-pdf/renderer";
import type { CVData, CVTheme, CVTranslation, CVItem, CVSection } from "@/types/cv";

const defaultTheme: CVTheme = {
  primary: "#D5FF0A",
  secondary: "#9EF01A",
  header: "#0B0C12",
  sidebar: "#F4F5F7",
  surface: "#FFFFFF",
  text: "#0D0E11",
  muted: "#60626A",
  border: "#E2E4EA",
  badge: "#0F1118",
};

const createStyles = (theme: CVTheme) =>
  StyleSheet.create({
    page: {
      padding: 0,
      backgroundColor: theme.surface,
      fontFamily: "Helvetica",
      color: theme.text,
    },
    header: {
      position: "relative",
      backgroundColor: theme.header,
      height: 160,
      padding: "18 30 16 30",
      justifyContent: "flex-end",
      overflow: "hidden",
    },
    headerShapes: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
    },
    headerContent: {
      position: "relative",
      zIndex: 10,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    headerLeft: {
      flex: 1,
    },
    name: {
      fontSize: 22,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 2,
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
    headline: {
      fontSize: 10,
      color: theme.primary,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginTop: 4,
    },
    headerSeparator: {
      marginTop: 6,
      marginBottom: 8,
      height: 2,
      width: 70,
      backgroundColor: theme.primary,
    },
    contactRow: {
      flexDirection: "column",
      marginTop: 4,
    },
    contactItem: {
      fontSize: 7.5,
      color: "#E7E7EC",
      marginBottom: 2,
      textDecoration: "none",
    },
    contactLabel: {
      fontSize: 7.5,
      color: "#9EA0A8",
      textTransform: "lowercase",
    },
    badge: {
      backgroundColor: theme.badge,
      color: "#FFFFFF",
      fontSize: 8,
      padding: "4 8",
      borderRadius: 10,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      alignSelf: "flex-start",
    },
    photoBadge: {
      position: "absolute",
      bottom: -35,
      left: 30,
      width: 80,
      height: 80,
      borderRadius: 40,
      border: `3 solid ${theme.primary}`,
      backgroundColor: "#0E0E14",
      overflow: "hidden",
      zIndex: 3,
    },
    photo: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    body: {
      flexDirection: "row",
      flex: 1,
    },
    sidebar: {
      width: "32%",
      backgroundColor: theme.sidebar,
      padding: "24 20 20 24",
      borderRight: `2 solid ${theme.primary}`,
      flexGrow: 1,
    },
    sidebarBlock: {
      marginBottom: 12,
    },
    sidebarTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1.4,
      color: theme.text,
      textTransform: "uppercase",
    },
    sidebarTitleBar: {
      width: 28,
      height: 2,
      backgroundColor: theme.primary,
      marginBottom: 6,
      marginTop: 4,
    },
    paragraph: {
      fontSize: 7.5,
      lineHeight: 1.4,
      color: theme.muted,
      textAlign: "justify",
    },
    contactLine: {
      fontSize: 7.5,
      color: theme.text,
      marginBottom: 4,
    },
    skillItem: {
      marginBottom: 6,
    },
    skillLabel: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
      marginBottom: 2,
    },
    skillBar: {
      width: "100%",
      height: 5,
      backgroundColor: theme.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    skillBarFill: {
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.primary,
    },
    badgeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 4,
    },
    softBadge: {
      backgroundColor: "#FFFFFF",
      border: `1 solid ${theme.primary}`,
      color: theme.text,
      padding: "3 6",
      fontSize: 7,
      borderRadius: 8,
      marginRight: 4,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    listItem: {
      marginBottom: 5,
    },
    listTitle: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
    },
    listSubtitle: {
      fontSize: 7,
      fontFamily: "Helvetica-Oblique",
      color: theme.muted,
    },
    main: {
      width: "68%",
      padding: "24 24 20 22",
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    sectionSquare: {
      width: 10,
      height: 10,
      backgroundColor: theme.primary,
      marginRight: 6,
    },
    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1.8,
      textTransform: "uppercase",
      color: theme.text,
    },
    timelineItem: {
      flexDirection: "row",
      marginBottom: 12,
      position: "relative",
    },
    timelineRail: {
      width: 14,
      alignItems: "center",
      position: "relative",
    },
    timelineLine: {
      position: "absolute",
      top: 10,
      bottom: -12,
      width: 1,
      backgroundColor: theme.border,
    },
    timelineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      border: `1.5 solid ${theme.surface}`,
      marginTop: 2,
      zIndex: 2,
    },
    timelineYear: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: theme.muted,
      marginBottom: 1,
      textAlign: "right",
    },
    timelineContent: {
      flex: 1,
      paddingLeft: 8,
    },
    expTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
      textTransform: "uppercase",
    },
    expSubtitle: {
      fontSize: 7.5,
      fontFamily: "Helvetica-Oblique",
      color: theme.muted,
      marginBottom: 1,
    },
    expMeta: {
      fontSize: 7,
      color: theme.muted,
      marginBottom: 3,
    },
    expDesc: {
      fontSize: 7,
      color: "#2F3035",
      lineHeight: 1.35,
      textAlign: "justify",
    },
    card: {
      padding: 8,
      borderRadius: 6,
      border: `1 solid ${theme.border}`,
      marginBottom: 8,
      backgroundColor: "#FFFFFF",
    },
    pillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    pill: {
      border: `1 solid ${theme.border}`,
      borderRadius: 8,
      padding: "2 5",
      fontSize: 7,
      color: theme.text,
      marginRight: 4,
      marginBottom: 4,
    },
  });

const HeaderShapes = ({ theme }: { theme: CVTheme }) => (
  <Svg style={styles.headerShapes} viewBox="0 0 600 160">
    {/* Triangle droit uniquement */}
    <Polygon points="480,0 600,0 600,160" fill="#11131C" opacity={0.7} />

    {/* Accent vert coin droit */}
    <Polygon points="540,0 600,0 600,80" fill={theme.primary} opacity={0.85} />

    {/* Accent vert coin gauche bas - petit */}
    <Polygon points="0,130 35,160 0,160" fill={theme.primary} opacity={0.85} />
  </Svg>
);

const styles = createStyles(defaultTheme);

export const CVDocument = ({ data, locale }: { data: CVData; locale: string }) => {
  const mergedTheme: CVTheme = {
    ...defaultTheme,
    ...(data.theme || {}),
  };

  if (data.accentColor) {
    mergedTheme.primary = data.accentColor;
  }

  const isFr = locale === "fr";
  const headline = isFr ? data.headlineFr : data.headlineEn;
  const badge = isFr ? data.badgeFr : data.badgeEn;
  const fullName = data.fullName || "Loïc Ghanem";
  const bio = isFr ? data.bioFr : data.bioEn;

  const t = (arr: CVTranslation[]) => arr.find((x) => x.locale === locale) || arr[0] || {};

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const formatRange = (item: CVItem) => {
    const start = formatDate(item.startDate);
    const end = item.isCurrent ? (isFr ? "Présent" : "Present") : formatDate(item.endDate);
    if (start && end) return `${start} — ${end}`;
    return start || end || "";
  };

  const activeSections = (data.sections || [])
    .filter((s) => s.isActive !== false)
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      ...section,
      items: (section.items || [])
        .filter((i) => i.isActive !== false)
        .sort((a, b) => a.order - b.order),
    }));

  const experienceSection = activeSections.find((s) => s.type === "experience" && s.placement !== "sidebar");
  const mainSections = activeSections.filter((s) => s.type !== "experience" && s.placement !== "sidebar");
  const sidebarSections = activeSections.filter((s) => s.placement === "sidebar");
  const educationSection = sidebarSections.find((s) => s.type === "education");
  const customSidebarSections = sidebarSections.filter((s) => s.type !== "education");

  const technicalSkills = (data.skills || [])
    .filter((s) => s.category === "technical" && s.isActive !== false)
    .sort((a, b) => a.order - b.order);
  const softwareSkills = (data.skills || [])
    .filter((s) => s.category === "software" && s.isActive !== false)
    .sort((a, b) => a.order - b.order);
  const languages = (data.skills || [])
    .filter((s) => s.category === "language" && s.isActive !== false)
    .sort((a, b) => a.order - b.order);

  // Fonction pour extraire un nom court d'une URL
  const getShortName = (url: string, platform: string): string => {
    if (platform === "LinkedIn") {
      const match = url.match(/linkedin\.com\/in\/([^/]+)/);
      return match ? `@${match[1].replace(/%C3%AF/gi, 'ï')}` : url;
    }
    if (platform === "YouTube") {
      const match = url.match(/youtube\.com\/@([^/?\s]+)/);
      return match ? `@${match[1]}` : "@LoicGhanem";
    }
    return url.replace(/^https?:\/\/(www\.)?/, "");
  };

  const socialFromLinks = (data.socialLinks || [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((link) => ({
      label: link.label || link.platform,
      value: getShortName(link.url, link.platform),
      isLink: true,
      href: link.url,
    }));

  const contactItems = [
    data.email ? { label: "email", value: data.email, isLink: true, href: `mailto:${data.email}` } : null,
    // Pas de téléphone sur le CV
    data.linkedInUrl ? {
      label: "linkedin",
      value: getShortName(data.linkedInUrl, "LinkedIn"),
      isLink: true,
      href: data.linkedInUrl
    } : null,
    data.website
      ? {
          label: "portfolio",
          value: data.website.replace(/^https?:\/\/(www\.)?/, ""),
          isLink: true,
          href: data.website.startsWith("http") ? data.website : `https://${data.website}`,
        }
      : null,
    ...socialFromLinks.map(link => ({
      ...link,
      label: link.label?.toLowerCase() || "youtube"
    })),
  ].filter((x) => x && x.value) as { label?: string; value: string; isLink?: boolean; href?: string }[];

  const seenContacts = new Set<string>();
  const dedupedContacts = contactItems.filter((item) => {
    if (seenContacts.has(item.value)) return false;
    seenContacts.add(item.value);
    return true;
  });

  const stylesWithTheme = createStyles(mergedTheme);

  const renderSidebarSection = (section: CVSection) => {
    const sectionColor = section.color || mergedTheme.primary;
    const sectionTitle = t(section.translations)?.title;
    return (
      <View key={section.id || sectionTitle} style={stylesWithTheme.sidebarBlock}>
        {sectionTitle && (
          <View>
            <Text style={stylesWithTheme.sidebarTitle}>{sectionTitle}</Text>
            <View style={[stylesWithTheme.sidebarTitleBar, { backgroundColor: sectionColor }]} />
          </View>
        )}
        {section.items.map((item) => {
          const it = t(item.translations);
          return (
            <View key={item.id || it?.title} style={stylesWithTheme.listItem}>
              {it?.title && <Text style={stylesWithTheme.listTitle}>{it.title}</Text>}
              {it?.subtitle && <Text style={stylesWithTheme.listSubtitle}>{it.subtitle}</Text>}
              {it?.location && <Text style={stylesWithTheme.listSubtitle}>{it.location}</Text>}
              {item.startDate && (
                <Text style={stylesWithTheme.listSubtitle}>
                  {formatDate(item.startDate)}
                  {item.endDate || item.isCurrent ? ` — ${item.isCurrent ? (isFr ? "Présent" : "Present") : formatDate(item.endDate)}` : ""}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderMainSection = (section: CVSection) => {
    const sectionColor = section.color || mergedTheme.primary;
    const title = t(section.translations)?.title;
    return (
      <View key={section.id || title} style={{ marginBottom: 20 }}>
        {title && (
          <View style={stylesWithTheme.sectionHeader}>
            <View style={[stylesWithTheme.sectionSquare, { backgroundColor: sectionColor }]} />
            <Text style={stylesWithTheme.sectionTitle}>{title}</Text>
          </View>
        )}
        {(section.layoutType === "timeline" || section.type === "timeline") &&
          section.items.map((item, idx) => {
            const it = t(item.translations);
            const isLast = idx === section.items.length - 1;
            return (
              <View key={item.id || it?.title} style={stylesWithTheme.timelineItem}>
                <View style={{ width: 52, paddingTop: 2 }}>
                  <Text style={stylesWithTheme.timelineYear}>{formatDate(item.startDate)}</Text>
                  <Text style={stylesWithTheme.timelineYear}>
                    {item.isCurrent ? (isFr ? "Présent" : "Present") : formatDate(item.endDate)}
                  </Text>
                </View>
                <View style={stylesWithTheme.timelineRail}>
                  <View style={[stylesWithTheme.timelineDot, { backgroundColor: sectionColor }]} />
                  {!isLast && <View style={stylesWithTheme.timelineLine} />}
                </View>
                <View style={stylesWithTheme.timelineContent}>
                  {it?.title && <Text style={stylesWithTheme.expTitle}>{it.title}</Text>}
                  {it?.subtitle && <Text style={stylesWithTheme.expSubtitle}>{it.subtitle}</Text>}
                  <Text style={stylesWithTheme.expMeta}>
                    {formatRange(item)}
                    {it?.location ? ` • ${it.location}` : ""}
                  </Text>
                  {it?.description && <Text style={stylesWithTheme.expDesc}>{it.description}</Text>}
                </View>
              </View>
            );
          })}

        {(section.layoutType === "list" || !section.layoutType) &&
          section.items.map((item) => {
            const it = t(item.translations);
            return (
              <View key={item.id || it?.title} style={stylesWithTheme.card}>
                {it?.title && <Text style={stylesWithTheme.expTitle}>{it.title}</Text>}
                {it?.subtitle && <Text style={stylesWithTheme.expSubtitle}>{it.subtitle}</Text>}
                {(it?.location || item.startDate) && (
                  <Text style={stylesWithTheme.expMeta}>
                    {formatRange(item)}
                    {it?.location ? ` • ${it.location}` : ""}
                  </Text>
                )}
                {it?.description && <Text style={stylesWithTheme.expDesc}>{it.description}</Text>}
              </View>
            );
          })}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={stylesWithTheme.page} wrap={false}>
        <View style={[stylesWithTheme.header, { backgroundColor: mergedTheme.header }]} wrap={false}>
          <HeaderShapes theme={mergedTheme} />
          <View style={stylesWithTheme.headerContent}>
            <View style={stylesWithTheme.headerLeft}>
              <Text style={stylesWithTheme.name}>{fullName}</Text>
              {headline && <Text style={stylesWithTheme.headline}>{headline}</Text>}
              <View style={stylesWithTheme.headerSeparator} />
              <View style={stylesWithTheme.contactRow}>
                {dedupedContacts.slice(0, 4).map((item) => {
                  const displayValue = item.value.replace(/^mailto:/, "").replace(/^tel:/, "");
                  if (item.isLink && item.href) {
                    return (
                      <View key={item.value} style={{ flexDirection: "row", marginBottom: 2 }}>
                        <Text style={stylesWithTheme.contactLabel}>{item.label} : </Text>
                        <Link src={item.href} style={stylesWithTheme.contactItem}>
                          {displayValue}
                        </Link>
                      </View>
                    );
                  }
                  return (
                    <View key={item.value} style={{ flexDirection: "row", marginBottom: 2 }}>
                      <Text style={stylesWithTheme.contactLabel}>{item.label} : </Text>
                      <Text style={stylesWithTheme.contactItem}>{displayValue}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View>
              <Text style={stylesWithTheme.badge}>{badge || (isFr ? "Compositeur & producteur" : "Composer & producer")}</Text>
            </View>
          </View>
        </View>

        <View style={stylesWithTheme.body} wrap={false}>
          <View style={stylesWithTheme.sidebar} wrap={false}>
            {bio && (
              <View style={stylesWithTheme.sidebarBlock}>
                <Text style={stylesWithTheme.sidebarTitle}>{isFr ? "Profil" : "Profile"}</Text>
                <View style={stylesWithTheme.sidebarTitleBar} />
                <Text style={stylesWithTheme.paragraph}>{bio}</Text>
              </View>
            )}

            {technicalSkills.length > 0 && (
              <View style={stylesWithTheme.sidebarBlock}>
                <Text style={stylesWithTheme.sidebarTitle}>{isFr ? "Compétences" : "Skills"}</Text>
                <View style={stylesWithTheme.sidebarTitleBar} />
                {technicalSkills.map((skill) => {
                  const st = t(skill.translations);
                  const percent = `${(skill.level / 5) * 100}%`;
                  return (
                    <View key={skill.id || st?.name} style={stylesWithTheme.skillItem}>
                      <Text style={stylesWithTheme.skillLabel}>{st?.name}</Text>
                      {skill.showAsBar && (
                        <View style={stylesWithTheme.skillBar}>
                          <View style={[stylesWithTheme.skillBarFill, { width: percent }]} />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {softwareSkills.length > 0 && (
              <View style={stylesWithTheme.sidebarBlock}>
                <Text style={stylesWithTheme.sidebarTitle}>{isFr ? "Logiciels" : "Tools"}</Text>
                <View style={stylesWithTheme.sidebarTitleBar} />
                <View style={stylesWithTheme.badgeRow}>
                  {softwareSkills.map((skill) => {
                    const st = t(skill.translations);
                    return (
                      <Text key={skill.id || st?.name} style={stylesWithTheme.softBadge}>
                        {st?.name}
                      </Text>
                    );
                  })}
                </View>
              </View>
            )}

            {languages.length > 0 && (
              <View style={stylesWithTheme.sidebarBlock}>
                <Text style={stylesWithTheme.sidebarTitle}>{isFr ? "Langues" : "Languages"}</Text>
                <View style={stylesWithTheme.sidebarTitleBar} />
                <View style={stylesWithTheme.badgeRow}>
                  {languages.map((lang) => {
                    const st = t(lang.translations);
                    return (
                      <Text key={lang.id || st?.name} style={stylesWithTheme.softBadge}>
                        {st?.name}
                      </Text>
                    );
                  })}
                </View>
              </View>
            )}

            {educationSection && educationSection.items.length > 0 && renderSidebarSection(educationSection)}

            {customSidebarSections.filter((s) => s.id !== educationSection?.id).map((section) => renderSidebarSection(section))}
          </View>

          <View style={stylesWithTheme.main} wrap={false}>
            {experienceSection && experienceSection.items.length > 0 && (
              <View style={{ marginBottom: 18 }}>
                <View style={stylesWithTheme.sectionHeader}>
                  <View style={[stylesWithTheme.sectionSquare, { backgroundColor: experienceSection.color || mergedTheme.primary }]} />
                  <Text style={stylesWithTheme.sectionTitle}>
                    {t(experienceSection.translations)?.title || (isFr ? "Expériences" : "Experience")}
                  </Text>
                </View>
                {experienceSection.items.map((item, idx) => {
                  const it = t(item.translations);
                  const isLast = idx === experienceSection.items.length - 1;
                  return (
                    <View key={item.id || it?.title} style={stylesWithTheme.timelineItem}>
                      <View style={{ width: 52, paddingTop: 2 }}>
                        <Text style={stylesWithTheme.timelineYear}>{formatDate(item.startDate)}</Text>
                        <Text style={stylesWithTheme.timelineYear}>
                          {item.isCurrent ? (isFr ? "Présent" : "Present") : formatDate(item.endDate)}
                        </Text>
                      </View>
                      <View style={stylesWithTheme.timelineRail}>
                        <View style={[stylesWithTheme.timelineDot, { backgroundColor: experienceSection.color || mergedTheme.primary }]} />
                        {!isLast && <View style={stylesWithTheme.timelineLine} />}
                      </View>
                      <View style={stylesWithTheme.timelineContent}>
                        {it?.title && <Text style={stylesWithTheme.expTitle}>{it.title}</Text>}
                        {it?.subtitle && <Text style={stylesWithTheme.expSubtitle}>{it.subtitle}</Text>}
                        <Text style={stylesWithTheme.expMeta}>
                          {formatRange(item)}
                          {it?.location ? ` • ${it.location}` : ""}
                        </Text>
                        {it?.description && <Text style={stylesWithTheme.expDesc}>{it.description}</Text>}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {mainSections.map((section) => renderMainSection(section))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
