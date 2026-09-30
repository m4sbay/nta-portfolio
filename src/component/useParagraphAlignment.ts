"use client";

import { useEffect, useRef } from "react";

/** Justify long paragraphs only when the browser can keep word gaps comfortable. */
export function useParagraphAlignment(content: unknown) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let frame = 0;
    let disposed = false;

    const measure = () => {
      const paragraphs = root.querySelectorAll<HTMLParagraphElement>(".auto-justify");
      for (const paragraph of paragraphs) {
        paragraph.style.textAlign = "start";
        const style = getComputedStyle(paragraph);
        const lineHeight = parseFloat(style.lineHeight);
        if (paragraph.getBoundingClientRect().height <= lineHeight * 2 + 1) continue;

        paragraph.style.textAlign = "justify";
        // CSS has no portable maximum justified word-spacing. Inspect actual
        // rendered spaces, reverting this paragraph if any gap exceeds 0.65em.
        const maxGap = parseFloat(style.fontSize) * 0.65;
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        let node: Node | null;
        let tooLoose = false;
        while ((node = walker.nextNode()) && !tooLoose) {
          const text = node.textContent ?? "";
          for (let i = 0; i < text.length; i++) {
            if (!/\s/.test(text[i])) continue;
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            if (range.getBoundingClientRect().width > maxGap) {
              tooLoose = true;
              break;
            }
          }
        }
        if (tooLoose) paragraph.style.textAlign = "start";
      }
    };

    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    schedule();
    void document.fonts.ready.then(schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [content]);

  return ref;
}
