import React, { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { classNames } from "@/utils/helpers";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Opțional: Împiedică închiderea când se dă click în afara modalului */
  preventOutsideClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  preventOutsideClick = false,
}: ModalProps) {
  // Referință către containerul interior al modalului pentru a gestiona focusul
  const modalRef = useRef<HTMLDivElement>(null);

  // 1. Gestiunea Overflow-ului (Scroll Lock)
  useEffect(() => {
    if (isOpen) {
      // Calculăm lățimea scrollbar-ului pentru a preveni saltul paginii (layout shift)
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // 2. Gestiunea Escape Key și Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      // Focus Trap simplificat: Prevenim Tab-ul să iasă din modal (opțional, dar recomandat pt a11y)
      // O implementare completă ar necesita o bibliotecă precum `focus-trap-react`
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Mutăm focusul pe modal la deschidere pentru Screen Readers
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl", // xl ar trebui să fie vizibil mai mare decât lg
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={preventOutsideClick ? undefined : onClose}
            aria-hidden="true"
          />
          
          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            // Atribute vitale de accesibilitate
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            tabIndex={-1} // Permite mutarea focusului programatic
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }} // Animație mai naturală
            className={classNames(
              "relative w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800",
              sizes[size]
            )}
          >
            {/* Header (Sticky, nu se va mișca când dai scroll în conținut) */}
            {title && (
              <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                <h2 id="modal-title" className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Închide fereastra"
                  className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Body (Doar această zonă va avea scroll) */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // 3. React Portal: Randăm modalul direct în <body> pentru a evita problemele de z-index
  if (typeof document === "undefined") return null; // Safety check pentru SSR
  
  return createPortal(modalContent, document.body);
}