// "use client";

// import React from "react";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
//   type DragEndEvent,
//   type DragStartEvent,
//   type UniqueIdentifier,
//   // type CollisionDetection,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   useSortable,
//   arrayMove,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// // const typeAwareClosestCenter: CollisionDetection = (args) => {
// //   const { active, droppableContainers } = args;
// //   const activeType = active.data.current?.type; // "parent" | "child"

// //   const filtered = droppableContainers.filter(
// //     (dc) => dc.data?.current?.type === activeType
// //   );

// //   // fall back to all if something’s wrong
// //   return closestCenter({ ...args, droppableContainers: filtered.length ? filtered : droppableContainers });
// // };

// // ────────────────────────────────────────────────────────────────
// // Sortable Item
// // ────────────────────────────────────────────────────────────────

// type ItemId = string;

// // type ItemId2 = {
// //   parent: string;
// //   id: string[]
// // };

// type ItemId3 = {
//   parent: string;
//   child: string[]
// };

// type child = string[]


// // const SortableItem: React.FC<{ id: ItemId, items2: ItemId2[], setItems2: React.Dispatch<React.SetStateAction<ItemId2[]>>; }> = ({ id, items2, setItems2 }) => {
// //   const { attributes, listeners, setNodeRef, transform, transition, isDragging, setActivatorNodeRef } =
// //     useSortable({ id });

// //   const sensors = useSensors(
// //     useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
// //     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
// //     useSensor(TouchSensor),
// //   );

// //   const children = React.useMemo(
// //     () => items2.filter((it) => it.parent === id),
// //     [items2, id]
// //   );  

// //   const [activeItem, setActiveItem] = React.useState<UniqueIdentifier | null>(null);

// //   const handleDragStart = ({ active }: DragStartEvent) => {
// //     setActiveItem(active.id);
// //   }

// //   const handleDragEnd = ({ active, over }: DragEndEvent) => {
// //     setActiveItem(null)
// //     if (!over || active.id === over.id) return;

// //     setItems2(prev => {
// //       // find this parent group
// //       const groupIndex = prev.findIndex(g => g.parent === id);
// //       if (groupIndex === -1) return prev;

// //       const group = prev[groupIndex];
// //       const oldIndex = group.id.indexOf(String(active.id));
// //       const newIndex = group.id.indexOf(String(over.id));
// //       if (oldIndex === -1 || newIndex === -1) return prev;

// //       const next = [...prev];
// //       next[groupIndex] = {
// //         ...group,
// //         id: arrayMove(group.id, oldIndex, newIndex),
// //       };
// //       return next;
// //     });
// //   };

// //   const style: React.CSSProperties = {
// //     transform: CSS.Transform.toString(transform),
// //     transition,
// //     userSelect: "none",
// //     cursor: "grab",
// //     background: "white",
// //     border: "1px solid #e5e7eb",
// //     borderRadius: 12,
// //     padding: "10px 12px",
// //     boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.12)" : "none",
// //     opacity: isDragging ? .2 : 1,
// //     touchAction: "none",
// //   };

// //   return (
// //     <li ref={setNodeRef} style={{ listStyle: "none", marginBottom: 8 }}>
// //       <div style={style}>
// //         <button ref={setActivatorNodeRef} {...attributes} {...listeners} style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</button>
// //         {id}
// //         <DndContext
// //           sensors={sensors}
// //           modifiers={[restrictToVerticalAxis]}
// //           onDragStart={handleDragStart}
// //           onDragEnd={handleDragEnd}
// //           collisionDetection={closestCenter}
// //         >
// //           <SortableContext items={children[0]['id']} strategy={verticalListSortingStrategy}>
// //             <ul style={{ padding: 0, margin: 0 }}>
// //               {children[0]['id'].map((item) => (
// //                 <SortableItem2 key={item} id={item} />
// //               ))}
// //             </ul>
// //           </SortableContext>

// //           <DragOverlay>
// //             {activeItem ? (
// //               <div style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.12)", opacity: 1 }}>
// //                 <span style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</span>
// //                 {activeItem} 
// //               </div>
// //             ) : null}
// //           </DragOverlay>

// //         </DndContext>
// //       </div>
// //     </li>
// //   );
// // };

// // const SortableItem2: React.FC<{ id: ItemId }> = ({ id }) => {
// //   const { attributes, listeners, setNodeRef, transform, transition, isDragging, setActivatorNodeRef } =
// //     useSortable({ id });

