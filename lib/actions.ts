'use server'
import { createClient } from "@/lib/supabase/server";
import type { SaveForm, Item  } from "@/src/types" 
import { UniqueIdentifier } from "@dnd-kit/core";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AddQuestionSchema } from "@/src/types";

export async function save(data:SaveForm) {
  data['data'].forEach(d => {
    if (d.op === 'addQuestion') {
      saveQuestion(d.data, data.formId);
    }
  });
}

async function saveQuestion(newQuestion: Item, formId:UniqueIdentifier) {
  const supabase = await createClient();

  const q:AddQuestionSchema = {
    id: newQuestion.id,
    title: newQuestion.title,
    type: newQuestion.type, 
    form_id: formId,
  };

  try {
    const { data, error } = await supabase
      .from('questions')
      .insert(q)
      .select('id')
      .limit(1)

    if (error) throw error;

    const {id} = data[0]
    if (id) {
      console.log(id)
    }

  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : "An error occurred");
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