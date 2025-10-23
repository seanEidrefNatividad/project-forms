"use client";

import { 
  useState,
  useRef,
  useEffect,
} from "react";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Handle from "../handle";
import type { OptionItemProps } from "@/src/types" 
import { UniqueIdentifier } from "@dnd-kit/core";

export default function OptionItem({ item, parentId, onRemoveOption, onChangeOptionTitle }: OptionItemProps) {
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

  const [draft, setDraft] = useState(item.title)
  useEffect(()=>{setDraft(item.title)}, [item.title])

  const onChangeTitle = useRef<(parentId:UniqueIdentifier, optionId: UniqueIdentifier, title:string) => void>(onChangeOptionTitle);
  useEffect(()=>{onChangeTitle.current = onChangeOptionTitle}, [onChangeOptionTitle])

  const first = useRef(true);
  const DELAY = 1500;

  useEffect(()=>{
    if (first.current) {first.current = false; return};
    if (draft === item.title) return

    const id = setTimeout(() => {onChangeTitle.current(parentId, item.id, draft)}, DELAY);
    return () => clearTimeout(id);
  }, [draft, parentId, item.id, item.title])

  return (
    <li ref={setNodeRef} style={listItem} className={`${isDragging ? 'item--dragging' : ''}`}>
      <div className="flex">
        <Handle setActivatorNodeRef={setActivatorNodeRef} attributes={attributes} listeners={listeners} type={'option'}/>
        <input className="px-2 rounded-xl bg-input flex-1 py-[5px]" type="text" name="" id="" value={draft} onInput={(e)=>setDraft(e.currentTarget.value)}/>
        <button className="pl-3" onClick={() => onRemoveOption(parentId,item.id)}>X</button>
      </div>
    </li>
  );
}