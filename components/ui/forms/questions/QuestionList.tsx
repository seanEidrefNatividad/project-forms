"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  TouchSensor,
  DragOverlay,
  type CollisionDetection,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { ThemeSwitcher } from "@/components/theme-switcher";

const typeAwareClosestCenter: CollisionDetection = (args) => {
  const { active, droppableContainers } = args;
  const activeType = active.data.current?.type; // "parent" | "child"

  const filtered = droppableContainers.filter(
    (dc) => dc.data?.current?.type === activeType
  );

  // fall back to all if something’s wrong
  return closestCenter({ ...args, droppableContainers: filtered.length ? filtered : droppableContainers });
};

import QuestionItem from "./QuestionItem";
import OptionItem from "../options/OptionItem";

import type { Option, Item } from "../../../../src/types.ts" 

type ActiveQuestion = { type: "question"; item: Item };
type ActiveOption   = { type: "option"; item: Option; parentId: string };
type ActiveDrag = ActiveQuestion | ActiveOption;

export default function QuestionList({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);

  const add = (q: Item) => setItems((prev) => [...prev, q]);
  const insertOption = (parentId: string, o: Option) => {
    setItems(prev =>
      prev.map(q => (q.id === parentId ? { ...q, options: [...q.options, o] } : q))
    );
  };
    
  const [activeItem, setActiveItem] = useState<ActiveDrag | null>(null);

  function handleDragStart(e: DragStartEvent) {

    const { active } = e;
    const ACTIVE_ID = String(active.id);

    const data = active.data.current as
      | { type: "question"; }
      | { type: "option"; parentId?: string }
      | undefined;

    if (!data?.type) {
      console.error("Missing active.data.current.type on drag start");
      return;
    }

    if (data.type === "question") {
      const q = items.find((i) => i.id === ACTIVE_ID);
      if (q) setActiveItem({ type: "question", item: q });
      return;
    }

    // Option: find parent id (prefer the one in data)
    const parentId = active.data.current?.parentId ?? items.find((i) => i.options.some((o) => o.id === ACTIVE_ID))?.id;
    if (!parentId) return;
    const parent = items.find((i) => i.id === parentId);
    const opt = parent?.options.find((o) => o.id === ACTIVE_ID);
    if (opt) setActiveItem({ type: "option", item: opt, parentId });
  }

  const RAND_ID = Date.now();
  // const addQuestion = () => add({ id: `q_${RAND_ID}`, title:'Untitled question', type: "short-text", options: [{id:`o_1${RAND_ID}`, title:"option 1"}, {id:`o_2${RAND_ID}`, title:"option 2"}, {id:`o_3${RAND_ID}`, title:"option 3"}]});
  const addQuestion = () => add({ id: `q_${RAND_ID}`, title:'Untitled question', type: "short-text", options: [{id:`o_1${RAND_ID}`, title:"option 1"}]});
  const addOption = (op:string) => insertOption(op, {id: `o_${RAND_ID}`, title:'Untitled option'});


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const createItemLookup = (items: Item[]) => {
    const itemLookup: Record<string, number> = {};
    items.forEach((item, index) => {
      itemLookup[item.id] = index;
      item.options.forEach((option, optionIndex) => {
        itemLookup[option.id] = optionIndex;
      });
    });
    return itemLookup;
  };

  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const itemLookup = useMemo(() => createItemLookup(items), [items]);

  const handleQuestionDrag = (activeId: string, overId: string) => {
    const oldIndex = itemLookup[activeId];
    const newIndex = itemLookup[overId];
    if (oldIndex === undefined || newIndex === undefined) {
      console.error("Item or option not found in lookup map");
      return;
    }
    setItems((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const handleOptionDrag = (activeId: string, overId: string, parentId: string) => {
    const parentIndex = itemLookup[parentId];
    const childIndexOld = itemLookup[activeId];
    const childIndexNew = itemLookup[overId];

    if (parentIndex === undefined || childIndexOld === undefined || childIndexNew === undefined) {
      console.error("Item or option not found in lookup map");
      return;
    }

    const updatedItems = [...items];
    updatedItems[parentIndex].options = arrayMove(updatedItems[parentIndex].options, childIndexOld, childIndexNew);
    setItems(updatedItems);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveItem(null);

    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const ACTIVE_ID = String(active.id);
    const OVER_ID = String(over.id);

    const ACTIVE_TYPE = active.data.current?.type;
    const OVER_TYPE = over.data.current?.type;
    if (!ACTIVE_TYPE || !OVER_TYPE) {
      console.error("Type for active or over not found in on drag end.");
      return;
    }
    const isQuestion = (type: string) => type == 'question';
    const isOption = (type: string) => type == 'option';

    if (isQuestion(ACTIVE_TYPE) && isQuestion(OVER_TYPE)) {
      handleQuestionDrag(ACTIVE_ID, OVER_ID);
    } else if (isOption(ACTIVE_TYPE) && isOption(OVER_TYPE)) {
      const PARENT_ID = active.data.current?.parentId ?? over.data.current?.parentId;
      if (!PARENT_ID) {
        console.error("Parent id not found in on drag end.");
        return;
      }
      handleOptionDrag(ACTIVE_ID, OVER_ID, PARENT_ID);
    }
  };

  return (
    <>
      <div className="w-full flex justify-end align-items-center p-2 absolute sticky top-0">
        < ThemeSwitcher />
      </div>
      <button onClick={addQuestion} className="mb-4 ml-4 p-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Add question
      </button>
      <DndContext
        sensors={sensors}
        collisionDetection={typeAwareClosestCenter} 
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveItem(null)}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ol style={{ listStyleType: "decimal"}} className="flex gap-4 flex-col">
            {items.map((item) => (
              <QuestionItem key={item.id} item={item} addOption={addOption}/>
            ))}
          </ol>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 180 }}>
          {activeItem?.type === "question" ? (
            //  <QuestionItem item={activeItem.item} addOption={addOption} />
              <div className="drag-overlay rounded-xl border p-3 shadow-2xl opacity-100 scale-100">
                <h4 className="font-medium mb-1">{activeItem.item.title}</h4>
                <p className="text-xs opacity-70">{activeItem.item.options.length} options</p>
              </div>
          ) : activeItem?.type === "option" ? (
            <OptionItem item={activeItem.item} parentId={activeItem.parentId}/>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
