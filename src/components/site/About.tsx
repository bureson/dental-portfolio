import { ImageSlot } from "@/components/ImageSlot";
import { contact, photos, practiceSince, stats, yearsOfPractice } from "@/lib/content";

export function About() {
  // Derived at build time so the years of practice don't stay pinned to an
  // old number.
  const allStats = [
    { value: `${yearsOfPractice(new Date().getFullYear())}+`, label: "let praxe" },
    ...stats,
  ];

  return (
    <section id="o-mne" className="relative bg-paper">
      <div
        data-plx="-0.06"
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -left-20 z-0 hidden font-display text-[220px] leading-none text-ghost-warm italic select-none lg:block"
      >
        o mně
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1140px] grid-cols-1 gap-12 px-6 py-20 md:px-9 md:py-24 lg:grid-cols-[320px_1fr] lg:gap-20">
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-[40px] leading-[1.15] font-medium">
            O mně
          </h2>
          <div aria-hidden="true" className="h-0.5 w-12 bg-sage" />
          <div
            data-plx="0.06"
            className="mt-3 aspect-square w-full max-w-[320px]"
          >
            <ImageSlot
              src={photos.office}
              alt={`Ordinace ${contact.clinic}`}
              placeholder="Fotografie z ordinace"
              sizes="(max-width: 1024px) 100vw, 320px"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-[22px]">
          <p className="m-0 font-display text-[27px] leading-[1.45] font-medium text-pretty">
            Zubnímu lékařství se věnuji od roku {practiceSince} — a nejraději vidím
            pacienty, kteří žádný zákrok nepotřebují, protože prevence funguje.
          </p>
          <p className="m-0 text-base leading-[1.75] font-light text-muted text-pretty">
            K stomatologii jsem se dostala přes materiály — nejdřív bakalář
            biomateriálů pro medicínské využití na VŠCHT, pak Zubní lékařství na
            Univerzitě Karlově. Od promoce působím na klinice DOLI:DENT, kde se
            zaměřuji na záchovnou stomatologii a estetiku. Ve volném čase
            sportuji, cestuji, učím se jazyky a ráda zdravě vařím a peču.
          </p>

          <dl className="mt-3 flex flex-col border-t border-line sm:flex-row">
            {allStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-1 flex-col gap-1 py-5 sm:pt-[22px] sm:pb-0 ${
                  i === 0
                    ? "sm:pr-6"
                    : "border-t border-line sm:border-t-0 sm:border-l sm:px-6"
                } ${i === allStats.length - 1 ? "sm:pr-0" : ""}`}
              >
                <dt className="order-2 text-[12.5px] font-medium tracking-[0.08em] text-sand uppercase">
                  {stat.label}
                </dt>
                <dd className="order-1 m-0 font-display text-[38px] font-medium text-sage-dark">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
