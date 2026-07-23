import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream px-6 text-center">
      <p className="eyebrow text-sage">404</p>
      <h1 className="m-0 font-display text-[clamp(2rem,6vw,44px)] font-medium">
        Tato stránka neexistuje
      </h1>
      <p className="m-0 max-w-[42ch] text-base leading-[1.7] font-light text-muted">
        Odkaz je nejspíš zastaralý. Zkuste to prosím z úvodní stránky.
      </p>
      <Link
        href="/"
        className="mt-2 bg-ink px-8 py-[15px] text-sm font-medium tracking-[0.08em] text-cream uppercase transition-colors hover:bg-sage-dark"
      >
        Zpět na úvod
      </Link>
    </div>
  );
}
