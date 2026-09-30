"use client";

import Image from "next/image";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type PointerEvent
} from "react";
import { createPortal } from "react-dom";
import styles from "./LinkPreview.module.css";

export type LinkPreviewProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  /** Static landing-page screenshot stored in public/. */
  preview?: `/${string}`;
};

const CURSOR_OFFSET = 20;
const VIEWPORT_MARGIN = 12;

function positionPreview(
  element: HTMLDivElement | null,
  point: { x: number; y: number }
) {
  if (!element) return;

  const { x, y } = point;
  const { width, height } = element.getBoundingClientRect();
  let left = x + CURSOR_OFFSET;

  if (left + width > window.innerWidth - VIEWPORT_MARGIN) {
    left = x - CURSOR_OFFSET - width;
  }

  left = Math.min(
    Math.max(VIEWPORT_MARGIN, left),
    Math.max(VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN)
  );
  const top = Math.min(
    Math.max(VIEWPORT_MARGIN, y - height / 2),
    Math.max(VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN)
  );

  element.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
  element.style.visibility = "visible";
}

/** A semantic link with a pointer-following, static screenshot preview. */
export function LinkPreview({
  href,
  preview,
  children,
  className = "",
  target,
  rel,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: LinkPreviewProps) {
  const [open, setOpen] = useState(false);
  const [failedPreview, setFailedPreview] = useState<string>();
  const previewRef = useRef<HTMLDivElement>(null);
  const pointRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>();
  const openRef = useRef(false);
  const external = /^https?:\/\//i.test(href);
  const linkTarget = target ?? (external ? "_blank" : undefined);
  const showPreview = preview && preview !== failedPreview;

  const supportsHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const updatePosition = () => {
    frameRef.current = undefined;
    positionPreview(previewRef.current, pointRef.current);
  };

  const schedulePosition = () => {
    if (frameRef.current === undefined) {
      frameRef.current = requestAnimationFrame(updatePosition);
    }
  };

  const showAt = (x: number, y: number) => {
    pointRef.current = { x, y };
    openRef.current = true;
    setOpen(true);
    schedulePosition();
  };

  const hide = () => {
    openRef.current = false;
    setOpen(false);
    if (frameRef.current !== undefined) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  };

  useLayoutEffect(() => {
    if (open) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = undefined;
        positionPreview(previewRef.current, pointRef.current);
      });
    }
    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [open]);

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerEnter?.(event);
    if (!event.defaultPrevented && event.pointerType !== "touch" && supportsHover()) {
      showAt(event.clientX, event.clientY);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(event);
    if (!openRef.current || event.pointerType === "touch") return;
    pointRef.current = { x: event.clientX, y: event.clientY };
    schedulePosition();
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(event);
    hide();
  };

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    onFocus?.(event);
    if (event.defaultPrevented || openRef.current || !supportsHover()) return;
    if (event.currentTarget.matches(":focus-visible")) {
      const rect = event.currentTarget.getBoundingClientRect();
      showAt(rect.right, rect.top + rect.height / 2);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLAnchorElement>) => {
    onBlur?.(event);
    hide();
  };

  return (
    <>
      <a
        {...props}
        href={href}
        target={linkTarget}
        rel={linkTarget === "_blank" ? `${rel ?? ""} noopener noreferrer`.trim() : rel}
        className={`${styles.trigger} ${className}`}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </a>
      {open && typeof document !== "undefined" && createPortal(
        <div ref={previewRef} aria-hidden="true" className={styles.positioner}>
          <div className={styles.card}>
            <div className={styles.viewport}>
              {showPreview && (
                <Image
                  src={preview}
                  alt=""
                  fill
                  sizes="(max-width: 360px) calc(100vw - 44px), 320px"
                  className="object-contain"
                  onError={() => setFailedPreview(preview)}
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
