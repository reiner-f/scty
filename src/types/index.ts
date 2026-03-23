export type RequestStatus = "accepted" | "rejected" | "pending";

export interface Municipality {
  id: string;
  name: string;
  cui: string;
  contactPerson: { name: string; email: string; phone: string; };
  locality: string;
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

// ⚠️ REPARAT: Am transformat câmpurile duplicate în Relații (JOIN-uri)
export interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  municipalityId: string;
  municipality?: { name: string; cui: string; locality: string }; // Date aduse prin JOIN
  contactPerson: { name: string; email: string; phone: string; };
  locality: string;
  serviceId: string;
  service?: { name: string }; // Date aduse prin JOIN
  providerId: string;
  provider?: { name: string; cui: string }; // Date aduse prin JOIN
  createdAt: string;
  estimatedStartDate?: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  timestamp: number;
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