import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-[3px] border-foreground font-bold text-sm transition-all duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-brutal hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-lg",
        secondary:
          "bg-warning text-warning-foreground shadow-brutal hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-lg",
        destructive:
          "bg-accent text-accent-foreground shadow-brutal hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-lg",
        success:
          "bg-success text-success-foreground shadow-brutal hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-lg",
        outline:
          "bg-card text-foreground shadow-brutal hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-lg",
        ghost: "border-transparent shadow-none hover:bg-muted",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
