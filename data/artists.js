export const artists = [
  {
    slug: "elena-voss",
    name: "Elena Voss",
    specialty: "Abstract Expressionism",
    bio: "Large-scale emotional landscapes exploring the intersection of memory and color",
    image:
      "https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/ee9363de155fcdcea950c588aeb28adc3de8718d",
    location: "Berlin, Germany",
    statement:
      "I paint memory as atmosphere. Every layer is a fragment of feeling, not a record of fact.",
    works: [
      { title: "Afterlight", year: "2025", medium: "Oil on canvas" },
      { title: "Memory Drift", year: "2026", medium: "Mixed media on linen" },
      { title: "Nocturne Field", year: "2024", medium: "Pigment and charcoal" },
    ],
  },
  {
    slug: "marcus-chen",
    name: "Marcus Chen",
    specialty: "Contemporary Sculpture",
    bio: "Industrial materials transformed into organic forms questioning human resilience",
    image:
      "https://kimi-web-img.moonshot.cn/img/media.istockphoto.com/cdcb93c23752a4fad1f5f483a792f2dddc8f0f1b.jpg",
    location: "Taipei, Taiwan",
    statement:
      "Steel remembers pressure. My sculptures test where weight becomes grace.",
    works: [
      { title: "Load Bearing", year: "2026", medium: "Steel and stone" },
      { title: "Orbit Tension", year: "2025", medium: "Cast iron" },
      { title: "Silent Frame", year: "2023", medium: "Aluminum and glass" },
    ],
  },
  {
    slug: "sofia-laurent",
    name: "Sofia Laurent",
    specialty: "Fine Art Photography",
    bio: "Monochrome narratives capturing the ephemeral beauty of urban solitude",
    image:
      "https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/6e0aabcf04ffd9c54480d7a3ca1113025d4295f3.jpg",
    location: "Paris, France",
    statement:
      "I photograph silence between people, where cities reveal their hidden pulse.",
    works: [
      { title: "Hollow Street", year: "2024", medium: "Silver gelatin print" },
      { title: "Last Train", year: "2025", medium: "Archival pigment print" },
      { title: "Window Noise", year: "2026", medium: "Digital monochrome print" },
    ],
  },
  {
    slug: "david-okonkwo",
    name: "David Okonkwo",
    specialty: "Digital and Mixed Media",
    bio: "Exploring identity through the fusion of traditional African motifs and digital glitch art",
    image:
      "https://kimi-web-img.moonshot.cn/img/instaheadshots.com/231fecd39502444271859635731311de3d00602c.png",
    location: "Lagos, Nigeria",
    statement:
      "Glitch is not error to me, it is ancestry interrupting the signal.",
    works: [
      { title: "Signal Ancestor", year: "2026", medium: "Digital collage" },
      { title: "Echo Mask", year: "2025", medium: "Projection and acrylic" },
      { title: "Fracture Ritual", year: "2024", medium: "Mixed media panel" },
    ],
  },
  {
    slug: "yuki-tanaka",
    name: "Yuki Tanaka",
    specialty: "Minimalist Installation",
    bio: "Spatial experiences using light, shadow, and natural materials to evoke tranquility",
    image:
      "https://kimi-web-img.moonshot.cn/img/c8.alamy.com/9dd0a4d2d4f531e971d421b57fc358f6df1a0d28.jpg",
    location: "Kyoto, Japan",
    statement:
      "I design rooms where viewers can hear their own attention.",
    works: [
      { title: "Sumi Light", year: "2026", medium: "Light and paper" },
      { title: "Breath of Stone", year: "2025", medium: "Site installation" },
      { title: "White Interval", year: "2024", medium: "Wood and natural fiber" },
    ],
  },
  {
    slug: "isabella-romano",
    name: "Isabella Romano",
    specialty: "Neo-Pop Painting",
    bio: "Vibrant critiques of consumer culture through classical technique and modern iconography",
    image:
      "https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/fdd575e53a11661c20320578786515c5da075c9c.jpg",
    location: "Milan, Italy",
    statement:
      "I paint desire as spectacle, then scratch through the gloss to show its cost.",
    works: [
      { title: "Neon Psalm", year: "2026", medium: "Acrylic on canvas" },
      { title: "Commodity Garden", year: "2024", medium: "Acrylic and enamel" },
      { title: "Luxury Engine", year: "2025", medium: "Oil and spray paint" },
    ],
  },
];

export function getArtistBySlug(slug) {
  return artists.find((artist) => artist.slug === slug);
}