// //   const style: React.CSSProperties = {
// //     transform: CSS.Transform.toString(transform),
// //     transition,
// //     userSelect: "none",
// //     cursor: "grab",
// //     background: "white",
// //     border: "1px solid #e5e7eb",
// //     borderRadius: 12,
// //     padding: "10px 12px",
// //     boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.12)" : "none",
// //     opacity: isDragging ? .2 : 1,
// //     touchAction: "none",
// //   };

// //   return (
// //     <li ref={setNodeRef} style={{ listStyle: "none", marginBottom: 8 }}>
// //       <div style={style}>
// //         <span ref={setActivatorNodeRef} {...attributes} {...listeners} style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</span>
// //         {id}
// //       </div>
// //     </li>
// //   );
// // };

// // const SortableItem3: React.FC<{ id: ItemId, child: child[], setItems3: React.Dispatch<React.SetStateAction<ItemId3[]>>; }> = ({ id, child, setItems3 }) => {
// //   const { attributes, listeners, setNodeRef, transform, transition, isDragging, setActivatorNodeRef } =
// //     useSortable({ id });

// //   const sensors = useSensors(
// //     useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
// //     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
// //     useSensor(TouchSensor),
// //   );

// //   // const children = React.useMemo(
// //   //   () => items2.filter((it) => it.parent === id),
// //   //   [items2, id]
// //   // );  

// //   const [activeItem, setActiveItem] = React.useState<UniqueIdentifier | null>(null);

// //   const handleDragStart = ({ active }: DragStartEvent) => {
// //     setActiveItem(active.id);
// //   }

// //   const handleDragEnd = ({ active, over }: DragEndEvent) => {
// //     setActiveItem(null)
// //     if (!over || active.id === over.id) return;

// //     setItems3(prev => {
// //       // find this parent group
// //       const groupIndex = prev.findIndex(g => g.parent === id);
// //       if (groupIndex === -1) return prev;

// //       const group = prev[groupIndex];
// //       const oldIndex = group.child.indexOf(String(active.id));
// //       const newIndex = group.child.indexOf(String(over.id));
// //       if (oldIndex === -1 || newIndex === -1) return prev;

// //       const next = [...prev];
// //       next[groupIndex] = {
// //         ...group,
// //         child: arrayMove(group.child, oldIndex, newIndex),
// //       };
// //       return next;
// //     });
// //   };

// //   const style: React.CSSProperties = {
// //     transform: CSS.Transform.toString(transform),
// //     transition,
// //     userSelect: "none",
// //     cursor: "grab",
// //     background: "white",
// //     border: "1px solid #e5e7eb",
// //     borderRadius: 12,
// //     padding: "10px 12px",
// //     boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.12)" : "none",
// //     opacity: isDragging ? .2 : 1,
// //     touchAction: "none",
// //   };

// //   return (
// //     <li ref={setNodeRef} style={{ listStyle: "none", marginBottom: 8 }}>
// //       <div style={style}>
// //         <button ref={setActivatorNodeRef} {...attributes} {...listeners} style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</button>
// //         {id}
// //         <DndContext
// //           sensors={sensors}
// //           modifiers={[restrictToVerticalAxis]}
// //           onDragStart={handleDragStart}
// //           onDragEnd={handleDragEnd}
// //           collisionDetection={closestCenter}
// //         >
// //           <SortableContext items={child} strategy={verticalListSortingStrategy}>
// //             <ul style={{ padding: 0, margin: 0 }}>
// //               {child.map((item) => (
// //                 <SortableItem4 key={item} id={item} />
// //               ))}
// //             </ul>
// //           </SortableContext>

// //           <DragOverlay>
// //             {activeItem ? (
// //               <div style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.12)", opacity: 1 }}>
// //                 <span style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</span>
// //                 {activeItem} 
// //               </div>
// //             ) : null}
// //           </DragOverlay>

// //         </DndContext>
// //       </div>
// //     </li>
// //   );
// // };

// // const SortableItem4: React.FC<{ id: string }> = ({ id }) => {
// //   const { attributes, listeners, setNodeRef, transform, transition, isDragging, setActivatorNodeRef } =
// //     useSortable({ id });

// //   const style: React.CSSProperties = {
// //     transform: CSS.Transform.toString(transform),
// //     transition,
// //     userSelect: "none",
// //     cursor: "grab",
// //     background: "white",
// //     border: "1px solid #e5e7eb",
// //     borderRadius: 12,
// //     padding: "10px 12px",
// //     boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.12)" : "none",
// //     opacity: isDragging ? .2 : 1,
// //     touchAction: "none",
// //   };

// //   return (
// //     <li ref={setNodeRef} style={{ listStyle: "none", marginBottom: 8 }}>
// //       <div style={style}>
// //         <span ref={setActivatorNodeRef} {...attributes} {...listeners} style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</span>
// //         {id}
// //       </div>
// //     </li>
// //   );
// // };


