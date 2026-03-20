import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building2, User, Bell, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { classNames } from "@/utils/helpers";

export function Header() {
  const location = useLocation();
  // Am adăugat `profile` aici pentru a ști ce rol are utilizatorul logat
  const { toggleProfile, stats, profile } = useApp(); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Închide meniul de mobil automat dacă se redimensionează fereastra (pe desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Meniu Inteligent în funcție de rolul utilizatorului
  let navLinks: { path: string; label: string }[] = [];
  
  if (profile?.role === 'admin') {
    navLinks = [
      { path: "/", label: "Dashboard (Toate Cererile)" },
      { path: "/history", label: "Istoric General" },
    ];
  } else if (profile?.role === 'primarie') {
    navLinks = [
      { path: "/", label: "Cererile Mele" },
      { path: "/create-request", label: "Cerere Nouă" },
      { path: "/history", label: "Istoric" },
    ];
  } else if (profile?.role === 'furnizor') {
    navLinks = [
      { path: "/", label: "Cereri Primite" },
      { path: "/history", label: "Istoric Execuție" },
    ];
  } else {
    // Fallback de siguranță în caz că profilul se încarcă puțin mai greu
    navLinks = [
      { path: "/", label: "Dashboard" }
    ];
  }

  return (
    <header
      id="centria_header"
      className="sticky top-0 z-40 border-b border-sky-800 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-600 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Partea Stângă: Logo & Navigare Desktop */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg p-1 -ml-1"
              aria-label="Acasă"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner group-hover:bg-white/25 transition-colors">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">Centria</span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={classNames(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                      isActive
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-sky-100 hover:bg-white/10 hover:text-white"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Partea Dreaptă: Statistici & Acțiuni */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Badge Statistici (Doar dacă sunt cereri pending) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-900/40 border border-white/10 rounded-lg shadow-inner">
              <span className="text-sm text-sky-200">Pending:</span>
              <span className="text-sm font-bold text-white">{stats.pending}</span>
            </div>

            {/* Buton Notificări */}
            <button 
              className="relative p-2 rounded-lg text-sky-100 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Notificări"
            >
              <Bell className="w-5 h-5" />
              {stats.pending > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full border border-sky-800 shadow-sm" />
              )}
            </button>

            {/* Buton Profil */}
            <button
              onClick={toggleProfile}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/5 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Deschide meniul de profil"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Profil</span>
            </button>

            {/* Buton Meniu Mobil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-sky-100 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label={mobileMenuOpen ? "Închide meniul" : "Deschide meniul"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Meniu Navigare Mobil */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
              id="mobile-menu"
            >
              <div className="flex flex-col gap-1 pb-4 pt-2 border-t border-white/10 mt-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={classNames(
                        "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-sky-100 hover:bg-white/10 hover:text-white"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                {/* Buton Profil Mobil */}
                <button
                  onClick={() => {
                    toggleProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-base font-medium text-sky-100 hover:bg-white/10 hover:text-white transition-colors text-left"
                >
                  <User className="w-5 h-5" />
                  Profilul Meu
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}