"use client";

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OptionList from "../options/OptionList";
import Handle from "../handle";

type Option = { id: string; title: string; };
type Item = { id: string; title: string; options: Option[]; };

export default function QuestionItem({ item, addOption }: { item: Item, addOption:(parentId:string)=>void }) {
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
      <div className={`listItemContainer ${isDragging ? 'item__container--dragging' : ''} bg-yellow-200 w-full`}>
        <Handle setActivatorNodeRef={setActivatorNodeRef} attributes={attributes} listeners={listeners} type={'question'}/>
        <div className="w-full bg-green-500">
          <span style={{ flex: 1 }}>{item.title}</span>
          <OptionList items={item.options} parentId={item.id} />
          <button onClick={() => addOption(item.id)} style={{ marginLeft: 'auto' }}>+ Add option</button>
        </div>
      </div>
    </li>
  );
}