export function RocketScene() {
  return (
    <div className="rocket-scene" aria-hidden="true">
      <div className="rocket-orbit rocket-orbit-one" />
      <div className="rocket-orbit rocket-orbit-two" />
      <div className="rocket-orbit rocket-orbit-three" />
      <span className="rocket-star rocket-star-one" />
      <span className="rocket-star rocket-star-two" />
      <span className="rocket-star rocket-star-three" />
      <div className="rocket-flight">
        <div className="rocket-trail rocket-trail-one" />
        <div className="rocket-trail rocket-trail-two" />
        <div className="rocket-trail rocket-trail-three" />
        <svg className="rocket-illustration" viewBox="0 0 300 300">
          <path
            className="rocket-exhaust"
            d="M69 244c-20 17-33 37-43 56 21-9 41-22 58-42Z"
          />
          <path
            className="rocket-flame"
            d="M88 223c-23 8-36 25-41 47 22-4 40-17 47-41Z"
          />
          <path
            className="rocket-flame-core"
            d="M83 232c-12 9-20 19-26 30 13-5 23-13 33-25Z"
          />
          <path className="rocket-fin" d="m103 185-28 2-29 43 45-12 23-20Z" />
          <path className="rocket-fin" d="m115 216-2 28 43 10-12-43-20-7Z" />
          <path
            className="rocket-body"
            d="M90 204c18-67 73-126 156-150 1 85-56 143-119 169Z"
          />
          <path
            className="rocket-panel"
            d="M173 92c20-15 45-28 73-38-1 27-8 52-19 73Z"
          />
          <path
            className="rocket-nose"
            d="M215 64c10-4 20-7 31-10-1 11-3 21-6 30Z"
          />
          <path
            className="rocket-stripe"
            d="M103 170c24 1 46 10 61 27l-13 10c-15-15-33-22-52-22Z"
          />
          <circle className="rocket-window" cx="183" cy="119" r="22" />
          <circle className="rocket-window-inner" cx="183" cy="119" r="12" />
          <path className="rocket-window-glint" d="M177 115c2-4 5-6 9-7" />
          <path className="rocket-seam" d="M107 184c17 0 34 4 50 14" />
          <path className="rocket-detail" d="M157 159 181 139M143 171l8-7" />
        </svg>
      </div>
    </div>
  );
}
