import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Design system §9 Button: pill, 48px (44px sm), 24px side padding, 15px bold.
 * One primary per view. No press scale; the colour change is the feedback.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-pill border px-6 text-[0.9375rem] font-bold whitespace-nowrap select-none transition-colors duration-(--dur-micro) ease-move disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "border-transparent bg-inverse text-on-inverse hover:bg-inverse-hover",
        secondary: "border-control bg-transparent text-fg hover:border-fg hover:bg-raised",
      },
      size: {
        default: "h-12",
        sm: "h-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
