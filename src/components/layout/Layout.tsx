import React, { ReactNode } from "react";
import { motion } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ProfileModal } from "../profile/ProfileModal";
import { NotificationContainer } from "../notifications/NotificationContainer";
// Importăm noul Chatbot
import { Chatbot } from "../chatbot/Chatbot";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div 
      id="centria_layout" 
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 relative selection:bg-sky-200 selection:text-sky-900 transition-colors duration-300"
    >
      {/* Element de design: Un "Glow" subtil în partea de sus a paginii (sub header) */}
      <div 
        className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-sky-100/40 to-transparent pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Overlays Globale (Modale, Notificări și Chatbot) */}
      <NotificationContainer />
      <ProfileModal />
      
      {/* Chatbot-ul este plasat aici pentru a pluti deasupra conținutului pe orice pagină */}
      <Chatbot />
      
      <Header />
      
      {/* motion.main pentru tranziții fluide între pagini */}
      <motion.main 
        id="main-content" // Crucial pentru accesibilitate
        className="flex-1 relative z-10 flex flex-col"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-1">
          {children}
        </div>
      </motion.main>
      
      {/* Footer-ul rămâne mereu la baza paginii */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
}