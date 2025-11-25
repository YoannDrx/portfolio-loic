import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const date = (iso: string) => new Date(iso);

async function main() {
  const fullName = "Loïc Ghanem";

  const cvData = {
    fullName,
    badgeFr: "Compositeur & Producteur",
    badgeEn: "Composer & Producer",
    email: "loic.ghanem@outlook.com",
    website: "loicghanem.com",
    location: "Paris, France",
    headlineFr: "Compositeur & producteur spécialisé en hybrid trailer music, metal et textures orchestrales.",
    headlineEn: "Composer & producer crafting hybrid trailer music, metal and orchestral textures.",
    bioFr:
      "Compositeur et producteur pour l'image, spécialisé dans les univers hybrides (trailer, metal, orchestral). Diffusion TV/streaming, jeux vidéo et publicités pour des marques internationales.",
    bioEn:
      "Composer and producer for picture, focused on hybrid (trailer, metal, orchestral) sounds. Placements across TV/streaming, games and advertising for global brands.",
    accentColor: "#D5FF0A",
    layout: "creative",
    showPhoto: true,
    photo: "/img/slider/loic-studio-front.jpg",
    theme: {
      primary: "#D5FF0A",
      secondary: "#9EF01A",
      header: "#0B0C12",
      sidebar: "#F4F5F7",
      surface: "#FFFFFF",
      text: "#0D0E11",
      muted: "#60626A",
      border: "#E2E4EA",
      badge: "#0F1118",
    },
  };

  let cv = await prisma.cV.findFirst();
  if (cv) {
    cv = await prisma.cV.update({
      where: { id: cv.id },
      data: cvData,
    });
  } else {
    cv = await prisma.cV.create({
      data: cvData,
    });
  }

  // Reset related data to mirror the PDF content
  await prisma.cVSection.deleteMany({ where: { cvId: cv.id } });
  await prisma.cVSkill.deleteMany({ where: { cvId: cv.id } });
  await prisma.cVSocialLink.deleteMany({ where: { cvId: cv.id } });

  // Sections
  const sections = [
    {
      type: "experience",
      placement: "main",
      layoutType: "timeline",
      order: 0,
      color: cvData.theme.primary,
      translations: [
        { locale: "fr", title: "Expériences" },
        { locale: "en", title: "Experience" },
      ],
      items: [
        {
          startDate: date("2015-01-01"),
          endDate: null,
          isCurrent: true,
          order: 0,
          translations: [
            {
              locale: "fr",
              title: "Compositeur & Producteur de Musique",
              subtitle: "Freelance",
              location: "Paris",
              description:
                "Composition et production pour Cezame Music Agency, MYMA, Justement Music. Spécialisé en trailer music, metal et hybrides orchestraux.",
            },
            {
              locale: "en",
              title: "Music Composer & Producer",
              subtitle: "Freelance",
              location: "Paris",
              description:
                "Composition and production for Cezame Music Agency, MYMA, Justement Music. Focused on trailer music, metal and hybrid orchestral cues.",
            },
          ],
        },
        {
          startDate: date("2017-01-01"),
          endDate: null,
          isCurrent: true,
          order: 1,
          translations: [
            {
              locale: "fr",
              title: "Producteur / Artiste",
              subtitle: "Voyager1",
              description: "Projet électronique, hip-hop et bass music. Production, mixage et direction artistique.",
            },
            {
              locale: "en",
              title: "Producer / Artist",
              subtitle: "Voyager1",
              description: "Electronic, hip-hop and bass music project. Production, mixing and creative direction.",
            },
          ],
        },
        {
          startDate: date("2011-01-01"),
          endDate: date("2015-01-01"),
          isCurrent: false,
          order: 2,
          translations: [
            {
              locale: "fr",
              title: "Guitariste",
              subtitle: "Early Seasons",
              description: "Metalcore. Tournées, composition et enregistrement studio (Artery Recordings).",
            },
            {
              locale: "en",
              title: "Guitarist",
              subtitle: "Early Seasons",
              description: "Metalcore band. Touring, songwriting and studio recording (Artery Recordings).",
            },
          ],
        },
        {
          startDate: date("2011-01-01"),
          endDate: date("2014-01-01"),
          isCurrent: false,
          order: 3,
          translations: [
            {
              locale: "fr",
              title: "Producteur & Guitariste",
              subtitle: "Confront",
              description: "Projet fusion Electronic / Metal. Composition et performance live.",
            },
            {
              locale: "en",
              title: "Producer & Guitarist",
              subtitle: "Confront",
              description: "Electronic/metal fusion project. Composition and live performance.",
            },
          ],
        },
        {
          startDate: date("2010-01-01"),
          endDate: date("2012-01-01"),
          isCurrent: false,
          order: 4,
          translations: [
            {
              locale: "fr",
              title: "Guitariste",
              subtitle: "Rise of the Northstar",
              description: "Hardcore. Concerts et travaux de composition.",
            },
            {
              locale: "en",
              title: "Guitarist",
              subtitle: "Rise of the Northstar",
              description: "Hardcore band. Live shows and songwriting.",
            },
          ],
        },
      ],
    },
    {
      type: "awards",
      placement: "main",
      layoutType: "list",
      order: 1,
      color: cvData.theme.secondary,
      translations: [
        { locale: "fr", title: "Prix & Récompenses" },
        { locale: "en", title: "Awards" },
      ],
      items: [
        {
          order: 0,
          translations: [
            {
              locale: "fr",
              title: "Production Music Awards 2024",
              subtitle: "Double Nomination - Catégorie Metal",
              description:
                '"Sparkle in the Dark" (Infinity Scores/Cezame) et "Revenge" feat. Aaron Matts (Justement Music/MYMA). Exploration du metal avec vocalistes de renom.',
            },
            {
              locale: "en",
              title: "Production Music Awards 2024",
              subtitle: "Double nomination - Metal Category",
              description:
                '"Sparkle in the Dark" (Infinity Scores/Cezame) and "Revenge" feat. Aaron Matts (Justement Music/MYMA). Metal explorations with renowned vocalists.',
            },
          ],
        },
        {
          order: 1,
          translations: [
            {
              locale: "fr",
              title: "The Production Music Awards",
              subtitle: "Reconnaissance d'excellence",
              description:
                "Célébration des meilleurs talents de la musique de production, soulignant créativité et innovation pour les médias.",
            },
            {
              locale: "en",
              title: "The Production Music Awards",
              subtitle: "Excellence recognition",
              description:
                "Celebrates top production music talent, highlighting creativity and innovation across media.",
            },
          ],
        },
        {
          order: 2,
          translations: [
            {
              locale: "fr",
              title: "The Mark Awards",
              subtitle: "Accomplissement exceptionnel",
              description:
                "Récompense les réalisations marquantes en musique de production, établissant un standard élevé de créativité.",
            },
            {
              locale: "en",
              title: "The Mark Awards",
              subtitle: "Outstanding achievement",
              description:
                "Recognizes standout achievements in production music, setting a high bar for creativity.",
            },
          ],
        },
      ],
    },
    {
      type: "clients",
      placement: "sidebar",
      layoutType: "grid",
      order: 2,
      color: cvData.theme.primary,
      translations: [
        { locale: "fr", title: "Clients & Sync" },
        { locale: "en", title: "Clients & Sync" },
      ],
      items: [
        "Porsche",
        "Mercedes",
        "Burger King",
        "NHL",
        "NFL",
        "NBA",
        "MLB",
        "Spotify",
        "HBO",
        "Netflix",
        "Amazon Prime",
        "Disney+",
      ].map((label, idx) => ({
        order: idx,
        translations: [
          { locale: "fr", title: label },
          { locale: "en", title: label },
        ],
      })),
    },
    {
      type: "interests",
      placement: "sidebar",
      layoutType: "grid",
      order: 3,
      color: cvData.theme.secondary,
      translations: [
        { locale: "fr", title: "Centres d'intérêt" },
        { locale: "en", title: "Interests" },
      ],
      items: [
        { fr: "Cinéma", en: "Cinema" },
        { fr: "Jeux Vidéo", en: "Video Games" },
        { fr: "Nouvelles Technologies", en: "New Technologies" },
      ].map((entry, idx) => ({
        order: idx,
        translations: [
          { locale: "fr", title: entry.fr },
          { locale: "en", title: entry.en },
        ],
      })),
    },
  ];

  for (const section of sections) {
    await prisma.cVSection.create({
      data: {
        cvId: cv.id,
        type: section.type,
        placement: section.placement,
        layoutType: section.layoutType,
        color: section.color,
        order: section.order,
        isActive: true,
        translations: { create: section.translations },
        items: {
          create: section.items.map((item) => ({
            startDate: 'startDate' in item ? item.startDate : null,
            endDate: 'endDate' in item ? item.endDate : null,
            isCurrent: 'isCurrent' in item ? item.isCurrent : false,
            order: item.order,
            isActive: true,
            translations: { create: item.translations },
          })),
        },
      },
    });
  }

  // Skills (bars + badges)
  const skills = [
    { nameFr: "Composition Musicale", nameEn: "Music Composition", level: 5, category: "technical" },
    { nameFr: "Production Musicale", nameEn: "Music Production", level: 5, category: "technical" },
    { nameFr: "Mixage & Mastering", nameEn: "Mixing & Mastering", level: 5, category: "technical" },
    { nameFr: "Arrangement / Orchestration", nameEn: "Arrangement / Orchestration", level: 5, category: "technical" },
    { nameFr: "Musique de Film", nameEn: "Film Scoring", level: 5, category: "technical" },
    { nameFr: "Musique de Jeu Vidéo", nameEn: "Video Game Music", level: 4, category: "technical" },
    { nameFr: "Design Sonore", nameEn: "Sound Design", level: 4, category: "technical" },
  ];

  for (const [idx, skill] of skills.entries()) {
    await prisma.cVSkill.create({
      data: {
        cvId: cv.id,
        category: skill.category,
        level: skill.level,
        showAsBar: true,
        order: idx,
        isActive: true,
        translations: {
          create: [
            { locale: "fr", name: skill.nameFr },
            { locale: "en", name: skill.nameEn },
          ],
        },
      },
    });
  }

  // Languages as badges
  const languages = [
    { fr: "Français (langue maternelle)", en: "French (native)" },
    { fr: "Anglais (courant / professionnel)", en: "English (fluent / professional)" },
  ];

  for (const [idx, lang] of languages.entries()) {
    await prisma.cVSkill.create({
      data: {
        cvId: cv.id,
        category: "language",
        level: 0,
        showAsBar: false,
        order: idx,
        isActive: true,
        translations: {
          create: [
            { locale: "fr", name: lang.fr },
            { locale: "en", name: lang.en },
          ],
        },
      },
    });
  }

  // Social links (approximated from CV contact block)
  const socialLinks = [
    { platform: "linkedin", url: "https://www.linkedin.com", label: "LinkedIn" },
    { platform: "soundcloud", url: "https://soundcloud.com", label: "SoundCloud" },
    { platform: "youtube", url: "https://www.youtube.com", label: "YouTube" },
  ];

  for (const [idx, link] of socialLinks.entries()) {
    await prisma.cVSocialLink.create({
      data: {
        cvId: cv.id,
        platform: link.platform,
        url: link.url,
        label: link.label,
        order: idx,
      },
    });
  }

  console.log("CV seeded with current PDF content for", fullName);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
