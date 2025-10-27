import NoSSRQuestionList from "@/components/ui/forms/forms";
import type { Item } from "@/src/types.ts" 
export const revalidate = 0;

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  console.log(params)
  // const id = params.id;
  const formData = {
    questions: [
      { id: "q1", title: "Question 1", type:"short-text"},
      { id: "q2", title: "Question 2", type:"multiple-choice", options: [{id: "q1o1", title: "option 1"}, {id: "q1o2", title: "option 2"}, {id: "q1o3", title: "option 3"}, {id: "q1o4", title: "option 4"}, {id: "q1o5", title: "option 5"}, {id: "q1o6", title: "option 6"}]},
      { id: "q3", title: "Question 3", type:"multiple-choice", options: [{id: "q2o4", title: "option 1"}, {id: "q2o5", title: "option 2"}, {id: "q2o6", title: "option 3"}]},
      { id: "q4", title: "Question 4", type:"multiple-choice", options: [{id: "q3o7", title: "option 1"}, {id: "q3o8", title: "option 2"}, {id: "q3o9", title: "option 3"}]},
    ] as Item[],
  };

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="mx-auto max-w-screen-md">
      <NoSSRQuestionList initial={formData.questions} />
    </div>
  );
}