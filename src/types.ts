// import { type UniqueIdentifier} from "@dnd-kit/core"

export type Option = { id: string; title: string; };
export type Item = 
  | { id: string; title: string; type: "multiple-choice"; options: Option[] }
  | { id: string; title: string; type: "short-text", options?: never};