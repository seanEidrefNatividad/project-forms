'use server'
import { createClient } from "@/lib/supabase/server";
import type { SaveForm, FormAction  } from "@/src/types" 
import { UniqueIdentifier } from "@dnd-kit/core";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function save(data:SaveForm) {
  saveQuestions(data.formId, data['data'])
}

export async function saveQuestions(formId: UniqueIdentifier, items: FormAction[]) {
  const supabase = await createClient();

  const { error } = await supabase.rpc('save_questions', {
    p_form_id: formId,
    p_questions: items,
  });

  if (error) {
    console.error('RPC failed:', error);
    throw error
    // throw new Error('Could not save questions');
  }
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