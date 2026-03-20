import React, { TextareaHTMLAttributes, forwardRef, useId } from "react";
import { classNames } from "@/utils/helpers";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, disabled, ...props }, ref) => {
    // Generăm ID-uri sigure pentru React (SSR & Accesibilitate)
    const reactId = useId();
    const textareaId = id || reactId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className={classNames(
              "text-sm font-medium text-slate-700",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          // Accesibilitate vitală
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={classNames(
            // Baza: Dimensiuni consistente cu Input, înălțime minimă și redimensionare doar pe verticală
            "w-full rounded-lg border bg-white px-3 py-2.5 transition-all duration-200 resize-y min-h-[100px]",
            // text-base previne zoom-ul forțat pe iOS Safari când utilizatorul dă click să scrie
            "text-base md:text-sm text-slate-900 placeholder:text-slate-400",
            // Focus modern: outline fin + ring translucid
            "focus:outline-none focus:ring-4",
            // Starea de "Disabled"
            "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
            // Stări dinamice (Eroare vs Normal)
            error
              ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected/20"
              : "border-slate-200 hover:border-slate-300 focus:border-baby-blue focus:ring-baby-blue/20",
            className
          )}
          {...props}
        />
        
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

Textarea.displayName = "Textarea";