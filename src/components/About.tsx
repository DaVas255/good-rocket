export function About() {
  const technologies = [
    ["Frontend", "React, Next.js, TypeScript"],
    ["Backend", "Python, FastAPI, Node.js"],
    ["Данные", "PostgreSQL, Redis"],
    ["Запуск", "Docker, Linux, CI/CD"],
  ];

  const capabilities = [
    "Лендинги и корпоративные сайты",
    "Веб-сервисы и личные кабинеты",
    "Telegram-боты и Mini Apps",
    "Интеграции и автоматизация",
  ];

  return (
    <section
      id="about"
      className="about section slide"
      aria-labelledby="about-title"
      data-slide
    >
      <div className="wrap about-layout">
        <div className="about-intro">
          <h2 id="about-title">Команда, которая погружается в задачу.</h2>
          <p>
            Вместе продумываем продукт, проектируем интерфейс, пишем код и
            доводим всё до запуска. Работаем напрямую и остаёмся на связи на
            каждом этапе.
          </p>
        </div>

        <div className="about-details">
          <section className="about-stack" aria-labelledby="stack-title">
            <h3 id="stack-title">Технологии</h3>
            <dl>
              {technologies.map(([group, items]) => (
                <div key={group}>
                  <dt>{group}</dt>
                  <dd>{items}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            className="about-capabilities"
            aria-labelledby="capabilities-title"
          >
            <h3 id="capabilities-title">Что можем сделать</h3>
            <ul>
              {capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
