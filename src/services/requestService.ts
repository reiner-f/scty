import { supabase } from "@/lib/supabase";
import { Request, RequestStatus, UserProfile } from "@/types";

function mapDbRequestToRequest(dbRequest: any): Request {
  return {
    id: dbRequest.id,
    title: dbRequest.title,
    description: dbRequest.description || "",
    status: dbRequest.status as RequestStatus,
    municipalityId: dbRequest.municipality_id || "",
    municipality: dbRequest.municipality || { name: "Necunoscut", cui: "-", locality: dbRequest.locality },
    contactPerson: {
      name: dbRequest.contact_person || "",
      email: dbRequest.contact_email || "",
      phone: dbRequest.contact_phone || "",
    },
    locality: dbRequest.locality || "",
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
    let query = supabase
      .from("requests")
      .select(`*, municipality:municipalities(name, cui, locality), provider:providers(name, cui), service:services(name)`)
      .order("created_at", { ascending: false });

    if (profile?.role === "primarie" && profile.entityId) {
      query = query.eq("municipality_id", profile.entityId);
    } else if (profile?.role === "furnizor" && profile.entityId) {
      query = query.eq("provider_id", profile.entityId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("❌ EROARE FETCH CERERI:", error);
      throw error;
    }
    return (data || []).map(mapDbRequestToRequest);
  },

  async create(request: Omit<Request, "id" | "createdAt" | "updatedAt">): Promise<Request> {
    // REPARAT: Ne asigurăm că string-urile goale ("") devin `null` pentru coloanele care sunt chei străine (UUID)
    const dbPayload = {
      title: request.title,
      description: request.description,
      status: request.status,
      municipality_id: request.municipalityId || null,
      contact_person: request.contactPerson.name,
      contact_email: request.contactPerson.email,
      contact_phone: request.contactPerson.phone,
      locality: request.locality,
      // Dacă e string gol sau "none", trimitem null ca să nu crape baza de date
      service_id: (request.serviceId && request.serviceId !== "none") ? request.serviceId : null,
      provider_id: (request.providerId && request.providerId !== "none") ? request.providerId : null,
      estimated_start_date: request.estimatedStartDate || null,
    };

    console.log("Trimitem către Supabase:", dbPayload);

    const { data, error } = await supabase
      .from("requests")
      .insert([dbPayload])
      .select('*, municipality:municipalities(name, cui, locality), provider:providers(name, cui), service:services(name)')
      .single();
      
    if (error) {
      // Acum vom vedea exact DE CE crapă baza de date direct în consola browserului
      console.error("❌ EROARE CRITICĂ LA CREAREA CERERII:", error);
      throw error;
    }
    
    return mapDbRequestToRequest(data);
  },

  async update(id: string, updates: Partial<Request>): Promise<Request> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.estimatedStartDate !== undefined) dbUpdates.estimated_start_date = updates.estimatedStartDate;
    if (updates.serviceId) dbUpdates.service_id = updates.serviceId;
    if (updates.providerId) dbUpdates.provider_id = updates.providerId;
    const { data, error } = await supabase
      .from("requests")
      .update(dbUpdates)
      .eq("id", id)
      .select('*, municipality:municipalities(name, cui, locality), provider:providers(name, cui), service:services(name)')
      .single();
      
    if (error) {
      console.error("❌ EROARE LA UPDATE:", error);
      throw error;
    }
    return mapDbRequestToRequest(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (error) {
      console.error("❌ EROARE LA ȘTERGERE:", error);
      throw error;
    }
  }
};