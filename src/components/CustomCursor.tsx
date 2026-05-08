"use client";

import { useEffect, useState } from "react";

type CursorState = {
  x: number;
  y: number;
  active: boolean;
  visible: boolean;
};

export function CustomCursor() {
  const [showWave, setShowWave] = useState(false);
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    active: false,
    visible: false,
  });

  useEffect(() => {
    const canUseCursor =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUseCursor) {
      return;
    }

    let waveTimeout: number | undefined;
    let hideWaveTimeout: number | undefined;
    let hasWaved = window.sessionStorage.getItem("adprompt-cursor-wave") === "true";

    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const isTopbar = Boolean(target?.closest(".topbar"));
      const labeledTarget = target?.closest<HTMLElement>("[data-cursor]");
      const interactiveTarget = target?.closest("a, button, select, input, textarea");

      if (!hasWaved) {
        hasWaved = true;
        window.sessionStorage.setItem("adprompt-cursor-wave", "true");
        waveTimeout = window.setTimeout(() => {
          setShowWave(true);
          hideWaveTimeout = window.setTimeout(() => setShowWave(false), 3200);
        }, 650);
      }

      setCursor({
        x: event.clientX,
        y: event.clientY,
        active: Boolean(labeledTarget || interactiveTarget),
        visible: !isTopbar,
      });
    };

    const leave = () => {
      setCursor((current) => ({ ...current, visible: false }));
    };

    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.clearTimeout(waveTimeout);
      window.clearTimeout(hideWaveTimeout);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${cursor.visible ? "custom-cursor-visible" : ""} ${
        cursor.active ? "custom-cursor-active" : ""
      }`}
      style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
      aria-hidden="true"
    >
      <span className="cursor-orbit" />
      <svg className="cursor-buddy" viewBox="0 0 56 44">
        <rect x="32" y="3" width="8" height="5" rx="1.7" />
        <rect x="25" y="10" width="14" height="5" rx="1.7" />
        <rect x="16" y="17" width="25" height="5" rx="1.7" />
        <rect x="1" y="24" width="32" height="5" rx="1.7" />
        <rect x="13" y="31" width="25" height="5" rx="1.7" />
        <rect x="41" y="14" width="8" height="5" rx="1.7" />
        <rect x="36" y="21" width="18" height="5" rx="1.7" />
        <rect x="34" y="28" width="15" height="5" rx="1.7" />
        <rect x="49" y="28" width="6" height="5" rx="1.7" />
        <rect x="8" y="36" width="10" height="5" rx="1.7" />
        <rect x="22" y="38" width="7" height="5" rx="1.7" />
        <rect x="34" y="36" width="11" height="5" rx="1.7" />
        <rect x="28" y="0" width="6" height="4" rx="1.5" />
      </svg>
      {showWave ? <span className="cursor-wave">👋</span> : null}
    </div>
  );
}
