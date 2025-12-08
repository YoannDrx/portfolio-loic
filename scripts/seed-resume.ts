import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding resume data...");

  // Clean existing data for a fresh baseline
  await prisma.resumeSection.deleteMany();
  await prisma.resumeEntry.deleteMany();
  await prisma.resumeProfile.deleteMany();
  await prisma.resumeTheme.deleteMany();

  const profile = await prisma.resumeProfile.upsert({
    where: { id: "default_profile" },
    update: {},
    create: {
      id: "default_profile",
      name: "Loïc Ghanem",
      roleEn: "Music Composer & Producer",
      roleFr: "Compositeur & Producteur",
      headlineEn: "Hybrid scores, trailer power, and emotive electronic textures for film, games, and brands.",
      headlineFr: "Partitions hybrides, puissance trailer et textures électroniques pour films, jeux et marques.",
      email: "loic.ghanem@outlook.com",
      phone: "+33 6 00 00 00 00",
      location: "Paris, France",
      website: "loicghanem.com",
      photo: "/img/slider/loic-studio-front.jpg",
    },
  });

  const theme = await prisma.resumeTheme.upsert({
    where: { id: "default_theme" },
    update: {},
    create: {
      id: "default_theme",
      primary: "#1bd99a",
      secondary: "#5dd6ff",
      accent: "#ff6bd6",
      muted: "#6b7280",
      sidebar: "#f5f7fb",
      divider: "#e5e7eb",
      gradientFrom: "#1bd99a",
      gradientTo: "#5dd6ff",
      tagBg: "#eef2ff",
      tagText: "#0b1021",
      fontHeadings: "Helvetica",
      fontBody: "Helvetica",
    },
  });

  const entries = [
    {
      type: "EXPERIENCE",
      titleEn: "Music Composer & Producer",
      titleFr: "Compositeur & Producteur de Musique",
      subtitleEn: "Freelance",
      subtitleFr: "Freelance",
      dateRangeEn: "2015 - Present",
      dateRangeFr: "2015 - Aujourd'hui",
      descriptionEn:
        "Trailer music and hybrid orchestral productions for libraries (Cezame, MYMA, Justement). Broadcast placements across TV and digital.",
      descriptionFr:
        "Musiques de trailer et hybrides orchestrales pour librairies (Cezame, MYMA, Justement). Diffusions TV et digital.",
      order: 1,
      published: true,
    },
    {
      type: "EXPERIENCE",
      titleEn: "Producer / Artist",
      titleFr: "Producteur / Artiste",
      subtitleEn: "Voyager1",
      subtitleFr: "Voyager1",
      dateRangeEn: "2017 - Present",
      dateRangeFr: "2017 - Aujourd'hui",
      descriptionEn:
        "Electronic, hip-hop and bass project. Composition, production, mixing, and artistic direction.",
      descriptionFr:
        "Projet électronique, hip-hop et bass. Composition, production, mixage et direction artistique.",
      link: "https://www.youtube.com/watch?v=aPJUTPMEukM&ab_channel=Voyager1",
      order: 2,
      published: true,
    },
    {
      type: "EXPERIENCE",
      titleEn: "Guitarist",
      titleFr: "Guitariste",
      subtitleEn: "Live & Studio",
      subtitleFr: "Live & Studio",
      dateRangeEn: "2011 - 2015",
      dateRangeFr: "2011 - 2015",
      descriptionEn: "Rock/metal guitarist for studio sessions and touring acts; arrangement and recording.",
      descriptionFr: "Guitariste rock/metal pour sessions studio et tournées; arrangement et enregistrement.",
      order: 3,
      published: true,
    },
    {
      type: "AWARD",
      titleEn: "Production Music Awards",
      titleFr: "Production Music Awards",
      subtitleEn: "Nominee - Best Trailer Track",
      subtitleFr: "Nommé - Meilleur titre trailer",
      dateRangeEn: "2024",
      dateRangeFr: "2024",
      descriptionEn: "Highlighted for hybrid trailer composition in library catalog.",
      descriptionFr: "Mise en avant pour une composition trailer hybride en librairie.",
      order: 1,
      published: true,
    },
    {
      type: "AWARD",
      titleEn: "The Mark Awards",
      titleFr: "The Mark Awards",
      subtitleEn: "Shortlist",
      subtitleFr: "Shortlist",
      dateRangeEn: "2023",
      dateRangeFr: "2023",
      descriptionEn: "Shortlisted for excellence in production music.",
      descriptionFr: "Shortlist pour excellence en production music.",
      order: 2,
      published: true,
    },
    {
      type: "SKILL",
      titleEn: "Music Composition",
      titleFr: "Composition musicale",
      value: 95,
      order: 1,
      published: true,
    },
    {
      type: "SKILL",
      titleEn: "Music Production",
      titleFr: "Production musicale",
      value: 92,
      order: 2,
      published: true,
    },
    {
      type: "SKILL",
      titleEn: "Mixing & Mastering",
      titleFr: "Mixage & Mastering",
      value: 88,
      order: 3,
      published: true,
    },
    {
      type: "SKILL",
      titleEn: "Arranging / Orchestration",
      titleFr: "Arrangement / Orchestration",
      value: 85,
      order: 4,
      published: true,
    },
    {
      type: "SKILL",
      titleEn: "Film Scoring",
      titleFr: "Composition à l’image",
      value: 86,
      order: 5,
      published: true,
    },
    {
      type: "LANGUAGE",
      titleEn: "French",
      titleFr: "Français",
      descriptionEn: "Native",
      descriptionFr: "Natif",
      order: 1,
      published: true,
    },
    {
      type: "LANGUAGE",
      titleEn: "English",
      titleFr: "Anglais",
      descriptionEn: "Fluent",
      descriptionFr: "Courant",
      order: 2,
      published: true,
    },
    { type: "INTEREST", titleEn: "Cinema", titleFr: "Cinéma", order: 1, published: true },
    { type: "INTEREST", titleEn: "Video Games", titleFr: "Jeux vidéo", order: 2, published: true },
    { type: "INTEREST", titleEn: "New Technologies", titleFr: "Nouvelles technologies", order: 3, published: true },
    { type: "CLIENT", titleEn: "Porsche", titleFr: "Porsche", order: 1, published: true },
    { type: "CLIENT", titleEn: "Mercedes", titleFr: "Mercedes", order: 2, published: true },
    { type: "CLIENT", titleEn: "Burger King", titleFr: "Burger King", order: 3, published: true },
    { type: "CLIENT", titleEn: "NHL", titleFr: "NHL", order: 4, published: true },
    { type: "CLIENT", titleEn: "NFL", titleFr: "NFL", order: 5, published: true },
  ];

  const sections = [
    { slug: "experience", titleEn: "Experience", titleFr: "Expérience", type: "TIMELINE", entryType: "EXPERIENCE", order: 1, published: true },
    { slug: "awards", titleEn: "Awards", titleFr: "Récompenses", type: "TIMELINE", entryType: "AWARD", order: 2, published: true },
    { slug: "skills", titleEn: "Skills", titleFr: "Compétences", type: "SKILL_BARS", entryType: "SKILL", order: 3, published: true },
    { slug: "clients", titleEn: "Clients & Sync", titleFr: "Clients & Sync", type: "TAG_CLOUD", entryType: "CLIENT", order: 4, published: true },
    { slug: "languages", titleEn: "Languages", titleFr: "Langues", type: "SIDEBAR_LIST", entryType: "LANGUAGE", order: 5, published: true },
    { slug: "interests", titleEn: "Interests", titleFr: "Centres d'intérêt", type: "TAG_CLOUD", entryType: "INTEREST", order: 6, published: true },
  ];

  await prisma.resumeEntry.createMany({ data: entries });
  await prisma.resumeSection.createMany({ data: sections });

  console.log(`✅ Profile: ${profile.name}`);
  console.log(`✅ Theme: ${theme.primary} / ${theme.secondary}`);
  console.log(`✅ Entries: ${entries.length}`);
  console.log(`✅ Sections: ${sections.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
