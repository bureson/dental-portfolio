import {
  contact,
  person,
  personName,
  photos,
  services,
  siteUrl,
} from "@/lib/content";

const fullName = `${person.title} ${personName}`;

const images = [photos.portrait, photos.office]
  .filter((src) => src !== null)
  .map((src) => `${siteUrl}${src}`);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: fullName,
      inLanguage: "cs",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: personName,
      givenName: person.firstName,
      familyName: person.lastName,
      honorificPrefix: person.title,
      jobTitle: "Zubní lékařka",
      url: siteUrl,
      ...(photos.portrait && { image: `${siteUrl}${photos.portrait}` }),
      worksFor: { "@type": "Organization", name: contact.clinic },
      memberOf: {
        "@type": "Organization",
        name: "Česká stomatologická komora",
      },
    },
    {
      "@type": "Dentist",
      "@id": `${siteUrl}/#dentist`,
      name: fullName,
      description:
        "Zubní lékařka se zaměřením na záchovnou a estetickou stomatologii.",
      url: siteUrl,
      ...(images.length > 0 && { image: images }),
      telephone: contact.phone,
      email: contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.street,
        postalCode: contact.postalCode,
        addressLocality: contact.city,
        addressCountry: "CZ",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: contact.latitude,
        longitude: contact.longitude,
      },
      areaServed: { "@type": "City", name: contact.city },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "15:00",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Služby",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
          },
        })),
      },
    },
  ],
};

/** Structured data lets search engines surface the ordination directly. */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
