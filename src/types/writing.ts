export type WritingInline = string | { type: "mention"; entity: string };

export type WritingBlock =
  | string
  | { type: "paragraph"; segments: WritingInline[] }
  | { type: "heading"; text: string }
  | { type: "entityCard"; entity: string };
