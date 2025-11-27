import { type UniqueIdentifier} from "@dnd-kit/core"
import { UUID } from "crypto";

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

export type FormAction =
| {
    action: 'add' | 'addUpdate'
    id: UniqueIdentifier;   
    title?: string;
    type?: QuestionType;  
  }
| {
    action: 'update'
    id: UniqueIdentifier;
    title?: string;
    type?: QuestionType;  
  }
| {
    action: 'deleteOption';
    id: UniqueIdentifier;
    title?: never;
    type?: never; 
    order?: never;
  }
| {
    action: 'delete';
    id: UniqueIdentifier;
    title?: never;
    type?: never; 
    order?: never;
  }
| {
    action: 'arrangeQuestions';
    order: UniqueIdentifier[];
    id?: never ;
    title?: never;
    type?: never; 
  }
| {
    action: 'addOption' | 'addUpdateOption'
    question_id: UniqueIdentifier;
    id: UniqueIdentifier;   
    title: string;
    type?: never; 
    order?: never;
  }
| {
    action: 'updateOption';
    question_id: UniqueIdentifier;
    id: UniqueIdentifier;   
    title: string;
    type?: never;
    order?: never;
  }
| {
    action: 'arrangeOptions';
    order: Orders[];
    id?: never ;
    title?: never;
    type?: never; 
  };

export type Orders = {
  question_id: UniqueIdentifier;
  option_order: UniqueIdentifier[];
}
export type Response = {
  message: 'success' | 'fail' | string
}

export type FormList = {
  id: UniqueIdentifier;
  title: string;
  owner_id: UniqueIdentifier;
  owner_email: string;
  created_at: string;
  perm_user_id: UniqueIdentifier | null;
  perm_role: 'editor' | null;
}