// export const runtime = 'nodejs';

import NoSSRQuestionList from "@/components/ui/forms/forms";
import type { Form } from "@/src/types.ts" 
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from 'next/navigation';

export const revalidate = 0;

export default async function Page(props: { params: Promise<{ id: string }> }) {

  const params = await props.params;
  let formData: Form =  {id:'', title: '', description: '', questions: []};

  const supabase = await createClient();

  const { data: {user}, error: err} = await supabase.auth.getUser();
  if (!user || err) { // not working, only show next thrown errors in dev or do nothing in Development
    redirect("/");
  }

  // 1. Check if user is OWNER
  const { data: ownerData } = await supabase
    .from("forms")
    .select("id")
    .eq("id", params.id)
    .eq("owner_id", user.id)
    .maybeSingle();

  // 2. Check if user is EDITOR (shared permission)
  const { data: editorData } = await supabase
    .from("forms-permissions")
    .select("form_id")
    .eq("form_id", params.id)
    .eq("user_id", user.id)
    .eq("role", "editor")
    .maybeSingle();

  // 3. If neither owner nor editor → deny access
  console.log('access: ', ownerData, editorData)
  if (!ownerData && !editorData) {
    redirect(`/dashboard/${params.id}/access-denied`);
  }

  const { data, error } = await supabase
    .from('forms')
    .select(`
      id, title, description,
      questions:questions (
        id, title, type, 
        options:options (
          id, title
        )
      )
    `)
    .eq('id', params.id)
    .eq('questions.is_deleted', false)
    .eq('questions.options.is_deleted', false)
    .eq('owner_id', user.id)
    .order('position', { foreignTable: 'questions', ascending: true })
    .order('position', { foreignTable: 'questions.options',  ascending: true })
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  formData = {
    id: data.id,
    title: data.title,
    description: data.description,
    questions: (data.questions || []).map((q) => {
      return {
        id: q.id,
        title: q.title,
        type: q.type,
        options: q.options,
      }
    })
  }

  // const id = params.id;
  // const formData = {
  //   questions: [
  //     { id: "q1", title: "Question 1", type:"short-text"},
  //     { id: "q2", title: "Question 2", type:"multiple-choice", options: [{id: "q1o1", title: "option 1"}, {id: "q1o2", title: "option 2"}, {id: "q1o3", title: "option 3"}, {id: "q1o4", title: "option 4"}, {id: "q1o5", title: "option 5"}, {id: "q1o6", title: "option 6"}]},
  //     { id: "q3", title: "Question 3", type:"multiple-choice", options: [{id: "q2o4", title: "option 1"}, {id: "q2o5", title: "option 2"}, {id: "q2o6", title: "option 3"}]},
  //     { id: "q4", title: "Question 4", type:"multiple-choice", options: [{id: "q3o7", title: "option 1"}, {id: "q3o8", title: "option 2"}, {id: "q3o9", title: "option 3"}]},
  //   ] as Item[],
  // };

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="mx-auto max-w-screen-md">
      <NoSSRQuestionList initial={formData} />
    </div>
  );
}