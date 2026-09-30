import { getEntity } from "../data/entities";
import type { WritingBlock } from "../types/writing";

export function getBlockText(block: WritingBlock): string {
  if (typeof block === "string") return block;
  if (block.type === "heading") return block.text;
  if (block.type === "paragraph") {
    return block.segments.map(seg =>
      typeof seg === "string" ? seg : (getEntity(seg.entity)?.title ?? "")
    ).join("");
  }
  return "";
}

export function getFirstParagraph(content: WritingBlock[]): string {
  const paragraph = content.find(block => typeof block === "string" || block.type === "paragraph");
  return paragraph === undefined ? "" : getBlockText(paragraph);
}

export function getPreviewText(content: WritingBlock[], maxChars = 140): string {
  const text = getFirstParagraph(content);
  return text.length <= maxChars ? text : `${text.slice(0, maxChars).trimEnd()}…`;
}

export function getWordCount(content: WritingBlock[]): number {
  return content.map(getBlockText).join(" ").split(/\s+/).filter(Boolean).length;
}
