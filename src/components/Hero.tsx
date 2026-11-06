import { RocketScene } from "./RocketScene";

export function Hero() {
  return (
    <section id="home" className="hero wrap slide" aria-labelledby="hero-title">
      <div className="hero-content">
        <div className="hero-copy">
          <h1 id="hero-title">
            <span>ОТ ИДЕИ</span>
            <span>К РЕЗУЛЬТАТУ</span>
          </h1>
          <p className="hero-desc">
            Сайты, веб-сервисы и Telegram-боты для бизнеса — от проектирования
            до запуска.
          </p>
          <button
            className="hero-cta"
            type="button"
            onClick={() => {
              if (window.location.hash) {
                window.history.replaceState(
                  null,
                  "",
                  window.location.pathname + window.location.search,
                );
              }
              window.dispatchEvent(
                new CustomEvent("slide:navigate", { detail: "contact" }),
              );
            }}
          >
            <span>Обсудить проект</span>
            <svg
              className="hero-cta-mark"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M5 19 19 5M8 5h11v11" />
            </svg>
          </button>
        </div>
        <RocketScene />
      </div>
    </section>
  );
}
