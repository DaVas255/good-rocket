import { useEffect, useRef, useState } from "react";
import type { DemoKind } from "../types";

const projectDetails: Record<DemoKind, { title: string; type: string }> = {
  landing: { title: "SmartBerry", type: "Игровой лендинг" },
  telegram: { title: "Расписание ТУСУР", type: "Бот + Mini App" },
  service: { title: "Аналитика обучения", type: "Веб-сервис" },
};

export function ProjectDialog({
  kind,
  onClose,
}: {
  kind: DemoKind;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [serviceView, setServiceView] = useState<"overview" | "course">(
    "overview",
  );
  useEffect(() => {
    const element = ref.current;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    element?.showModal();
    document.body.classList.add("dialog-open");
    return () => {
      element?.close();
      document.body.classList.remove("dialog-open");
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    if (kind !== "landing") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (motion.matches) videoRef.current?.pause();
      else void videoRef.current?.play().catch(() => {});
    };
    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => motion.removeEventListener("change", syncMotion);
  }, [kind]);

  const project = projectDetails[kind];
  return (
    <dialog
      ref={ref}
      className={
        kind === "service"
          ? "project-dialog-featured project-dialog-service"
          : "project-dialog-featured"
      }
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <div className="dialog-header">
        <span>{project.type}</span>
        <button
          className="dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>
      {kind === "landing" ? (
        <div className="featured-project">
          <div className="featured-project-media">
            <video
              ref={videoRef}
              src="/projects/smartberry-scroll.mp4"
              poster="/projects/smartberry.png"
              preload="metadata"
              aria-label="Прокрутка сайта SmartBerry"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <div className="featured-project-content">
            <div>
              <h2 id="dialog-title">Игры начинаются прямо здесь.</h2>
            </div>
            <div className="featured-project-description">
              <p>
                Для SmartBerry создали лендинг, который знакомит со студией и
                собирает её игры в одном месте. Посетитель может выбрать
                настольную игру или головоломку и запустить её прямо на сайте.
              </p>
              <a
                className="featured-project-link"
                href="https://smartberry.online/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Посмотреть проект <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      ) : kind === "telegram" ? (
        <div className="featured-project">
          <div className="featured-project-media featured-project-media-telegram">
            <div className="featured-project-phones">
              <div className="featured-project-phone featured-project-phone-bot">
                <img
                  src="/projects/tusur-bot.jpg"
                  alt="Сообщение бота с расписанием занятий группы"
                />
              </div>
              <div className="featured-project-phone featured-project-phone-app">
                <img
                  src="/projects/tusur-miniapp.jpg"
                  alt="Mini App с ближайшими занятиями группы"
                />
              </div>
            </div>
          </div>
          <div className="featured-project-content">
            <div>
              <h2 id="dialog-title">Расписание под рукой.</h2>
            </div>
            <div className="featured-project-description">
              <p>
                Telegram-бот каждое утро присылает расписание выбранной группы.
                В Mini App можно посмотреть занятия и ближайшие пары, а также
                настроить удобное время отправки.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="featured-project">
          <div className="featured-project-media featured-project-media-service">
            <img
              src={`/projects/learning-${serviceView}.svg`}
              alt={
                serviceView === "overview"
                  ? "Сводка, график активности, статусы заданий и таблица курсов"
                  : "Показатели отдельного курса, график выполнения и таблица заданий"
              }
            />
          </div>
          <div className="service-view-switch" aria-label="Экраны сервиса">
            <button
              type="button"
              aria-pressed={serviceView === "overview"}
              onClick={() => setServiceView("overview")}
            >
              Общий обзор
            </button>
            <button
              type="button"
              aria-pressed={serviceView === "course"}
              onClick={() => setServiceView("course")}
            >
              Отдельный курс
            </button>
          </div>
          <div className="featured-project-content">
            <div>
              <h2 id="dialog-title">Обучение в цифрах.</h2>
            </div>
            <div className="featured-project-description">
              <p>
                Веб-приложение подключается к Moodle, получает данные об
                обучении и показывает статистику в графиках, сводках и таблицах.
              </p>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
