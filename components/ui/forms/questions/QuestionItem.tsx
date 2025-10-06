"use client";

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OptionList from "../options/OptionList";

type Option = { id: string; title: string; };
type Item = { id: string; title: string; options: Option[]; };

export default function QuestionItem({ item }: { item: Item}) {
  const {
    setNodeRef,
    setActivatorNodeRef, // attach this to the handle
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data:{type:'question'} });

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
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          ☰
        </button>
        <div>
          <span style={{ flex: 1 }}>{item.title}</span>
          <OptionList items={item.options} parentId={item.id} />
        </div>
      </div>
    </li>
  );
}