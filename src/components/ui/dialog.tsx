import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

/**
 * shadcn Dialog on Base UI, restyled to the design system: square, --surface, 1px --line,
 * no shadow, a dark scrim. Enter/exit are opacity transitions on Base UI's `data-starting-style` /
 * `data-ending-style`; `--dur-micro` is 0ms under reduced motion, so the dialog then appears instantly.
 */

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  const { t } = useSiteContent();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="dialog-overlay"
        className="fixed inset-0 z-(--z-overlay) bg-black/80 transition-opacity duration-(--dur-micro) ease-move data-ending-style:opacity-0 data-starting-style:opacity-0"
      />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-(--z-overlay) max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-line bg-surface p-6 outline-none transition-opacity duration-(--dur-micro) ease-move data-ending-style:opacity-0 data-starting-style:opacity-0",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          data-slot="dialog-close"
          aria-label={t.common.close}
          className="absolute top-4 right-4 inline-flex size-10 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-(--dur-micro) ease-move hover:text-fg"
        >
          <XIcon aria-hidden="true" className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("type-h3", className)} {...props} />;
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 pr-10", className)} {...props} />;
}

export { Dialog, DialogContent, DialogHeader, DialogTitle };
