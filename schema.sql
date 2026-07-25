-- ============================================================================
-- LEGAL MARKETPLACE — CORE SCHEMA
-- Run against a fresh Supabase project (SQL Editor, or `supabase db push`
-- against a migration file containing this content).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- ENUMS (Protected with idempotent DROP guards)
-- ----------------------------------------------------------------------------

drop type if exists public.user_role cascade;
create type public.user_role as enum ('client', 'lawyer', 'law_firm_admin', 'platform_admin');

drop type if exists public.verification_status cascade;
create type public.verification_status as enum ('unverified', 'pending', 'pending_review', 'verified', 'approved', 'rejected');

drop type if exists public.case_status cascade;
create type public.case_status as enum ('draft', 'open', 'matched', 'in_progress', 'closed', 'archived');

drop type if exists public.match_status cascade;
create type public.match_status as enum ('pending', 'accepted', 'declined', 'withdrawn');

drop type if exists public.document_type cascade;
create type public.document_type as enum (
  'case_evidence',
  'client_id_verification',
  'lawyer_bar_license',
  'firm_registration',
  'retainer_agreement'
);

drop type if exists public.practice_area cascade;
create type public.practice_area as enum (
  'corporate', 'litigation', 'family', 'immigration', 'real_estate',
  'ip', 'criminal', 'employment', 'tax', 'other'
);

-- ----------------------------------------------------------------------------
-- REFERENCE DATA: JURISDICTIONS
-- One row per routable jurisdiction — a whole country, or a state/province
-- with its own bar association. This is the join point for "route by
-- country + regional bar" matching.
-- ----------------------------------------------------------------------------

create table if not exists public.jurisdictions (
  id uuid primary key default gen_random_uuid(),
  country_code char(2) not null,               -- ISO 3166-1 alpha-2
  region_code text,                            -- state/province code; null = country-wide
  region_name text,
  bar_association_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (country_code, region_code)
);

comment on table public.jurisdictions is
  'Routable legal jurisdictions. A case is tagged with exactly one; a lawyer can hold multiple (lawyer_jurisdictions).';

-- ----------------------------------------------------------------------------
-- PROFILES — extends auth.users, one row per account regardless of role
-- ----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  full_name text not null,
  avatar_url text,
  phone text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- LAW FIRMS — corporate accounts. owner_id is the firm admin who can
-- onboard/manage lawyers under the firm.
-- ----------------------------------------------------------------------------

create table if not exists public.law_firms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  registration_number text,
  country_code char(2) not null,
  verification_status public.verification_status not null default 'pending',
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- LAWYER PROFILES — one per lawyer account. law_firm_id is null for solo
-- practitioners, set for firm-affiliated lawyers.
-- ----------------------------------------------------------------------------

create table if not exists public.lawyer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  law_firm_id uuid references public.law_firms(id) on delete set null,
  bar_license_number text not null,
  years_experience integer not null default 0 check (years_experience >= 0),
  bio text,
  hourly_rate_cents integer check (hourly_rate_cents is null or hourly_rate_cents >= 0),
  verification_status public.verification_status not null default 'pending',
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.lawyer_jurisdictions (
  lawyer_id uuid not null references public.lawyer_profiles(id) on delete cascade,
  jurisdiction_id uuid not null references public.jurisdictions(id) on delete cascade,
  bar_admission_date date,
  primary key (lawyer_id, jurisdiction_id)
);

create table if not exists public.lawyer_practice_areas (
  lawyer_id uuid not null references public.lawyer_profiles(id) on delete cascade,
  practice_area public.practice_area not null,
  primary key (lawyer_id, practice_area)
);

