import {
  AlertTriangle,
  CheckCircle2Icon,
  CheckCircleIcon,
  Icon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "flex items-center justify-between rounded-lg p-4 text-sm w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const Banner = ({ label, variant }: BannerProps) => {
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" iconNode={[]} />
      {label}
    </div>
  );
};

export default Banner;
