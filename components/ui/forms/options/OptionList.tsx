"use client";

import { 
  useMemo,
} from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import OptionItem from "./OptionItem";

type Option = { id: string; title: string; };

export default function OptionList({ items, parentId }: { items: Option[], parentId: string }) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <ol style={{ listStyleType: "none", paddingLeft: 24 }}>
        {items.map((item) => (
          <OptionItem key={item.id} item={item} parentId={parentId}/>
        ))}
      </ol>
    </SortableContext>
  );
}