-- ----------------------------------------------------------------------------
-- CASES — the core listing. anonymized_summary is public-safe; full_description
-- and case_documents are locked behind an accepted case_matches row.
-- ----------------------------------------------------------------------------

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  anonymized_summary text not null,
  full_description text not null,
  practice_area public.practice_area not null,
  jurisdiction_id uuid not null references public.jurisdictions(id),
  budget_min_cents integer check (budget_min_cents >= 0),
  budget_max_cents integer check (budget_max_cents is null or budget_max_cents >= budget_min_cents),
  status public.case_status not null default 'draft',
  verification_status public.verification_status not null default 'pending',
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(anonymized_summary, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FORCE COLUMN ALIGNMENT (Ensures columns exist if the table was created by an older migration run)
alter table public.cases add column if not exists status public.case_status not null default 'draft';
alter table public.cases add column if not exists verification_status public.verification_status not null default 'pending';

create index if not exists cases_search_idx on public.cases using gin (search_vector);
create index if not exists cases_jurisdiction_idx on public.cases (jurisdiction_id);
create index if not exists cases_open_idx on public.cases (status) where status = 'open';
create index if not exists cases_client_idx on public.cases (client_id);

create table if not exists public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  storage_path text not null,
  document_type public.document_type not null,
  file_name text not null,
  file_size_bytes integer not null check (file_size_bytes > 0),
  mime_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists case_documents_case_idx on public.case_documents (case_id);

-- case_matches is the unlock mechanism: a lawyer requests a case, the client
-- accepts, and only then does full case data + messaging become visible.
create table if not exists public.case_matches (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  lawyer_id uuid not null references public.lawyer_profiles(id) on delete cascade,
  status public.match_status not null default 'pending',
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  decline_reason text,
  unique (case_id, lawyer_id)
);

create index if not exists case_matches_case_idx on public.case_matches (case_id);
create index if not exists case_matches_lawyer_idx on public.case_matches (lawyer_id);

create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  case_match_id uuid not null unique references public.case_matches(id) on delete cascade,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body_encrypted text not null,  -- AES-256-GCM ciphertext, see lib/crypto/message-encryption.ts
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists messages_thread_idx on public.messages (thread_id, created_at);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_table text not null,
  target_id uuid not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
-- ----------------------------------------------------------------------------
-- HELPER FUNCTIONS — security definer so they can read RLS-protected tables
-- regardless of the calling user's own row access, without opening a
-- recursion hole. Reused across policies below.
-- ----------------------------------------------------------------------------

-- FORCE COLUMN ALIGNMENT (Ensures columns exist for older versions of pre-existing tables)
alter table public.profiles add column if not exists role public.user_role not null default 'client';
alter table public.lawyer_profiles add column if not exists verification_status public.verification_status not null default 'pending_review';
alter table public.case_matches add column if not exists status public.match_status not null default 'pending';

create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'platform_admin'
  );
$$;

-- Named for what it actually checks: real access to browse/request cases,
-- which the "instant access, honestly labeled" model grants at
-- pending_review, not only approved. This is NOT the same thing as "bar
-- confirmed" — anywhere that distinction matters (client-facing badging),
-- read verification_status directly instead of calling this function.
create or replace function public.has_board_access()
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.lawyer_profiles
    where id = auth.uid() and verification_status in ('pending_review', 'approved')
  );
$$;

create or replace function public.has_accepted_match(p_case_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.case_matches
    where case_id = p_case_id
      and lawyer_id = auth.uid()
      and status = 'accepted'
  );
$$;
-- ----------------------------------------------------------------------------
-- TRIGGERS
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.law_firms;
create trigger set_updated_at before update on public.law_firms
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.lawyer_profiles;
create trigger set_updated_at before update on public.lawyer_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.cases;
create trigger set_updated_at before update on public.cases
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when someone signs up. Role is read from
-- auth signup metadata (set by your sign-up form), defaulting to 'client'.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'client'),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- When a client accepts a match, spin up the message thread and flip the
-- case out of the open pool. This is the seam between "matching" and
-- "secure communication" in the workflow.
create or replace function public.handle_match_accepted()
returns trigger language plpgsql security definer as $$
begin
if new.status = 'accepted' and old.status is distinct from 'accepted' then
    insert into public.message_threads (case_match_id)
    values (new.id)
    on conflict (case_match_id) do nothing;

    update public.cases set status = 'matched'
    where id = new.case_id and status = 'open';
  end if;
  return new;
end;
$$;

drop trigger if exists on_match_accepted on public.case_matches;
create trigger on_match_accepted
  after update on public.case_matches
  for each row execute function public.handle_match_accepted();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------

-- Column alignment guard to prevent 42703 error on evaluation
alter table public.law_firms add column if not exists verification_status text not null default 'pending';

