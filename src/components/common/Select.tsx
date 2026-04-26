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
  ({ label, error, helperText, options, placeholder, className, id, disabled, value, defaultValue, ...props }, ref) => {
    // Generăm ID-uri sigure pentru React
    const reactId = useId();
    const selectId = id || reactId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    // REPARAT: Determinăm dacă componenta este controlată (folosește value) sau necontrolată
    const isControlled = value !== undefined;
    
    // Setăm valoarea implicită corectă pentru a evita warning-ul de "uncontrolled vs controlled"
    const resolvedValue = isControlled ? (value || "") : undefined;
    const resolvedDefault = !isControlled ? (defaultValue || (placeholder ? "" : undefined)) : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className={classNames(
              "text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors",
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
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={classNames(
              "w-full appearance-none rounded-lg border bg-white dark:bg-slate-900 pl-3 pr-10 py-2.5 transition-all duration-200",
              "text-base md:text-sm text-slate-900 dark:text-slate-100",
              "focus:outline-none focus:ring-4",
              "disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed disabled:opacity-100",
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-sky-500 focus:ring-sky-500/20",
              className
            )}
            value={resolvedValue}
            defaultValue={resolvedDefault}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-500 dark:text-slate-400">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                className="text-slate-900 dark:text-slate-100 dark:bg-slate-900"
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute right-3 flex items-center justify-center pointer-events-none text-slate-400 dark:text-slate-500 transition-colors">
            <ChevronDown className={classNames("w-5 h-5", disabled && "opacity-50")} />
          </div>
        </div>

        {error ? (
          <p id={errorId} className="text-sm text-rose-500 dark:text-rose-400 font-medium transition-colors">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";