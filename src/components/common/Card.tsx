import React, { ReactNode, KeyboardEvent } from "react";
import { classNames } from "@/utils/helpers";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  const paddingSizes = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const isInteractive = !!onClick;
  const showHoverEffect = hover || isInteractive;

  // activarea cardului prin tastatura (Enter sau Space)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={classNames(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm bg-clip-border text-slate-900 dark:text-slate-100",
        paddingSizes[padding],
        showHoverEffect && "transition-all duration-300 ease-out hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5",
        isInteractive && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-[0.98]",
        
        className
      )}
    >
      {children}
    </div>
  );
}