import { type UniqueIdentifier} from "@dnd-kit/core"

type ActiveQuestion = { type: "question"; item: Item };
type ActiveOption   = { type: "option"; item: Option; parentId: UniqueIdentifier };
export type ActiveDrag = ActiveQuestion | ActiveOption;

export type Form = { id: UniqueIdentifier; title: string; description: string; questions?: Item[]; };
export type QuestionType = "short-text" | "multiple-choice"
export type Option = { id: UniqueIdentifier; title: string; };
export type Item = 
  | { id: UniqueIdentifier; title: string; type: "multiple-choice"; options: Option[] }
  | { id: UniqueIdentifier; title: string; type: "short-text", options?: never};

export type QuestionItemProps = {
  item: Item; // ensure Item has at least { id: Id; ... }
  onAddOption?: (parentId: UniqueIdentifier) => void;
  onRemoveQuestion: (id: UniqueIdentifier) => void;
  onRemoveOption?: (parentId: UniqueIdentifier, optionId: UniqueIdentifier) => void;
  onChangeType: (parentId: UniqueIdentifier, type: QuestionType) => void;
  onChangeQuestionTitle: (parentId: UniqueIdentifier, title: string) => void;
  onChangeOptionTitle: (parentId: UniqueIdentifier, optionId: UniqueIdentifier, title: string) => void;
};

export type OptionListProps = {
  items: Option[],
  parentId: UniqueIdentifier,
  onRemoveOption:(parentId:UniqueIdentifier, optionId:UniqueIdentifier)=>void
  onChangeOptionTitle: (parentId: UniqueIdentifier, optionId: UniqueIdentifier, title: string) => void;
};

export type OptionItemProps = {
  item: Option, 
  parentId: UniqueIdentifier, 
  onRemoveOption:(parentId:UniqueIdentifier, optionId:UniqueIdentifier)=>void
  onChangeOptionTitle: (parentId: UniqueIdentifier, optionId: UniqueIdentifier, title: string) => void;
};

export type SaveForm = {
  formId: UniqueIdentifier;
  data: FormAction[];
}

export type FormAction = {
  op: 'addQuestion';
  data: Item;
}

export type AddQuestionSchema = {
  id: UniqueIdentifier;
  title: string;
  type: string;
  form_id: UniqueIdentifier;
}
