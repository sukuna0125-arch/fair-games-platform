create or replace function public.get_demo_wallet(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare result jsonb;
begin
  select jsonb_build_object('walletId', id, 'userId', user_id, 'balanceMinor', balance_minor, 'currency', currency)
    into result from public.wallets where user_id = p_user_id;
  if result is null then raise exception 'wallet_not_found'; end if;
  return result;
end;
$$;

create or replace function public.credit_demo_wallet(p_user_id uuid, p_amount_minor bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare w public.wallets%rowtype; new_balance bigint;
begin
  if p_amount_minor <= 0 or p_amount_minor > 100000 then raise exception 'invalid_demo_amount'; end if;
  select * into w from public.wallets where user_id = p_user_id for update;
  if not found then raise exception 'wallet_not_found'; end if;
  new_balance := w.balance_minor + p_amount_minor;
  update public.wallets set balance_minor = new_balance, updated_at = now() where id = w.id;
  insert into public.wallet_ledger(wallet_id,user_id,entry_type,amount_minor,balance_after_minor,reason,reference_type,reference_id)
  values(w.id,p_user_id,'bonus',p_amount_minor,new_balance,'demo_credit','demo_wallet',gen_random_uuid());
  return jsonb_build_object('ok',true,'balanceMinor',new_balance,'currency',w.currency);
end;
$$;

create or replace function public.settle_demo_crash_round(
  p_user_id uuid, p_bet_minor bigint, p_payout_minor bigint, p_multiplier numeric,
  p_crashed boolean, p_server_seed text, p_client_seed text, p_seed_hash text, p_nonce bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare w public.wallets%rowtype; g public.game_catalog%rowtype; v public.game_versions%rowtype;
  r_id uuid := gen_random_uuid(); debit_balance bigint; final_balance bigint;
begin
  if p_bet_minor < 10 or p_bet_minor > 10000 or p_payout_minor < 0 then raise exception 'invalid_round'; end if;
  if p_multiplier < 1.01 or p_multiplier > 1000 then raise exception 'invalid_multiplier'; end if;
  select * into w from public.wallets where user_id = p_user_id for update;
  if not found or w.balance_minor < p_bet_minor then raise exception 'insufficient_demo_balance'; end if;
  select * into g from public.game_catalog where slug = 'crash' and status = 'active';
  if not found then raise exception 'crash_game_unavailable'; end if;
  select * into v from public.game_versions where game_id = g.id and status = 'published' order by version desc limit 1;
  if not found then raise exception 'crash_version_unavailable'; end if;
  debit_balance := w.balance_minor - p_bet_minor;
  final_balance := debit_balance + case when p_crashed then 0 else p_payout_minor end;
  update public.wallets set balance_minor = final_balance, updated_at = now() where id = w.id;
  insert into public.game_rounds(id,game_id,game_version_id,user_id,round_status,bet_minor,payout_minor,outcome_json,seed_hash,server_seed,client_seed,nonce,resolved_at,settled_at)
  values(r_id,g.id,v.id,p_user_id,'settled',p_bet_minor,case when p_crashed then 0 else p_payout_minor end,
    jsonb_build_object('multiplier',p_multiplier,'crashed',p_crashed,'payoutMinor',case when p_crashed then 0 else p_payout_minor end),p_seed_hash,p_server_seed,p_client_seed,p_nonce,now(),now());
  insert into public.bets(user_id,round_id,game_id,game_version_id,amount_minor,status)
  values(p_user_id,r_id,g.id,v.id,p_bet_minor,'settled');
  insert into public.wallet_ledger(wallet_id,user_id,entry_type,amount_minor,balance_after_minor,reason,reference_type,reference_id)
  values(w.id,p_user_id,'debit',p_bet_minor,debit_balance,'bet_placed','game_round',r_id);
  if not p_crashed then
    insert into public.wallet_ledger(wallet_id,user_id,entry_type,amount_minor,balance_after_minor,reason,reference_type,reference_id)
    values(w.id,p_user_id,'credit',p_payout_minor,final_balance,'bet_settled','game_round',r_id);
  end if;
  return jsonb_build_object('ok',true,'roundId',r_id,'multiplier',p_multiplier,'crashed',p_crashed,'payoutMinor',case when p_crashed then 0 else p_payout_minor end,'finalBalance',final_balance,'seedHash',p_seed_hash,'serverSeed',p_server_seed,'clientSeed',p_client_seed,'nonce',p_nonce);
end;
$$;

revoke all on function public.get_demo_wallet(uuid) from public, anon, authenticated;
revoke all on function public.credit_demo_wallet(uuid,bigint) from public, anon, authenticated;
revoke all on function public.settle_demo_crash_round(uuid,bigint,bigint,numeric,boolean,text,text,text,bigint) from public, anon, authenticated;
grant execute on function public.get_demo_wallet(uuid) to service_role;
grant execute on function public.credit_demo_wallet(uuid,bigint) to service_role;
grant execute on function public.settle_demo_crash_round(uuid,bigint,bigint,numeric,boolean,text,text,text,bigint) to service_role;

insert into public.game_catalog(id,slug,title,category,description,status,sort_order)
values('00000000-0000-0000-0000-000000000001','crash','Crash','Multiplier','Transparent demo crash rounds','active',1)
on conflict (slug) do update set status='active';
insert into public.game_versions(game_id,version,rtp_bps,house_edge_bps,min_bet_minor,max_bet_minor,currency,status,math_model_version,rng_algorithm_version,published_at)
select id,1,9650,350,10,10000,'USD','published','crash-hmac-v1','hmac-sha256-v1',now()
from public.game_catalog where slug='crash'
on conflict (game_id,version) do nothing;
