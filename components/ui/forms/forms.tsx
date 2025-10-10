"use client";

import dynamic from "next/dynamic";

// If you have Item/Option types exported elsewhere, import them here.
import type { Item } from "../../../src/types.ts" 

const NoSSRQuestionList = dynamic(
  () => import("@/components/ui/forms/questions/QuestionList"),
  { ssr: false }
);

export default function QuestionListClient({ initial }: { initial: Item[] }) {
  return <NoSSRQuestionList initial={initial} />;
}