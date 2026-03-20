import React, { InputHTMLAttributes, forwardRef, useId } from "react";
import { classNames } from "@/utils/helpers";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, disabled, ...props }, ref) => {
    // Generăm ID-uri sigure pentru SSR și Accesibilitate
    const reactId = useId();
    const inputId = id || reactId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={classNames(
              "text-sm font-medium text-primary-700",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center justify-center pointer-events-none text-primary-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            // Accesibilitate vitală: spune asistentelor vocale că inputul are o eroare și unde să citească mesajul
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={classNames(
              // Baza: Dimensiuni și tipografie corecte
              "w-full rounded-lg border bg-white px-3 py-2.5 transition-all duration-200",
              // text-base este critic pe mobile pentru a preveni auto-zoom-ul enervant pe iOS Safari
              "text-base md:text-sm text-primary-900 placeholder:text-primary-400",
              // Focus modern: outline fin + ring translucid
              "focus:outline-none focus:ring-4",
              // Starea de "Disabled"
              "disabled:bg-primary-50 disabled:text-primary-500 disabled:cursor-not-allowed",
              // Stări dinamice (Eroare vs Normal)
              error
                ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected/20"
                : "border-primary-200 hover:border-primary-300 focus:border-baby-blue focus:ring-baby-blue/20",
              // Padding dinamic pentru iconițe
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 flex items-center justify-center text-primary-400">
              {/* Nu punem pointer-events-none aici, poate vrei să dai click pe un icon de "Arată Parola" */}
              {rightIcon}
            </div>
          )}
        </div>

        {/* Zona de mesaje */}
        {error ? (
          <p id={errorId} className="text-sm text-status-rejected font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-sm text-primary-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";