import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
import type { CVData, CVTheme, CVTranslation, CVItem, CVSection } from "@/types/cv";

// Neo-brutalist theme - single accent
const defaultTheme: CVTheme = {
  primary: "#F73604", // Orange-rouge (accent unique)
  secondary: "#F73604", // Même accent
  header: "#0B0C12", // Noir
  sidebar: "#F4F5F7", // Gris clair
  surface: "#FFFFFF", // Blanc
  text: "#0B0C12", // Noir
  muted: "#666666", // Gris
  border: "#0B0C12", // Bordure noire
  badge: "#F73604", // Même accent
};

const createStyles = (theme: CVTheme) =>
  StyleSheet.create({
    page: {
      padding: 0,
      backgroundColor: theme.surface,
      fontFamily: "Helvetica",
      color: theme.text,
    },
    // ============ HEADER ============
    header: {
      backgroundColor: theme.header,
      padding: "24 28",
      borderBottom: `6 solid ${theme.primary}`,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerLeft: {
      flex: 1,
      paddingRight: 20,
    },
    name: {
      fontSize: 32,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 2,
      color: "#FFFFFF",
      textTransform: "uppercase",
      marginBottom: 6,
    },
    headline: {
      fontSize: 11,
      color: theme.primary,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontFamily: "Helvetica-Bold",
      marginBottom: 16,
    },
    // Contact info with neo-brutalist blocks
    contactGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    contactBlock: {
      backgroundColor: "#111111",
      border: `2 solid #333333`,
      padding: "6 10",
      marginRight: 6,
      marginBottom: 6,
    },
    contactLabel: {
      fontSize: 6,
      color: theme.primary,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 2,
    },
    contactValue: {
      fontSize: 8,
      color: "#FFFFFF",
      textDecoration: "none",
    },
    // Photo block - neo-brutalist square
    photoBlock: {
      alignItems: "center",
    },
    photoContainer: {
      width: 100,
      height: 100,
      border: `4 solid ${theme.primary}`,
      backgroundColor: theme.header,
      padding: 4,
    },
    photo: {
      width: 88,
      height: 88,
      objectFit: "cover",
    },
    availableBadge: {
      backgroundColor: theme.primary,
      padding: "4 8",
      marginTop: 8,
    },
    availableText: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: theme.header,
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    // ============ BODY ============
    body: {
      flexDirection: "row",
      flex: 1,
    },

    // ============ SIDEBAR ============
    sidebar: {
      width: "32%",
      backgroundColor: theme.sidebar,
      padding: "20 16",
      borderRight: `4 solid ${theme.border}`,
    },
    sidebarBlock: {
      marginBottom: 18,
    },
    sidebarHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      borderBottom: `3 solid ${theme.border}`,
      paddingBottom: 6,
    },
    sidebarSquare: {
      width: 12,
      height: 12,
      backgroundColor: theme.primary,
      marginRight: 8,
    },
    sidebarTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 2,
      color: theme.text,
      textTransform: "uppercase",
    },
    bioText: {
      fontSize: 8,
      lineHeight: 1.5,
      color: theme.muted,
      textAlign: "justify",
    },
    // Skills with neo-brutalist bars
    skillItem: {
      marginBottom: 8,
    },
    skillLabel: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
      marginBottom: 3,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    skillBar: {
      width: "100%",
      height: 8,
      backgroundColor: "#EEEEEE",
      border: `2 solid ${theme.border}`,
    },
    skillBarFill: {
      height: 4,
      backgroundColor: theme.primary,
    },
    // Tool badges - neo-brutalist style
    badgeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    toolBadge: {
      backgroundColor: "#FFFFFF",
      border: `2 solid ${theme.border}`,
      padding: "4 8",
      marginRight: 4,
      marginBottom: 4,
    },
    toolBadgeText: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    // Language badges with color accent
    langBadge: {
      backgroundColor: theme.primary,
      border: `2 solid ${theme.border}`,
      padding: "4 10",
      marginRight: 4,
      marginBottom: 4,
    },
    langBadgeText: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: theme.header,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    // Clients grid badges
    clientsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    clientBadge: {
      backgroundColor: "#FFFFFF",
      border: `2 solid ${theme.border}`,
      padding: "6 12",
      marginRight: 6,
      marginBottom: 6,
    },
    clientBadgeText: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    // ============ MAIN CONTENT ============
    main: {
      width: "68%",
      padding: "20 20",
    },
    // Section header
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
      paddingBottom: 8,
      borderBottom: `4 solid ${theme.border}`,
    },
    sectionSquare: {
      width: 14,
      height: 14,
      marginRight: 10,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 2.5,
      textTransform: "uppercase",
      color: theme.text,
    },
    // Timeline items
    timelineItem: {
      flexDirection: "row",
      marginBottom: 16,
      position: "relative",
    },
    timelineDateCol: {
      width: 58,
      paddingRight: 8,
    },
    timelineDate: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: theme.muted,
      textAlign: "right",
    },
    timelineRail: {
      width: 20,
      alignItems: "center",
      position: "relative",
    },
    timelineDot: {
      width: 12,
      height: 12,
      backgroundColor: theme.primary,
      border: `2 solid ${theme.border}`,
      marginTop: 2,
      zIndex: 2,
    },
    timelineLine: {
      position: "absolute",
      top: 14,
      bottom: -16,
      width: 3,
      backgroundColor: "#CCCCCC",
      left: 8.5,
    },
    timelineContent: {
      flex: 1,
      paddingLeft: 10,
    },
    // Experience card - neo-brutalist
    expTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    expSubtitle: {
      fontSize: 8,
      fontFamily: "Helvetica-Oblique",
      color: theme.muted,
      marginBottom: 2,
    },
    expMeta: {
      fontSize: 7,
      color: theme.muted,
      marginBottom: 4,
    },
    expDesc: {
      fontSize: 7.5,
      color: theme.muted,
      lineHeight: 1.4,
      textAlign: "justify",
    },
    // Award/Achievement cards
    awardCard: {
      border: `3 solid ${theme.border}`,
      padding: 10,
      marginBottom: 10,
      backgroundColor: "#FFFFFF",
    },
    awardTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    awardSubtitle: {
      fontSize: 7,
      fontFamily: "Helvetica-Oblique",
      color: theme.muted,
      marginBottom: 2,
    },
    awardDesc: {
      fontSize: 7,
      color: theme.muted,
      lineHeight: 1.3,
    },
    // Education items in sidebar
    eduItem: {
      marginBottom: 8,
      paddingBottom: 8,
      borderBottom: `1 solid #CCCCCC`,
    },
    eduTitle: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: theme.text,
      textTransform: "uppercase",
    },
    eduSubtitle: {
      fontSize: 7,
      fontFamily: "Helvetica-Oblique",
      color: theme.muted,
    },
    eduMeta: {
      fontSize: 6,
      color: theme.muted,
      marginTop: 2,
    },
  });

