import { services } from "@/lib/content";

export function Services() {
  return (
    <section id="sluzby" className="relative overflow-hidden bg-ink">
      <div
        data-plx="-0.1"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-16 font-display text-[260px] leading-none text-cream/[0.04] italic select-none"
      >
        služby
      </div>

      <div className="relative z-10 mx-auto max-w-[1140px] px-6 py-20 md:px-9 md:py-24">
        <div className="mb-14 flex flex-col gap-3.5">
          <p className="eyebrow text-sage-mid">Služby</p>
          <h2 className="m-0 font-display text-[clamp(2rem,5vw,44px)] font-medium text-cream">
            S čím vám mohu pomoci
          </h2>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 p-0 md:grid-cols-2">
          {services.map((s) => (
            <li
              key={s.number}
              className="grid grid-cols-[44px_1fr] items-baseline gap-[18px] border-t border-cream/[0.16] py-[26px] md:grid-cols-[56px_1fr] md:pr-8"
            >
              <span
                aria-hidden="true"
                className="font-display text-[22px] text-sage-mid italic"
              >
                {s.number}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="m-0 text-[17px] font-medium text-cream">
                  {s.name}
                </h3>
                <p className="m-0 text-sm leading-[1.6] font-light text-dune">
                  {s.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
