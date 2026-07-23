import Image from "next/image";

type ImageSlotProps = {
  /** Path under `public/`, or null while no photograph has been supplied. */
  src: string | null;
  alt: string;
  /** Shown inside the empty frame when `src` is null. */
  placeholder: string;
  /** Passed to next/image so the browser can pick the right source width. */
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * A fixed-ratio photo frame. Until a real photograph is dropped in, it renders
 * the same slot the mockup used — a labelled placeholder — so the layout holds
 * its shape either way.
 */
export function ImageSlot({
  src,
  alt,
  placeholder,
  sizes = "(max-width: 1024px) 100vw, 420px",
  priority = false,
  className = "",
}: ImageSlotProps) {
  return (
    <div className={`relative size-full overflow-hidden ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 border border-dashed border-rule bg-ghost-warm px-6 text-center">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-7 text-rule"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <rect x="3" y="4" width="18" height="16" rx="1.5" />
            <circle cx="8.5" cy="9.5" r="1.75" />
            <path d="m3.5 17 5-5 4.5 4.5L16.5 13l4 4" />
          </svg>
          <span className="text-[13px] leading-relaxed font-light text-sand">
            {placeholder}
          </span>
        </div>
      )}
    </div>
  );
}
