import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { RequestStatus } from "@/types";
import { getStatusLabel, classNames } from "@/utils/helpers";

interface BadgeProps {
  status: RequestStatus;
  size?: "sm" | "md" | "lg";
  /** efect animatie pentru statusul 'pending' */
  animated?: boolean;
}

const statusConfig = {
  accepted: {
    wrapper: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    icon: CheckCircle,
  },
  rejected: {
    wrapper: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    icon: XCircle,
  },
  pending: {
    wrapper: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    icon: Clock,
  },
};

const sizeConfig = {
  sm: {
    wrapper: "px-2 py-0.5 text-xs gap-1",
    icon: "w-3.5 h-3.5",
  },
  md: {
    wrapper: "px-2.5 py-1 text-sm gap-1.5",
    icon: "w-4 h-4",
  },
  lg: {
    wrapper: "px-3 py-1.5 text-base gap-2",
    icon: "w-5 h-5",
  },
};

export function Badge({ status, size = "md", animated = false }: BadgeProps) {
  const config = statusConfig[status];
  const sizing = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={classNames(
        "inline-flex items-center justify-center font-medium border shadow-sm",
        "rounded-full transition-colors duration-200 ease-in-out",
        config.wrapper,
        sizing.wrapper
      )}
    >
      <Icon 
        className={classNames(
          sizing.icon,
          animated && status === "pending" ? "animate-pulse" : ""
        )} 
        strokeWidth={2.5}
      />
      {getStatusLabel(status)}
    </span>
  );
}