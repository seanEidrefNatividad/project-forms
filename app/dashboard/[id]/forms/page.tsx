import NoSSRQuestionList from "@/components/ui/forms/forms";
import type { Form } from "@/src/types.ts" 
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const params = await props.params;
  let formData: Form = { id: '', title: '', description: '', questions: [] };

  try {
    const { data:form, error:formError } = await supabase
      .from('forms')
      .select('id, title, description')
      .eq('id', params.id)
      .single()

    if (formError) throw formError;
    if (!form) throw new Error('Form not found.');

    const { data:questions, error:qError } = await supabase
      .from('questions')
      .select()
      .eq('form_id', form.id)

    if (qError) throw qError;

    formData = {
      ...form,
      questions: (questions || []).map((q) => {
        return {
          id: q.id,
          title: q.title,
          type: q.type,
          options: q.options || [],
        }
      })
    }
  } catch (error: unknown) {
    alert(error instanceof Error ? error.message : "An error occurred");
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
      <NoSSRQuestionList initial={formData.questions ?? []} />
    </div>
  );
}