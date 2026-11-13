"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export function StudioClient() {
  if (!isSanityConfigured) {
    return (
      <main
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: "34rem", lineHeight: 1.6 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            Sanity Studio is not configured yet
          </h1>
          <p style={{ color: "#a1a1aa", marginBottom: "1rem" }}>
            Set <code style={{ color: "#fafafa" }}>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
            <code style={{ color: "#fafafa" }}>NEXT_PUBLIC_SANITY_DATASET</code> in{" "}
            <code style={{ color: "#fafafa" }}>.env.local</code> (see{" "}
            <code style={{ color: "#fafafa" }}>.env.example</code>), then restart the dev server or rebuild.
          </p>
          <p style={{ color: "#a1a1aa", fontSize: "0.875rem" }}>
            Once configured, run <code style={{ color: "#fafafa" }}>pnpm sanity:seed</code> to import all existing
            content from <code style={{ color: "#fafafa" }}>content/site.ts</code> into Sanity.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
