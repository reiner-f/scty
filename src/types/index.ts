export type RequestStatus = "accepted" | "rejected" | "pending";

export interface Municipality {
  id: string;
  name: string;
  cui: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
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

export interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  municipalityId: string;
  municipalityName: string;
  municipalityCui: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  locality: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  providerCui: string;
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
