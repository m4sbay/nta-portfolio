import type { ReactNode } from "react";
import type { WritingBlock, WritingInline } from "../../types/writing";
import { RichMention } from "./RichMention";

export function InlineSegments({ segments }: { segments: WritingInline[] }) {
  return <>{segments.map((seg, i) =>
    typeof seg === "string" ? seg : <RichMention key={i} entity={seg.entity} />
  )}</>;
}

export function WritingArticleBody({
  content,
  className = "reading mt-10",
  paragraphClassName,
  renderEntityCard
}: {
  content: WritingBlock[];
  className?: string;
  paragraphClassName?: string;
  /** Entity cards are a separate, optional block feature; none exists on this landing page. */
  renderEntityCard?: (entity: string) => ReactNode;
}) {
  return (
    <div className={className}>
      {content.map((block, i) => {
        if (typeof block === "string") return <p key={i} className={paragraphClassName}>{block}</p>;
        if (block.type === "paragraph") return <p key={i} className={paragraphClassName}><InlineSegments segments={block.segments} /></p>;
        if (block.type === "heading") return <h2 key={i}>{block.text}</h2>;
        return renderEntityCard ? <div key={i} className="not-reading">{renderEntityCard(block.entity)}</div> : null;
      })}
    </div>
  );
}
