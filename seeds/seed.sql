-- Seed initial brands, categories, and a sample product
-- Safe to run multiple times due to ON CONFLICT where possible

-- Brands
insert into brands (id, slug, name, description, website)
values
  (gen_random_uuid(), 'leon-atelier', 'Léon Atelier', 'Classic-modern menswear & essentials', 'https://example.com')
on conflict (slug) do nothing;

-- Categories
insert into categories (id, slug, name, description)
values
  (gen_random_uuid(), 'tops', 'Tops', 'Shirts, tees, polos'),
  (gen_random_uuid(), 'bottoms', 'Bottoms', 'Trousers, denim'),
  (gen_random_uuid(), 'outerwear', 'Outerwear', 'Coats & jackets')
on conflict (slug) do nothing;

-- Find brand and category ids
with b as (
  select id from brands where slug='leon-atelier'
), c as (
  select id from categories where slug='tops'
)
insert into products (id, slug, title, subtitle, description, brand_id, category_id, active, metadata)
select gen_random_uuid(), 'classic-tee-brown', 'Classic Tee', 'Soft cotton tee', 'Soft cotton in warm earth tones', b.id, c.id, true, '{}'::jsonb
from b, c
on conflict (slug) do nothing;

-- Variant-less product price fallback
insert into prices (id, product_id, currency_code, amount_cents)
select gen_random_uuid(), p.id, 'USD', 4800
from products p where p.slug='classic-tee-brown'
on conflict do nothing;

-- A tiny bit of inventory if a variant exists later (optional)
-- For now we keep inventory tied to variants only; skipping here.
