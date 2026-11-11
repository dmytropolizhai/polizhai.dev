import { isExternal, t } from "@/lib/content";
import { cn } from "@/lib/utils";

type TextLinkProps = React.ComponentPropsWithoutRef<"a"> & { href: string };

/**
 * Design system §9 Link: white, 1px underline in --control at 0.25em; underline turns white on hover.
 * External links open in a new tab and say so to screen readers.
 */
export function TextLink({ href, className, children, ...props }: TextLinkProps) {
  const external = isExternal(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex min-h-11 items-center text-fg underline decoration-control decoration-1 underline-offset-[0.25em] transition-colors duration-(--dur-micro) ease-move hover:decoration-fg",
        className,
      )}
      {...props}
    >
      {children}
      {external && <span className="sr-only"> ({t.a11y.externalLink})</span>}
    </a>
  );
}

/** Props for a link styled as a button (`buttonVariants`), with the same new-tab handling. */
export function externalProps(href: string) {
  return isExternal(href) ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};
}

export function ExternalNote({ href }: { href: string }) {
  return isExternal(href) ? <span className="sr-only"> ({t.a11y.externalLink})</span> : null;
}
