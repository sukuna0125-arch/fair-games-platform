create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.generate_referral_code()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8));
    exit when not exists (select 1 from public.referral_codes where code = candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  code text;
begin
  code := public.generate_referral_code();
  insert into public.profiles (id, full_name, username, referral_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, 'player'), '@', 1)),
    concat('player_', substr(replace(new.id::text, '-', ''), 1, 10)),
    code
  ) on conflict (id) do nothing;

  insert into public.wallets (user_id, currency)
  values (new.id, 'USD') on conflict (user_id) do nothing;

  insert into public.referral_codes (owner_user_id, code)
  values (new.id, code) on conflict (owner_user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