alter table public.jurisdictions enable row level security;
alter table public.profiles enable row level security;
alter table public.law_firms enable row level security;
alter table public.lawyer_profiles enable row level security;
alter table public.lawyer_jurisdictions enable row level security;
alter table public.lawyer_practice_areas enable row level security;
alter table public.cases enable row level security;
alter table public.case_documents enable row level security;
alter table public.case_matches enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists "jurisdictions_public_read" on public.jurisdictions;
create policy "jurisdictions_public_read" on public.jurisdictions
  for select using (true);

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "law_firms_select" on public.law_firms;
create policy "law_firms_select" on public.law_firms
  for select using (
    owner_id = auth.uid()
    or public.is_admin()
    or verification_status = 'verified'
  );

drop policy if exists "law_firms_insert_own" on public.law_firms;
create policy "law_firms_insert_own" on public.law_firms
  for insert with check (owner_id = auth.uid());

drop policy if exists "law_firms_update_own_or_admin" on public.law_firms;
create policy "law_firms_update_own_or_admin" on public.law_firms
  for update using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "lawyer_profiles_select" on public.lawyer_profiles;
create policy "lawyer_profiles_select" on public.lawyer_profiles
  for select using (
    id = auth.uid()
    or public.is_admin()
    or verification_status = 'approved'
    or (law_firm_id is not null and law_firm_id in (
      select id from public.law_firms where owner_id = auth.uid()
    ))
    -- A client can see the status of any lawyer who has requested one of
    -- their own cases, regardless of that lawyer's status — this is what
    -- lets the client see "self-reported, not yet confirmed" before they
    -- accept a match, not just after.
    or exists (
      select 1 from public.case_matches cm
      join public.cases c on c.id = cm.case_id
      where cm.lawyer_id = lawyer_profiles.id and c.client_id = auth.uid()
    )
  );

drop policy if exists "lawyer_profiles_insert_self" on public.lawyer_profiles;
create policy "lawyer_profiles_insert_self" on public.lawyer_profiles
  for insert with check (id = auth.uid());
drop policy if exists "lawyer_profiles_update" on public.lawyer_profiles;
create policy "lawyer_profiles_update" on public.lawyer_profiles
  for update using (
    id = auth.uid()
    or public.is_admin()
    or (law_firm_id is not null and law_firm_id in (
      select id from public.law_firms where owner_id = auth.uid()
    ))
  );

drop policy if exists "lawyer_jurisdictions_select" on public.lawyer_jurisdictions;
create policy "lawyer_jurisdictions_select" on public.lawyer_jurisdictions
  for select using (true);

drop policy if exists "lawyer_jurisdictions_write" on public.lawyer_jurisdictions;
create policy "lawyer_jurisdictions_write" on public.lawyer_jurisdictions
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

drop policy if exists "lawyer_practice_areas_select" on public.lawyer_practice_areas;
create policy "lawyer_practice_areas_select" on public.lawyer_practice_areas
  for select using (true);

drop policy if exists "lawyer_practice_areas_write" on public.lawyer_practice_areas;
create policy "lawyer_practice_areas_write" on public.lawyer_practice_areas
  for all using (lawyer_id = auth.uid() or public.is_admin())
  with check (lawyer_id = auth.uid() or public.is_admin());

-- CASES: the core two-tier privacy rule. Full-row SELECT is limited to the
-- owning client, an admin, or a lawyer with an *accepted* match. Anyone else
-- (including unmatched verified lawyers) reads through the case_listings
-- view below instead, which exposes only the safe columns.
drop policy if exists "cases_select_full" on public.cases;
create policy "cases_select_full" on public.cases
  for select using (
    client_id = auth.uid()
    or public.is_admin()
    or public.has_accepted_match(id)
  );

drop policy if exists "cases_insert_own" on public.cases;
create policy "cases_insert_own" on public.cases
  for insert with check (client_id = auth.uid());

drop policy if exists "cases_update_own_or_admin" on public.cases;
create policy "cases_update_own_or_admin" on public.cases
  for update using (client_id = auth.uid() or public.is_admin());

drop policy if exists "case_documents_select" on public.case_documents;
create policy "case_documents_select" on public.case_documents
  for select using (
    public.is_admin()
    or public.has_accepted_match(case_id)
    or exists (select 1 from public.cases c where c.id = case_id and c.client_id = auth.uid())
  );

