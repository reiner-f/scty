import React, { InputHTMLAttributes, forwardRef, useId } from "react";
import { Check } from "lucide-react";
import { classNames } from "@/utils/helpers";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  /** Opțional: Un text secundar mai mic sub label, foarte util în formulare complexe */
  description?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, size = "md", disabled, ...props }, ref) => {
    // Folosim useId pentru a genera ID-uri sigure și unice garantat de React
    const reactId = useId();
    const checkboxId = id || reactId;

    // Mapăm mărimile pentru a păstra consistența cu componentele Button și Badge
    const sizes = {
      sm: { container: "w-4 h-4", icon: "w-3 h-3", text: "text-sm", gap: "ml-2.5" },
      md: { container: "w-5 h-5", icon: "w-3.5 h-3.5", text: "text-base", gap: "ml-3" },
      lg: { container: "w-6 h-6", icon: "w-4 h-4", text: "text-lg", gap: "ml-3.5" },
    };

    const currentSize = sizes[size];

    return (
      <div className={classNames("flex items-start", className)}>
        {/* Containerul păstrează elementele ca "frați" pentru ca `peer` să funcționeze perfect */}
        <div 
          className={classNames(
            "relative flex items-center justify-center shrink-0 mt-0.5", 
            currentSize.container
          )}
        >
          {/* Input-ul invizibil, dar care primește interacțiunile și focusul */}
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed m-0"
            {...props}
          />
          
          {/* Fundalul / Border-ul Checkbox-ului */}
          <div
            className={classNames(
              "absolute inset-0 rounded border-2 border-slate-300 bg-white transition-colors duration-200 pointer-events-none",
              "peer-checked:bg-primary-500 peer-checked:border-primary-500",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2",
              disabled ? "opacity-50" : ""
            )}
          />
          
          {/* Iconița (apare cu un efect de zoom "scale" și fade-in) */}
          <Check
            strokeWidth={3}
            className={classNames(
              "absolute text-white pointer-events-none transition-all duration-200 ease-out",
              "opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100",
              currentSize.icon
            )}
          />
        </div>
        
        {/* Zona de Text (Label + Description) */}
        {(label || description) && (
          <div className={classNames("flex flex-col", currentSize.gap)}>
            {label && (
              <label
                htmlFor={checkboxId}
                className={classNames(
                  "font-medium text-slate-700 select-none",
                  currentSize.text,
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p 
                className={classNames(
                  "text-slate-500", 
                  size === "sm" ? "text-xs" : "text-sm", 
                  disabled && "opacity-50"
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";