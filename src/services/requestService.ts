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

export async function fetchRequests(): Promise<Request[]> {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }

  return (data || []).map(mapDbRequestToRequest);
}

export async function createRequest(request: Omit<Request, "id" | "createdAt" | "updatedAt">): Promise<Request> {
  const dbRequest = {
    title: request.title,
    description: request.description,
    status: request.status,
    municipality_id: request.municipalityId || null,
    municipality_name: request.municipalityName,
    municipality_cui: request.municipalityCui,
    contact_person: request.contactPerson.name,
    contact_email: request.contactPerson.email,
    contact_phone: request.contactPerson.phone,
    locality: request.locality,
    service_id: request.serviceId || null,
    service_name: request.serviceName,
    provider_id: request.providerId || null,
    provider_name: request.providerName,
    provider_cui: request.providerCui,
    estimated_start_date: request.estimatedStartDate || null,
    has_estimated_date: !!request.estimatedStartDate,
  };

  const { data, error } = await supabase
    .from("requests")
    .insert([dbRequest])
    .select()
    .single();

  if (error) {
    console.error("Error creating request:", error);
    throw error;
  }

  return mapDbRequestToRequest(data);
}

export async function updateRequest(id: string, updates: Partial<Request>): Promise<Request> {
  const dbUpdates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.serviceId !== undefined) dbUpdates.service_id = updates.serviceId;
  if (updates.serviceName !== undefined) dbUpdates.service_name = updates.serviceName;
  if (updates.providerId !== undefined) dbUpdates.provider_id = updates.providerId;
  if (updates.providerName !== undefined) dbUpdates.provider_name = updates.providerName;
  if (updates.providerCui !== undefined) dbUpdates.provider_cui = updates.providerCui;
  if (updates.estimatedStartDate !== undefined) {
    dbUpdates.estimated_start_date = updates.estimatedStartDate || null;
    dbUpdates.has_estimated_date = !!updates.estimatedStartDate;
  }

  const { data, error } = await supabase
    .from("requests")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating request:", error);
    throw error;
  }

  return mapDbRequestToRequest(data);
}

export async function updateRequestStatus(id: string, status: RequestStatus): Promise<Request> {
  return updateRequest(id, { status });
}

export async function deleteRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting request:", error);
    throw error;
  }
}