const _styles = createStyles(defaultTheme);

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

  const experienceSection = activeSections.find(
    (s) => s.type === "experience" && s.placement !== "sidebar"
  );
  const mainSections = activeSections.filter(
    (s) => s.type !== "experience" && s.placement !== "sidebar"
  );
  const sidebarSections = activeSections.filter((s) => s.placement === "sidebar");

  const technicalSkills = (data.skills || [])
    .filter((s) => s.category === "technical" && s.isActive !== false)
    .sort((a, b) => a.order - b.order);
  const softwareSkills = (data.skills || [])
    .filter((s) => s.category === "software" && s.isActive !== false)
    .sort((a, b) => a.order - b.order);
  const languages = (data.skills || [])
    .filter((s) => s.category === "language" && s.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const getShortName = (url: string, platform: string): string => {
    if (platform === "LinkedIn") {
      const match = url.match(/linkedin\.com\/in\/([^/]+)/);
      return match ? `@${match[1].replace(/%C3%AF/gi, "ï")}` : url;
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
      href: link.url,
    }));

  const contactItems = [
    data.email ? { label: "EMAIL", value: data.email, href: `mailto:${data.email}` } : null,
    data.linkedInUrl
      ? {
          label: "LINKEDIN",
          value: getShortName(data.linkedInUrl, "LinkedIn"),
          href: data.linkedInUrl,
        }
      : null,
    data.website
      ? {
          label: "PORTFOLIO",
          value: data.website.replace(/^https?:\/\/(www\.)?/, ""),
          href: data.website.startsWith("http") ? data.website : `https://${data.website}`,
        }
      : null,
    ...socialFromLinks.map((link) => ({
      label: link.label?.toUpperCase() || "SOCIAL",
      value: link.value,
      href: link.href,
    })),
  ].filter((x) => x && x.value) as { label: string; value: string; href: string }[];

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
          <View style={stylesWithTheme.sidebarHeader}>
            <View style={[stylesWithTheme.sidebarSquare, { backgroundColor: sectionColor }]} />
            <Text style={stylesWithTheme.sidebarTitle}>{sectionTitle}</Text>
          </View>
        )}
        {section.items.map((item) => {
          const it = t(item.translations);
          return (
            <View key={item.id || it?.title} style={stylesWithTheme.eduItem}>
              {it?.title && <Text style={stylesWithTheme.eduTitle}>{it.title}</Text>}
              {it?.subtitle && <Text style={stylesWithTheme.eduSubtitle}>{it.subtitle}</Text>}
              {(it?.location || item.startDate) && (
                <Text style={stylesWithTheme.eduMeta}>
                  {it?.location}
                  {it?.location && item.startDate ? " • " : ""}
                  {item.startDate && formatRange(item)}
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
                <View style={stylesWithTheme.timelineDateCol}>
                  <Text style={stylesWithTheme.timelineDate}>{formatDate(item.startDate)}</Text>
                  <Text style={stylesWithTheme.timelineDate}>
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
              <View key={item.id || it?.title} style={stylesWithTheme.awardCard}>
                {it?.title && <Text style={stylesWithTheme.awardTitle}>{it.title}</Text>}
                {it?.subtitle && <Text style={stylesWithTheme.awardSubtitle}>{it.subtitle}</Text>}
                {(it?.location || item.startDate) && (
                  <Text style={stylesWithTheme.expMeta}>
                    {formatRange(item)}
                    {it?.location ? ` • ${it.location}` : ""}
                  </Text>
                )}
                {it?.description && <Text style={stylesWithTheme.awardDesc}>{it.description}</Text>}
              </View>
            );
          })}

        {section.layoutType === "grid" && (
          <View style={stylesWithTheme.clientsGrid}>
            {section.items.map((item) => {
              const it = t(item.translations);
              return (
                <View key={item.id || it?.title} style={stylesWithTheme.clientBadge}>
                  <Text style={stylesWithTheme.clientBadgeText}>{it?.title}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={stylesWithTheme.page} wrap={false}>
        {/* ============ HEADER ============ */}
        <View
          style={[stylesWithTheme.header, { backgroundColor: mergedTheme.header }]}
          wrap={false}
        >
          <View style={stylesWithTheme.headerContent}>
            <View style={stylesWithTheme.headerLeft}>
              <Text style={stylesWithTheme.name}>{fullName}</Text>
              {headline && (
                <Text style={[stylesWithTheme.headline, { color: mergedTheme.primary }]}>
                  {headline}
                </Text>
              )}

              {/* Contact blocks */}
              <View style={stylesWithTheme.contactGrid}>
                {dedupedContacts.slice(0, 4).map((item) => (
                  <View key={item.value} style={stylesWithTheme.contactBlock}>
                    <Text style={[stylesWithTheme.contactLabel, { color: mergedTheme.primary }]}>
                      {item.label}
                    </Text>
                    <Link src={item.href} style={stylesWithTheme.contactValue}>
                      {item.value}
                    </Link>
                  </View>
                ))}
              </View>
            </View>

            {/* Photo */}
            {data.photo && data.showPhoto !== false && (
              <View style={stylesWithTheme.photoBlock}>
                <View
                  style={[stylesWithTheme.photoContainer, { borderColor: mergedTheme.primary }]}
                >
                  <Image src={data.photo} style={stylesWithTheme.photo} />
                </View>
                <View
                  style={[stylesWithTheme.availableBadge, { backgroundColor: mergedTheme.primary }]}
                >
                  <Text style={[stylesWithTheme.availableText, { color: mergedTheme.header }]}>
                    {isFr ? "DISPONIBLE" : "AVAILABLE"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ============ BODY ============ */}
        <View style={stylesWithTheme.body} wrap={false}>
          {/* ============ SIDEBAR ============ */}
          <View style={stylesWithTheme.sidebar} wrap={false}>
            {/* Profile/Bio */}
            {bio && (
              <View style={stylesWithTheme.sidebarBlock}>
                <View style={stylesWithTheme.sidebarHeader}>
                  <View
                    style={[
                      stylesWithTheme.sidebarSquare,
                      { backgroundColor: mergedTheme.primary },
                    ]}
                  />
                  <Text style={stylesWithTheme.sidebarTitle}>{isFr ? "PROFIL" : "PROFILE"}</Text>
                </View>
                <Text style={stylesWithTheme.bioText}>{bio}</Text>
              </View>
            )}

            {/* Skills */}
            {technicalSkills.length > 0 && (
              <View style={stylesWithTheme.sidebarBlock}>
                <View style={stylesWithTheme.sidebarHeader}>
                  <View
                    style={[
                      stylesWithTheme.sidebarSquare,
                      { backgroundColor: mergedTheme.primary },
                    ]}
                  />
                  <Text style={stylesWithTheme.sidebarTitle}>
                    {isFr ? "COMPÉTENCES" : "SKILLS"}
                  </Text>
                </View>
                {technicalSkills.map((skill) => {
                  const st = t(skill.translations);
                  const percent = `${(skill.level / 5) * 100}%`;
                  return (
                    <View key={skill.id || st?.name} style={stylesWithTheme.skillItem}>
                      <Text style={stylesWithTheme.skillLabel}>{st?.name}</Text>
                      {skill.showAsBar && (
                        <View style={stylesWithTheme.skillBar}>
                          <View
                            style={[
                              stylesWithTheme.skillBarFill,
                              { width: percent, backgroundColor: mergedTheme.primary },
                            ]}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Tools/Software */}
            {softwareSkills.length > 0 && (
              <View style={stylesWithTheme.sidebarBlock}>
                <View style={stylesWithTheme.sidebarHeader}>
                  <View
                    style={[
                      stylesWithTheme.sidebarSquare,
                      { backgroundColor: mergedTheme.primary },
                    ]}
                  />
                  <Text style={stylesWithTheme.sidebarTitle}>{isFr ? "OUTILS" : "TOOLS"}</Text>
                </View>
                <View style={stylesWithTheme.badgeRow}>
                  {softwareSkills.map((skill) => {
                    const st = t(skill.translations);
                    return (
                      <View key={skill.id || st?.name} style={stylesWithTheme.toolBadge}>
                        <Text style={stylesWithTheme.toolBadgeText}>{st?.name}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View style={stylesWithTheme.sidebarBlock}>
                <View style={stylesWithTheme.sidebarHeader}>
                  <View
                    style={[
                      stylesWithTheme.sidebarSquare,
                      { backgroundColor: mergedTheme.primary },
                    ]}
                  />
                  <Text style={stylesWithTheme.sidebarTitle}>{isFr ? "LANGUES" : "LANGUAGES"}</Text>
                </View>
                <View style={stylesWithTheme.badgeRow}>
                  {languages.map((lang) => {
                    const st = t(lang.translations);
                    return (
                      <View
                        key={lang.id || st?.name}
                        style={[
                          stylesWithTheme.langBadge,
                          { backgroundColor: mergedTheme.primary },
                        ]}
                      >
                        <Text
                          style={[stylesWithTheme.langBadgeText, { color: mergedTheme.header }]}
                        >
                          {st?.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Sidebar sections (education, etc.) */}
            {sidebarSections.map((section) => renderSidebarSection(section))}
          </View>

          {/* ============ MAIN CONTENT ============ */}
          <View style={stylesWithTheme.main} wrap={false}>
            {/* Experience section */}
            {experienceSection && experienceSection.items.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <View style={stylesWithTheme.sectionHeader}>
                  <View
                    style={[
                      stylesWithTheme.sectionSquare,
                      { backgroundColor: experienceSection.color || mergedTheme.primary },
                    ]}
                  />
                  <Text style={stylesWithTheme.sectionTitle}>
                    {t(experienceSection.translations)?.title ||
                      (isFr ? "EXPÉRIENCE" : "EXPERIENCE")}
                  </Text>
                </View>
                {experienceSection.items.map((item, idx) => {
                  const it = t(item.translations);
                  const isLast = idx === experienceSection.items.length - 1;
                  return (
                    <View key={item.id || it?.title} style={stylesWithTheme.timelineItem}>
                      <View style={stylesWithTheme.timelineDateCol}>
                        <Text style={stylesWithTheme.timelineDate}>
                          {formatDate(item.startDate)}
                        </Text>
                        <Text style={stylesWithTheme.timelineDate}>
                          {item.isCurrent
                            ? isFr
                              ? "Présent"
                              : "Present"
                            : formatDate(item.endDate)}
                        </Text>
                      </View>
                      <View style={stylesWithTheme.timelineRail}>
                        <View
                          style={[
                            stylesWithTheme.timelineDot,
                            { backgroundColor: experienceSection.color || mergedTheme.primary },
                          ]}
                        />
                        {!isLast && <View style={stylesWithTheme.timelineLine} />}
                      </View>
                      <View style={stylesWithTheme.timelineContent}>
                        {it?.title && <Text style={stylesWithTheme.expTitle}>{it.title}</Text>}
                        {it?.subtitle && (
                          <Text style={stylesWithTheme.expSubtitle}>{it.subtitle}</Text>
                        )}
                        <Text style={stylesWithTheme.expMeta}>
                          {formatRange(item)}
                          {it?.location ? ` • ${it.location}` : ""}
                        </Text>
                        {it?.description && (
                          <Text style={stylesWithTheme.expDesc}>{it.description}</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Other main sections */}
            {mainSections.map((section) => renderMainSection(section))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
