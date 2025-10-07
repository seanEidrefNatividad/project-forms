"use client";

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Handle from "../handle";

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
       <Handle setActivatorNodeRef={setActivatorNodeRef} attributes={attributes} listeners={listeners} type={'option'}/>
        <span style={{ flex: 1 }}>{item.title} asdf feasdf asdf asdfasdfasdfasdf asd fasdfasd fasd fasd fasdf asfasd sadfasdf</span>
      </div>
    </li>
  );
}