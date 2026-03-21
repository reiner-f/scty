import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Plus, LayoutDashboard, Loader2 } from "lucide-react";
import { RequestList } from "@/components/requests/RequestList";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";

export function PrimarieDashboard() {
  const { filteredRequests, filters, setFilter, isLoadingRequests } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center shadow-sm">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panou Primărie</h1>
            <p className="text-slate-500">Gestionează cererile tale către furnizori</p>
          </div>
        </div>
        <Link to="/create-request">
          <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>Cerere Nouă</Button>
        </Link>
      </div>

      <SearchBar
        value={filters.searchQuery || ""}
        onChange={(value) => setFilter("searchQuery", value)}
        placeholder="Caută în cererile tale..."
      />

      {isLoadingRequests ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>
      ) : (
        <RequestList requests={filteredRequests} title="Cererile Mele" />
        // Observă că NU i-am pasat onUpdateStatus. Deci primăria nu poate da "Accept/Reject".
      )}
    </div>
  );
}