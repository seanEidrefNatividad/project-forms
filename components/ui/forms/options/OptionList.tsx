"use client";

import { 
  useMemo,
} from "react";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import OptionItem from "./OptionItem";
import type { OptionListProps } from "@/src/types" 

export default function OptionList({ items, parentId, onRemoveOption, onChangeOptionTitle }: OptionListProps) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <ul className="list-none gap-2 flex flex-col pb-3">
        {items.map((item) => (
          <OptionItem key={item.id} item={item} parentId={parentId} onRemoveOption={onRemoveOption} onChangeOptionTitle={onChangeOptionTitle}/>
        ))}
      </ul>
    </SortableContext>
  );
}