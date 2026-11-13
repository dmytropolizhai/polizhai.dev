import type { Metadata, Viewport } from "next";
import "../index.css";

const siteUrl = "https://polizhai.dev";
const title = "Let's talk";
const description =
  "Dmytro Polizhai is a full-stack developer in Riga, Latvia. He designs, builds and launches web apps such as Stundio, Prolifts and Curio.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Dmytro Polizhai · Full-Stack Developer in Riga",
    description: "Make it run, make it right. Web apps from the first commit to the live site.",
    // [TBD] og:image once the portrait exists (open item 4).
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
