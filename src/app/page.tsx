import { App } from "@/App";

/** The one route. Prerendered to static HTML at build time; the interactive tree hydrates on the client. */
export default function Page() {
  return <App />;
}
