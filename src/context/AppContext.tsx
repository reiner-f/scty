import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from "react";
import { useRequests } from "@/hooks/useRequests";
import { useNotifications } from "@/hooks/useNotifications";
import { useMunicipality } from "@/hooks/useMunicipality";
import { useProviders } from "@/hooks/useProviders";
import { useServices } from "@/hooks/useServices";
import { Request, FilterOptions, DashboardStats, Municipality, Notification, Provider, Service, UserProfile, ActivityLog } from "@/types";
import { supabase } from "@/lib/supabase";
import { fetchAllMunicipalities } from "@/services/municipalityService";

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
  allMunicipalities: Municipality[];
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  toggleProfile: () => void;
  providers: Provider[];
  services: Service[];
  isLoadingProviders: boolean;
  isLoadingServices: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activityLogs: ActivityLog[];
  addActivityLog: (action: ActivityLog['action'], details: string, actor: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children, user, profile }: { children: ReactNode, user: any, profile: UserProfile | null }) {
  const notificationsHook = useNotifications();
  const municipalityHook = useMunicipality(profile);
  const providersHook = useProviders();
  const servicesHook = useServices();

  const [allMunicipalities, setAllMunicipalities] = useState<Municipality[]>([]);

  // Sistemul JSON local pentru Activitate (Încărcare rapidă din cache-ul browserului)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const stored = localStorage.getItem("centria_logs");
    return stored ? JSON.parse(stored) : [];
  });

  // NOU: Sincronizare la pornire cu fișierul fizic (pentru browsere cu cache gol)
  useEffect(() => {
    if (import.meta.env.DEV) {
      fetch('/api/log')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            console.log("📂 Loguri sincronizate din fișierul VS Code:", data.length);
            setActivityLogs(data);
            localStorage.setItem("centria_logs", JSON.stringify(data));
          }
        })
        .catch(err => console.error("Nu am putut citi fișierul JSON de pe serverul Vite:", err));
    }
  }, []);

  const addActivityLog = useCallback((action: ActivityLog['action'], details: string, actor: string) => {
    const newLog = { 
      id: Date.now().toString(), 
      action, 
      details, 
      actor, 
      timestamp: new Date().toISOString() 
    };

    // 1. Salvare în UI / Browser Cache
    setActivityLogs(prev => {
      const newLogs = [newLog, ...prev].slice(0, 50);
      localStorage.setItem("centria_logs", JSON.stringify(newLogs));
      return newLogs;
    });

    // 2. Trimitere către VS Code pentru a scrie fizic în activity-logs.json
    if (import.meta.env.DEV) {
      console.log("📤 Trimit către Vite...", newLog);
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      })
      .then(res => res.json())
      .then(data => console.log("✅ Răspuns de la serverul Vite:", data))
      .catch(err => console.error("❌ Eroare la trimiterea către Vite:", err));
    }
  }, []);

  const requestsHook = useRequests(profile, addActivityLog);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const { refreshRequests } = requestsHook;
  const { notifySuccess } = notificationsHook;

  useEffect(() => {
    async function loadAllData() {
      try {
        const data = await fetchAllMunicipalities();
        setAllMunicipalities(data);
      } catch (err) {
        console.error("Eroare la încărcarea listei de municipalități:", err);
      }
    }
    loadAllData();
  }, []);

  useEffect(() => {
    if (!profile) return; 

    const requestChannel = supabase
      .channel('cereri-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          refreshRequests(); 
          if (payload.eventType === 'INSERT' && profile.role === 'furnizor') {
            notifySuccess("Ai primit o cerere nouă!");
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(requestChannel); };
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
    allMunicipalities,
    providers: providersHook.providers,
    services: servicesHook.services,
    isLoadingProviders: providersHook.isLoading,
    isLoadingServices: servicesHook.isLoading,
    isDarkMode,
    toggleDarkMode,
    activityLogs,
    addActivityLog
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useApp must be used within an AppProvider");
  return context;
}