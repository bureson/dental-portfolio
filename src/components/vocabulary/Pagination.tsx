"use client";

/**
 * Page numbers with the middle collapsed once there are too many to show.
 * Always keeps the first and last page reachable, plus the current one and its
 * neighbours: 1 … 4 [5] 6 … 12. Below the threshold every page is listed, so
 * the gaps only appear when they earn their place.
 */
function pageItems(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("gap");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("gap");

  items.push(total);
  return items;
}

const buttonBase =
  "flex size-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-bold transition-colors";

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  // A single page needs no controls at all.
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Stránkování"
      className="flex flex-wrap items-center justify-center gap-1.5 pt-3"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Předchozí stránka"
        className={`${buttonBase} border-[1.5px] border-slov-border bg-white text-slov-ink hover:border-slov-teal hover:text-slov-teal disabled:pointer-events-none disabled:opacity-35`}
      >
        <Chevron />
      </button>

      {pageItems(page, pageCount).map((item, i) =>
        item === "gap" ? (
          <span
            // Gaps carry no identity of their own; position is all there is.
            key={`gap-${i}`}
            aria-hidden="true"
            className="flex size-9 items-center justify-center text-slov-hint"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-label={`Stránka ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`${buttonBase} ${
              item === page
                ? "bg-slov-teal text-slov-bg"
                : "bg-white text-slov-ink-soft hover:bg-slov-mist hover:text-slov-teal-dark"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Další stránka"
        className={`${buttonBase} border-[1.5px] border-slov-border bg-white text-slov-ink hover:border-slov-teal hover:text-slov-teal disabled:pointer-events-none disabled:opacity-35`}
      >
        <Chevron next />
      </button>
    </nav>
  );
}

function Chevron({ next = false }: { next?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-[15px] ${next ? "" : "rotate-180"}`}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
