import React, { SelectHTMLAttributes, forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { classNames } from "@/utils/helpers";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className, id, disabled, ...props }, ref) => {
    // Generăm ID-uri sigure pentru React (SSR & Accesibilitate)
    const reactId = useId();
    const selectId = id || reactId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className={classNames(
              "text-sm font-medium text-slate-700",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            // Accesibilitate vitală
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={classNames(
              // Baza: Dimensiuni consistente cu componenta Input, ascundem designul nativ
              "w-full appearance-none rounded-lg border bg-white pl-3 pr-10 py-2.5 transition-all duration-200",
              // text-base previne zoom-ul forțat pe iOS Safari când se deschide meniul
              "text-base md:text-sm text-slate-900",
              // Focus modern: outline fin + ring translucid
              "focus:outline-none focus:ring-4",
              // Starea de "Disabled"
              "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed disabled:opacity-100",
              // Stări dinamice (Eroare vs Normal)
              error
                ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected/20"
                : "border-slate-200 hover:border-slate-300 focus:border-baby-blue focus:ring-baby-blue/20",
              className
            )}
            // Dacă ai placeholder, asigură-te că valoarea implicită e un string gol
            defaultValue={placeholder ? "" : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-500">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="text-slate-900">
                {option.label}
              </option>
            ))} {/* <--- Aici e reparația, am închis paranteza de la map */}
          </select>
          
          {/* Săgeata Custom */}
          <div className="absolute right-3 flex items-center justify-center pointer-events-none text-slate-400">
            <ChevronDown className={classNames("w-5 h-5", disabled && "opacity-50")} />
          </div>
        </div>

        {/* Zona de mesaje */}
        {error ? (
          <p id={errorId} className="text-sm text-status-rejected font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-sm text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";