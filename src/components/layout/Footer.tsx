import React, { useState, useEffect } from "react";
import { Building2, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

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
            
            {/* Secțiunea Logo & Nume */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-wide block">
                  Centria
                </span>
                <span className="text-sm text-sky-200">
                  Administrație Publică
                </span>
              </div>
            </div>

            {/* Secțiunea Descriere */}
            <p className="text-sm md:text-base text-sky-100 text-center md:text-right max-w-sm">
              Platformă inteligentă de management al cererilor și resurselor administrative.
            </p>
          </div>
        </div>

        {/* Secțiunea de Copyright curată */}
        <div className="border-t border-white/10 py-4 bg-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <p className="text-sm text-sky-200/70 text-center">
              &copy; {currentYear} Centria. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </footer>

      {/* Butonul de Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Înapoi sus"
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 p-3 rounded-full bg-white text-sky-700 shadow-xl border border-sky-100 hover:bg-sky-50 hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-sky-500/30"
          >
            <ArrowUp className="w-6 h-6" strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}