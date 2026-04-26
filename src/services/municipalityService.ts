import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Municipality } from "@/types";
// Extragem tipurile corecte din structura Supabase
type DbMunicipality = Database["public"]["Tables"]["municipalities"]["Row"];
type DbMunicipalityInsert = Database["public"]["Tables"]["municipalities"]["Insert"];

function mapDbMunicipalityToMunicipality(db: DbMunicipality | any): Municipality {
  return {
    id: db.id, 
    name: db.name, 
    cui: db.cui,
    contactPerson: { name: db.contact_person, email: db.email, phone: db.phone },
    locality: db.locality,
    isBlocked: db.is_blocked || false, // <-- NOU
    blockReason: db.block_reason || undefined, // <-- NOU
  };
}

export async function fetchMunicipality(): Promise<Municipality | null> {
  const { data, error } = await supabase.from("municipalities").select("*").limit(1).single();
  if (error) return null;
  return data ? mapDbMunicipalityToMunicipality(data) : null;
}

export async function fetchAllMunicipalities(): Promise<Municipality[]> {
  const { data, error } = await supabase.from("municipalities").select("*").order("name");
  if (error) throw error;
  return (data || []).map(mapDbMunicipalityToMunicipality);
}

// NOU: Funcție pentru Admin
export async function createMunicipality(payload: DbMunicipalityInsert): Promise<Municipality> {
  const { data, error } = await supabase.from("municipalities").insert([payload]).select().single();
  if (error) throw error;
  return mapDbMunicipalityToMunicipality(data);
}