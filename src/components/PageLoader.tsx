import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP);

export function PageLoader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const word = "goodrocket.ru";

  useGSAP(
    () => {
      document.body.classList.add("loader-open");
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        onComplete();
      };

      if (reducedMotion) {
        if (progress.current) progress.current.textContent = "100";
        gsap.set(".loader-letter", { display: "inline" });
        const timer = window.setTimeout(finish, 650);
        return () => {
          window.clearTimeout(timer);
          document.body.classList.remove("loader-open");
        };
      }

      const counter = { value: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: finish,
      });
      const fallback = window.setTimeout(finish, 2400);
      const letters = gsap.utils.toArray<HTMLElement>(".loader-letter");

      timeline
        .set(".loader-letter", { display: "none" })
        .fromTo(
          ".loader-cursor",
          { opacity: 0 },
          { opacity: 1, duration: 0.12 },
          0,
        );

      letters.forEach((letter, index) => {
        timeline.fromTo(
          letter,
          {
            display: "inline",
            opacity: 0,
            y: "0.2em",
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.32,
          },
          0.16 + index * 0.085,
        );
      });

      timeline
        .to(
          counter,
          {
            value: 100,
            duration: 1.52,
            ease: "power2.inOut",
            onUpdate: () => {
              if (progress.current) {
                progress.current.textContent = String(
                  Math.round(counter.value),
                ).padStart(3, "0");
              }
            },
          },
          0,
        )
        .fromTo(
          ".loader-progress-fill",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.52, ease: "power2.inOut" },
          0,
        )
        .to(
          ".loader-cursor",
          {
            opacity: 0.2,
            duration: 0.12,
            repeat: 1,
            yoyo: true,
          },
          1.55,
        );

      return () => {
        window.clearTimeout(fallback);
        timeline.kill();
        document.body.classList.remove("loader-open");
      };
    },
    { scope: root },
  );

  return (
    <div
      className="page-loader"
      role="status"
      aria-live="polite"
      aria-label="goodrocket.ru загружается"
      ref={root}
    >
      <div className="loader-frame">
        <div className="loader-stage">
          <p className="loader-word" aria-hidden="true">
            {Array.from(word).map((letter, index) => (
              <span className="loader-letter" key={`${letter}-${index}`}>
                {letter}
              </span>
            ))}
            <span className="loader-cursor" />
          </p>
        </div>
        <div className="loader-bottom">
          <span className="loader-progress-line" aria-hidden="true">
            <i className="loader-progress-fill" />
          </span>
          <p className="loader-progress" aria-hidden="true">
            <span ref={progress}>000</span>
            <span>/100</span>
          </p>
        </div>
      </div>
    </div>
  );
}
