import React, { ReactNode, KeyboardEvent } from "react";
import { classNames } from "@/utils/helpers";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  /** Activează efectul de hover vizual. Se activează automat dacă există un onClick */
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
  // Am mărit puțin padding-urile pentru a respira mai bine designul (standard modern)
  const paddingSizes = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const isInteractive = !!onClick;
  const showHoverEffect = hover || isInteractive;

  // Permitem activarea cardului și de pe tastatură (Enter sau Space)
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
      // Dacă primește onClick, browserul trebuie să știe că acest div se comportă ca un buton
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={classNames(
        // Baza: Colțuri mai rotunjite (xl) și un border subtil
        "bg-white rounded-xl border border-slate-200 shadow-sm bg-clip-border",
        paddingSizes[padding],
        
        // Efectul de hover: o umbră mai fină și o ridicare subtilă (-translate-y-1)
        showHoverEffect && "transition-all duration-300 ease-out hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5",
        
        // Interactivitate și Accesibilitate
        isInteractive && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-[0.98]",
        
        className
      )}
    >
      {children}
    </div>
  );
}