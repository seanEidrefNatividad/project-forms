create or replace function save_questions(
  p_form_id uuid,
  p_questions jsonb
) returns void as $$
begin
  insert into questions (form_id, id, title, type)
  select 
    p_form_id, 
    (item->'data'->>'id')::uuid,
    (item->'data'->>'title')::text,
    (item->'data'->>'type')::text
  from jsonb_array_elements(p_questions) as item;
end;
$$ language plpgsql;