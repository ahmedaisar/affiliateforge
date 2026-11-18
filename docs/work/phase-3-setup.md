# Phase 3 — what the owner must create outside this repo

Everything in Phase 3 (`docs/product/plan.md`) needs accounts and keys that only you can
create. This file is the checklist and the expected shape of what the agent will then build.

## 1. Clerk application (authentication + organizations)

- Create at <https://dashboard.clerk.com> → **New application** → enable **Email + password**
  and turn **Organizations** on for the app.
- Copy: **Publishable key** (`pk_test_…`), **Secret key** (`sk_test_…`).
- The workspace model is `organization`; a solo operator logs in as an organization of one.
- Nothing about your live Clerk instance is needed yet; develop against the test keys only.

## 2. Supabase project (database)

- Create at <https://supabase.com> → **New project** (a free plan works).
- Copy: **Project URL** (`https://…supabase.co`), **anon public key**, **service_role key**
  (keep the service role secret out of the client bundle entirely; it is only for the agent).
- The schema will carry `workspaces`, `memberships`, `stores`, `catalogue`, `price_snapshots`
  — each with `workspace_id` and a default-deny RLS policy (the three-function discipline
  from the harness: resolve-from-URL, require-member, require-workspace).

## 3. Decisions needed before code

- **Domain**: `cairn.example.com` or your own — the front door lands at `/`, `/stores` is the
  member home after sign-in.
- **Front-door wording**: the bold claim on `/` ("Three agents research the niche…") is your
  call to keep or soften before real strangers see it.
- **Legal**: approve, or send corrections to, `src/pages/terms.tsx` and
  `src/pages/privacy.tsx` (both are honest drafts, not products).
- **Storage of the operator's GitHub/Vercel tokens**: Phase 4 needs your GitHub fine-grained
  PAT (repository creation + push) and your Vercel token; both live encrypted in the server,
  never in the client bundle.

## What I will do the moment you provide the keys

1. Verify the keys against Clerk's and Supabase's health endpoints (one curl each).
2. Write the schema migration (`supabase/migrations/0001_init.sql`) with RLS; you run it on
   the development project (or I run it with your permission, spelling out the project target).
3. Wire Clerk's client SDK into the SPA; sign-in lands on `/stores`; audit log shows you as
   the first member of your organization.
4. Prove the boundary: two different Clerk users cannot see each other's data (a cross-tenant
   test).
5. Promote the local SQLite backend routes (`server/index.mjs`) behind the API to Supabase;
   the front end keeps calling `/api` unchanged.

Expected effort: one focused session once keys exist.


---

## Note added 18 Nov 2026

The public demo on the current quick-tunnel link is deliberately read-only:
no POST/PUT/DELETE can mutate the seeded demo. A stranger with the link sees
the banner, the disabled New Store control, and the seeded portfolio — nothing
else. This is the correct posture for a pre-auth demo; it is **not** the right
posture for a paying workspace. Phase 3 replaces it entirely.
