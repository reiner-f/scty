import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Select } from "../common/Select";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { useApp } from "@/context/AppContext";
import { RequestStatus } from "@/types"; // Asigură-te că importul acesta există

export function RequestFilters() {
  const { filters, setFilter, clearFilters, providers, services } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-600" />
          <h3 className="font-semibold text-slate-800">Filtrează cererile</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Resetează
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select
          label="Status"
          value={filters.status || "all"}
          // REPARAȚIA: Adăugarea asertării "as RequestStatus | 'all'"
          onChange={(e) => setFilter("status", e.target.value as RequestStatus | "all")}
          options={[
            { value: "all", label: "Toate" },
            { value: "pending", label: "În așteptare" },
            { value: "accepted", label: "Acceptate" },
            { value: "rejected", label: "Respinse" },
          ]}
        />
        <Select
          label="Furnizor"
          placeholder="Toți furnizorii"
          value={filters.providerId || ""}
          onChange={(e) => setFilter("providerId", e.target.value)}
          options={providers.map(p => ({ value: p.id, label: p.name }))}
        />
        <Select
          label="Serviciu"
          placeholder="Toate serviciile"
          value={filters.serviceId || ""}
          onChange={(e) => setFilter("serviceId", e.target.value)}
          options={services.map(s => ({ value: s.id, label: s.name }))}
        />
        <Input label="De la" type="date" value={filters.dateFrom || ""} onChange={(e) => setFilter("dateFrom", e.target.value)} />
        <Input label="Până la" type="date" value={filters.dateTo || ""} onChange={(e) => setFilter("dateTo", e.target.value)} />
      </div>
    </div>
  );
}