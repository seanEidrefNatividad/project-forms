'use server'
import { createClient } from "@/lib/supabase/server";
import type { SaveForm, FormAction, Response  } from "@/src/types" 
import { UniqueIdentifier } from "@dnd-kit/core";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function save(data:SaveForm): Promise<Response> {
  return await saveQuestions(data.formId, data['data'])
}

// async function saveQuestions(formId: UniqueIdentifier, items: FormAction[]): Promise<Response> {
//   const supabase = await createClient();
//   const questions = items.map(i=>{
//     const {id, title, type} = i;
//     return {
//       id, title, type, 'form_id': formId
//     }
//   })
//   const { error } = await supabase
//     .from('questions')
//     .insert(questions)

//   if (error) return {message:'fail'}
//   return {message:'success'}
// }

export async function saveQuestions(formId: UniqueIdentifier, items: FormAction[]): Promise<Response> {
  const supabase = await createClient();

  const { error } = await supabase.rpc('save_questions', {
    p_form_id: formId,
    p_actions: items
  });

  if (error) return {message:'fail: ' + error.message}
  return {message:'success'}
}

const uid = () => crypto?.randomUUID?.();

export async function createForm() {
  const supabase = await createClient();
  const id = uid();

  const { error } = await supabase
    .from('forms')
    .insert([{ id }])

  if (error) throw error;

  revalidatePath('/dashboard');
  redirect(`/dashboard/${id}/forms`);
}