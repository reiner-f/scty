import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Plus, FileStack, CheckCircle, XCircle, Clock, Loader2, LayoutDashboard } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RequestList } from "@/components/requests/RequestList";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";

export function Dashboard() {
  const {
    stats,
    filteredRequests,
    filters,
    setFilter,
    updateRequest,
    notifySuccess,
    notifyError,
    isLoadingRequests,
  } = useApp();

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
    <div id="centria_dashboard" className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-sm">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
            <p className="text-lg text-primary-500 mt-0.5">
              Gestionează cererile către furnizori
            </p>
          </div>
        </div>
        <Link to="/create-request">
          <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
            Cerere Nouă
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Cereri" value={stats.total} icon={FileStack} color="blue" delay={0} />
        <StatsCard title="Acceptate" value={stats.accepted} icon={CheckCircle} color="green" delay={0.1} />
        <StatsCard title="Respinse" value={stats.rejected} icon={XCircle} color="red" delay={0.2} />
        <StatsCard title="În Așteptare" value={stats.pending} icon={Clock} color="yellow" delay={0.3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
      >
        <SearchBar
          value={filters.searchQuery || ""}
          onChange={(value) => setFilter("searchQuery", value)}
          placeholder="Caută după titlu, serviciu sau furnizor..."
        />
        <div className="flex gap-2">
          <Link to="/history">
            <Button variant="outline" leftIcon={<FileStack className="w-4 h-4" />}>
              Vezi Istoric
            </Button>
          </Link>
        </div>
      </motion.div>

      {isLoadingRequests ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-primary-400 mb-4" />
          <span className="text-lg text-primary-500">Se încarcă cererile...</span>
        </div>
      ) : (
        <RequestList
          requests={filteredRequests}
          title="Cereri Recente"
          emptyMessage="Nu există cereri. Creează prima ta cerere!"
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
}
