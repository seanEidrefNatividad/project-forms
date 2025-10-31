'use server'
import { createClient } from "@/lib/supabase/server";
import type { SaveForm, FormAction  } from "@/src/types" 
import { UniqueIdentifier } from "@dnd-kit/core";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function save(data:SaveForm) {
  saveQuestions(data.formId, data['data'])
}

async function saveQuestions(formId: UniqueIdentifier, items: FormAction[]) {
  const supabase = await createClient();
  const questions = items.map(i=>{
    const {id, title, type} = i.data;
    return {
      id, title, type, 'form_id': formId
    }
  })
  //  console.log(questions)
  try {
    const { error } = await supabase
      .from('questions')
      .insert(questions)

    if (error) throw error;

  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : "An error occurred");
  }
}


// export async function saveQuestions(formId: UniqueIdentifier, items: FormAction[]) {
//   const supabase = await createClient();

//   const { error } = await supabase.rpc('save_questions', {
//     p_form_id: formId,
//     // p_questions: [{"op":"addQuestion","data":{"id":'5c29ddf4-c6ad-4e65-912f-5ef7538fe48b',"title":"fasdfaesf", "type": "short-text"}},{"op":"addQuestion","data":{"id":'4016ff0d-403c-40cb-9695-ad8807c81ed1',"title":"fasdfaesf", "type": "short-text"}}]
//   });

//   if (error) {
//     console.error('RPC failed:', error);
//     throw error
//     // throw new Error('Could not save questions');
//   }
// }

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