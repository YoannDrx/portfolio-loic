import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const date = (iso: string) => new Date(iso);

async function main() {
  const fullName = "Loïc Ghanem";

  // Palette de couleurs recommandées pour les sections
  const SECTION_COLORS = {
    experience: "#F73604", // Orange (dominante)
    awards: "#7C3AED", // Violet
    clients: "#0A66C2", // Bleu
    interests: "#00A67E", // Vert
    education: "#0A66C2", // Bleu
    skills: "#00A67E", // Vert
  };

  const cvData = {
    fullName,
    badgeFr: "Compositeur & Producteur",
    badgeEn: "Composer & Producer",
    email: "loic.ghanem@outlook.com",
    website: "loicghanem.com",
    location: "Paris, France",
    headlineFr: "Compositeur & Producteur",
    headlineEn: "Composer & Producer",
    bioFr:
      "Compositeur et producteur basé à Paris, passionné par la création de paysages sonores narratifs. Depuis plus d'une décennie, je transforme des idées brutes en expériences auditives complètes. De la musique originale aux compositions pour médias visuels et l'édition musicale, j'apporte ma signature sonore à chaque projet, amplifiant l'histoire et enrichissant l'expérience du spectateur. Je crée des paysages sonores uniques, contemporains et engageants qui résonnent et laissent une impression durable.",
    bioEn:
      "Paris-based composer and music producer with a passion for soundscaping narratives. For over a decade, I've been transforming raw ideas into full-blown auditory experiences. From original music to compelling compositions for visual media and music publishing, I bring my sonic signature to every project, amplifying the story and enriching the viewer's experience. I deliver unique, contemporary, and engaging soundscapes that resonate and create lasting impressions.",
    accentColor: "#F73604",
    layout: "creative",
    showPhoto: true,
    photo: "/img/slider/loic-studio-front.jpg",
    theme: {
      primary: "#F73604", // Orange vif (accent unique)
      secondary: "#F73604", // Même accent
      header: "#0B0C12", // Noir
      sidebar: "#F4F5F7", // Gris clair
      surface: "#FFFFFF", // Blanc
      text: "#0B0C12", // Noir
      muted: "#666666", // Gris
      border: "#0B0C12", // Bordure noire
      badge: "#F73604", // Même accent
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
      color: SECTION_COLORS.experience,
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
              description:
                "Projet électronique, hip-hop et bass music. Production, mixage et direction artistique.",
            },
            {
              locale: "en",
              title: "Producer / Artist",
              subtitle: "Voyager1",
              description:
                "Electronic, hip-hop and bass music project. Production, mixing and creative direction.",
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
              description:
                "Metalcore. Tournées, composition et enregistrement studio (Artery Recordings).",
            },
            {
              locale: "en",
              title: "Guitarist",
              subtitle: "Early Seasons",
              description:
                "Metalcore band. Touring, songwriting and studio recording (Artery Recordings).",
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
      type: "clients",
      placement: "main",
      layoutType: "grid",
      order: 1,
      color: SECTION_COLORS.clients,
      translations: [
        { locale: "fr", title: "Clients & Sync" },
        { locale: "en", title: "Clients & Sync" },
      ],
      items: [
        // Marques
        "Porsche",
        "Mercedes",
        "Burger King",
        "Lululemon",
        // TV Sport
        "BBC",
        "ESPN",
        "NHL",
        "NFL",
        "NBA",
        "MLB",
        "WWE",
        // Streaming
        "Netflix",
        "HBO",
        "Amazon Prime",
        "Disney+",
        "Apple TV+",
        "Spotify",
      ].map((label, idx) => ({
        order: idx,
        translations: [
          { locale: "fr", title: label },
          { locale: "en", title: label },
        ],
      })),
    },
    {
      type: "awards",
      placement: "main",
      layoutType: "list",
      order: 2,
      color: SECTION_COLORS.awards,
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
      type: "interests",
      placement: "sidebar",
      layoutType: "grid",
      order: 3,
      color: SECTION_COLORS.interests,
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
            startDate: "startDate" in item ? item.startDate : null,
            endDate: "endDate" in item ? item.endDate : null,
            isCurrent: "isCurrent" in item ? item.isCurrent : false,
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
    {
      nameFr: "Composition Musicale",
      nameEn: "Music Composition",
      level: 5,
      category: "technical",
    },
    { nameFr: "Production Musicale", nameEn: "Music Production", level: 5, category: "technical" },
    { nameFr: "Mixage & Mastering", nameEn: "Mixing & Mastering", level: 5, category: "technical" },
    {
      nameFr: "Arrangement / Orchestration",
      nameEn: "Arrangement / Orchestration",
      level: 5,
      category: "technical",
    },
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
