import type { DemoKind } from "../types";
import { ArrowIcon } from "./ArrowIcon";

const projects: { kind: DemoKind; title: string; category: string }[] = [
  { kind: "landing", title: "SmartBerry", category: "Игровой лендинг" },
  { kind: "telegram", title: "Расписание ТУСУР", category: "Бот + Mini App" },
  { kind: "service", title: "Аналитика обучения", category: "Веб-сервис" },
];

function ProjectDevice({ kind }: { kind: DemoKind }) {
  if (kind === "telegram") {
    return (
      <span className="showcase-telegram-preview" aria-hidden="true">
        <img
          className="showcase-telegram-app"
          src="/projects/tusur-miniapp-card.png"
          alt=""
        />
        <img
          className="showcase-telegram-bot"
          src="/projects/tusur-bot-card.png"
          alt=""
        />
      </span>
    );
  }

  return (
    <span
      className={
        kind === "landing"
          ? "showcase-laptop"
          : "showcase-laptop showcase-laptop-service"
      }
      aria-hidden="true"
    >
      <span className="device-screen">
        {kind === "landing" ? (
          <img
            className="device-shot"
            src="/projects/smartberry-card.png"
            alt=""
          />
        ) : (
          <img
            className="device-shot"
            src="/projects/learning-overview.svg"
            alt=""
          />
        )}
      </span>
      <span className="laptop-base" />
    </span>
  );
}

export function Projects({ onOpen }: { onOpen: (kind: DemoKind) => void }) {
  return (
    <section
      id="work"
      className="work section slide showcase"
      aria-labelledby="work-title"
    >
      <div className="wrap">
        <div className="showcase-heading">
          <h2 id="work-title">Примеры наших работ.</h2>
          <p>Три формата. Три разных задачи.</p>
        </div>
        <div className="showcase-grid">
          {projects.map((project) => (
            <article className="showcase-card" key={project.kind}>
              <button
                className="showcase-open"
                type="button"
                onClick={() => onOpen(project.kind)}
                aria-label={`Подробнее: ${project.title}`}
              >
                <span
                  className={`showcase-stage showcase-stage-${project.kind}`}
                >
                  <ProjectDevice kind={project.kind} />
                </span>
                <span className="showcase-caption">
                  <span>
                    <small>{project.category}</small>
                    <span className="showcase-caption-title">
                      <strong>{project.title}</strong>
                      <ArrowIcon />
                    </span>
                  </span>
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
