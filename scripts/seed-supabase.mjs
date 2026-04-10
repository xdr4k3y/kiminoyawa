import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { fileURLToPath } from "node:url";

import { artists } from "../data/artists.js";
import { artworks } from "../data/artworks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function mustGetEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

async function run() {
  loadEnvFile(path.join(rootDir, ".env.local"));
  loadEnvFile(path.join(rootDir, ".env"));

  const connectionString = mustGetEnv("DATABASE_URL");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query("BEGIN");

  try {
    const artistIdsByName = new Map();
    const artistIdsBySlug = new Map();

    for (const artist of artists) {
      const result = await client.query(
        `
          INSERT INTO artists (slug, name, specialty, bio, image_url, location, statement)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (slug)
          DO UPDATE SET
            name = EXCLUDED.name,
            specialty = EXCLUDED.specialty,
            bio = EXCLUDED.bio,
            image_url = EXCLUDED.image_url,
            location = EXCLUDED.location,
            statement = EXCLUDED.statement
          RETURNING id
        `,
        [
          artist.slug,
          artist.name,
          artist.specialty,
          artist.bio,
          artist.image,
          artist.location,
          artist.statement,
        ],
      );

      const artistId = result.rows[0].id;
      artistIdsByName.set(artist.name, artistId);
      artistIdsBySlug.set(artist.slug, artistId);
    }

    for (const artist of artists) {
      const artistId = artistIdsBySlug.get(artist.slug);
      await client.query("DELETE FROM artist_works WHERE artist_id = $1", [artistId]);

      for (const work of artist.works || []) {
        await client.query(
          `
            INSERT INTO artist_works (artist_id, title, year, medium)
            VALUES ($1, $2, $3, $4)
          `,
          [artistId, work.title, Number(work.year), work.medium],
        );
      }
    }

    for (const artwork of artworks) {
      const artistId = artistIdsByName.get(artwork.artist);
      if (!artistId) {
        throw new Error(
          `Artist "${artwork.artist}" for artwork "${artwork.slug}" not found.`,
        );
      }

      await client.query(
        `
          INSERT INTO artworks
            (slug, artist_id, title, medium, year, image_url, dimensions, price, summary, details)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (slug)
          DO UPDATE SET
            artist_id = EXCLUDED.artist_id,
            title = EXCLUDED.title,
            medium = EXCLUDED.medium,
            year = EXCLUDED.year,
            image_url = EXCLUDED.image_url,
            dimensions = EXCLUDED.dimensions,
            price = EXCLUDED.price,
            summary = EXCLUDED.summary,
            details = EXCLUDED.details
        `,
        [
          artwork.slug,
          artistId,
          artwork.title,
          artwork.medium,
          Number(artwork.year),
          artwork.image,
          artwork.dimensions,
          Number(artwork.price),
          artwork.summary,
          artwork.details,
        ],
      );
    }

    await client.query("COMMIT");
    console.log(
      `Seed complete: ${artists.length} artists, ${artworks.length} artworks.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
