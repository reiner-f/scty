import { supabase } from "@/lib/supabase";
import { DbRequest } from "@/types/database";
import { Request, RequestStatus } from "@/types";

function mapDbRequestToRequest(dbRequest: DbRequest): Request {
  return {
    id: dbRequest.id,
    title: dbRequest.title,
    description: dbRequest.description || "",
    status: dbRequest.status as RequestStatus,
    municipalityId: dbRequest.municipality_id || "",
    municipalityName: dbRequest.municipality_name,
    municipalityCui: dbRequest.municipality_cui,
    contactPerson: {
      name: dbRequest.contact_person,
      email: dbRequest.contact_email,
      phone: dbRequest.contact_phone,
    },
    locality: dbRequest.locality,
    serviceId: dbRequest.service_id || "",
    serviceName: dbRequest.service_name,
    providerId: dbRequest.provider_id || "",
    providerName: dbRequest.provider_name,
    providerCui: dbRequest.provider_cui,
    createdAt: dbRequest.created_at || new Date().toISOString(),
    estimatedStartDate: dbRequest.estimated_start_date || undefined,
    updatedAt: dbRequest.updated_at || new Date().toISOString(),
  };
}

export const requestService = {
  async fetchAll(): Promise<Request[]> {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDbRequestToRequest);
  },

  async create(request: Omit<Request, "id" | "createdAt" | "updatedAt">): Promise<Request> {
    const dbPayload = {
      title: request.title,
      description: request.description,
      status: request.status,
      municipality_id: request.municipalityId,
      municipality_name: request.municipalityName,
      municipality_cui: request.municipalityCui,
      contact_person: request.contactPerson.name,
      contact_email: request.contactPerson.email,
      contact_phone: request.contactPerson.phone,
      locality: request.locality,
      service_id: request.serviceId,
      service_name: request.serviceName,
      provider_id: request.providerId,
      provider_name: request.providerName,
      provider_cui: request.providerCui,
      estimated_start_date: request.estimatedStartDate || null,
    };

    const { data, error } = await supabase.from("requests").insert([dbPayload]).select().single();
    if (error) throw error;
    return mapDbRequestToRequest(data);
  },

  async update(id: string, updates: Partial<Request>): Promise<Request> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.estimatedStartDate !== undefined) dbUpdates.estimated_start_date = updates.estimatedStartDate;

    const { data, error } = await supabase.from("requests").update(dbUpdates).eq("id", id).select().single();
    if (error) throw error;
    return mapDbRequestToRequest(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (error) throw error;
  }
};