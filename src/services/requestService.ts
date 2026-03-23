import { supabase } from "@/lib/supabase";
import { Request, RequestStatus, UserProfile } from "@/types";

// Mapare inteligentă a datelor relaționale
function mapDbRequestToRequest(dbRequest: any): Request {
  return {
    id: dbRequest.id,
    title: dbRequest.title,
    description: dbRequest.description || "",
    status: dbRequest.status as RequestStatus,
    municipalityId: dbRequest.municipality_id || "",
    // Luăm numele din JOIN, dacă există, altfel fallback
    municipality: dbRequest.municipality || { name: "Necunoscut", cui: "-", locality: dbRequest.locality },
    contactPerson: {
      name: dbRequest.contact_person,
      email: dbRequest.contact_email,
      phone: dbRequest.contact_phone,
    },
    locality: dbRequest.locality,
    serviceId: dbRequest.service_id || "",
    service: dbRequest.service || { name: "Serviciu Necunoscut" },
    providerId: dbRequest.provider_id || "",
    provider: dbRequest.provider || { name: "Furnizor Necunoscut", cui: "-" },
    createdAt: dbRequest.created_at || new Date().toISOString(),
    estimatedStartDate: dbRequest.estimated_start_date || undefined,
    updatedAt: dbRequest.updated_at || new Date().toISOString(),
  };
}

export const requestService = {
  async fetchAll(profile: UserProfile | null): Promise<Request[]> {
    // ⚠️ REPARAT: Folosim JOIN-uri native Supabase pentru a evita denormalizarea
    let query = supabase
      .from("requests")
      .select(`
        *,
        municipality:municipalities(name, cui, locality),
        provider:providers(name, cui),
        service:services(name)
      `)
      .order("created_at", { ascending: false });

    if (profile?.role === "primarie" && profile.entityId) {
      query = query.eq("municipality_id", profile.entityId);
    } else if (profile?.role === "furnizor" && profile.entityId) {
      query = query.eq("provider_id", profile.entityId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapDbRequestToRequest);
  },

  async create(request: Omit<Request, "id" | "createdAt" | "updatedAt">): Promise<Request> {
    // ⚠️ REPARAT: Trimitem strict ID-urile, nu și numele (baza de date face restul)
    const dbPayload = {
      title: request.title,
      description: request.description,
      status: request.status,
      municipality_id: request.municipalityId,
      contact_person: request.contactPerson.name,
      contact_email: request.contactPerson.email,
      contact_phone: request.contactPerson.phone,
      locality: request.locality,
      service_id: request.serviceId,
      provider_id: request.providerId,
      estimated_start_date: request.estimatedStartDate || null,
    };

    const { data, error } = await supabase.from("requests").insert([dbPayload]).select('*, municipality:municipalities(name, cui, locality), provider:providers(name, cui), service:services(name)').single();
    if (error) throw error;
    return mapDbRequestToRequest(data);
  },

  async update(id: string, updates: Partial<Request>): Promise<Request> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.estimatedStartDate !== undefined) dbUpdates.estimated_start_date = updates.estimatedStartDate;

    const { data, error } = await supabase.from("requests").update(dbUpdates).eq("id", id).select('*, municipality:municipalities(name, cui, locality), provider:providers(name, cui), service:services(name)').single();
    if (error) throw error;
    return mapDbRequestToRequest(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (error) throw error;
  }
};