import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "../env";

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null;

/** Builds an optimized Sanity CDN image URL, or returns `null` if Sanity is unconfigured or source is missing. */
export function urlFor(source: SanityImageSource | null | undefined) {
  if (!builder || !source) return null;
  return builder.image(source);
}
