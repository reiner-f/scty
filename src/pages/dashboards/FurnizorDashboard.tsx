import React from "react";
import { motion } from "motion/react";
import { Briefcase, Loader2, CheckCircle, Clock } from "lucide-react";
import { RequestList } from "@/components/requests/RequestList";
import { SearchBar } from "@/components/common/SearchBar";
import { useApp } from "@/context/AppContext";
import { StatsCard } from "@/components/dashboard/StatsCard";

export function FurnizorDashboard() {
  const { filteredRequests, filters, setFilter, updateRequest, notifySuccess, notifyError, isLoadingRequests, stats } = useApp();

  const handleStatusUpdate = async (id: string, status: "accepted" | "rejected" | "pending") => {
    try {
      await updateRequest(id, { status });
      notifySuccess(`Status actualizat la: ${status}`);
    } catch {
      notifyError("Eroare la actualizarea statusului.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-sm">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panou Furnizor</h1>
          <p className="text-slate-500">Vizualizează și răspunde la cererile primite</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard title="Cereri de Soluționat (Pending)" value={stats.pending} icon={Clock} color="yellow" />
        <StatsCard title="Cereri Acceptate" value={stats.accepted} icon={CheckCircle} color="green" />
      </div>

      <SearchBar value={filters.searchQuery || ""} onChange={(v) => setFilter("searchQuery", v)} placeholder="Caută în cererile primite..." />

      {isLoadingRequests ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
      ) : (
        <RequestList 
          requests={filteredRequests} 
          title="Cereri Atribuite Ție" 
          onUpdateStatus={handleStatusUpdate} // Furnizorul ARE voie să schimbe statusul
        />
      )}
    </div>
  );
}