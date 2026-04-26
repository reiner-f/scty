import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Bell, Menu, X, LogOut, Moon, Sun, MonitorSmartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { classNames, formatDateTime } from "@/utils/helpers";
import { authService } from "@/services/authService";
import logoImg from "@/assets/logo.png"; 

export function Header() {
  const location = useLocation();
  const { toggleProfile, stats, profile, isDarkMode, toggleDarkMode, activityLogs } = useApp(); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState("");

  // Extragere Sistem Operare și Browser (ERP Style)
  useEffect(() => {
    const ua = navigator.userAgent;
    let os = "Desktop";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/mac/i.test(ua)) os = "MacOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/ios|iphone|ipad/i.test(ua)) os = "iOS";

    let browser = "Browser";
    if (/edg/i.test(ua)) browser = "Edge";
    else if (/chrome/i.test(ua)) browser = "Chrome";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/firefox/i.test(ua)) browser = "Firefox";

    setDeviceInfo(`${os} • ${browser}`);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Eroare la deconectare:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg p-1 -ml-1"
            >
              <img 
                src={logoImg} 
                alt="Centria Logo" 
                className="h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
              />
            </Link>

            {/* Informații Dispozitiv (Stil ERP) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-sky-900/40 border border-white/10 rounded-lg shadow-inner ml-2">
              <MonitorSmartphone className="w-4 h-4 text-sky-200" />
              <span className="text-xs text-sky-100 font-medium">{deviceInfo}</span>
            </div>

            <nav className="hidden md:flex items-center gap-2 ml-4">
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
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-sky-100 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              title={isDarkMode ? "Activare Mod Luminos" : "Activare Mod Întunecat"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Dropdown Notificări JSON */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-sky-100 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Bell className="w-5 h-5" />
                {activityLogs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full border border-sky-800 shadow-sm" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[400px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 dark:text-white">Activitate Recentă</h3>
                      <span className="text-xs font-semibold bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">{activityLogs.length} noi</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                      {activityLogs.length === 0 ? (
                        <p className="p-4 text-sm text-slate-500 text-center">Nicio activitate înregistrată.</p>
                      ) : (
                        activityLogs.map(log => (
                          <div key={log.id} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug mb-1.5">{log.details}</p>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-sky-600 dark:text-sky-400 font-semibold">{log.actor}</span>
                              <span className="text-slate-400">{formatDateTime(log.timestamp)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleProfile}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/5 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Profil</span>
            </button>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-100 hover:bg-rose-500/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              title="Deconectare"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Ieșire</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-sky-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
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
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                <button
                  onClick={() => { toggleProfile(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-sky-100 hover:bg-white/10 hover:text-white transition-colors text-left"
                >
                  <User className="w-5 h-5" />
                  Profilul Meu
                </button>

                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 mt-1 rounded-lg text-base font-medium text-rose-200 hover:bg-rose-500/20 hover:text-white transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Deconectare
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}