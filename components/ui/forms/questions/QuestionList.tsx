"use client";

import { useMemo, useState, useCallback } from "react";
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
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {save} from "@/lib/actions"

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

import type { Option, Item, Form, QuestionType, ActiveDrag, SaveForm, FormAction, Response } from "@/src/types" 


export default function QuestionList({ initial }: { initial: Form }) {
  const [items, setItems] = useState<Item[]>(initial.questions || []);
  const [formId] = useState(() => initial.id);
  const [isSaving, setIsSaving] = useState(false);

  const uid = useCallback(
    () => crypto?.randomUUID?.(),
    []
  );

  const handleChangeQuestionTitle = useCallback((parentId: UniqueIdentifier, title: string) => {
    setItems(prev =>
      prev.map(q =>
        q.id === parentId
          ? { ...q, title} 
          : q
      )
    )
  },[]);

  const handleChangeOptionTitle = useCallback((parentId: UniqueIdentifier, optionId: UniqueIdentifier, title: string) => {
    setItems(prev =>
      prev.map(q =>
        q.id === parentId && q.options
          ? { ...q, options: q.options.map(o => o.id === optionId ? {...o, title} : o)} 
          : q
      )
    )
  },[]);

  const addQuestion = useCallback((q: Item) => setItems(prev => [...prev, q]), []);

  const addOption = useCallback((parentId: UniqueIdentifier, o: Option) => {
    setItems(prev =>
      prev.map(q =>
        q.type === "multiple-choice" && q.id === parentId
          ? { ...q, options: [...q.options, o] }
          : q
      )
    );
  }, []);

  const handleAddQuestion = () => {
    const id:UniqueIdentifier = uid();
    const newQuestion: Item = { id, title: "Untitled question", type: "short-text" };
    addQuestion(newQuestion) // UI
    const data: FormAction = {
      op: 'addQuestion',
      data: newQuestion
    }
    localSave(data) // local storage
  }
  
  const localSave = (data: FormAction) => {
    const local = localStorage.getItem('forms') ?? '';
    const currentSaved = local ? JSON.parse(local) : [];
    localStorage.setItem('forms', JSON.stringify([...currentSaved, data]));
  }

  async function handleSave () {
    setIsSaving(true)
    const localData = coalesce();
    const saving: SaveForm = {
      formId: formId,
      data: localData
    }
    let data: Response = await save(saving)
    if (data) {
      setIsSaving(false)
      alert(data.message)
    }
  }

  const coalesce = () => {
    const data = JSON.parse(localStorage.getItem('forms') ?? '');
    localStorage.removeItem('forms');
    return data;
  }

  const handleAddOption = useCallback(
    (parentId: UniqueIdentifier) => addOption(parentId, { id: uid(), title: "Untitled option" }),
    [addOption, uid]
  );

  const handleRemoveQuestion = useCallback(
    (id: UniqueIdentifier) => setItems(prev => prev.filter(item => item.id !== id)),
    []
  );

  const handleRemoveOption = useCallback(
    (parentId: UniqueIdentifier, optionId: UniqueIdentifier) => {
      setItems(prev =>
        prev.map(q =>
          q.type === "multiple-choice" && q.id === parentId
            ? { ...q, options: q.options.filter(o => o.id !== optionId) }
            : q
        )
      );
    },
    []
  );

  const handleChangeType = useCallback(
    (id: UniqueIdentifier, type: QuestionType) => {
      setItems(prev =>
        prev.map(p => {
          if (p.id !== id) return p;
          if (type === "multiple-choice") {
            return {
              id: p.id,
              title: p.title,
              type,
              options: [{ id: uid(), title: "Untitled option" }],
            };
          }
          return { id: p.id, title: p.title, type };
        })
      );
    },
    [uid]
  );

    
  const [activeItem, setActiveItem] = useState<ActiveDrag | null>(null);

  function handleDragStart(e: DragStartEvent) {

    const { active } = e;
    const ACTIVE_ID = String(active.id);

    const data = active.data.current as
      | { type: "question"; }
      | { type: "option"; parentId?: UniqueIdentifier }
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

    const parentId = active.data.current?.parentId ?? items.find((i) => i.options?.some((o) => o.id === ACTIVE_ID))?.id;
    if (!parentId) return;
    const parent = items.find((i) => i.id === parentId);
    const opt = parent?.options?.find((o) => o.id === ACTIVE_ID);
    if (opt) setActiveItem({ type: "option", item: opt, parentId });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const createItemLookup = (items: Item[]) => {
    const itemLookup: Record<string, number> = {};
    items.forEach((item, index) => {
      itemLookup[item.id] = index;
      item.options?.forEach((option, optionIndex) => {
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

  const handleOptionDrag = (activeId: string, overId: string, parentId: UniqueIdentifier) => {
    const parentIndex = itemLookup[parentId];
    const childIndexOld = itemLookup[activeId];
    const childIndexNew = itemLookup[overId];

    if (parentIndex === undefined || childIndexOld === undefined || childIndexNew === undefined) {
      console.error("Item or option not found in lookup map");
      return;
    }

    const updatedItems = [...items];
    updatedItems[parentIndex].options = arrayMove(updatedItems[parentIndex].options ?? [], childIndexOld, childIndexNew);
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
      <button onClick={() => console.log(items)}>show items</button>
      <button onClick={handleSave} className="mb-4 ml-4 p-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      <button onClick={handleAddQuestion} className="mb-4 ml-4 p-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
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
              item.type === 'multiple-choice'
              ? <QuestionItem key={item.id} item={item} 
              onAddOption={handleAddOption} 
              onRemoveQuestion={handleRemoveQuestion} 
              onRemoveOption={handleRemoveOption} 
              onChangeType={handleChangeType}
              onChangeQuestionTitle={handleChangeQuestionTitle}
              onChangeOptionTitle={handleChangeOptionTitle}/>
              : <QuestionItem key={item.id} item={item} 
              onRemoveQuestion={handleRemoveQuestion} 
              onChangeType={handleChangeType}
              onChangeQuestionTitle={handleChangeQuestionTitle}
              onChangeOptionTitle={handleChangeOptionTitle}/>
            ))}
          </ol>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 180 }}>
          {activeItem?.type === "question" ? (
            <div className="drag-overlay rounded-xl border p-3 shadow-2xl opacity-100 scale-100">
              <h4 className="font-medium mb-1">{activeItem.item.title}</h4>
              <p className="text-xs opacity-70">{activeItem.item?.options?.length} options</p>
            </div>
          ) : activeItem?.type === "option" ? (
            // <OptionItem item={activeItem.item} parentId={activeItem.parentId} onRemoveOption={handleRemoveOption}/>
             <div className="drag-overlay rounded-xl border p-3 shadow-2xl opacity-100 scale-100">
              <h4 className="font-medium mb-1">{activeItem.item.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
