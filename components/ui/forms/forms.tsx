"use client";

import dynamic from "next/dynamic";

// If you have Item/Option types exported elsewhere, import them here.
type Option = { id: string; title: string };
type Item = { id: string; title: string; options: Option[] };

const NoSSRQuestionList = dynamic(
  () => import("@/components/ui/forms/questions/QuestionList"),
  { ssr: false }
);

export default function QuestionListClient({ initial }: { initial: Item[] }) {
  return <NoSSRQuestionList initial={initial} />;
}