import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const backgroundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-slate-100",
        primary: "bg-blue-500",
        secondary: "bg-green-500",
        danger: "bg-red-500",
        success: "bg-green-500",
      },
      size: {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-slate-500",
      primary: "text-white",
      secondary: "text-white",
      danger: "text-white",
      success: "text-white",
    },
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
});
export const IconBadge = ({
  icon: Icon,
  variant,
  size,
}: {
  icon: LucideIcon;
} & VariantProps<typeof backgroundVariants>) => {
  return (
    <div className={backgroundVariants({ variant, size })}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};
