import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Select } from "../common/Select";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { useApp } from "@/context/AppContext";
import { RequestStatus, FilterOptions } from "@/types";

export interface RequestFiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
  onClearFilters: () => void;
}

export function RequestFilters({ filters, onFilterChange, onClearFilters }: RequestFiltersProps) {
  // Preluăm doar listele (furnizori și servicii) din contextul global, 
  // filtrele propriu-zise sunt primite prin props din componenta părinte.
  const { providers, services } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-600 dark:text-sky-400" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Filtrează cererile</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearFilters} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Resetează
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select
          label="Status"
          value={filters.status || "all"}
          // REPARAȚIA: Adăugarea asertării "as RequestStatus | 'all'" și folosirea funcției din props
          onChange={(e) => onFilterChange("status", e.target.value as RequestStatus | "all")}
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
          onChange={(e) => onFilterChange("providerId", e.target.value)}
          options={providers.map(p => ({ value: p.id, label: p.name }))}
        />
        <Select
          label="Serviciu"
          placeholder="Toate serviciile"
          value={filters.serviceId || ""}
          onChange={(e) => onFilterChange("serviceId", e.target.value)}
          options={services.map(s => ({ value: s.id, label: s.name }))}
        />
        <Input 
          label="De la" 
          type="date" 
          value={filters.dateFrom || ""} 
          onChange={(e) => onFilterChange("dateFrom", e.target.value)} 
        />
        <Input 
          label="Până la" 
          type="date" 
          value={filters.dateTo || ""} 
          onChange={(e) => onFilterChange("dateTo", e.target.value)} 
        />
      </div>
    </div>
  );
}