import { contact, openingHours, urgentNote } from "@/lib/content";

/** Digits only, so the tel: link works from a phone. */
const telHref = `tel:${contact.phone.replace(/\s/g, "")}`;

export function Contact() {
  return (
    <section
      id="kontakt"
      className="relative mx-auto max-w-[1140px] px-6 py-20 md:px-9 md:py-24"
    >
      <div
        data-plx="0.1"
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-0 z-0 hidden size-[130px] rounded-full bg-sage-soft lg:block"
      />

      <div className="relative z-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-5">
          <p className="eyebrow text-sage">Kontakt</p>
          <h2 className="m-0 font-display text-[clamp(2rem,5vw,44px)] font-medium">
            Kde mě najdete
          </h2>
          <p className="m-0 text-base leading-[1.7] font-light text-muted">
            Ordinuji na klinice {contact.clinic} v Liberci. Nové pacienty
            přijímáme — objednat se můžete telefonicky nebo e-mailem.
          </p>

          <dl className="mt-2 flex flex-col">
            <Row label="Klinika">
              <address className="not-italic">
                {contact.clinic}, {contact.street}, {contact.postalCode}{" "}
                {contact.city}
              </address>
            </Row>
            <Row label="Telefon">
              <a href={telHref} className="text-sage hover:text-sage-dark">
                {contact.phone}
              </a>
            </Row>
            <Row label="E-mail" last>
              <a
                href={`mailto:${contact.email}`}
                className="break-all text-sage hover:text-sage-dark"
              >
                {contact.email}
              </a>
            </Row>
          </dl>
        </div>

        <div className="flex flex-col gap-[18px] bg-paper p-7 md:p-9">
          <h3 className="m-0 font-display text-2xl font-semibold">
            Ordinační hodiny
          </h3>
          <dl className="m-0 flex flex-col text-[15px]">
            {openingHours.map((h) => (
              <div
                key={h.days}
                className="flex justify-between gap-4 border-t border-hairline py-3"
              >
                <dt className="font-light text-muted">{h.days}</dt>
                <dd
                  className={`m-0 font-medium ${h.closed ? "text-bronze" : ""}`}
                >
                  {h.time}
                </dd>
              </div>
            ))}
          </dl>
          <p className="m-0 bg-sage-soft px-[18px] py-3.5 text-[13.5px] leading-[1.55] text-sage-deep">
            {urgentNote}
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 border-t border-line py-3.5 text-[15px] sm:flex-row sm:gap-5 ${
        last ? "border-b" : ""
      }`}
    >
      <dt className="min-w-[90px] text-[12.5px] font-semibold tracking-[0.1em] text-sand uppercase sm:pt-0.5">
        {label}
      </dt>
      <dd className="m-0">{children}</dd>
    </div>
  );
}
