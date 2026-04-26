import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

// Importul oficial al logo-ului tău
import logoImg from "@/assets/logo.png";

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Logica pentru afișarea butonului de "Sus" la scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer
        id="centria_footer"
        className="mt-auto border-t border-sky-800 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Partea Stângă: Logo și Branding */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img 
                src={logoImg} 
                alt="Centria Logo" 
                className="h-10 w-auto object-contain" 
              />
              <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-sky-500 pt-3 sm:pt-0 sm:pl-4 mt-1 sm:mt-0">
                <span className="text-sm text-sky-200 block font-medium">
                  Administrație Publică
                </span>
                <span className="text-xs text-sky-300 block mt-0.5">
                  Platformă inteligentă de management.
                </span>
              </div>
            </div>

            {/* Partea Dreaptă: Link-uri de Navigare */}
            <div className="text-sm md:text-base text-sky-100 text-center md:text-right flex flex-wrap justify-center items-center gap-3">
              <Link 
                to="/team" 
                className="hover:text-white font-medium transition-colors"
              >
                Despre Developer
              </Link>
              <span className="opacity-30">|</span>
              <a href="/suport" className="hover:text-white transition-colors">
                Suport Tehnic
              </a>
              <span className="hidden sm:inline opacity-30">|</span>
              <a href="/termeni" className="hidden sm:inline hover:text-white transition-colors">
                Termeni și Condiții
              </a>
            </div>
          </div>
        </div>

        {/* Zona de Copyright */}
        <div className="border-t border-white/10 py-4 bg-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <p className="text-sm text-sky-200/70 text-center">
              &copy; {currentYear} Centria. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </footer>

      {/* Butonul animat de Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Înapoi sus"
            className="fixed bottom-6 right-24 md:bottom-10 md:right-28 z-50 p-3 rounded-full bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-400 shadow-xl border border-sky-100 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-sky-500/30"
          >
            <ArrowUp className="w-6 h-6" strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}