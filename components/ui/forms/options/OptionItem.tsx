"use client";

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Handle from "../handle";
import type { OptionItemProps } from "@/src/types" 

export default function OptionItem({ item, parentId, onDeleteOption }: OptionItemProps) {
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
  };

  return (
    <li ref={setNodeRef} style={listItem} className={`listItem ${isDragging ? 'item--dragging' : ''}`}>
      <div className="flex p-1">
        <Handle setActivatorNodeRef={setActivatorNodeRef} attributes={attributes} listeners={listeners} type={'option'}/>
        <input style={{ flex: 1 }} type="text" name="" id="" readOnly value={item.title +"asdf feasdf asdf asdfasdfasdfasdf asd fasdfasd fasd fasd fasdf asfasd sadfasdf"}/>
        <button className="pl-3" onClick={() => onDeleteOption(parentId,item.id)}>X</button>
      </div>
    </li>
  );
}