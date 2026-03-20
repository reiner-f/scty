import { createContext, useContext, ReactNode } from "react";
import { useRequests } from "@/hooks/useRequests";
import { useNotifications } from "@/hooks/useNotifications";
import { useMunicipality } from "@/hooks/useMunicipality";
import { useProviders } from "@/hooks/useProviders";
import { useServices } from "@/hooks/useServices";
import { Request, FilterOptions, DashboardStats, Municipality, Notification, Provider, Service } from "@/types";

interface AppContextType {
  requests: Request[];
  filteredRequests: Request[];
  filters: FilterOptions;
  stats: DashboardStats;
  isLoadingRequests: boolean;
  addRequest: (request: Omit<Request, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: string; updatedAt?: string }) => Promise<Request>;
  updateRequest: (id: string, updates: Partial<Request>) => Promise<Request>;
  deleteRequest: (id: string) => Promise<void>;
  setFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  clearFilters: () => void;
  refreshRequests: () => Promise<void>;
  notifications: Notification[];
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  notifyWarning: (message: string) => void;
  removeNotification: (id: string) => void;
  municipality: Municipality;
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  toggleProfile: () => void;
  providers: Provider[];
  services: Service[];
  isLoadingProviders: boolean;
  isLoadingServices: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const requestsHook = useRequests();
  const notificationsHook = useNotifications();
  const municipalityHook = useMunicipality();
  const providersHook = useProviders();
  const servicesHook = useServices();

  const value: AppContextType = {
    requests: requestsHook.requests,
    filteredRequests: requestsHook.filteredRequests,
    filters: requestsHook.filters,
    stats: requestsHook.stats,
    isLoadingRequests: requestsHook.isLoading,
    addRequest: requestsHook.addRequest,
    updateRequest: requestsHook.updateRequest,
    deleteRequest: requestsHook.deleteRequest,
    setFilter: requestsHook.setFilter,
    clearFilters: requestsHook.clearFilters,
    refreshRequests: requestsHook.refreshRequests,
    ...notificationsHook,
    ...municipalityHook,
    providers: providersHook.providers,
    services: servicesHook.services,
    isLoadingProviders: providersHook.isLoading,
    isLoadingServices: servicesHook.isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
