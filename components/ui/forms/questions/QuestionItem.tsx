"use client";

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OptionList from "../options/OptionList";
import Handle from "../handle";
import type { QuestionItemProps } from "@/src/types.ts" 

export default function QuestionItem({ item, onAddOption, onRemoveQuestion, onDeleteOption }: QuestionItemProps) {
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

  const handleDelete = onDeleteOption ?? (() => {});

  return (
    <li ref={setNodeRef} style={listItem} className={`listItem ${isDragging ? 'item--dragging' : ''} list-inside p-8 border-2 border-solid border-black-800`}>

      <div className="w-[94%] inline-flex gap-1 mb-4">
        <input type="text" value={item.title + 'afsdfaefafef aef asef aesfeaf '} readOnly className="p-2 grow-2 w-[100%]"/>
        <select name="type" id="" className="p-2 max-w-max">
          <option value="" disabled>Select type</option>
          <option value="short text">text</option>
          <option value="multiple choice">multiple choice</option>
        </select>
      </div>
     
      {/* <div className={`listItemContainer ${isDragging ? 'item__container--dragging' : ''}`}> */}
        <Handle setActivatorNodeRef={setActivatorNodeRef} attributes={attributes} listeners={listeners} type={'question'}/>
        <div className="w-full">
          {
            item.type === "multiple-choice" && 
            (
              <>
                <OptionList items={item.options ?? []} parentId={item.id} onDeleteOption={handleDelete} /> 
                <button onClick={() => onAddOption?.(item.id)} className="ml-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">+ Add option</button>
              </>
            )
          }
          <button onClick={() => onRemoveQuestion(item.id)} className="ml-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">- Remove question</button>
        </div>
      {/* </div> */}
    </li>
  );
}