import React from "react";
import { useApp } from "@/context/AppContext";
import { Clock } from "lucide-react";

import { PrimarieDashboard } from "./dashboards/PrimarieDashboard";
import { FurnizorDashboard } from "./dashboards/FurnizorDashboard";
import { AdminDashboard } from "./dashboards/AdminDashboard";

export function Dashboard() {
  const { profile } = useApp();

  // Dacă profilul nu există sau nu are un rol, arătăm un ecran de "Așteptare Aprobare"
  if (!profile || !profile.role) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner mb-6">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Cont în așteptare</h2>
        <p className="text-lg text-slate-500 max-w-md">
          Contul tău a fost creat cu succes, dar nu are încă un rol atribuit. 
          Te rugăm să aștepți ca un administrator să îți aprobe accesul.
        </p>
      </div>
    );
  }

  // Aici facem MAGIC ROUTING pe bază de rol!
  switch (profile.role) {
    case "admin":
      return <AdminDashboard />;
    case "furnizor":
      return <FurnizorDashboard />;
    case "primarie":
      return <PrimarieDashboard />;
    default:
      return (
        <div className="text-center py-20 text-rose-500 font-bold">
          Eroare: Rol necunoscut ({profile.role}). Contactați administratorul.
        </div>
      );
  }
}