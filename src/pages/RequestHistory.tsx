import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, History, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { RequestList } from "@/components/requests/RequestList";
import { RequestFilters } from "@/components/requests/RequestFilters";
import { ExportButtons } from "@/components/requests/ExportButtons";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";

export function RequestHistory() {
  const { filteredRequests, filters, setFilter, clearFilters, updateRequest, notifySuccess, notifyError } = useApp();

  // NOU: Starea pentru selecția manuală (array cu ID-urile bifate)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Funcție de toggle pentru checkbox
  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) // Dacă e deja bifat, îl scoatem
        : [...prev, id] // Altfel îl adăugăm
    );
  };

  const handleStatusUpdate = async (id: string, status: "accepted" | "rejected" | "pending") => {
    try {
      await updateRequest(id, { status });
      const messages: Record<string, string> = {
        accepted: "Cererea a fost acceptată!",
        rejected: "Cererea a fost respinsă!",
        pending: "Cererea a fost resetată la pending!",
      };
      notifySuccess(messages[status]);
    } catch {
      notifyError("A apărut o eroare la actualizarea cererii");
    }
  };

  // NOU: Datele finale pentru export. 
  // Dacă avem selecție manuală, dăm doar acele elemente. Altfel dăm tot filtrul.
  const dataToExport = selectedIds.length > 0 
    ? filteredRequests.filter(req => selectedIds.includes(req.id))
    : filteredRequests;

  return (
    <div id="centria_request-history" className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Înapoi
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-sky-600 dark:text-sky-400 transition-colors" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Istoric Cereri</h1>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-1 transition-colors">
              Vizualizează, filtrează și exportă cererile
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="w-full sm:w-64">
            <SearchBar
              value={filters.searchQuery || ""}
              onChange={(value) => setFilter("searchQuery", value)}
              placeholder="Caută cereri..."
            />
          </div>
          
          {/* Trimitem selecția curentă către butoanele de Export */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedIds.length > 0 && (
              <button 
                onClick={() => setSelectedIds([])}
                className="text-sm text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 shrink-0"
                title="Deselectează tot"
              >
                <XCircle className="w-4 h-4" /> Reset
              </button>
            )}
            <ExportButtons 
              data={dataToExport} 
              selectedCount={selectedIds.length} 
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <RequestFilters
          filters={filters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Trimitem proprietățile de selecție către Listă */}
        <RequestList
          requests={filteredRequests}
          emptyMessage="Nu s-au găsit cereri cu filtrele selectate"
          onUpdateStatus={handleStatusUpdate}
          selectedIds={selectedIds}
          onToggleSelection={handleToggleSelection}
        />
      </motion.div>
    </div>
  );
}