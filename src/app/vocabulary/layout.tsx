import type { Metadata } from "next";
import { Lora, Manrope } from "next/font/google";

/**
 * The vocabulary page keeps its own type pairing from the mockup. Loading the
 * families in this nested layout means the public portfolio never pays for them.
 */
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Slovníček",
  description: "Soukromá kartotéka slovíček.",
  // Private page — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function VocabularyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`vocabulary-type ${lora.variable} ${manrope.variable} min-h-screen bg-slov-bg font-slov-sans text-slov-ink`}
    >
      {children}
    </div>
  );
}
