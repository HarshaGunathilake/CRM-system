# Phase 4 setup — backend

Phase 4 adds a real backend: PostgreSQL (via Drizzle ORM), authentication,
server actions, email, and file storage. Because the environment this was
built in couldn't reach a Postgres server or Prisma's binary CDN, the
database layer uses **Drizzle ORM** with the standard `pg` driver instead of
Prisma — it's pure JavaScript, needs no downloaded binaries, and works with
any Postgres instance (local, Docker, or hosted).

## 1. Install the new dependencies

```
npm install
```

This pulls in `drizzle-orm`, `pg`, `bcryptjs`, `jose`, `nodemailer`,
`@aws-sdk/client-s3`, and dev tools (`drizzle-kit`, `tsx`). Prisma is not
used.

## 2. Set up Postgres

Install PostgreSQL locally if you don't have it already, then create a
database:

```
createdb crm_system
```

## 3. Configure environment variables

A `.env` file has already been created (from `.env.example`) with working
defaults. At minimum, check `DATABASE_URL` matches your local Postgres
credentials:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crm_system"
```

`AUTH_SECRET` already has a placeholder — replace it with a real random
string before you rely on this for anything beyond local testing:

```
openssl rand -base64 32
```

`SMTP_*` and `S3_*` are optional. Leave them blank and the app degrades
gracefully:
- No SMTP configured → emails are logged to the console and saved as
  `.html` files under `.local-emails/` instead of being sent.
- No S3 configured → uploaded files (avatars, attachments) are saved to
  `public/uploads/` on local disk instead of a cloud bucket.

Fill in real SMTP credentials and S3-compatible bucket details whenever
you're ready to send real email / use cloud storage — no code changes
needed, just the env vars.

## 4. Run migrations and seed data

```
npm run db:generate   # only needed if you change the schema later
npm run db:migrate    # creates all tables in your database
npm run db:seed       # populates realistic demo data
```

The seed script creates 8 demo users (all with password `password123`),
56 companies, 128 contacts, 112 leads, 64 deals, 24 tasks, notifications,
and 180 audit log entries — carried over from the same mock data used in
Phases 1–3, so the app looks fully populated from the first run.

**Demo login:** `demo@nimbuscrm.com` / `password123` (Super Admin)

## 5. Run the app

```
npm run dev
```

You'll be redirected to `/sign-in`. Sign in with the demo account above, or
create a new one from `/sign-up`.

## What's real vs. still illustrative

Fully wired to the database: authentication (sign up/in/out, password
reset), the Leads/Contacts/Companies/Deals/Tasks list views and their
"create" drawers, notifications (polls every 20s, marks read), audit
logging (every create/delete/login/etc. writes a real row, visible on
Admin → Audit Logs), and file attachments on contact/deal detail pages
(uploads to S3 or local disk).

Still using the seeded mock-data module directly (unchanged from Phase 3,
not yet migrated to live queries): the Deals Kanban board and Forecast
tab, the Pipelines board, Calendar, Inbox, Reports, Workflow builder, and
the Roles/Users/Teams admin pages. These render great demo data but
writes there don't persist yet — a natural next slice of backend work.

## Useful scripts

- `npm run db:studio` — opens Drizzle Studio, a GUI for browsing/editing
  your database directly in the browser.
- `.local-emails/` — check here to see rendered email templates when SMTP
  isn't configured.
