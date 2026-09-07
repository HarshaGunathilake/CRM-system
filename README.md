# Nimbus CRM

A premium, enterprise-grade CRM SaaS UI built with Next.js App Router, TypeScript, Tailwind CSS v4, Radix UI primitives (hand-rolled in shadcn/ui style), Recharts, and Framer Motion.

## Phase 1 (this build)

- Application shell: collapsible sidebar (with tooltips, badges, keyboard shortcut `⌘/Ctrl+B`), top navigation, breadcrumbs
- Command palette (`⌘/Ctrl+K`) with categorized search across contacts, companies, leads, deals, pages
- Full dark / light / system theme system, centralized as CSS custom properties in `src/app/globals.css`
- Notifications center with categories and mark-as-read
- User menu, quick-create menu, theme switcher
- Dashboard: 6 animated KPI cards with sparklines, revenue/pipeline area chart, sales funnel, revenue-by-source donut, drag-and-drop deal pipeline kanban preview, top customers table, live activity feed
- Realistic seeded mock data (128 contacts, 56 companies, 112 leads, 64 deals, tasks, notifications) in `src/lib/mock/data.ts`
- Every sidebar route is wired up; modules beyond Phase 1 scope render a branded "coming soon" placeholder so nothing 404s

## Getting started

```bash
npm install
npm run dev
```
## Admin Login

demo@nimbuscrm.com
password123

Open http://localhost:3000 — it redirects to `/dashboard`.

## Project structure

```
src/
  app/(app)/            route group with the shared shell layout + all pages
  components/ui/        hand-rolled shadcn/ui-style primitives (button, card, dialog, command, etc.)
  components/layout/    sidebar, topbar, command palette, notifications, user menu
  components/dashboard/ KPI cards, charts, funnel, kanban preview, tables, activity feed
  components/providers/ theme + sidebar-collapse context providers
  lib/mock/data.ts      seeded realistic mock data generators
  config/nav.ts         sidebar navigation structure
```

## Next phases (not yet built)

- Phase 2: Leads, Contacts, Companies, Deals, Pipelines, Activities, Tasks, Calendar (full CRUD screens)
- Phase 3: Inbox, Automation builder, Reports, dashboard customization, custom fields, roles & permissions
- Phase 4: Real backend — auth, database, API/server actions, realtime notifications, email integration, file storage
