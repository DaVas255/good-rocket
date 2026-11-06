export function ArrowIcon({ direction = "up" }: { direction?: "up" | "down" }) {
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {direction === "up" ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M12 4v16m-6-6 6 6 6-6" />
      )}
    </svg>
  );
}
