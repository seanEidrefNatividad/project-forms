"use client";

import { useState, useEffect, useRef } from "react";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OptionList from "../options/OptionList";
import Handle from "../handle";
import type { QuestionItemProps, QuestionType } from "@/src/types.ts" 
import { UniqueIdentifier } from "@dnd-kit/core";

export default function QuestionItem({ item, onAddOption, onRemoveQuestion, onRemoveOption, onChangeType, onChangeQuestionTitle, onChangeOptionTitle}: QuestionItemProps) {
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
  };

  const handleRemoveOption = onRemoveOption ?? (() => {});

  const [draft, setDraft] = useState(item.title);
  useEffect(() => setDraft(item.title), [item.title]);

  // keep handler stable for the debounce effect
  const onChangeTitleRef = useRef<(parentId: UniqueIdentifier, title: string) => void>(onChangeQuestionTitle);
  useEffect(() => { onChangeTitleRef.current = onChangeQuestionTitle; }, [onChangeQuestionTitle]);

  // optional: skip initial run
  const first = useRef(true);
  const DELAY = 1500;
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (draft === item.title) return; // no-op

    const id = setTimeout(() => onChangeTitleRef.current(item.id, draft), DELAY);
    return () => clearTimeout(id);
  }, [draft, item.id, item.title]);

  return (
    <li ref={setNodeRef} style={listItem} className={`listItem ${isDragging ? 'item--dragging' : ''} list-inside p-8 border-2 border-solid border-black-800`}>

      <div className="w-[94%] inline-flex gap-1 mb-4">
        <input type="text" value={draft} onInput={(e) => setDraft(e.currentTarget.value)} className="p-2 grow-2 w-[100%]"/>
        <select name="type" id="" className="p-2 max-w-max" value={item.type} onChange={(e) => onChangeType(item.id, e.target.value as QuestionType)}>
          <option value="" disabled>Select type</option>
          <option value="short-text">text</option>
          <option value="multiple-choice">multiple choice</option>
        </select>
      </div>
     
      <Handle setActivatorNodeRef={setActivatorNodeRef} attributes={attributes} listeners={listeners} type={'question'}/>
      <div className="w-full">
        {
          item.type === "multiple-choice" && 
          (
            <>
              <OptionList items={item.options ?? []} parentId={item.id} onRemoveOption={handleRemoveOption} onChangeOptionTitle={onChangeOptionTitle}/> 
              <button onClick={() => onAddOption?.(item.id)} className="ml-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">+ Add option</button>
            </>
          )
        }
        <button onClick={() => onRemoveQuestion(item.id)} className="ml-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">- Remove question</button>
      </div>
    </li>
  );
}