drop policy if exists "case_documents_insert" on public.case_documents;
create policy "case_documents_insert" on public.case_documents
  for insert with check (
    uploaded_by = auth.uid()
    and exists (select 1 from public.cases c where c.id = case_id and c.client_id = auth.uid())
  );

drop policy if exists "case_matches_select" on public.case_matches;
create policy "case_matches_select" on public.case_matches
  for select using (
    lawyer_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.cases c where c.id = case_id and c.client_id = auth.uid())
  );

drop policy if exists "case_matches_insert_lawyer_request" on public.case_matches;
create policy "case_matches_insert_lawyer_request" on public.case_matches
  for insert with check (
    lawyer_id = auth.uid()
    and public.has_board_access()
  );

-- Single UPDATE policy (deliberately not split across multiple permissive
-- policies — see the code review notes on why that combination is easy to
-- get wrong). Clients may move their own case's matches to any status;
-- lawyers may only withdraw their own still-pending request.
drop policy if exists "case_matches_update" on public.case_matches;
create policy "case_matches_update" on public.case_matches
  for update using (
    (lawyer_id = auth.uid() and status = 'pending')
    or exists (select 1 from public.cases c where c.id = case_id and c.client_id = auth.uid())
  )
  with check (
    exists (select 1 from public.cases c where c.id = case_id and c.client_id = auth.uid())
    or (lawyer_id = auth.uid() and status = 'withdrawn')
  );

drop policy if exists "message_threads_select" on public.message_threads;
create policy "message_threads_select" on public.message_threads
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.case_matches cm
      join public.cases c on c.id = cm.case_id
      where cm.id = case_match_id
        and (cm.lawyer_id = auth.uid() or c.client_id = auth.uid())
        and cm.status = 'accepted'
    )
  );

drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.message_threads mt
      join public.case_matches cm on cm.id = mt.case_match_id
      join public.cases c on c.id = cm.case_id
      where mt.id = thread_id
        and (cm.lawyer_id = auth.uid() or c.client_id = auth.uid())
    )
  );

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.message_threads mt
      join public.case_matches cm on cm.id = mt.case_match_id
      join public.cases c on c.id = cm.case_id
      where mt.id = thread_id
        and (cm.lawyer_id = auth.uid() or c.client_id = auth.uid())
        and cm.status = 'accepted'
    )
  );

drop policy if exists "audit_log_admin_only" on public.audit_log;
create policy "audit_log_admin_only" on public.audit_log
  for select using (public.is_admin());

-- ----------------------------------------------------------------------------
-- PUBLIC CASE LISTINGS — column-level privacy via a view, since Postgres RLS
-- is row-scoped, not column-scoped. This view intentionally does NOT set
-- `security_invoker`; it must run with the view owner's access to `cases`
-- ----------------------------------------------------------------------------
-- PUBLIC CASE LISTINGS — column-level privacy via a view, since Postgres RLS
-- is row-scoped, not column-scoped. This view intentionally does NOT set
-- `security_invoker`; it must run with the view owner's access to `cases`
-- ----------------------------------------------------------------------------
-- Bypassing the base table's RLS precisely because its job is to expose a
-- narrower, pre-redacted slice of `cases` to a *wider* audience (any
-- verified lawyer) than the base table's own RLS would ever allow. The
-- WHERE clause below — not RLS — is this view's security boundary. If a
-- future migration "helpfully" adds security_invoker = true here, every
-- unmatched lawyer will silently see zero cases on the board.
-- ----------------------------------------------------------------------------

-- Column alignment guards to prevent view execution failures (42703)
alter table public.cases add column if not exists verification_status text not null default 'unverified';
alter table public.cases add column if not exists practice_area text;
alter table public.cases add column if not exists anonymized_summary text;

create or replace view public.case_listings as
select
  id,
  title,
  anonymized_summary,
  practice_area,
  jurisdiction_id,
  budget_min_cents,
  budget_max_cents,
  status,
  created_at
from public.cases
where status = 'open'
  and verification_status = 'verified'
  and (public.has_board_access() or public.is_admin());

grant select on public.case_listings to authenticated;

-- ----------------------------------------------------------------------------
-- STORAGE — the `case-documents` bucket must mirror case_documents access.
-- Create the bucket (private) via the dashboard or supabase-js first, then
-- apply these policies. Objects are uploaded at `${case_id}/${filename}`;
-- storage.foldername() splits that path so we can reuse has_accepted_match().
-- ----------------------------------------------------------------------------

