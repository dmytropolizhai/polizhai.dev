import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

/**
 * Sanity client for build-time / server-side data fetching.
 * Returns `null` when `NEXT_PUBLIC_SANITY_PROJECT_ID` is not configured,
 * allowing the app to fall back to `content/site.ts`.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN || undefined,
    })
  : null;
