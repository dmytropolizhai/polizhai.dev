import { Section } from "@/components/ui/section";
import { t } from "@/lib/content";
import { CurioTile, DnfTile, NumerologgiTile, OneToOneTile, ProliftsTile, StatementTile, StundioTile } from "./tiles";

/** §2 Selected work: the bento grid, the signature section. Own code, no bento library. */
export function Work() {
  return (
    <Section id="work" title={t.work.heading} intro={t.work.intro}>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:auto-rows-[minmax(18rem,auto)] lg:grid-cols-12">
        <ProliftsTile index={0} />
        <StundioTile index={1} />
        <CurioTile index={2} />
        <NumerologgiTile index={3} />
        <OneToOneTile index={4} />
        <DnfTile index={5} />
        <StatementTile index={6} />
      </ul>
    </Section>
  );
}
