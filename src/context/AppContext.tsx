import { createContext, useContext, ReactNode, useEffect } from "react";
import { useRequests } from "@/hooks/useRequests";
import { useNotifications } from "@/hooks/useNotifications";
import { useMunicipality } from "@/hooks/useMunicipality";
import { useProviders } from "@/hooks/useProviders";
import { useServices } from "@/hooks/useServices";
import { Request, FilterOptions, DashboardStats, Municipality, Notification, Provider, Service, UserProfile } from "@/types";
import { supabase } from "@/lib/supabase";

interface AppContextType {
  user: any;
  profile: UserProfile | null;
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

export function AppProvider({ children, user, profile }: { children: ReactNode, user: any, profile: UserProfile | null }) {
  // Aducem toate hook-urile externe
  const requestsHook = useRequests(profile);
  const notificationsHook = useNotifications();
  const municipalityHook = useMunicipality(profile);
  const providersHook = useProviders();
  const servicesHook = useServices();

  // Extragem exact funcțiile de care avem nevoie pentru Realtime
  const { refreshRequests } = requestsHook;
  const { notifySuccess } = notificationsHook;

  // NOU: ASCULTĂM MODIFICĂRILE ÎN TIMP REAL
  useEffect(() => {
    // Dacă utilizatorul nu este logat, nu deschidem nicio conexiune WebSocket
    if (!profile) return; 

    const requestChannel = supabase
      .channel('cereri-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          console.log('🔄 Sincronizare Live Detectată:', payload);
          
          // Orice schimbare are loc în BD, îi spunem aplicației să descarce noile date silențios
          refreshRequests(); 
          
          // Bonus: Dacă s-a introdus o cerere NOUĂ și utilizatorul curent este Furnizor
          if (payload.eventType === 'INSERT' && profile.role === 'furnizor') {
            notifySuccess("Ai primit o cerere nouă!");
          }
        }
      )
      .subscribe();

    // Când utilizatorul închide pagina sau se deloghează, tăiem firul (cleanup)
    return () => {
      supabase.removeChannel(requestChannel);
    };
  }, [profile, refreshRequests, notifySuccess]);

  const value: AppContextType = {
    user,
    profile,
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