import { useState, useCallback, useMemo, useEffect } from "react";
import { Request, FilterOptions, DashboardStats, UserProfile, ActivityLog } from "@/types";
import { requestService } from "@/services/requestService";

// Hook-ul primește acum opțional funcția de addActivityLog pentru a trimite notificările în sistem
export function useRequests(profile: UserProfile | null, addActivityLog?: (action: ActivityLog['action'], details: string, actor: string) => void) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    searchQuery: "",
  });

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await requestService.fetchAll(profile);
      setRequests(data);
    } catch (err) {
      console.error("Eroare la încărcare:", err);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const addRequest = async (data: Omit<Request, "id" | "createdAt" | "updatedAt">) => {
    const newRequest = await requestService.create(data);
    setRequests(prev => [newRequest, ...prev]);
    
    // Înregistrăm activitatea local
    if (addActivityLog) {
      addActivityLog("ADD", `A creat cererea "${data.title}"`, newRequest.municipality?.name || "Primărie");
    }
    
    return newRequest;
  };

  const updateRequest = async (id: string, updates: Partial<Request>) => {
    const oldState = [...requests];
    const targetReq = requests.find(r => r.id === id);
    
    setRequests(prev => prev.map(req => req.id === id ? { ...req, ...updates } : req));
    
    try {
      const updated = await requestService.update(id, updates);
      
      // Înregistrăm activitatea dacă s-a modificat statusul sau detaliile
      if (addActivityLog && targetReq) {
        if (updates.status && updates.status !== targetReq.status) {
          const actorName = profile?.role === 'furnizor' ? (targetReq.provider?.name || 'Furnizor') : (targetReq.municipality?.name || 'Primărie');
          addActivityLog("STATUS_CHANGE", `A modificat statusul în "${updates.status}" pentru "${targetReq.title}"`, actorName);
        } else {
          addActivityLog("UPDATE", `A modificat detaliile cererii "${targetReq.title}"`, targetReq.municipality?.name || 'Primărie');
        }
      }
      
      return updated;
    } catch (err) {
      setRequests(oldState); // Rollback
      throw err;
    }
  };

  const deleteRequest = async (id: string) => {
    const oldState = [...requests];
    const targetReq = requests.find(r => r.id === id);
    
    setRequests(prev => prev.filter(req => req.id !== id));
    
    try {
      await requestService.delete(id);
      
      // Înregistrăm activitatea de ștergere
      if (addActivityLog && targetReq) {
        addActivityLog("DELETE", `A șters cererea "${targetReq.title}"`, targetReq.municipality?.name || 'Primărie');
      }
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
        // Reparat: Folosim provider?.name în loc de providerName pentru a evita crash-uri TS
        const providerName = req.provider?.name || "";
        return req.title.toLowerCase().includes(q) || providerName.toLowerCase().includes(q);
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