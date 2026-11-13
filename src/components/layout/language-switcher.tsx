"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultLocale, locales, type Locale } from "@content/site";
import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  scrolled?: boolean;
  className?: string;
}

/**
 * Switcher between the site's supported locales (en, lv, ru, uk).
 * Preserves the current section anchor when changing language.
 * Follows the top bar's pill-to-flat transition on scroll.
 */
export function LanguageSwitcher({ scrolled, className }: LanguageSwitcherProps) {
  const { locale, t } = useSiteContent();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash);
    };
    updateHash();
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);
    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, []);

  const getHref = (loc: Locale) => {
    const cleanHash = hash && hash !== "#" ? hash : "";
    if (loc === defaultLocale) {
      return cleanHash ? `/${cleanHash}` : "/";
    }
    return cleanHash ? `/${loc}/${cleanHash}` : `/${loc}/`;
  };

  return (
    <nav
      aria-label={t.about.languages.heading}
      className={cn(
        "pointer-events-auto flex items-center border p-0.5 transition-[background-color,border-color,border-radius] duration-(--dur-component) ease-move",
        scrolled
          ? "rounded-none border-transparent bg-transparent"
          : "rounded-pill border-line-strong bg-raised",
        className,
      )}
    >
      {locales.map((loc) => {
        const isCurrent = loc === locale;
        return (
          <Link
            key={loc}
            href={getHref(loc)}
            lang={loc}
            aria-current={isCurrent ? "true" : undefined}
            aria-label={t.about.languages.names[loc]}
            className={cn(
              "inline-flex items-center justify-center uppercase transition-[color,background-color,border-radius] duration-(--dur-micro) ease-move focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse",
              scrolled ? "rounded-none" : "rounded-pill",
              "px-1.5 py-0.5 text-[0.6875rem] min-[380px]:px-2 min-[380px]:text-xs md:px-2 md:py-1 md:text-xs",
              isCurrent
                ? "bg-line font-black text-fg"
                : "font-bold text-fg-muted hover:bg-line/50 hover:text-fg",
            )}
          >
            {loc}
          </Link>
        );
      })}
    </nav>
  );
}
