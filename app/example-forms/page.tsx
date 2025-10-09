import NoSSRExample from "@/components/ui/example-forms/forms";

export default async function Page() {
  const formData = {
    questions: [
      { id: "q-q1", title: "Question 1", type:"short-text", options: [{id: "o-q1-o1", title: "option 1"}, {id: "o-q1-o2", title: "option 2"}, {id: "o-q1-o3", title: "option 3"}, {id: "o-q1-o4", title: "option 4"}, {id: "o-q1-o5", title: "option 5"}, {id: "o-q1-o6", title: "option 6"}]},
      { id: "q-q2", title: "Question 2", type:"short-text", options: [{id: "o-q2-o4", title: "option 1"}, {id: "o-q2-o5", title: "option 2"}, {id: "o-q2-o6", title: "option 3"}]},
      { id: "q-q3", title: "Question 3", type:"short-text", options: [{id: "o-q3-o7", title: "option 1"}, {id: "o-q3-o8", title: "option 2"}, {id: "o-q3-o9", title: "option 3"}]},
    ],
  };

  return (
    <div className="container mx-auto max-w-screen-md md:p-6">
      <h1 className="p-2">Sortable with Handle</h1>
      <NoSSRExample initial={formData.questions} />
    </div>
  );
}