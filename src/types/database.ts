export interface DbMunicipality {
  id: string;
  name: string;
  cui: string;
  contact_person: string;
  email: string;
  phone: string;
  locality: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbProvider {
  id: string;
  name: string;
  cui: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbService {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbRequest {
  id: string;
  municipality_id: string | null;
  municipality_name: string;
  municipality_cui: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  locality: string;
  provider_id: string | null;
  provider_name: string;
  provider_cui: string;
  service_id: string | null;
  service_name: string;
  title: string;
  description: string | null;
  estimated_start_date: string | null;
  has_estimated_date: boolean | null;
  status: "pending" | "accepted" | "rejected";
  status_notes: string | null;
  request_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}
