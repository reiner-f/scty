import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, History } from "lucide-react";
import { Link } from "react-router-dom";
import { RequestList } from "@/components/requests/RequestList";
import { RequestFilters } from "@/components/requests/RequestFilters";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";

export function RequestHistory() {
  const { filteredRequests, filters, setFilter, clearFilters, updateRequest, notifySuccess, notifyError } =
    useApp();

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

  return (
    <div id="centria_request-history" className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Înapoi
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-primary-500" />
              <h1 className="text-3xl font-bold text-primary-900">Istoric Cereri</h1>
            </div>
            <p className="text-lg text-primary-500 mt-1">
              Vizualizează și filtrează toate cererile anterioare
            </p>
          </div>
        </div>

        <SearchBar
          value={filters.searchQuery || ""}
          onChange={(value) => setFilter("searchQuery", value)}
          placeholder="Caută cereri..."
        />
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
        <RequestList
          requests={filteredRequests}
          emptyMessage="Nu s-au găsit cereri cu filtrele selectate"
          onUpdateStatus={handleStatusUpdate}
        />
      </motion.div>
    </div>
  );
}
