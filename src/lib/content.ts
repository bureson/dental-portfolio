/**
 * All copy and data for the portfolio lives here, so the page components stay
 * purely presentational and the text can be edited without touching JSX.
 */

export const person = {
  firstName: "Irena",
  title: "MUDr.",
  role: "Zubní lékařka — Liberec",
  initial: "I",
} as const;

/**
 * The moment the surname changes.
 *
 * 26 September 2026 at 13:00 Prague time. Central Europe is still on summer
 * time (UTC+2) until the last Sunday of October, so that is 11:00 UTC — an
 * absolute instant, immune to whatever timezone the visitor is in.
 */
export const SURNAME_CHANGES_AT = Date.UTC(2026, 8, 26, 11, 0);

/** The full name as of a given instant. */
export function nameAt(now: number): string {
  const surname = now >= SURNAME_CHANGES_AT ? "Burešová" : "Mouleová";
  return `${person.firstName} ${surname}`;
}

/**
 * Photographs. Drop the files into `public/` and fill in the paths — until
 * then a labelled placeholder frame is rendered in their place.
 */
export const photos: {
  portrait: string | null;
  office: string | null;
} = {
  portrait: "/profilepic.jpg",
  office: "/ordi.jpg",
};

/** Start of practice. The single source for every derived duration. */
export const practiceSince = 2022;

/**
 * Years of practice as of the given year. The caller passes the current year
 * in: `content.ts` also ends up in the client bundle, where `new Date()` could
 * return something different than the server did over New Year and break
 * hydration.
 */
export function yearsOfPractice(currentYear: number): number {
  return Math.max(0, currentYear - practiceSince);
}

export const stats = [{ value: "2 500+", label: "pacientů" }] as const;

/**
 * Education and practice, in chronological order. The years are numbers rather
 * than ready-made text — `Education` assembles the label ("2022 — dosud", the
 * duration), so the ongoing entry never goes stale or needs editing by hand.
 *
 * `to: null` means "dosud".
 */
export const timeline = [
  {
    from: 2014,
    to: 2017,
    title: "Vysoká škola chemicko-technologická v Praze",
    description:
      "Bakalář (Bc.), obor Biomateriály pro medicínské využití — materiálový základ, ze kterého dodnes čerpám při výběru výplní a náhrad.",
  },
  {
    from: 2017,
    to: 2022,
    title: "Univerzita Karlova",
    description:
      "Magisterský obor Zubní lékařství. Studium zakončeno se studijním průměrem 2.",
  },
  {
    from: practiceSince,
    to: null,
    title: "Zubní lékařka, DOLI:DENT",
    description:
      "Moderní zubní klinika v Liberci. Záchovná a estetická stomatologie, dentální hygiena a ošetření dětských pacientů. Členka České stomatologické komory.",
  },
] as const;

export const services = [
  {
    number: "I.",
    name: "Preventivní péče",
    description:
      "Pravidelné prohlídky, odstranění zubního kamene a plán péče na míru.",
  },
  {
    number: "II.",
    name: "Dentální hygiena",
    description:
      "Profesionální čištění, airflow a nácvik správné techniky doma.",
  },
  {
    number: "III.",
    name: "Záchovná stomatologie",
    description: "Estetické výplně, které nejsou vidět — a vydrží.",
  },
  {
    number: "IV.",
    name: "Endodoncie",
    description: "Ošetření kořenových kanálků moderně, šetrně a bez bolesti.",
  },
  {
    number: "V.",
    name: "Estetická stomatologie",
    description: "Bělení zubů, fazety a úpravy tvaru pro sebevědomý úsměv.",
  },
] as const;

export const contact = {
  clinic: "DOLI:DENT",
  street: "Ampérova 649",
  postalCode: "463 12",
  city: "Liberec",
  phone: "+420 733 734 794",
  email: "info@dolident.cz",
} as const;

export const openingHours = [
  { days: "Pondělí — Pátek", time: "7:30 — 15:00", closed: false },
  { days: "Sobota — Neděle", time: "zavřeno", closed: true },
] as const;

export const urgentNote =
  "Akutní bolest? Volejte ráno mezi 7:30 a 8:30 — pokusíme se vás vzít ještě týž den.";

export const navigation = [
  { href: "#o-mne", label: "O mně" },
  { href: "#vzdelani", label: "Vzdělání" },
  { href: "#sluzby", label: "Služby" },
  { href: "#kontakt", label: "Kontakt" },
] as const;