// // ────────────────────────────────────────────────────────────────
// // Page
// // ────────────────────────────────────────────────────────────────

// // export default function Page() {
// //   // const [items, setItems] = React.useState<ItemId[]>([
// //   //   "Item A",
// //   //   "Item B",
// //   //   "Item C",
// //   //   "Item D",
// //   // ]);

// //   // const [items2, setItems2] = React.useState<ItemId2[]>([
// //   //   { parent: "Item A", id: ["Item E", "Item 1", "Item 2"] },
// //   //   { parent: "Item B", id: ["Item G", "Item 3",] },
// //   //   { parent: "Item C", id: ["Item H"] },
// //   //   { parent: "Item D", id: ["Item T"] },
// //   // ]);

// //   const [items3, setItems3] = React.useState<ItemId3[]>([
// //     { parent: "Item A", child: ["Item E", "Item 1", "Item 2"] },
// //     { parent: "Item B", child: ["Item G", "Item 3",] },
// //     { parent: "Item C", child: ["Item H"] },
// //     { parent: "Item D", child: ["Item T"] },
// //   ]);

// //   const sensors = useSensors(
// //     useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
// //     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
// //     useSensor(TouchSensor),
// //   );

// //   const [activeItem, setActiveItem] = React.useState<UniqueIdentifier | null>(null);

// //   const handleDragStart = ({ active }: DragStartEvent) => {
// //     setActiveItem(active.id);
// //   }

// //   const handleDragEnd = ({ active, over }: DragEndEvent) => {
// //     setActiveItem(null);
// //     if (!over) return;

// //     if (active.id !== over.id) {
// //       setItems3((prev) => {
// //         const oldIndex = prev.findIndex(item => item.parent === active.id);
// //         const newIndex = prev.findIndex(item => item.parent === over.id);
// //         return arrayMove(prev, oldIndex, newIndex);
// //       });
// //     }
// //   };

// //   return (
// //     <div style={{ maxWidth: 560, margin: "32px auto", padding: "0 16px" }}>
// //       <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Simple Sortable List</h1>
// //       <p style={{ color: "#6b7280", marginBottom: 16 }}>
// //         Drag to reorder. Works with mouse/touch and keyboard.
// //       </p>

// //       <DndContext
// //         sensors={sensors}
// //         modifiers={[restrictToVerticalAxis]}
// //         collisionDetection={closestCenter}
// //         onDragEnd={handleDragEnd}
// //         onDragStart={handleDragStart}
// //       >
// //         <SortableContext items={items3.map(i=>i.parent)} strategy={verticalListSortingStrategy}>
// //           <ul style={{ padding: 0, margin: 0 }}>
// //             {items3.map((item) => (
// //               // <SortableItem key={id} id={id} items2={items2} setItems2={setItems2}/>
// //               <SortableItem3 key={item.parent} id={item.parent} child={item.child} setItems3={setItems3}/>
// //             ))}
// //           </ul>
// //         </SortableContext>

// //         <DragOverlay>
// //           {activeItem ? (
// //             <div style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.12)", opacity: 1 }}>
// //               <span style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</span>
// //               {activeItem} 
// //             </div>
// //           ) : null}
// //         </DragOverlay>

// //       </DndContext>
// //     </div>
// //   );
// // }


// const SortableItem5: React.FC<{ id: ItemId, child: child[], setItems3: React.Dispatch<React.SetStateAction<ItemId3[]>>; }> = ({ id, child, setItems3 }) => {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging, setActivatorNodeRef } =
//     useSortable({ id, data: { type: "parent" as const } });

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
//     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
//     useSensor(TouchSensor),
//   );

//   // const children = React.useMemo(
//   //   () => items2.filter((it) => it.parent === id),
//   //   [items2, id]
//   // );  

//   const [activeItem, setActiveItem] = React.useState<UniqueIdentifier | null>(null);

//   const handleDragStart = ({ active }: DragStartEvent) => {
//     setActiveItem(active.id);
//   }

//   const handleDragEnd = ({ active, over }: DragEndEvent) => {
//     setActiveItem(null)
//     if (!over || active.id === over.id) return;

//     setItems3(prev => {
//       // find this parent group
//       const groupIndex = prev.findIndex(g => g.parent === id);
//       if (groupIndex === -1) return prev;

//       const group = prev[groupIndex];
//       const oldIndex = group.child.indexOf(String(active.id));
//       const newIndex = group.child.indexOf(String(over.id));
//       if (oldIndex === -1 || newIndex === -1) return prev;

//       const next = [...prev];
//       next[groupIndex] = {
//         ...group,
//         child: arrayMove(group.child, oldIndex, newIndex),
//       };
//       return next;
//     });
//   };

