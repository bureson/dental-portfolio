import { timeline } from "@/lib/content";

/** "1 rok" / "2 roky" / "5 let" — Czech numeral for an entry's length. */
function duration(years: number): string {
  if (years === 1) return "1 rok";
  if (years < 5) return `${years} roky`;
  return `${years} let`;
}

export function Education() {
  // Evaluated at build time (server component), so the ongoing entry moves on
  // its own with every deploy — and can't disagree with the client.
  const currentYear = new Date().getFullYear();

  return (
    <section
      id="vzdelani"
      className="relative mx-auto max-w-[1140px] px-6 py-20 md:px-9 md:py-24"
    >
      <div
        data-plx="-0.07"
        aria-hidden="true"
        className="pointer-events-none absolute top-5 -right-24 z-0 hidden font-display text-[200px] leading-none text-ghost italic select-none lg:block"
      >
        vzdělání
      </div>

      <div className="relative z-10">
        <div className="mb-14 flex flex-col items-center gap-4 text-center">
          <p className="eyebrow text-sage">Vzdělání a praxe</p>
          <h2 className="m-0 max-w-[22ch] font-display text-[clamp(2rem,5vw,44px)] font-medium text-balance">
            Odbornost, na kterou se můžete spolehnout
          </h2>
        </div>

        <ol className="m-0 mx-auto flex max-w-[760px] list-none flex-col p-0">
          {timeline.map((entry) => {
            const endYear = entry.to ?? currentYear;
            return (
              <li
                key={entry.title}
                className="flex flex-col gap-1.5 border-t border-line-strong pt-6 pb-7"
              >
                <span className="text-[12.5px] font-semibold tracking-[0.1em] text-bronze">
                  {entry.from} — {entry.to ?? "dosud"}
                  <span className="text-sand">
                    {" "}
                    · {duration(endYear - entry.from)}
                  </span>
                </span>
                <h3 className="m-0 font-display text-2xl font-semibold">
                  {entry.title}
                </h3>
                <p className="m-0 text-[14.5px] leading-[1.65] font-light text-muted">
                  {entry.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
