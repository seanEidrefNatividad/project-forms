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
    question_id uuid,
    id uuid,
    title text,
    type text,
    "order" jsonb
  )
),
src_arrange_questions as (
  -- pick the arrange action (adjust name if different) and expand its array to (id, pos)
  select (elem)::uuid as id, position
  from src s
  cross join lateral jsonb_array_elements_text(s."order") with ordinality as t(elem, position)
  where s.action = 'arrangeQuestions'
),
add_options as (
  insert into options (question_id, id)
  select src.question_id, src.id
  from src
  where action = 'addOption'
  on conflict (id) do nothing
  returning 1
),
add_question as (
  insert into questions (form_id, id, position)
  select p_form_id, src.id, o.position
  from src
  join src_arrange_questions as o on o.id = src.id
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
addUpdate_options as (
  insert into options (question_id, id, title, position)
  select s.question_id, 
    s.id,  
    s.title,
  from src s
  where action = 'addUpdateOption'
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
update_options as (
  update options o
  set
    title = coalesce(nullif(s.title,''), o.title),
  from src s
  where s.action = 'updateOption'
    and o.question_id = s.question_id
    and o.id = s.id
    and (
      (s.title is not null and btrim(s.title) <> '' and s.title is distinct from o.title)
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
),
delete_options as (
  update options o
  set is_deleted = true
  from src s
  where s.action = 'deleteOption'
    and o.id = s.id
    and o.is_deleted is distinct from true
  returning 1
),
arrange_questions as (
  update public.questions q
  set position = (o.position)::numeric
  from src_arrange_questions o
  where q.form_id = p_form_id
    and q.id = o.id
    and q.position is distinct from (o.position)::numeric
  returning 
    q.id::text as id,
    q.position::text as old_pos,
    o.position::text as new_pos
)
select jsonb_build_object(
  'add',      (select count(*) from add_question),
  'addUpdate',(select count(*) from addUpdate_question),
  'update',   (select count(*) from update_question),
  'removed',  (select count(*) from delete_question),
  'addOption',(select count(*) from add_options),
  'updateOptions',   (select count(*) from update_options),
  'removedOptions',  (select count(*) from delete_options)
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
