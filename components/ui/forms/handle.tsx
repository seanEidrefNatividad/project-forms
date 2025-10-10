"use client";

import React from "react";
import {
  useSortable,
} from "@dnd-kit/sortable";

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
  const topMiddle: React.CSSProperties = type === 'question' ? {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
  } : {};
  return (
    <button
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      title="Drag to reorder"
      style={{
        cursor: "grab",
        touchAction: "none",
        fontSize: 20,
        ...topMiddle
      }}
      className="pr-2"
    >
      {handle}
    </button>
  );
}