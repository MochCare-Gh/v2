
import { cn } from "@/lib/utils";

type StatusType = "antenatal" | "postnatal" | "delivered" | "default";

interface StatusPillProps {
  status: StatusType;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const statusConfig = {
    antenatal: {
      label: "Ante-natal",
      className: "bg-blue-100 text-blue-800 border-blue-300",
    },
    postnatal: {
      label: "Post-natal",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    delivered: {
      label: "Delivered",
      className: "bg-purple-100 text-purple-800 border-purple-300",
    },
    default: {
      label: "Unknown",
      className: "bg-gray-100 text-gray-800 border-gray-300",
    },
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
