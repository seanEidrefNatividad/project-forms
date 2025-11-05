-- create or replace function save_questions(
--   p_form_id uuid,
--   p_questions jsonb
-- ) returns void as $$
-- begin
--   insert into questions (form_id, id, title, type)
--   select 
--     p_form_id, 
--     (item->>'id')::uuid,
--     (item->>'title')::text,
--     (item->>'type')::text
--   from jsonb_array_elements(p_questions) as item;
-- end;
-- $$ language plpgsql;

create or replace function save_questions(
  p_form_id uuid,
  p_actions jsonb
) returns jsonb
language sql
security definer
set search_path = public
as $$
with src as (
  select *
  from jsonb_to_recordset(p_actions) as r(
    action text,
    id uuid,
    title text,
    type text
  )
),
add_question as (
  insert into questions (form_id, id)
  select p_form_id, id
  from src
  where action = 'add'
  on conflict (id) do nothing
  returning 1
),
addUpdate_question as (
  insert into questions (form_id, id, title, type)
  select p_form_id, 
    id,  
    title,
    type
  from src
  where action = 'addUpdate'
  on conflict (id) do nothing
  returning 1
),
update_question as (
  update questions q
  set
    title = coalesce(nullif(s.title,''), q.title),
    type  = coalesce(nullif(s.type ,''), q.type)
  from src s
  where s.action = 'update'
    and q.form_id = p_form_id
    and q.id = s.id
    and (
      (s.title is not null and btrim(s.title) <> '' and s.title is distinct from q.title)
      or
      (s.type  is not null and btrim(s.type)  <> '' and s.type  is distinct from q.type)
    )
  returning 1
),
delete_question as (
  update questions q
  set is_deleted = true
  from src s
  where s.action = 'delete'
    and q.form_id = p_form_id
    and q.id = s.id
    and q.is_deleted is distinct from true
  returning 1
)
select jsonb_build_object(
  'add',      (select count(*) from add_question),
  'addUpdate',(select count(*) from addUpdate_question),
  'update',   (select count(*) from update_question),
  'removed',  (select count(*) from delete_question)
);
$$;

-- remove_question as (
--   insert into questions (form_id, id, is_deleted)
--   select
--     p_form_id,
--     id,
--     true
--   from src
--   where action = 'remove'
--   on conflict (id) do update
--     set is_deleted = true,
--   returning 1
-- )

-- update_upsert as (
--   insert into questions (title, type)
--   select
--     id,
--     title,
--     type
--   from src
--   where action = 'update'
--   on conflict (id) do update
--     set title      = coalesce(nullif(excluded.title,''), questions.title),
--         type       = coalesce(nullif(excluded.type ,''), questions.type)
--     where (excluded.title is not null and excluded.title <> '')
--        or (excluded.type  is not null and excluded.type  <> '')
--   returning 1
-- ),
