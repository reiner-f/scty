import React, { ReactNode } from "react";
import { motion } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ProfileModal } from "../profile/ProfileModal";
import { NotificationContainer } from "../notifications/NotificationContainer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div 
      id="centria_layout" 
      // Am schimbat bg-primary-50 cu slate-50 pentru un aspect mai curat și neutru
      // Am adăugat `selection:bg-sky-200` ca atunci când selectezi un text să arate profi, nu acel albastru standard din browser
      className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-sky-200 selection:text-sky-900"
    >
      {/* Element de design: Un "Glow" subtil în partea de sus a paginii (sub header) */}
      <div 
        className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-sky-100/40 to-transparent pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Overlays Globale (Modale și Notificări stau cel mai bine la nivelul de top) */}
      <NotificationContainer />
      <ProfileModal />
      
      <Header />
      
      {/* Am transformat <main> într-un <motion.main> pentru ca fiecare pagină să apară fluid la încărcare */}
      <motion.main 
        id="main-content" // ID crucial pentru accesibilitate (permite butoanelor de "Skip to content" să funcționeze)
        className="flex-1 relative z-10 flex flex-col"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-1">
          {children}
        </div>
      </motion.main>
      
      {/* Am învelit Footer-ul pentru a ne asigura că stă mereu deasupra decorului de fundal */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
}