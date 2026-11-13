'use client'

import { MotionConfig } from "motion/react";
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
import { t } from "@/lib/content";
import Link from "next/link";

/** The landing page: a stack of posters (design/landing-page.md). The dock is last in the DOM. */
export default function Root() {
  return (
      <MotionConfig reducedMotion="user">
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
      </MotionConfig>
  );
}
