import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { contact, person, personName, siteUrl } from "@/lib/content";
import "./globals.css";

/** The name for the title and OG. */
const fullName = `${person.title} ${personName}`;
const title = `${fullName} — zubní lékařka v Liberci`;

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  // Lets every URL below be written relative to the canonical address.
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${fullName}` },
  description: `${fullName}, zubní lékařka na klinice ${contact.clinic} v Liberci. Preventivní, záchovná a estetická stomatologie s klidným přístupem. Přijímáme nové pacienty.`,
  keywords: [
    "zubní lékařka",
    "stomatologie Liberec",
    "dentální hygiena",
    "estetická stomatologie",
    "prevence",
  ],
  openGraph: {
    type: "profile",
    locale: "cs_CZ",
    url: "/",
    title,
    description:
      "Péče o úsměv, která uklidní. Preventivní a estetická stomatologie v Liberci.",
    siteName: fullName,
    firstName: person.firstName,
    lastName: person.lastName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      // globals.css sets `scroll-behavior: smooth` for the in-page anchors;
      // this tells Next.js to switch it off while it navigates between pages.
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
