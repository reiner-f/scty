import { useState, useCallback, useMemo, useEffect } from "react";
import { Request, FilterOptions, DashboardStats } from "@/types";
import { 
  fetchRequests, 
  createRequest as createRequestApi, 
  updateRequest as updateRequestApi, 
  deleteRequest as deleteRequestApi 
} from "@/services/requestService";

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    searchQuery: "",
  });

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError("Nu s-au putut încărca cererile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const addRequest = useCallback(async (request: Omit<Request, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: string; updatedAt?: string }) => {
    try {
      const newRequest = await createRequestApi(request);
      setRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      console.error("Failed to create request:", err);
      throw err;
    }
  }, []);

  const updateRequest = useCallback(async (id: string, updates: Partial<Request>) => {
    try {
      const updatedRequest = await updateRequestApi(id, updates);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? updatedRequest : req))
      );
      return updatedRequest;
    } catch (err) {
      console.error("Failed to update request:", err);
      throw err;
    }
  }, []);

  const deleteRequest = useCallback(async (id: string) => {
    try {
      await deleteRequestApi(id);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error("Failed to delete request:", err);
      throw err;
    }
  }, []);

  const setFilter = useCallback(
    <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      status: "all",
      searchQuery: "",
    });
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (filters.status && filters.status !== "all") {
        if (request.status !== filters.status) return false;
      }

      if (filters.providerId) {
        if (request.providerId !== filters.providerId) return false;
      }

      if (filters.serviceId) {
        if (request.serviceId !== filters.serviceId) return false;
      }

      if (filters.dateFrom) {
        if (new Date(request.createdAt) < new Date(filters.dateFrom)) return false;
      }

      if (filters.dateTo) {
        if (new Date(request.createdAt) > new Date(filters.dateTo)) return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = request.title.toLowerCase().includes(query);
        const matchesProvider = request.providerName.toLowerCase().includes(query);
        const matchesService = request.serviceName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesProvider && !matchesService) return false;
      }

      return true;
    });
  }, [requests, filters]);

  const stats: DashboardStats = useMemo(() => {
    return {
      total: requests.length,
      accepted: requests.filter((r) => r.status === "accepted").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
      pending: requests.filter((r) => r.status === "pending").length,
    };
  }, [requests]);

  return {
    requests,
    filteredRequests,
    filters,
    stats,
    isLoading,
    error,
    addRequest,
    updateRequest,
    deleteRequest,
    setFilter,
    clearFilters,
    refreshRequests: loadRequests,
  };
}
