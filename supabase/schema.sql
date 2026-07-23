
-- ----------------------------------------------------------------------------
-- JURISDICTION CITY GRANULARITY
-- Bar admission is province/state-level (Law Society of Ontario covers all
-- of Ontario, not "Toronto" specifically) -- city is added as its own column
-- rather than modeling cities as separate jurisdictions, which would wrongly
-- imply city-specific licensing.
-- ----------------------------------------------------------------------------

alter table public.jurisdictions add column if not exists city text;

do $$
declare
  old_constraint_name text;
begin
  select conname into old_constraint_name
  from pg_constraint
  where conrelid = 'public.jurisdictions'::regclass
    and contype = 'u'
    and array_length(conkey, 1) = 2
  limit 1;

  if old_constraint_name is not null then
    execute format('alter table public.jurisdictions drop constraint %I', old_constraint_name);
  end if;
end $$;

alter table public.jurisdictions
  add constraint jurisdictions_country_region_city_key unique (country_code, region_code, city);

update public.jurisdictions set city = 'Los Angeles' where country_code = 'US' and region_code = 'CA' and city is null;
update public.jurisdictions set city = 'New York City' where country_code = 'US' and region_code = 'NY' and city is null;
update public.jurisdictions set city = 'Chicago' where country_code = 'US' and region_code = 'IL' and city is null;
update public.jurisdictions set city = 'London' where country_code = 'GB' and region_code is null and city is null;

insert into public.jurisdictions (country_code, region_code, region_name, city, bar_association_name) values
  ('CA', 'ON', 'Ontario', 'Toronto', 'Law Society of Ontario'),
  ('CA', 'ON', 'Ontario', 'Ottawa', 'Law Society of Ontario'),
  ('CA', 'BC', 'British Columbia', 'Vancouver', 'Law Society of British Columbia'),
  ('CA', 'BC', 'British Columbia', 'Victoria', 'Law Society of British Columbia'),
  ('CA', 'QC', 'Quebec', 'Montreal', 'Barreau du Quebec'),
  ('CA', 'QC', 'Quebec', 'Quebec City', 'Barreau du Quebec'),
  ('CA', 'AB', 'Alberta', 'Calgary', 'Law Society of Alberta'),
  ('CA', 'AB', 'Alberta', 'Edmonton', 'Law Society of Alberta'),
  ('CA', 'NS', 'Nova Scotia', 'Halifax', 'Nova Scotia Barristers'' Society'),
  ('CA', 'MB', 'Manitoba', 'Winnipeg', 'Law Society of Manitoba'),
  ('AU', 'NSW', 'New South Wales', 'Sydney', 'Law Society of New South Wales')
on conflict (country_code, region_code, city) do nothing;

-- ----------------------------------------------------------------------------
-- JURISDICTION CITY GRANULARITY
-- Bar admission is province/state-level (Law Society of Ontario covers all
-- of Ontario, not "Toronto" specifically) -- city is added as its own column
-- rather than modeling cities as separate jurisdictions, which would wrongly
-- imply city-specific licensing.
-- ----------------------------------------------------------------------------

alter table public.jurisdictions add column if not exists city text;

do $$
declare
  old_constraint_name text;
begin
  select conname into old_constraint_name
  from pg_constraint
  where conrelid = 'public.jurisdictions'::regclass
    and contype = 'u'
    and array_length(conkey, 1) = 2
  limit 1;

  if old_constraint_name is not null then
    execute format('alter table public.jurisdictions drop constraint %I', old_constraint_name);
  end if;
end $$;

alter table public.jurisdictions
  add constraint jurisdictions_country_region_city_key unique (country_code, region_code, city);

update public.jurisdictions set city = 'Los Angeles' where country_code = 'US' and region_code = 'CA' and city is null;
update public.jurisdictions set city = 'New York City' where country_code = 'US' and region_code = 'NY' and city is null;
update public.jurisdictions set city = 'Chicago' where country_code = 'US' and region_code = 'IL' and city is null;
update public.jurisdictions set city = 'London' where country_code = 'GB' and region_code is null and city is null;

insert into public.jurisdictions (country_code, region_code, region_name, city, bar_association_name) values
  ('CA', 'ON', 'Ontario', 'Toronto', 'Law Society of Ontario'),
  ('CA', 'ON', 'Ontario', 'Ottawa', 'Law Society of Ontario'),
  ('CA', 'BC', 'British Columbia', 'Vancouver', 'Law Society of British Columbia'),
  ('CA', 'BC', 'British Columbia', 'Victoria', 'Law Society of British Columbia'),
  ('CA', 'QC', 'Quebec', 'Montreal', 'Barreau du Quebec'),
  ('CA', 'QC', 'Quebec', 'Quebec City', 'Barreau du Quebec'),
  ('CA', 'AB', 'Alberta', 'Calgary', 'Law Society of Alberta'),
  ('CA', 'AB', 'Alberta', 'Edmonton', 'Law Society of Alberta'),
  ('CA', 'NS', 'Nova Scotia', 'Halifax', 'Nova Scotia Barristers'' Society'),
  ('CA', 'MB', 'Manitoba', 'Winnipeg', 'Law Society of Manitoba'),
  ('AU', 'NSW', 'New South Wales', 'Sydney', 'Law Society of New South Wales')
on conflict (country_code, region_code, city) do nothing;
