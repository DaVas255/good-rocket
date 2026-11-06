import { useEffect, useRef } from "react";

// <core>
type Stroke = {
  xs: number[];
  ys: number[];
  rel: number[]; // момент появления каждой точки от старта штриха (шаги, 1 шаг ≈ 1/60 с)
  x: number;
  y: number;
  elapsed: number; // шагов с момента старта (< 0 — штрих ждёт своей очереди)
  life: number;
  speed: number;
  tone: number; // индекс базовой прозрачности штриха
  doneAt: number | null; // когда штрих полностью дорисовался
  from: number; // первая ещё не исчезнувшая точка
};

const random = (min: number, max: number) => min + Math.random() * (max - min);

const BG = "#191a18";
const ALPHAS = [0.2, 0.3, 0.42, 0.55];
const LEVELS = 12; // ступени прозрачности хвоста
const STYLES = ALPHAS.flatMap((alpha) =>
  Array.from(
    { length: LEVELS },
    (_, level) =>
      `rgba(239,182,47,${((alpha * (level + 1)) / LEVELS).toFixed(3)})`,
  ),
);
const HOLD = 120; // сколько штрих остаётся целиком после отрисовки (~2 с)
const FADE = 150; // за сколько хвост плавно растворяется (~2.5 с)

function startAmbientFlow(canvas: HTMLCanvasElement): (() => void) | undefined {
  const context = canvas.getContext("2d");
  if (!context) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const fx = random(0.0015, 0.0035);
  const fy = random(0.0015, 0.0035);
  const fz = random(0.001, 0.0025);
  const phases = [
    random(0, Math.PI * 2),
    random(0, Math.PI * 2),
    random(0, Math.PI * 2),
  ];
  let width = 0;
  let height = 0;
  let time = 0;
  let frame = 0;
  let lastFrame = 0;
  let pointerX = -9999;
  let pointerY = -9999;
  let strokes: Stroke[] = [];

  const spawn = (delay: number): Stroke => {
    const x = random(0, width);
    const y = random(0, height);
    return {
      xs: [x],
      ys: [y],
      rel: [0],
      x,
      y,
      elapsed: -delay,
      life: random(180, 520),
      speed: random(0.2, 0.55),
      tone: Math.floor(Math.random() * ALPHAS.length),
      doneAt: null,
      from: 0,
    };
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = BG;
    context.fillRect(0, 0, width, height);
    const count = Math.min(
      80,
      Math.max(24, Math.floor((width * height) / 16000)),
    );
    strokes = Array.from({ length: count }, () => spawn(random(0, 240)));
  };

  const draw = (step: number) => {
    // Холст полностью очищается каждый кадр — серой дымки не остаётся
    context.fillStyle = BG;
    context.fillRect(0, 0, width, height);
    context.lineWidth = 1.2;
    context.lineCap = "round";
    context.lineJoin = "round";
    const paths = STYLES.map(() => new Path2D());

    for (const s of strokes) {
      s.elapsed += step;
      if (s.elapsed < 0) continue;

      if (s.doneAt === null) {
        const angle =
          (Math.sin(s.x * fx + time * 0.12 + phases[0]) +
            Math.cos(s.y * fy - time * 0.09 + phases[1]) +
            Math.sin((s.x + s.y) * fz + time * 0.07 + phases[2])) *
          Math.PI *
          0.8;
        let nextX = s.x + Math.cos(angle) * s.speed * step;
        let nextY = s.y + Math.sin(angle) * s.speed * step;
        const dx = nextX - pointerX;
        const dy = nextY - pointerY;
        const distance = Math.hypot(dx, dy);
        if (distance < 110 && distance > 0) {
          const force = (1 - distance / 110) * 0.8 * step;
          nextX += (dx / distance) * force;
          nextY += (dy / distance) * force;
        }
        s.xs.push(nextX);
        s.ys.push(nextY);
        s.rel.push(s.elapsed);
        s.x = nextX;
        s.y = nextY;
        s.life -= step;
        if (
          s.life < 0 ||
          nextX < 0 ||
          nextX > width ||
          nextY < 0 ||
          nextY > height
        ) {
          s.doneAt = s.elapsed;
        }
      }

      // Фронт исчезновения: стартует через HOLD после отрисовки и бежит от хвоста к голове
      const front = s.doneAt === null ? -1 : s.elapsed - s.doneAt - HOLD;
      if (s.doneAt !== null && front - s.doneAt >= FADE) {
        Object.assign(s, spawn(random(0, 90)));
        continue;
      }

      let last = -1;
      for (let i = Math.max(s.from, 1); i < s.rel.length; i += 1) {
        const age = front - s.rel[i];
        if (age >= FADE) {
          s.from = i;
          continue;
        }
        const k = age <= 0 ? 1 : 1 - age / FADE;
        const eased = k * k * (3 - 2 * k);
        const key =
          s.tone * LEVELS + Math.min(LEVELS - 1, Math.floor(eased * LEVELS));
        const path = paths[key];
        if (key !== last) {
          path.moveTo(s.xs[i - 1], s.ys[i - 1]);
          last = key;
        }
        path.lineTo(s.xs[i], s.ys[i]);
      }
    }

    STYLES.forEach((style, key) => {
      context.strokeStyle = style;
      context.stroke(paths[key]);
    });
    time += 0.008 * step;
  };

  const tick = (now: number) => {
    const step = Math.min((now - (lastFrame || now)) / 16.67, 2);
    lastFrame = now;
    if (!document.hidden) draw(step);
    frame = requestAnimationFrame(tick);
  };
  const onMove = (event: PointerEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  };
  const onLeave = () => {
    pointerX = -9999;
    pointerY = -9999;
  };

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerout", onLeave);
  if (reducedMotion) {
    for (let i = 0; i < 300; i += 1) draw(1);
  } else {
    frame = requestAnimationFrame(tick);
  }
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerout", onLeave);
  };
}
// </core>

export function AmbientFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startAmbientFlow(canvas);
  }, []);

  return (
    <div className="ambient-flow" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
