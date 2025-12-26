create extension if not exists "pgcrypto";

create table if not exists settings (
  id int primary key default 1,
  relationship_start_date date,
  spotify_track_url text,
  updated_at timestamptz default now(),
  constraint settings_singleton check (id = 1)
);

create table if not exists carousel_images (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  caption text,
  position int not null default 0,
  created_at timestamptz default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  created_at timestamptz default now()
);

create table if not exists timeline_posts (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text,
  content text not null,
  image_path text,
  created_at timestamptz default now()
);

create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text,
  content text not null,
  image_path text,
  slug text unique,
  created_at timestamptz default now()
);

create table if not exists reasons (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  position int not null default 0,
  created_at timestamptz default now()
);

alter table settings enable row level security;
alter table carousel_images enable row level security;
alter table quotes enable row level security;
alter table timeline_posts enable row level security;
alter table letters enable row level security;
alter table reasons enable row level security;

create policy "Public read settings" on settings
  for select using (true);
create policy "Public read carousel" on carousel_images
  for select using (true);
create policy "Public read quotes" on quotes
  for select using (true);
create policy "Public read timeline" on timeline_posts
  for select using (true);
create policy "Public read letters" on letters
  for select using (true);
create policy "Public read reasons" on reasons
  for select using (true);

create policy "Service role insert settings" on settings
  for insert with check (auth.role() = 'service_role');
create policy "Service role update settings" on settings
  for update using (auth.role() = 'service_role');
create policy "Service role delete settings" on settings
  for delete using (auth.role() = 'service_role');

create policy "Service role insert carousel" on carousel_images
  for insert with check (auth.role() = 'service_role');
create policy "Service role update carousel" on carousel_images
  for update using (auth.role() = 'service_role');
create policy "Service role delete carousel" on carousel_images
  for delete using (auth.role() = 'service_role');

create policy "Service role insert quotes" on quotes
  for insert with check (auth.role() = 'service_role');
create policy "Service role update quotes" on quotes
  for update using (auth.role() = 'service_role');
create policy "Service role delete quotes" on quotes
  for delete using (auth.role() = 'service_role');

create policy "Service role insert timeline" on timeline_posts
  for insert with check (auth.role() = 'service_role');
create policy "Service role update timeline" on timeline_posts
  for update using (auth.role() = 'service_role');
create policy "Service role delete timeline" on timeline_posts
  for delete using (auth.role() = 'service_role');

create policy "Service role insert letters" on letters
  for insert with check (auth.role() = 'service_role');
create policy "Service role update letters" on letters
  for update using (auth.role() = 'service_role');
create policy "Service role delete letters" on letters
  for delete using (auth.role() = 'service_role');

create policy "Service role insert reasons" on reasons
  for insert with check (auth.role() = 'service_role');
create policy "Service role update reasons" on reasons
  for update using (auth.role() = 'service_role');
create policy "Service role delete reasons" on reasons
  for delete using (auth.role() = 'service_role');

create index if not exists carousel_position_idx on carousel_images(position);
create index if not exists reasons_position_idx on reasons(position);
create index if not exists timeline_date_idx on timeline_posts(date);
create index if not exists letters_date_idx on letters(date);

insert into storage.buckets (id, name, public)
values ('romantic', 'romantic', true)
on conflict (id) do update set public = true;

create policy "Public read romantic bucket" on storage.objects
  for select using (bucket_id = 'romantic');
create policy "Service role insert romantic bucket" on storage.objects
  for insert with check (bucket_id = 'romantic' and auth.role() = 'service_role');
create policy "Service role update romantic bucket" on storage.objects
  for update using (bucket_id = 'romantic' and auth.role() = 'service_role');
create policy "Service role delete romantic bucket" on storage.objects
  for delete using (bucket_id = 'romantic' and auth.role() = 'service_role');
