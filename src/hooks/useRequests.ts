import { useState, useCallback, useMemo, useEffect } from "react";
import { Request, FilterOptions, DashboardStats } from "@/types";
import { requestService } from "@/services/requestService";

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    searchQuery: "",
  });

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await requestService.fetchAll();
      setRequests(data);
    } catch (err) {
      console.error("Eroare la încărcare:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const addRequest = async (data: Omit<Request, "id" | "createdAt" | "updatedAt">) => {
    const newRequest = await requestService.create(data);
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const updateRequest = async (id: string, updates: Partial<Request>) => {
    const oldState = [...requests];
    setRequests(prev => prev.map(req => req.id === id ? { ...req, ...updates } : req));
    try {
      return await requestService.update(id, updates);
    } catch (err) {
      setRequests(oldState); // Rollback
      throw err;
    }
  };

  const deleteRequest = async (id: string) => {
    const oldState = [...requests];
    setRequests(prev => prev.filter(req => req.id !== id));
    try {
      await requestService.delete(id);
    } catch (err) {
      setRequests(oldState); // Rollback
      throw err;
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      if (filters.status && filters.status !== "all" && req.status !== filters.status) return false;
      if (filters.providerId && req.providerId !== filters.providerId) return false;
      if (filters.serviceId && req.serviceId !== filters.serviceId) return false;
      if (filters.dateFrom && new Date(req.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(req.createdAt) > new Date(filters.dateTo + "T23:59:59")) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return req.title.toLowerCase().includes(q) || req.providerName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [requests, filters]);

  const stats: DashboardStats = useMemo(() => ({
    total: requests.length,
    accepted: requests.filter(r => r.status === "accepted").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    pending: requests.filter(r => r.status === "pending").length,
  }), [requests]);

  return {
    requests, filteredRequests, filters, stats, isLoading,
    addRequest, updateRequest, deleteRequest,
    setFilter: (key: keyof FilterOptions, value: any) => setFilters(prev => ({ ...prev, [key]: value })),
    clearFilters: () => setFilters({ status: "all", searchQuery: "" }),
    refreshRequests: loadRequests
  };
}