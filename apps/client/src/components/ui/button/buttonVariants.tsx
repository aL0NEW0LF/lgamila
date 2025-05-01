import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex cursor-pointer duration-250 transition-colors ease-in-out rounded items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "bg-secondary border border-transparent shadow-sm hover:border-accent",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "border border-transparent bg-muted hover:bg-muted/90 hover:border-muted",
        link: "text-primary underline-offset-4 hover:underline",
        twitch: "bg-twitch text-white hover:bg-twitch-dark",
        transparent: "bg-transparent",
      },
      size: {
        default: "h-10 px-5 py-3",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-10 w-10",
        iconOnly: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
