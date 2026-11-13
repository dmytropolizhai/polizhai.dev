import { PortfolioShell } from "@/components/portfolio-shell";
import { SiteContentProvider } from "@/lib/content-context";
import { getSiteContent } from "@/sanity/lib/fetch";

export default async function HomePage() {
  const data = await getSiteContent();

  return (
    <SiteContentProvider data={data}>
      <PortfolioShell />
    </SiteContentProvider>
  );
}
