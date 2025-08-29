create table if not exists articles(
  id bigserial primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  body text not null,
  author text,
  created_at timestamptz not null default now(),
  published boolean not null default true
);
create index if not exists idx_articles_created_at on articles(created_at desc);

