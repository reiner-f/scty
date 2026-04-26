export type RequestStatus = "accepted" | "rejected" | "pending";

// Găsește interfața Municipality și actualizeaz-o așa:
export interface Municipality {
  id: string;
  name: string;
  cui: string;
  contactPerson: { name: string; email: string; phone: string; };
  locality: string;
  isBlocked?: boolean; // <-- NOU
  blockReason?: string; // <-- NOU
}

export interface Provider {
  id: string;
  name: string;
  cui: string;
  services: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

// Adaugă documentUrl în interfața Request
export interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  municipalityId: string;
  municipality?: { name: string; cui: string; locality: string };
  contactPerson: { name: string; email: string; phone: string; };
  locality: string;
  serviceId: string;
  service?: { name: string };
  providerId: string;
  provider?: { name: string; cui: string };
  createdAt: string;
  estimatedStartDate?: string;
  updatedAt: string;
  documentUrl?: string; // <--- NOU: Adăugat pentru fișiere
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  action: "ADD" | "UPDATE" | "DELETE" | "STATUS_CHANGE";
  details: string;
  actor: string;
  timestamp: string;
}

export interface DashboardStats {
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
}

export interface FilterOptions {
  status?: RequestStatus | "all";
  providerId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type AppRole = "admin" | "primarie" | "furnizor";

export interface UserProfile {
  id: string;
  role: AppRole;
  entityId: string | null;
}

export interface UserSession {
  user: any;
  profile: UserProfile | null;
  access_token: string;
}