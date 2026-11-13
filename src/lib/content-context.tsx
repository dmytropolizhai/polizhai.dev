"use client";

import { createContext, useContext, useMemo } from "react";
import { defaultLocale, type Locale, type PriceUnit, type ServiceId, type TierId } from "@content/site";
import {
  defaultSiteContent,
  type ResolvedProject,
  type ResolvedSiteContent,
} from "@/sanity/lib/fetch";
import type { VisibleProjectId } from "./content";

type SiteContentContextValue = ResolvedSiteContent & {
  locale: Locale;
  visibleProjects: readonly VisibleProjectId[];
  projectsById: Record<string, ResolvedProject>;
  letsTalkLabel: string;
  showClientQuote: boolean;
  showServices: boolean;
  serviceIds: readonly ServiceId[];
  tierIds: readonly TierId[];
  servicePriceLabel: (id: ServiceId) => string;
  tierPriceLabel: (id: TierId) => string;
  serviceProof: (id: ServiceId) => readonly VisibleProjectId[];
};

const SiteContentContext = createContext<ResolvedSiteContent>(defaultSiteContent);

export function SiteContentProvider({
  data,
  children,
}: {
  data: ResolvedSiteContent;
  children: React.ReactNode;
}) {
  return <SiteContentContext.Provider value={data}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContentContextValue {
  const data = useContext(SiteContentContext);

  return useMemo(() => {
    const euro = (amount: number) => new Intl.NumberFormat(data.locale).format(amount);
    const projectsById: Record<string, ResolvedProject> = {};
    for (const p of data.projects) {
      projectsById[p.id] = p;
    }

    const visibleProjects = data.projects
      .filter((p) => p.status !== "hidden")
      .map((p) => p.id) as VisibleProjectId[];

    const visibleSet = new Set<string>(visibleProjects);

    const letsTalkLabel =
      data.locale === defaultLocale && data.pendingCopy.letsTalk.show
        ? data.pendingCopy.letsTalk.text
        : data.t.nav.sections.contact.label;

    const showClientQuote =
      data.facts.clientQuote.status === "visible" && data.facts.clientQuote.approval === "approved";

    const showServices = data.services.show;
    const serviceIds = data.services.items.map((s) => s.id);
    const tierIds = data.services.supportTiers.map((tier) => tier.id);

    const withUnit = (label: string, unit: PriceUnit) =>
      unit === "month" ? `${label} ${data.t.services.price.units.month}` : label;

    const servicePriceLabel = (id: ServiceId) => {
      const item = data.services.items.find((s) => s.id === id);
      if (!item || item.price === null) return data.t.services.price.custom;
      return withUnit(data.t.services.price.from.replace("{price}", euro(item.price)), item.priceUnit);
    };

    const tierPriceLabel = (id: TierId) => {
      const tier = data.services.supportTiers.find((t) => t.id === id);
      return data.t.services.price.tier.replace("{price}", euro(tier?.price ?? 0));
    };

    const serviceProof = (id: ServiceId) => {
      const item = data.services.items.find((s) => s.id === id);
      if (!item) return [];
      return item.proof.filter((pid): pid is VisibleProjectId => visibleSet.has(pid));
    };

    return {
      ...data,
      visibleProjects,
      projectsById,
      letsTalkLabel,
      showClientQuote,
      showServices,
      serviceIds,
      tierIds,
      servicePriceLabel,
      tierPriceLabel,
      serviceProof,
    };
  }, [data]);
}
