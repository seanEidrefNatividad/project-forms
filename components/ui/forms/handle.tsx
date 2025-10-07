"use client";

export default function Handle({setActivatorNodeRef, attributes, listeners, type}: {setActivatorNodeRef: any, attributes: any, listeners: any, type:string}) {
  const handle = type === 'option' ? '⋮⋮' : '☰';
  const topMiddle = type === 'question' ? {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
  } : {};
  return (
    <button
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      title="Drag to reorder"
      style={{
        cursor: "grab",
        border: "none",
        background: "transparent",
        padding: 4,
        lineHeight: 1,
        fontSize: 20,
        ...topMiddle
      }}
    >
      {handle}
    </button>
  );
}