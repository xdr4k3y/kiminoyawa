# Database Setup

This project now includes a PostgreSQL schema at `db/schema.sql`.

## 1) Create Supabase project

In Supabase dashboard, create a new project.

## 2) Set environment variables

Use `.env.local` (copy from `.env.example`) and set:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3) Create tables

Option A (recommended): Supabase SQL Editor

1. Open Supabase dashboard -> SQL Editor
2. Paste the content of `db/schema.sql`
3. Run query

Option B (local terminal with `psql`)

```powershell
psql "$env:DATABASE_URL" -f db/schema.sql
```

## 4) What this schema covers

- Auth tables for NextAuth/Auth.js adapter:
  - `users`, `accounts`, `sessions`, `verification_tokens`
- Gallery domain:
  - `artists`, `artist_works`, `artworks`, `exhibitions`, `exhibition_artworks`
- User interaction / commerce:
  - `favorites`, `carts`, `cart_items`

## 5) Supabase client helper

Use `lib/supabase.js`:

- `createSupabaseBrowserClient()` for client-side public queries
- `createSupabaseServerClient()` for server-side privileged queries

## 6) Next step

Wire API routes to these tables (for example `/api/artists`, `/api/artworks`, `/api/cart`), then replace data from `data/*.js` and localStorage with database reads/writes.

## 7) Seed current project data

```powershell
npm run seed
```

This imports `data/artists.js` and `data/artworks.js` into Supabase tables.
