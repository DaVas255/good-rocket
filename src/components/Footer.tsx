import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="footer wrap">
      <div className="footer-identity">
        <a
          className="wordmark footer-wordmark"
          href="#home"
          aria-label="Good Rocket — на главную"
        >
          <BrandMark />
          <span>goodrocket</span>
        </a>
        <span className="footer-city">Разработка сайтов · Томск</span>
      </div>
      <div className="footer-secondary">
        <span>Продумано. Разработано. Запущено.</span>
        <a href="#home">К началу</a>
      </div>
    </footer>
  );
}
