import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react"; 
import { useApp } from "@/context/AppContext";
import { Notification } from "@/types";
import { classNames } from "@/utils/helpers";

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

// Culori mai rafinate, cu borduri translucide pentru un efect subtil
const styleMap = {
  success: "bg-emerald-50 border-emerald-200/60 text-emerald-800",
  error: "bg-rose-50 border-rose-200/60 text-rose-800",
  warning: "bg-amber-50 border-amber-200/60 text-amber-800",
  info: "bg-blue-50 border-blue-200/60 text-blue-800",
};

const iconColorMap = {
  success: "text-emerald-500",
  error: "text-rose-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

// REPARAT: Am folosit forwardRef pentru ca Framer Motion să poată anima componenta la ieșire (exit)
const NotificationItem = forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ notification, onRemove }, ref) => {
    const Icon = iconMap[notification.type];

    return (
      <motion.div
        ref={ref} // Aici trimitem ref-ul către Framer Motion
        // Prop-ul MAGIC: Animație fluidă când o notificare este ștearsă iar celelalte se rearanjează
        layout 
        // Animație Apple-like: Apare de sus, cu un blur subtil
        initial={{ opacity: 0, y: -40, scale: 0.9, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.85, filter: "blur(2px)", transition: { duration: 0.2 } }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        
        // Accesibilitate vitală
        role="alert"
        aria-live="assertive"
        
        className={classNames(
          // Reactivăm pointer-events doar pentru notificare, nu pentru tot ecranul
          "pointer-events-auto flex items-start gap-3 w-full p-4 rounded-2xl border shadow-xl shadow-slate-200/50 backdrop-blur-sm",
          styleMap[notification.type]
        )}
      >
        {/* Iconița sus (în caz că textul e lung și se întinde pe 2 rânduri) */}
        <Icon className={classNames("w-5 h-5 flex-shrink-0 mt-0.5", iconColorMap[notification.type])} />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {notification.message}
          </p>
        </div>

        <button
          onClick={() => onRemove(notification.id)}
          aria-label="Închide notificarea"
          className="flex-shrink-0 p-1.5 -mr-1.5 -mt-1.5 rounded-lg opacity-50 hover:opacity-100 hover:bg-black/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }
);

// Nume de afișare necesar când folosim forwardRef (ajută la debugging)
NotificationItem.displayName = "NotificationItem";

export function NotificationContainer() {
  const { notifications, removeNotification } = useApp();

  return (
    <div 
      // pointer-events-none e CRITIC aici. Permite utilizatorului să dea click "prin" acest container
      // z-[150] asigură că va sta peste orice modal posibil
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[150] flex flex-col items-center gap-3 w-full max-w-sm px-4 pointer-events-none"
    >
      {/* mode="popLayout" previne salturile bruște în DOM când un element iese din scenă */}
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}