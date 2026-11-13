import { defaultLocale, locales, type Locale } from "@content/site";
import { PortfolioShell } from "@/components/portfolio-shell";
import { SiteContentProvider } from "@/lib/content-context";
import { getSiteContent } from "@/sanity/lib/fetch";

export function generateStaticParams() {
  return [
    { locale: [] },
    { locale: ["en"] },
    { locale: ["lv"] },
    { locale: ["ru"] },
    { locale: ["uk"] },
  ];
}

function resolveLocale(raw?: string | string[]): Locale {
  const code = Array.isArray(raw) ? raw[0] : raw;
  if (code && (locales as readonly string[]).includes(code)) {
    return code as Locale;
  }
  return defaultLocale;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const data = await getSiteContent(locale);

  return (
    <SiteContentProvider data={data}>
      <PortfolioShell />
    </SiteContentProvider>
  );
}
