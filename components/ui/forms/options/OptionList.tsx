"use client";

import { 
  useMemo,
} from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import OptionItem from "./OptionItem";
import type { Option } from "../../../../src/types.ts" 

export default function OptionList({ items, parentId }: { items: Option[], parentId: string }) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <ol style={{ listStyleType: "none"}}>
        {items.map((item) => (
          <OptionItem key={item.id} item={item} parentId={parentId}/>
        ))}
      </ol>
    </SortableContext>
  );
}