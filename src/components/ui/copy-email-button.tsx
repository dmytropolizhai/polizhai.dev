import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { Check } from "@/components/animate-ui/icons/check";
import { Copy } from "@/components/animate-ui/icons/copy";
import { Mail } from "@/components/animate-ui/icons/mail";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { facts, t } from "@/lib/content";

type CopyEmailButtonProps = {
  /** Visible label before copying. */
  label: string;
  /** Hero shows a mail icon, Contact a copy icon; both flip to a check. */
  icon: "mail" | "copy";
  variant?: "primary" | "secondary";
};

/**
 * Copies the address. "Copied" + polite announcement on success; on failure it announces
 * the fallback and the next press opens `mailto:` (landing-page.md §1 and §7).
 * Icons: Animate UI (lucide set). The check draws itself when copied.
 */
export function CopyEmailButton({ label, icon, variant = "primary" }: CopyEmailButtonProps) {
  const { state, copy } = useCopy(facts.email);
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const [failedOnce, setFailedOnce] = useState(false);
  const Idle = icon === "mail" ? Mail : Copy;

  const onClick = async () => {
    if (failedOnce) {
      window.location.href = `mailto:${facts.email}`;
      return;
    }
    if (!(await copy())) setFailedOnce(true);
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={onClick}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        {state === "copied" ? (
          <Check animate={!reduced} aria-hidden="true" />
        ) : (
          <Idle animate={hover && !reduced} aria-hidden="true" />
        )}
        <span>{state === "copied" ? t.common.copied : failedOnce ? t.common.emailMe : label}</span>
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? t.a11y.copy.copied : state === "failed" ? t.a11y.copy.failed : ""}
      </span>
    </>
  );
}
