import React, { useState, useEffect, InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import { classNames } from "@/utils/helpers";

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Caută după serviciu sau furnizor...",
  debounceMs = 300,
  className,
  ...props
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // 1. Sincronizăm starea locală dacă valoarea din exterior se schimbă (ex: buton de "Reset Filters" în pagina părinte)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // 2. Metoda nativă și 100% sigură (Memory-Leak Free) pentru Debounce în React
  useEffect(() => {
    const handler = setTimeout(() => {
      // Trimitem către părinte doar dacă valoarea locală diferă de cea primită
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    // Funcția de cleanup: dacă utilizatorul tastează din nou înainte de expirarea timpului, anulăm timer-ul vechi
    return () => {
      clearTimeout(handler);
    };
  }, [localValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setLocalValue("");
    onChange(""); // Când dăm clear, vrem ca efectul să fie instant, nu așteptăm debounce-ul
  };

  return (
    <div className={classNames("relative w-full", className)}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5" />
      </div>
      
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        // Accesibilitate pentru Screen Readers
        aria-label={placeholder}
        className={classNames(
          // Baza: Dimensiuni consistente cu componenta Input
          "w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 transition-all duration-200",
          // Tipografie: iOS Zoom Fix (text-base)
          "text-base md:text-sm text-slate-900 placeholder:text-slate-400",
          // Focus Ring modern (halou translucid)
          "border-slate-200 hover:border-slate-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20",
          // Starea disabled
          "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
        )}
        {...props}
      />
      
      {localValue && (
        <button
          type="button" // CRITIC: Previne trimiterea accidentală a formularului la apăsarea pe "X"
          onClick={handleClear}
          aria-label="Șterge căutarea"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:text-primary-600 rounded-r-xl"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}