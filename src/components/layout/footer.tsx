import { Lockup } from "@/components/ui/lockup";
import { TextLink } from "@/components/ui/text-link";
import { facts, t } from "@/lib/content";

/** §8 Footer: small and factual, then the lockup at container width, the dock floating over it. */
export function Footer() {
  return (
    <footer className="container-site pb-[calc(var(--dock-h)+1rem)]">
      <div className="flex flex-col gap-6 border-t border-line pt-(--space-8) md:flex-row md:items-start md:justify-between">
        <div>
          <p className="type-small">{t.footer.credit}</p>
          <p className="type-small text-fg-muted">
            © {facts.copyrightYear} {facts.person.name}
          </p>
        </div>
        <ul className="type-small flex flex-wrap gap-x-6 gap-y-2">
          {facts.profiles.map((p) => (
            <li key={p.label}>
              <TextLink href={p.href}>{p.label}</TextLink>
            </li>
          ))}
          <li>
            <TextLink href="#top">{t.footer.backToTop}</TextLink>
          </li>
        </ul>
      </div>
      <Lockup className="mt-(--space-16) w-full" alt="" />
    </footer>
  );
}
