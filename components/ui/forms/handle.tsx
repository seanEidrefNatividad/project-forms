"use client";

import React from "react";
import {
  useSortable,
} from "@dnd-kit/sortable";
import clsx from 'clsx';

// Derive the exact types from your installed dnd-kit
type SortableReturn = ReturnType<typeof useSortable>;
type SortableAttrs = SortableReturn["attributes"];
type SortableListeners = SortableReturn["listeners"];
type SortableActivatorRef = SortableReturn["setActivatorNodeRef"];

type HandleProps = {
  setActivatorNodeRef: SortableActivatorRef;
  attributes: SortableAttrs;
  listeners?: SortableListeners; // can be undefined
  type: "question" | "option" | string;
};

export default function Handle({
  setActivatorNodeRef,
  attributes,
  listeners,
  type,
}: HandleProps) {
  const handle = type === 'option' ? '⋮⋮' : '☰';
  const handleClass = clsx(
    'cursor-grab touch-none',{
      'text-[16px] absolute top-0 left-1/2 -translate-x-1/2': (type === 'question'),
      'text-[20px] mr-2': type !== 'question'
    }
  )
  return (
    <button
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      title="Drag to reorder"
      className={handleClass}
    >
      {handle}
    </button>
  );
}