//   const style: React.CSSProperties = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     userSelect: "none",
//     cursor: "grab",
//     background: "white",
//     border: "1px solid #e5e7eb",
//     borderRadius: 12,
//     padding: "10px 12px",
//     boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.12)" : "none",
//     opacity: isDragging ? .2 : 1,
//     touchAction: "none",
//   };

//   return (
//     <li ref={setNodeRef} style={{ listStyle: "none", marginBottom: 8 }}>
//       <div style={style}>
//         <button ref={setActivatorNodeRef} {...attributes} {...listeners} style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</button>
//         {id}
//         <DndContext
//           sensors={sensors}
//           modifiers={[restrictToVerticalAxis]}
//           onDragStart={handleDragStart}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext items={child} strategy={verticalListSortingStrategy}>
//             <ul style={{ padding: 0, margin: 0 }}>
//               {child.map((item) => (
//                 <SortableItem6 key={item} id={item} />
//               ))}
//             </ul>
//           </SortableContext>

//           <DragOverlay>
//             {activeItem ? (
//               <div style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.12)", opacity: 1 }}>
//                 <span style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</span>
//                 {activeItem} 
//               </div>
//             ) : null}
//           </DragOverlay>

//         </DndContext>
//       </div>
//     </li>
//   );
// };

// const SortableItem6: React.FC<{ id: string }> = ({ id }) => {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging, setActivatorNodeRef } =
//     useSortable({ id, data: { type: "child" as const } });

//   const style: React.CSSProperties = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     userSelect: "none",
//     cursor: "grab",
//     background: "white",
//     border: "1px solid #e5e7eb",
//     borderRadius: 12,
//     padding: "10px 12px",
//     boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.12)" : "none",
//     opacity: isDragging ? .2 : 1,
//     touchAction: "none",
//   };

//   return (
//     <li ref={setNodeRef} style={{ listStyle: "none", marginBottom: 8 }}>
//       <div style={style}>
//         <span ref={setActivatorNodeRef} {...attributes} {...listeners} style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</span>
//         {id}
//       </div>
//     </li>
//   );
// };

// export default function Page() {
//   const [items3, setItems3] = React.useState<ItemId3[]>([
//     { parent: "Item A", child: ["Item E", "Item 1", "Item 2"] },
//     { parent: "Item B", child: ["Item G", "Item 3",] },
//     { parent: "Item C", child: ["Item H"] },
//     { parent: "Item D", child: ["Item T"] },
//   ]);

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
//     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
//     useSensor(TouchSensor),
//   );

//   const [activeItem, setActiveItem] = React.useState<UniqueIdentifier | null>(null);

//   const handleDragStart = ({ active }: DragStartEvent) => {
//     setActiveItem(active.id);
//   }

//   const handleDragEnd = ({ active, over }: DragEndEvent) => {
//     setActiveItem(null);
//     if (!over) return;

//     if (active.id !== over.id) {
//       setItems3((prev) => {
//         const oldIndex = prev.findIndex(item => item.parent === active.id);
//         const newIndex = prev.findIndex(item => item.parent === over.id);
//         return arrayMove(prev, oldIndex, newIndex);
//       });
//     }
//   };

//   return (
//     <div style={{ maxWidth: 560, margin: "32px auto", padding: "0 16px" }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Simple Sortable List</h1>
//       <p style={{ color: "#6b7280", marginBottom: 16 }}>
//         Drag to reorder. Works with mouse/touch and keyboard.
//       </p>

//       <DndContext
//         sensors={sensors}
//         modifiers={[restrictToVerticalAxis]}
//         collisionDetection={closestCenter}
//         // collisionDetection={typeAwareClosestCenter}
//         onDragEnd={handleDragEnd}
//         onDragStart={handleDragStart}
//       >
//         <SortableContext items={items3.map(i=>i.parent)} strategy={verticalListSortingStrategy}>
//           <ul style={{ padding: 0, margin: 0 }}>
//             {items3.map((item) => (
//               // <SortableItem key={id} id={id} items2={items2} setItems2={setItems2}/>
//               <SortableItem5 key={item.parent} id={item.parent} child={item.child} setItems3={setItems3}/>
//             ))}
//           </ul>
//         </SortableContext>

//         <DragOverlay>
//           {activeItem ? (
//             <div style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.12)", opacity: 1 }}>
//               <span style={{ display: "inline-block", width: 18, marginRight: 8 }}>⠿</span>
//               {activeItem} 
//             </div>
//           ) : null}
//         </DragOverlay>

//       </DndContext>
//     </div>
//   );
// }

