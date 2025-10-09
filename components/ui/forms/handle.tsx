"use client";

import React from "react";
import type {
  DraggableAttributes,
} from "@dnd-kit/core";

export default function Handle({setActivatorNodeRef, attributes, listeners, type}: {
  setActivatorNodeRef: React.RefCallback<HTMLElement>;
  attributes: DraggableAttributes;
  listeners?: string[];
  type:string}) {
  const handle = type === 'option' ? '⋮⋮' : '☰';
  const topMiddle = type === 'question' ? {
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
        fontSize: 20,
        ...topMiddle
      }}
      className="pr-2"
    >
      {handle}
    </button>
  );
}