import type { Metadata, Viewport } from "next";
import { getSiteContent } from "@/sanity/lib/fetch";
import "../../index.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t, facts, ogImage } = await getSiteContent();
  const title = t.meta.title;
  const description = t.meta.description;

  return {
    metadataBase: new URL(facts.siteUrl),
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
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

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
