"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { defaultLocale, locales, type Locale } from "@content/site";
import { Mark } from "@/components/ui/mark";
import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  scrolled?: boolean;
  className?: string;
}

/**
 * Compact 44px locale menu trigger + Poster-mono dropdown (en, lv, ru, uk).
 * Preserves the current section anchor when changing language and follows
 * the top bar's pill-to-flat transition on scroll.
 */
export function LanguageSwitcher({ scrolled, className }: LanguageSwitcherProps) {
  const { locale, t } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

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

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const getHref = (loc: Locale) => {
    const cleanHash = hash && hash !== "#" ? hash : "";
    if (loc === defaultLocale) {
      return cleanHash ? `/${cleanHash}` : "/";
    }
    return cleanHash ? `/${loc}/${cleanHash}` : `/${loc}/`;
  };

  return (
    <div
      ref={containerRef}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      className={cn("pointer-events-auto relative", className)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t.about.languages.heading}: ${t.about.languages.names[locale]}`}
        onClick={() => {
          setHash(window.location.hash);
          setOpen((prev) => !prev);
        }}
        className={cn(
          "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 border px-2.5 text-xs font-bold tracking-wider uppercase transition-[background-color,border-color,border-radius,color] duration-(--dur-component) ease-move focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse min-[360px]:px-3",
          scrolled
            ? "rounded-none border-transparent bg-transparent text-fg-muted hover:bg-raised hover:text-fg"
            : "rounded-pill border-line-strong bg-raised text-fg-muted hover:bg-line hover:text-fg",
          open && (scrolled ? "bg-raised text-fg" : "bg-line text-fg"),
        )}
      >
        <span>{locale}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          fill="none"
          className={cn(
            "size-3 transition-transform duration-(--dur-micro) ease-move",
            open && "rotate-180",
          )}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={menuId}
          aria-label={t.about.languages.heading}
          className="absolute top-[calc(100%+0.5rem)] right-0 z-(--z-dock) min-w-44 border border-line-strong bg-raised p-1"
        >
          {locales.map((loc) => {
            const isCurrent = loc === locale;
            return (
              <li key={loc}>
                <Link
                  href={getHref(loc)}
                  lang={loc}
                  aria-current={isCurrent ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-11 w-full items-center justify-between gap-3 px-3 text-sm whitespace-nowrap transition-colors duration-(--dur-micro) ease-move focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inverse",
                    isCurrent
                      ? "font-bold text-fg"
                      : "font-medium text-fg-muted hover:bg-line hover:text-fg",
                  )}
                >
                  <span>{t.about.languages.names[loc]}</span>
                  <span className="flex items-center gap-2 text-xs font-bold uppercase text-fg-muted">
                    {isCurrent && <Mark className="text-[0.625rem]" />}
                    <span>{loc}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
