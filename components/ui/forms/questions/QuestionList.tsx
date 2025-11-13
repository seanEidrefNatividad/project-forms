"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
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
import useNetworkStatus from '@/hooks/useNetworkStatus'; // Adjust path as needed

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

import type { Option, Item, Form, QuestionType, ActiveDrag, SaveForm, FormAction, Response, Orders } from "@/src/types" 


export default function QuestionList({ initial }: { initial: Form }) {
  const [items, setItems] = useState<Item[]>(initial.questions || []);
  const [formId] = useState(() => initial.id);
  const [isSaving, setIsSaving] = useState(false);
  const isOnline = useNetworkStatus();
  const arrangeQuestions = useRef(false);
  const arrangeOptions = useRef(false);
  const arrangeOptionsQuestionIds = useRef<UniqueIdentifier[]>([]);
  const didMount = useRef(false);
  const timerRef = useRef<number | null>(null);

  const uid = useCallback(
    () => crypto?.randomUUID?.(),
    []
  );

  const addQuestion = useCallback((q: Item) => setItems(prev => [...prev, q]), []);

  const addOption = useCallback((parentId: UniqueIdentifier, o: Option) => {
    setItems(prev =>
      prev.map(q =>
        q.type === "multiple-choice" && q.id === parentId
          ? { ...q, options: q.options ? [...q.options, o] : [o] }
          : q
      )
    );
  }, []);

  const localSaveRawFormActions = useCallback((data: FormAction) => {
    const local = localStorage.getItem('rawFormActions') ?? '';
    const currentSaved = local ? JSON.parse(local) : [];
    localStorage.setItem('rawFormActions', JSON.stringify([...currentSaved, data]));
  }, []);

  const arrangeOpt = useCallback((items:Item[]) => {
    const temp = arrangeOptionsQuestionIds.current.map(id => ({
      question_id: id,
      option_order: items.find(i => i.id === id)?.options?.map(o => o.id) ?? []
    }));

    const data: FormAction = {
      action: 'arrangeOptions',
      order: temp
    }
    localSaveRawFormActions(data) 
   
  },[localSaveRawFormActions])

  const arrange = useCallback((items:Item[]) => {
    const data: FormAction = {
      action: 'arrangeQuestions',
      order: items.map((i) => i.id)
    }
    localSaveRawFormActions(data) 
  },[localSaveRawFormActions])

  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return; } // skip initial render
    if (arrangeQuestions.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        arrangeQuestions.current = false;         // consume the flag
        arrange(items);           // run with latest items
        timerRef.current = null;
      }, 150);                                // adjust debounce ms as you like

      // cleanup if items changes again before timeout or on unmount
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
    if (arrangeOptions.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        arrangeOptions.current = false;         // consume the flag
        arrangeOpt(items);           // run with latest items
        arrangeOptionsQuestionIds.current = [];
        timerRef.current = null;
      }, 150);                                // adjust debounce ms as you like

      // cleanup if items changes again before timeout or on unmount
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [items, arrange, arrangeOpt]);


  const handleAddOption = useCallback((parentId: UniqueIdentifier) => {
    const id:UniqueIdentifier = uid();
    const newOption: Option = { id, title: "Untitled Option"};
    addOption(parentId, newOption) // ui
    const data: FormAction = {
      action: 'addOption',
      question_id: parentId,
      ...newOption
    }
    localSaveRawFormActions(data) // local storage
    triggerArrangeOptions(parentId)

  const handleAddQuestion = () => {
    const id:UniqueIdentifier = uid();
    const newQuestion: Item = { id, title: "Untitled question", type: "short-text" };
    addQuestion(newQuestion) // UI
    const data: FormAction = {
      action: 'add',
      ...newQuestion
    }
    localSaveRawFormActions(data) // local storage
    triggerArrangeQuestions()
  }

  const changeQuestionTitle = useCallback((parentId: UniqueIdentifier, title: string) => {
    setItems(prev =>
      prev.map(q =>
        q.id === parentId
          ? { ...q, title} 
          : q
      )
    )
  },[]);
  const handleChangeQuestionTitle = useCallback((parentId: UniqueIdentifier, title: string) => {
    changeQuestionTitle(parentId, title) // UI
    const data: FormAction = {
      action: 'update',
      id: parentId,
      title,
    }
    localSaveRawFormActions(data) // local storage
  },[changeQuestionTitle, localSaveRawFormActions]);

  const changeOptionTitle = useCallback((parentId: UniqueIdentifier, optionId: UniqueIdentifier, title: string) => {
    setItems(prev =>
      prev.map(q =>
        q.id === parentId && q.options
          ? { ...q, options: q.options.map(o => o.id === optionId ? {...o, title} : o)} 
          : q
      )
    )
  },[]);

  const handleChangeOptionTitle = useCallback((parentId: UniqueIdentifier, optionId: UniqueIdentifier, title: string) => {
    changeOptionTitle(parentId, optionId, title) // UI
    const data: FormAction = {
      action: 'updateOption',
      question_id: parentId,
      id: optionId,
      title,
    }
    localSaveRawFormActions(data) // local storage
  },[changeOptionTitle, localSaveRawFormActions]);

  const changeType = useCallback((id: UniqueIdentifier, type: QuestionType) => {
    setItems(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        if (type === "multiple-choice") {
          return {
            id: p.id,
            title: p.title,
            type,
            options: [],
          };
        }
        return { id: p.id, title: p.title, type };
      })
    );
  }, []);
  const handleChangeType = useCallback((id: UniqueIdentifier, type: QuestionType) => {
    changeType(id, type);
    const data: FormAction = {
      action: 'update',
      id,
      type
    }
    localSaveRawFormActions(data) // local storage
  },[changeType, localSaveRawFormActions]);


  const triggerArrangeQuestions = () => {
    arrangeQuestions.current = true;
  }

  const triggerArrangeOptions = (parentId: UniqueIdentifier) => {
    arrangeOptions.current = true;
    if (!arrangeOptionsQuestionIds.current.includes(parentId)) arrangeOptionsQuestionIds.current.push(parentId);
  }

  const removeQuestion = useCallback((id: UniqueIdentifier) => setItems(prev => prev.filter(item => item.id !== id)),[]);
  const handleRemoveQuestion = useCallback((id: UniqueIdentifier) => {
    removeQuestion(id) // UI
    const data: FormAction = {
      action: 'delete',
      id,
    }
    localSaveRawFormActions(data) // local storage
    triggerArrangeQuestions()
    },[removeQuestion, localSaveRawFormActions]
  );

  const removeOption = useCallback(
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

  const handleRemoveOption = useCallback((parentId: UniqueIdentifier, optionId: UniqueIdentifier) => {
    removeOption(parentId, optionId) // UI
    const data: FormAction = {
      action: 'deleteOption',
      id: optionId
    }
    localSaveRawFormActions(data) // local storage
    triggerArrangeOptions(parentId)
    },[removeOption, localSaveRawFormActions]
  );
  


  const localSaveProcessedFormActions = (data: FormAction[]) => {
    const local = localStorage.getItem('processedFormActions') ?? '';
    const currentSaved = local ? JSON.parse(local) : [];
    localStorage.setItem('processedFormActions', JSON.stringify([...currentSaved, data].flat()));
  }

  async function handleSave () {
    setIsSaving(true)
    const localData = processFormActions();
    if (!localData || localData.length < 1) {
      setIsSaving(false)
      alert('No changes to save')
      return;
    }

    if (!isOnline) {
      setIsSaving(false)
      alert('You are offline. Changes saved locally and will be synced when back online.')
      return;
    } else {
      const saving: SaveForm = {
        formId: formId,
        data: localData
      }
      const data: Response = await save(saving)
      if (data) {
        setIsSaving(false)
        alert(data.message)
      }
    }
  }

  const getLocalSavedRawFormAction = (): FormAction[] | undefined  => {
    const data = JSON.parse(localStorage.getItem('rawFormActions') ?? '[]');
    localStorage.removeItem('rawFormActions');
    return data;
  }

  const getLocalSavedProcessedFormAction = (): FormAction[] | undefined  => {
    const data = JSON.parse(localStorage.getItem('processedFormActions') ?? '[]');
    localStorage.removeItem('processedFormActions');
    return data;
  }

  const findFormActionIndex = (data: FormAction[], id: UniqueIdentifier): number => { 
    return data.findIndex(d => d.id === id);
  }

  const reduceFormAction = (data: FormAction[]): FormAction[] | undefined => {
    const temp:FormAction[] = [];
    let index: number;
    let arrangeQuestionsIndex: number;
    let arrangeOptionsIndex: number;
    data.forEach(d => {
      switch(d.action) {
        case 'addOption':
          temp.push(d);
          break;
        case 'add':
          temp.push(d);
          break;
        case 'delete':
          index = findFormActionIndex(temp, d.id);
          if (index == -1) {
            temp.push(d);
          } else {
            if (temp[index].action == 'add' || temp[index].action == 'addUpdate') { // remove, do not send to database
              temp.splice(index, 1);
              return;
            } 
            temp[index] = { // if already in the database, we must delete it by sending this.
              action: 'delete',
              id: d.id,
            }
          }
          break;
        case 'deleteOption':
          index = findFormActionIndex(temp, d.id);
          if (index == -1) {
            temp.push(d);
          } else {
            if (temp[index].action == 'addOption' || temp[index].action == 'addUpdateOption') { // remove, do not send to database
              temp.splice(index, 1);
              return;
            } 
            temp[index] = { // if already in the database, we must delete it by sending this.
              action: 'deleteOption',
              id: d.id,
            }
          }
          break;
        case 'update':
          index = findFormActionIndex(temp, d.id);
          if (index == -1) {
            temp.push(d);
          } else {
           
            if (temp[index].action == 'add') {
              temp[index] = {
                action: 'addUpdate',
                id: d.id,
                title: d.title ? d.title : 'Untitled question',
                type: d.type ? d.type : 'short-text'
              }
              return;
            }
            temp[index] = {
              action: (temp[index].action == 'addUpdate') ? 'addUpdate' : 'update',
              id: d.id,
              title: d.title ? d.title : temp[index].title,
              type: d.type ? d.type : temp[index].type,
            }
          }
          break;
        case 'updateOption':
          index = findFormActionIndex(temp, d.id);
          if (index == -1) {
            temp.push(d);
          } else {
           
            if (temp[index].action == 'addOption') {
              temp[index] = {
                ...d,
                action: 'addUpdateOption',
              }
              return;
            }
            temp[index] = {
              ...d,
              action: (temp[index].action == 'addUpdateOption') ? 'addUpdateOption' : 'updateOption',
            }
          }
          break;
        case 'arrangeQuestions':
          arrangeQuestionsIndex = temp.findIndex(d => d.action === 'arrangeQuestions');
          if (arrangeQuestionsIndex == -1) {
            temp.push(d);
          } else {
            temp[arrangeQuestionsIndex] = d;
          }
          break;
        case 'arrangeOptions':
          arrangeOptionsIndex = temp.findIndex(d => d.action === 'arrangeOptions');
  
          if (arrangeOptionsIndex === -1) {
            temp.push(d);
          } else {
            // Narrow both to arrangeOptions variant
            const existing = temp[arrangeOptionsIndex] as Extract<FormAction, { action: 'arrangeOptions' }>;
            const incoming = d as Extract<FormAction, { action: 'arrangeOptions' }>;
            
            // Now both have order: Orders[]
            const allOrders = [...(existing.order ?? []), ...(incoming.order ?? [])];
            
            // Merge duplicate question_ids
            const temp_order: Orders[] = [];
            allOrders.forEach(o => {
              const idx = temp_order.findIndex(t => t.question_id === o.question_id);
              if (idx === -1) {
                temp_order.push(o);
              } else {
                // Merge option_orders for same question
                temp_order[idx].option_order = [
                  ...o.option_order
                ];
              }
            });
            
            temp[arrangeOptionsIndex] = {
              action: 'arrangeOptions',
              order: temp_order
            };
          }
          break;
      }
    });
    return temp;
  }

  const processFormActions = (): FormAction[] | undefined => {
    const formActions: FormAction[] = [];

    const localDraft: FormAction[] | undefined = getLocalSavedProcessedFormAction();
    if (localDraft) {
      formActions.push(...localDraft);
    }
  
    const localData: FormAction[] | undefined = getLocalSavedRawFormAction();
    if (localData) {
      formActions.push(...localData);
    }

    const reduced = reduceFormAction(formActions)

    if (!reduced) {
      alert('No draft found to save locally.')
      return;
    }

    localSaveProcessedFormActions(reduced)

    return reduced;
  }

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
    triggerArrangeQuestions()
    const oldIndex = itemLookup[activeId];
    const newIndex = itemLookup[overId];
    if (oldIndex === undefined || newIndex === undefined) {
      console.error("Item or option not found in lookup map");
      return;
    }
    setItems((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const handleOptionDrag = (activeId: string, overId: string, parentId: UniqueIdentifier) => {
    triggerArrangeOptions(parentId)
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
      {isOnline ? (
        <p>You are online!</p>
      ) : (
        <p>You are currently offline. Please check your internet connection.</p>
      )}
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
