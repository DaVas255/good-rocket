import { useEffect, useRef, useState } from "react";

const slides = [
  { id: "home", label: "Главная" },
  { id: "work", label: "Проекты" },
  { id: "about", label: "О команде" },
  { id: "contact", label: "Контакты" },
];

export function SlideNavigation() {
  const [active, setActive] = useState(slides[0].id);
  const activeRef = useRef(0);

  useEffect(() => {
    let lockedUntil = 0;
    let touchY = 0;
    const goTo = (index: number) => {
      const next = Math.max(0, Math.min(slides.length - 1, index));
      if (next === activeRef.current) return;
      activeRef.current = next;
      setActive(slides[next].id);
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document.getElementById(slides[next].id)?.scrollIntoView({
        behavior: reducedMotion ? "instant" : "smooth",
      });
      lockedUntil = performance.now() + (reducedMotion ? 250 : 750);
    };
    const canAdvance = (target: EventTarget | null, direction: number) => {
      const slide =
        target instanceof Element
          ? target.closest<HTMLElement>(".slide")
          : null;
      if (!slide || slide.scrollHeight <= slide.clientHeight + 2) return true;
      return direction > 0
        ? slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 2
        : slide.scrollTop <= 2;
    };
    const onWheel = (event: WheelEvent) => {
      if (document.body.classList.contains("dialog-open")) return;
      const direction = Math.sign(event.deltaY);
      if (
        !direction ||
        Math.abs(event.deltaY) < 4 ||
        !canAdvance(event.target, direction)
      )
        return;
      event.preventDefault();
      if (performance.now() >= lockedUntil) goTo(activeRef.current + direction);
    };
    const onKey = (event: KeyboardEvent) => {
      if (document.body.classList.contains("dialog-open")) return;
      if (
        event.target instanceof Element &&
        event.target.closest("input, textarea, button, a, [contenteditable]")
      )
        return;
      const direction = ["ArrowDown", "PageDown"].includes(event.key)
        ? 1
        : ["ArrowUp", "PageUp"].includes(event.key)
          ? -1
          : 0;
      if (direction || event.key === "Home" || event.key === "End") {
        event.preventDefault();
        goTo(
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? slides.length - 1
              : activeRef.current + direction,
        );
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      if (document.body.classList.contains("dialog-open")) return;
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (document.body.classList.contains("dialog-open")) return;
      const delta = touchY - (event.changedTouches[0]?.clientY ?? touchY);
      if (
        Math.abs(delta) > 55 &&
        canAdvance(event.target, Math.sign(delta)) &&
        performance.now() >= lockedUntil
      ) {
        goTo(activeRef.current + Math.sign(delta));
      }
    };
    const onHash = () => {
      const index = slides.findIndex(({ id }) => `#${id}` === location.hash);
      if (index >= 0) goTo(index);
    };
    const onNavigate = (event: Event) => {
      const index = slides.findIndex(
        ({ id }) => id === (event as CustomEvent<string>).detail,
      );
      if (index >= 0) goTo(index);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("hashchange", onHash);
    window.addEventListener("slide:navigate", onNavigate);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("slide:navigate", onNavigate);
    };
  }, []);

  return (
    <nav className="slide-nav" aria-label="Навигация по слайдам">
      {slides.map(({ id, label }) => (
        <button
          type="button"
          key={id}
          className="slide-dot"
          aria-label={label}
          aria-current={active === id ? "step" : undefined}
          onClick={() => {
            const index = slides.findIndex((slide) => slide.id === id);
            activeRef.current = index;
            setActive(id);
            const reducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            document
              .getElementById(id)
              ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
          }}
        >
          <span aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
