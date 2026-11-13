import type { Metadata, Viewport } from "next";
import { defaultLocale, locales, type Locale } from "@content/site";
import { getSiteContent } from "@/sanity/lib/fetch";
import "../../../index.css";

function resolveLocale(raw?: string | string[]): Locale {
  const code = Array.isArray(raw) ? raw[0] : raw;
  if (code && (locales as readonly string[]).includes(code)) {
    return code as Locale;
  }
  return defaultLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const { t, facts, ogImage } = await getSiteContent(locale);
  const title = t.meta.title;
  const description = t.meta.description;
  const canonical = locale === defaultLocale ? "/" : `/${locale}`;

  return {
    metadataBase: new URL(facts.siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: "/",
        lv: "/lv",
        ru: "/ru",
        uk: "/uk",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: t.meta.og.title,
      description: t.meta.og.description,
      ...(ogImage ? { images: [{ url: ogImage, alt: t.meta.og.imageAlt }] } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string[] }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const { t, facts } = await getSiteContent(locale);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${facts.siteUrl}/#person`,
        name: facts.person.name,
        givenName: facts.person.givenName,
        familyName: facts.person.familyName,
        alternateName: facts.person.ukrainian,
        jobTitle: facts.person.jobTitle,
        url: facts.siteUrl,
        image: `${facts.siteUrl}/images/portrait.jpg`,
        sameAs: facts.profiles.map((p) => p.href),
        knowsLanguage: facts.person.languages.map((l) => l.code),
        address: {
          "@type": "PostalAddress",
          addressLocality: facts.person.city,
          addressCountry: facts.person.country,
        },
        alumniOf: {
          "@type": "EducationalOrganization",
          name: facts.person.school.name,
          alternateName: [facts.person.school.localName, facts.person.school.short],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${facts.siteUrl}/#website`,
        url: facts.siteUrl,
        name: facts.person.name,
        inLanguage: locale,
        publisher: { "@id": `${facts.siteUrl}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${facts.siteUrl}/#profile`,
        url: locale === defaultLocale ? facts.siteUrl : `${facts.siteUrl}/${locale}`,
        name: t.meta.title,
        inLanguage: locale,
        isPartOf: { "@id": `${facts.siteUrl}/#website` },
        mainEntity: { "@id": `${facts.siteUrl}/#person` },
      },
    ],
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
