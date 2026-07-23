import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { contact, nameAt, person } from "@/lib/content";
import "./globals.css";

/**
 * The name for the title, OG and structured data. Metadata is emitted at build
 * time and cannot re-render in the browser, so unlike the name on the page
 * itself this one only catches up with the surname change on the next deploy.
 */
const fullName = `${person.title} ${nameAt(Date.now())}`;

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
  title: `${fullName} — zubní lékařka`,
  description:
    "Zubní lékařka v Liberci. Preventivní a estetická stomatologie s důrazem na klidný, srozumitelný přístup k pacientům.",
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
    title: `${fullName} — zubní lékařka`,
    description:
      "Péče o úsměv, která uklidní. Preventivní a estetická stomatologie v Liberci.",
    siteName: fullName,
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
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
        <script
          type="application/ld+json"
          // Structured data lets search engines surface the ordination directly.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dentist",
              name: fullName,
              description:
                "Zubní lékařka se zaměřením na záchovnou a estetickou stomatologii.",
              telephone: contact.phone,
              email: contact.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: contact.street,
                postalCode: contact.postalCode,
                addressLocality: contact.city,
                addressCountry: "CZ",
              },
              openingHours: ["Mo-Fr 07:30-15:00"],
            }),
          }}
        />
      </body>
    </html>
  );
}
