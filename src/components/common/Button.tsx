import React, { ButtonHTMLAttributes } from "react";
import { classNames } from "@/utils/helpers";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    // Folosim flex și gap pentru a alinia perfect textul și iconițele, fără margini manuale
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-600 hover:to-primary-600 focus-visible:ring-primary-500 shadow-sm hover:shadow",
    secondary:
      "bg-primary-50 text-primary-700 hover:bg-primary-100 focus-visible:ring-primary-300",
    outline:
      "border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 focus-visible:ring-primary-300",
    ghost:
      "text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-300",
    danger:
      "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-500 hover:to-rose-600 focus-visible:ring-red-400 shadow-sm hover:shadow",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
  };

  return (
    <button
      className={classNames(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4" // Am scos marginile hardcodate; Flex gap rezolvă asta.
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Afișăm leftIcon DOAR dacă NU se încarcă */}
      {!isLoading && leftIcon && <span>{leftIcon}</span>}
      
      {/* Învelim textul într-un span pentru consistență la animații (opțional, dar recomandat) */}
      <span>{children}</span>
      
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}