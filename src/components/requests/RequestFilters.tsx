import React from "react";
import { Filter, X } from "lucide-react";
import { Select } from "../common/Select";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { FilterOptions, RequestStatus } from "@/types";
import { providers, services } from "@/data/mockData";

interface RequestFiltersProps {
  filters: FilterOptions;
  onFilterChange: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  onClearFilters: () => void;
}

export function RequestFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: RequestFiltersProps) {
  const statusOptions = [
    { value: "all", label: "Toate Statusurile" },
    { value: "accepted", label: "Acceptate" },
    { value: "rejected", label: "Respinse" },
    { value: "pending", label: "În Așteptare" },
  ];

  const providerOptions = [
    { value: "", label: "Toți Furnizorii" },
    ...providers.map((p) => ({ value: p.id, label: p.name })),
  ];

  const serviceOptions = [
    { value: "", label: "Toate Serviciile" },
    ...services.map((s) => ({ value: s.id, label: s.name })),
  ];

  const hasActiveFilters =
    (filters.status && filters.status !== "all") ||
    filters.providerId ||
    filters.serviceId ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="bg-white rounded-2xl border border-primary-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-baby-dark" />
        <h3 className="text-lg font-semibold text-primary-900">Filtre</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto"
            leftIcon={<X className="w-4 h-4" />}
          >
            Resetează
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status || "all"}
          onChange={(e) =>
            onFilterChange("status", e.target.value as RequestStatus | "all")
          }
        />

        <Select
          label="Furnizor"
          options={providerOptions}
          value={filters.providerId || ""}
          onChange={(e) => onFilterChange("providerId", e.target.value || undefined)}
        />

        <Select
          label="Serviciu"
          options={serviceOptions}
          value={filters.serviceId || ""}
          onChange={(e) => onFilterChange("serviceId", e.target.value || undefined)}
        />

        <Input
          label="De la data"
          type="date"
          value={filters.dateFrom || ""}
          onChange={(e) => onFilterChange("dateFrom", e.target.value || undefined)}
        />

        <Input
          label="Până la data"
          type="date"
          value={filters.dateTo || ""}
          onChange={(e) => onFilterChange("dateTo", e.target.value || undefined)}
        />
      </div>
    </div>
  );
}