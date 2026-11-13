type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      appearance?: "always" | "execute" | "interaction-only";
      theme?: "light" | "dark" | "auto";
      callback?: (token: string) => void;
      "error-callback"?: (errorCode?: string) => void;
      "expired-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

export function loadTurnstileScript(): Promise<TurnstileApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Turnstile requires browser"));
  }
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        scriptPromise = null;
        reject(new Error("Turnstile failed to initialize"));
      }
    };
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Turnstile script"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function getTurnstileToken(
  siteKey: string,
  container: HTMLElement,
): Promise<string> {
  const api = await loadTurnstileScript();

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    let widgetId = "";

    const cleanup = () => {
      if (widgetId) {
        try {
          api.remove(widgetId);
        } catch {
          // ignore
        }
      }
    };

    const timeout = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        reject(new Error("Turnstile timeout"));
      }
    }, 15_000);

    widgetId = api.render(container, {
      sitekey: siteKey,
      appearance: "interaction-only",
      theme: "dark",
      callback: (token: string) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        cleanup();
        resolve(token);
      },
      "error-callback": (errorCode?: string) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        cleanup();
        reject(new Error(`Turnstile error: ${errorCode ?? "unknown"}`));
      },
      "expired-callback": () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        cleanup();
        reject(new Error("Turnstile expired"));
      },
    });
  });
}
