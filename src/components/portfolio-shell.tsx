"use client";

import Link from "next/link";
import { MotionConfig } from "motion/react";
import { AssistantProvider } from "@/components/assistant/assistant-context";
import { Dock } from "@/components/layout/dock";
import { Footer } from "@/components/layout/footer";
import { SiteNav } from "@/components/layout/site-nav";
import { About } from "@/components/sections/about";
import { ClientQuote } from "@/components/sections/client-quote";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { How } from "@/components/sections/how";
import { Journey } from "@/components/sections/journey";
import { Services } from "@/components/sections/services";
import { useSiteContent } from "@/lib/content-context";

/** The landing page: a stack of posters (design/landing-page.md). The dock is last in the DOM. */
export function PortfolioShell() {
  const { t } = useSiteContent();

  return (
    <MotionConfig reducedMotion="user">
      <AssistantProvider>
        <Link
          href="#main"
          className="sr-only z-(--z-overlay) rounded-pill bg-inverse px-6 py-3 font-bold text-on-inverse focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {t.a11y.skipLink}
        </Link>
        <SiteNav />
        <Hero />
        <main id="main" tabIndex={-1} className="outline-none">
          <How />
          <Services />
          <Journey />
          <About />
          <ClientQuote />
          <Contact />
        </main>
        <Footer />
        <Dock />
      </AssistantProvider>
    </MotionConfig>
  );
}
