"use client";

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Option = { id: string; title: string; };

export default function OptionItem({ item, parentId }: { item: Option, parentId: string}) {
  const {
    setNodeRef,
    setActivatorNodeRef, // attach this to the handle
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data:{type:'option', parentId:parentId} });

    const listItem: React.CSSProperties = {
    ...(transform ? { transform: CSS.Transform.toString(transform) } : {}),
    ...(transition ? { transition } : {}),
    willChange: "transform",
    touchAction: "none",
    background: "white",
  };

  return (
    <li ref={setNodeRef} style={listItem} className={`listItem ${isDragging ? 'item--dragging' : ''}`}>
      <div className={`listItemContainer ${isDragging ? 'item__container--dragging' : ''}`}>
        <span style={{ flex: 1 }}>{item.title}</span>

        {/* Drag handle */}
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          title="Drag to reorder"
          style={{
            cursor: "grab",
            border: "none",
            background: "transparent",
            padding: 4,
            lineHeight: 1,
            fontSize: 20,
          }}
        >
          ☰
        </button>
      </div>
    </li>
  );
}