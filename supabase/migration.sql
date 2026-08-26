-- À exécuter dans Supabase : Dashboard > SQL Editor > New query

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('simple', 'counter', 'list')),
  category text not null,
  target integer not null default 0,
  current integer not null default 0,
  entries jsonb not null default '[]'::jsonb,
  completed boolean not null default false,
  year integer not null,
  created_at timestamptz not null default now()
);

create index if not exists goals_user_year_idx on goals (user_id, year);

alter table goals enable row level security;

-- Chacun ne peut voir, créer, modifier et supprimer que ses propres objectifs.
create policy "select own goals" on goals
  for select using (auth.uid() = user_id);

create policy "insert own goals" on goals
  for insert with check (auth.uid() = user_id);

create policy "update own goals" on goals
  for update using (auth.uid() = user_id);

create policy "delete own goals" on goals
  for delete using (auth.uid() = user_id);
