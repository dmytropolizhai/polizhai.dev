import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { TextLink } from "@/components/ui/text-link";
import { facts, hrefOf, t } from "@/lib/content";
import { shots } from "@/lib/pending";

/** §5 About: the human layer. Sticky 3:4 portrait left (5/12), text right (7/12). */
export function About() {
  const { person } = facts;
  const [head, stress] = splitStress(person.phonetic, person.phoneticStress);

  return (
    <Section id="about" title={t.about.heading}>
      <div className="grid gap-x-6 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-12">
            <figure className="texture-grain aspect-[3/4] overflow-hidden bg-raised border border-line">
              {shots.portrait ? (
                <picture>
                  <source srcSet="/images/portrait.avif" type="image/avif" />
                  <source srcSet="/images/portrait.webp" type="image/webp" />
                  <img
                    src={shots.portrait}
                    alt={t.a11y.portraitAlt}
                    width={900}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover grayscale contrast-[1.04]"
                  />
                </picture>
              ) : (
                <div aria-hidden="true" className="flex h-full items-end p-4">
                  <span className="type-label relative z-(--z-content) text-fg-muted">portrait · 3:4</span>
                </div>
              )}
            </figure>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="type-label text-fg-muted">{t.about.nameLabel}</p>
            <p className="type-lede mt-2 text-fg-muted">
              {head}
              <strong className="font-bold text-fg">{stress}</strong>
              <span className="mx-3" aria-hidden="true">
                ·
              </span>
              {/* No Cyrillic in the Archivo subset: this line falls back to the system face, kept small. */}
              <span lang="uk" className="type-small align-middle font-[system-ui]">
                {person.ukrainian}
              </span>
            </p>
          </Reveal>

          <Reveal className="mt-(--space-12)">
            <p className="type-lede">{t.about.bio[0]}</p>
            <p className="type-body mt-(--space-6) text-fg-muted">{t.about.bio[1]}</p>
          </Reveal>

          <Reveal className="mt-(--space-12)">
            <p className="type-h3">{t.about.ageLine}</p>
            <p className="type-body mt-(--space-4)">{t.about.originLine}</p>
            <p className="type-small mt-2 text-fg-muted">{t.about.schoolLine}</p>
          </Reveal>

          <div className="mt-(--space-16) grid gap-(--space-12) md:grid-cols-2 md:gap-6">
            <Reveal>
              <h3 className="type-label text-fg-muted">{t.about.languages.heading}</h3>
              <dl className="mt-3">
                {person.languages.map((l) => (
                  <div key={l.code} className="flex justify-between border-t border-line py-3 type-small">
                    <dt>{t.about.languages.names[l.code]}</dt>
                    <dd className="text-fg-muted">{l.level === "native" ? t.about.languages.native : l.level}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal index={1}>
              <h3 className="type-label text-fg-muted">{t.about.certificates.heading}</h3>
              <p className="type-small mt-1 text-fg-subtle">{t.about.certificates.note}</p>
              <ul className="mt-3">
                {facts.certificates.map((c) => {
                  const href = hrefOf(c.href);
                  return (
                    <li key={c.title} className="border-t border-line py-3 type-small">
                      {href ? <TextLink href={href}>{c.title}</TextLink> : c.title}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** "poh-lee-ZHAI" + "ZHAI" → ["poh-lee-", "ZHAI"]. */
function splitStress(phonetic: string, stress: string): [string, string] {
  const at = phonetic.lastIndexOf(stress);
  return at < 0 ? [phonetic, ""] : [phonetic.slice(0, at), stress];
}