drop policy if exists "case_documents_storage_select" on storage.objects;
create policy "case_documents_storage_select" on storage.objects
  for select using (
    bucket_id = 'case-documents'
    and (
      public.is_admin()
      or public.has_accepted_match((storage.foldername(name))[1]::uuid)
      or exists (
        select 1 from public.cases c
        where c.id = (storage.foldername(name))[1]::uuid
          and c.client_id = auth.uid()
      )
    )
  );

drop policy if exists "case_documents_storage_insert" on storage.objects;
create policy "case_documents_storage_insert" on storage.objects
  for insert with check (
    bucket_id = 'case-documents'
    and exists (
      select 1 from public.cases c
      where c.id = (storage.foldername(name))[1]::uuid
        and c.client_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Added for the self-serve /verify flow (app/verify/page.tsx). Raw,
-- self-reported text for now — not yet reconciled against the structuredrun n
-- `jurisdictions` table. An admin review pass should migrate these into
-- real lawyer_jurisdictions rows before this is trusted for production
-- matching. Uses `if not exists` so re-running this file is safe.
-- ----------------------------------------------------------------------------

alter table public.lawyer_profiles 
  add column if not exists self_reported_jurisdiction text,
  add column if not exists bar_admission_year integer
    check (bar_admission_year is null or bar_admission_year between 1900 and 2100);

-- ============================================================================
-- LAWYER VERIFICATION HARDENING
-- Replaces the instant self-verify flow with a real pending-review state,
-- and closes an RLS hole where a lawyer could set their own status straight
-- to 'approved' via a direct Supabase call, bypassing the UI/server action
-- entirely. This is the actual production-readiness fix — the column
-- rename alone would not have been.
-- ============================================================================

-- Guarding type re-creation to allow iterative migrations without crashing
drop type if exists public.lawyer_verification_status cascade;
create type public.lawyer_verification_status as enum ('unverified', 'pending_review', 'approved');

-- The actual security fix: a lawyer (or their firm admin) may write to
-- their own row, but the resulting status may never be 'approved' unless
-- the actor is a platform admin. Covers both INSERT (first submission) and
-- UPDATE (resubmission), since upsert can hit either path under RLS.
drop policy if exists "lawyer_profiles_insert_self" on public.lawyer_profiles;
create policy "lawyer_profiles_insert_self" on public.lawyer_profiles
  for insert with check (
    public.is_admin() or (id = auth.uid() and verification_status <> 'approved')
  );

drop policy if exists "lawyer_profiles_update" on public.lawyer_profiles;
create policy "lawyer_profiles_update" on public.lawyer_profiles
  for update using (
    id = auth.uid()
    or public.is_admin()
    or (law_firm_id is not null and law_firm_id in (
      select id from public.law_firms where owner_id = auth.uid()
    ))
  )
  with check (
    public.is_admin()
    or (
      (id = auth.uid() or (law_firm_id is not null and law_firm_id in (
        select id from public.law_firms where owner_id = auth.uid()
      )))
      and verification_status <> 'approved'
    )
  );

-- Starter jurisdictions so the client intake form's dropdown isn't empty.
insert into public.jurisdictions (country_code, region_code, region_name, bar_association_name) values
  ('US', 'CA', 'California', 'State Bar of California'),
  ('US', 'NY', 'New York', 'New York State Bar Association'),
  ('US', 'TX', 'Texas', 'State Bar of Texas'),
  ('US', 'IL', 'Illinois', 'Illinois State Bar Association'),
  ('GB', null, 'England and Wales', 'Solicitors Regulation Authority'),
  ('CA', null, 'Canada', 'Federation of Law Societies of Canada')
on conflict (country_code, region_code) do nothing;

-- ----------------------------------------------------------------------------
-- AI TRIAGE SUPPORT
-- Adds a 'rejected' outcome (safe to automate — it grants nothing) and a
-- place to store the triage agent's notes for whoever reviews a
-- 'pending_review' submission. Does NOT add any path to 'approved' — the
-- self-approval RLS block added earlier still applies unchanged.
-- ----------------------------------------------------------------------------