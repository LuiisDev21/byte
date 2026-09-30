import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/CapaNegocio/utilidades"

const variantesBoton = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-4xl border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-[color-mix(in_oklch,var(--primary)_75%,#000)] bg-primary text-primary-foreground shadow-[inset_0_1.5px_0px_0_color-mix(in_oklch,var(--primary)_65%,#fff),inset_0_-1.5px_0px_0_color-mix(in_oklch,var(--primary)_75%,#000)] hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-ring/30",
        outline:
          "border-border bg-card text-foreground hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/30 aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-transparent dark:shadow-[inset_0_1.5px_0px_0_color-mix(in_oklch,white_25%,transparent)] dark:hover:bg-input/30",
        secondary:
          "border-secondary-foreground/15 bg-secondary text-secondary-foreground shadow-[inset_0_1.5px_0px_0_white,inset_0_-1.5px_0px_0_color-mix(in_oklch,var(--secondary-foreground)_15%,transparent)] hover:opacity-80 focus-visible:border-ring focus-visible:ring-ring/30 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground dark:border-[color-mix(in_oklch,var(--secondary)_90%,transparent)] dark:shadow-[inset_0_1.5px_0px_0_color-mix(in_oklch,white_25%,transparent),inset_0_-1.5px_0px_0_color-mix(in_oklch,black_25%,transparent)]",
        ghost:
          "border-transparent text-foreground hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/30 aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive shadow-[inset_0_1.5px_0px_0_color-mix(in_oklch,var(--destructive)_5%,#fff),inset_0_-1.5px_0px_0_color-mix(in_oklch,var(--destructive)_25%,#fff)] hover:opacity-80 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:border-[color-mix(in_oklch,var(--destructive)_38%,#000)] dark:bg-destructive/25 dark:shadow-[inset_0_1.5px_0px_0_color-mix(in_oklch,white_15%,transparent),inset_0_-1.5px_0px_0_color-mix(in_oklch,black_28%,transparent)] dark:focus-visible:ring-destructive/40",
        link:
          "border-transparent text-primary underline-offset-4 hover:underline focus-visible:border-ring focus-visible:ring-ring/30",
      },
      size: {
        default:
          "h-10 gap-1.5 px-3.5 text-sm has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-4",
        xs:
          "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm:
          "h-8 gap-1 px-3 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        lg:
          "h-12 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-4",
        icon:
          "size-10 text-sm [&_svg:not([class*='size-'])]:size-4",
        "icon-xs":
          "size-6 text-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 text-sm [&_svg:not([class*='size-'])]:size-4",
        "icon-lg":
          "size-12 text-sm [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface PropiedadesBoton
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantesBoton> {
  asChild?: boolean
}

const Boton = React.forwardRef<HTMLButtonElement, PropiedadesBoton>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(variantesBoton({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Boton.displayName = "Boton"

export { Boton, Boton as Button, variantesBoton }
