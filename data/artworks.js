export const artworks = [
  {
    slug: "crimson-memory",
    title: "Crimson Memory",
    artist: "Elena Voss",
    medium: "Oil on linen",
    year: "2025",
    image: "/images/1.jpg",
    dimensions: "180 x 120 cm",
    price: 5800,
    summary:
      "A layered field of reds and charcoal tones that maps how grief transforms into warmth.",
    details:
      "Elena Voss builds this piece through translucent glazing and dry brush passages to create depth that shifts under changing light.",
  },
  {
    slug: "glass-tide",
    title: "Glass Tide",
    artist: "Elena Voss",
    medium: "Mixed media",
    year: "2026",
    image: "/images/2.jpg",
    dimensions: "150 x 100 cm",
    price: 6200,
    summary:
      "A luminous composition where fractured geometry meets fluid brush movement.",
    details:
      "Fragments of reflective material are embedded in paint, producing a dynamic surface that responds to viewer movement.",
  },
  {
    slug: "weight-of-silence",
    title: "Weight of Silence",
    artist: "Marcus Chen",
    medium: "Steel and stone",
    year: "2024",
    image: "/images/3.jpg",
    dimensions: "210 x 90 x 75 cm",
    price: 8900,
    summary:
      "A suspended industrial form that appears heavier than its anchored footprint.",
    details:
      "Marcus Chen contrasts rough-forged steel edges with polished basalt planes to question structural trust and vulnerability.",
  },
  {
    slug: "pulse-frame",
    title: "Pulse Frame",
    artist: "Marcus Chen",
    medium: "Kinetic sculpture",
    year: "2026",
    image: "/images/4.jpg",
    dimensions: "190 x 120 x 120 cm",
    price: 9400,
    summary:
      "A rhythmic steel structure with subtle mechanical shifts that mimic breathing.",
    details:
      "The work uses a low-noise motor cycle to animate tension lines, creating a meditative loop between stillness and motion.",
  },
  {
    slug: "city-in-ash",
    title: "City in Ash",
    artist: "Sofia Laurent",
    medium: "Silver gelatin print",
    year: "2023",
    image: "/images/2.jpg",
    dimensions: "90 x 60 cm",
    price: 3200,
    summary:
      "A monochrome street portrait of urban emptiness after rain.",
    details:
      "Printed in a darkroom process, this photograph preserves tonal subtleties and grain to emphasize atmosphere over narrative certainty.",
  },
  {
    slug: "quiet-transit",
    title: "Quiet Transit",
    artist: "Sofia Laurent",
    medium: "Archival pigment print",
    year: "2025",
    image: "/images/1.jpg",
    dimensions: "120 x 80 cm",
    price: 3600,
    summary:
      "An image of passing commuters where only one figure remains sharply present.",
    details:
      "Long exposure and masked contrast control isolate the subject from blurred surrounding movement.",
  },
  {
    slug: "signal-ancestor",
    title: "Signal Ancestor",
    artist: "David Okonkwo",
    medium: "Digital collage",
    year: "2026",
    image: "/images/4.jpg",
    dimensions: "140 x 100 cm",
    price: 5100,
    summary:
      "A digital matrix of ancestral motifs interrupted by glitch distortions.",
    details:
      "Layered source scans of textiles are remixed with code-generated artifacts to challenge linear readings of identity.",
  },
  {
    slug: "fractured-crown",
    title: "Fractured Crown",
    artist: "David Okonkwo",
    medium: "Projection and acrylic",
    year: "2024",
    image: "/images/3.jpg",
    dimensions: "160 x 120 cm",
    price: 5400,
    summary:
      "Projected symbols and painted marks combine into a portrait of inherited pressure.",
    details:
      "The piece pairs layered acrylic textures with mapped projection to shift symbolic emphasis over time.",
  },
  {
    slug: "breath-of-stone",
    title: "Breath of Stone",
    artist: "Yuki Tanaka",
    medium: "Installation study",
    year: "2025",
    image: "/images/1.jpg",
    dimensions: "Variable dimensions",
    price: 4700,
    summary:
      "A meditative arrangement of stone forms and ambient light intervals.",
    details:
      "Tanaka calibrates spacing and shadow as primary materials, inviting slow movement and attentive viewing.",
  },
  {
    slug: "sumi-light",
    title: "Sumi Light",
    artist: "Yuki Tanaka",
    medium: "Light and paper",
    year: "2026",
    image: "/images/3.jpg",
    dimensions: "200 x 200 cm",
    price: 5200,
    summary:
      "A quiet field of suspended paper planes lit to resemble ink diffusion.",
    details:
      "The work references sumi brush logic through gradients cast from concealed directional lighting.",
  },
  {
    slug: "neon-psalm",
    title: "Neon Psalm",
    artist: "Isabella Romano",
    medium: "Acrylic on canvas",
    year: "2026",
    image: "/images/2.jpg",
    dimensions: "170 x 130 cm",
    price: 6000,
    summary:
      "A saturated pop tableau where luxury symbols collapse into devotional framing.",
    details:
      "Romano fuses classical composition with graphic iconography to critique spectacle and desire.",
  },
  {
    slug: "commodity-garden",
    title: "Commodity Garden",
    artist: "Isabella Romano",
    medium: "Acrylic and enamel",
    year: "2024",
    image: "/images/4.jpg",
    dimensions: "155 x 110 cm",
    price: 5600,
    summary:
      "An ornamental visual feast that reveals hidden branding debris beneath floral forms.",
    details:
      "Multiple enamel pours create glossy interruptions, foregrounding the tension between beauty and consumption.",
  },
];

export const exhibitionArtists = [
  "All",
  ...new Set(artworks.map((artwork) => artwork.artist)),
];

export function getArtworkBySlug(slug) {
  return artworks.find((artwork) => artwork.slug === slug);
}
