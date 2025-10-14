import { type UniqueIdentifier} from "@dnd-kit/core"

export type QuestionType = "short-text" | "multiple-choice"
export type Option = { id: UniqueIdentifier; title: string; };
export type Item = 
  | { id: UniqueIdentifier; title: string; type: "multiple-choice"; options: Option[] }
  | { id: UniqueIdentifier; title: string; type: "short-text", options?: never};

export type QuestionItemProps = {
  item: Item; // ensure Item has at least { id: Id; ... }
  onAddOption?: (parentId: UniqueIdentifier) => void;
  onRemoveQuestion: (id: UniqueIdentifier) => void;
  onDeleteOption?: (parentId: UniqueIdentifier, optionId: UniqueIdentifier) => void;
  onChangeType: (parentId: UniqueIdentifier, type: QuestionType) => void;
};

export type OptionListProps = {
  items: Option[],
  parentId: UniqueIdentifier,
  onDeleteOption:(parentId:UniqueIdentifier, optionId:UniqueIdentifier)=>void
};

export type OptionItemProps = {
  item: Option, 
  parentId: UniqueIdentifier, 
  onDeleteOption:(parentId:UniqueIdentifier, optionId:UniqueIdentifier)=>void
};
