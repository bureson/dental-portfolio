import { ImageSlot } from "@/components/ImageSlot";
import { person, personName, photos } from "@/lib/content";

export function Hero() {
  return (
    <header className="relative mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-16 px-6 pt-16 pb-24 md:px-9 lg:grid-cols-[1fr_420px] lg:gap-[72px] lg:pt-[100px] lg:pb-[130px]">
      <div
        data-plx="-0.08"
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -right-16 z-0 hidden font-display text-[300px] leading-none font-medium italic text-ghost select-none lg:block"
      >
        {person.initial}
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:gap-[26px]">
        <p className="eyebrow text-sage">{person.role}</p>
        <h1 className="m-0 font-display text-[clamp(2.75rem,8vw,68px)] leading-[1.05] font-medium text-pretty">
          Péče o úsměv,
          <br />
          <em className="text-sage-dark italic">která uklidní</em>
        </h1>
        <p className="m-0 max-w-[44ch] text-[17px] leading-[1.7] font-light text-muted text-pretty">
          Věřím, že návštěva zubaře nemusí být stres. Pečuji o své pacienty
          klidně, srozumitelně a s důrazem na prevenci — aby se ke mně vraceli
          rádi.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-[18px] gap-y-4">
          <a
            href="#kontakt"
            className="bg-ink px-8 py-[15px] text-sm font-medium tracking-[0.08em] text-cream uppercase transition-colors hover:bg-sage-dark"
          >
            Objednat se
          </a>
          <a
            href="#o-mne"
            className="border-b-[1.5px] border-rule pb-1 text-sm font-medium tracking-[0.08em] text-ink uppercase transition-colors hover:border-sage-dark hover:text-sage-dark"
          >
            Více o mně
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[340px] lg:max-w-none">
        <div
          data-plx="0.12"
          aria-hidden="true"
          className="absolute top-6 -right-6 -bottom-6 left-6 z-0 bg-sage-soft"
        />
        <div
          data-plx="-0.05"
          className="relative z-10 aspect-4/5 w-full"
        >
          <ImageSlot
            src={photos.portrait}
            alt={`Portrét — ${person.title} ${personName}`}
            placeholder="Portrét"
            priority
          />
        </div>
        <div
          data-plx="0.18"
          aria-hidden="true"
          className="absolute -bottom-12 -left-4 z-20 size-[92px] rounded-full border-[1.5px] border-rule lg:-left-11"
        />
      </div>
    </header>
  );
}
