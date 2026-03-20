import { supabase } from "@/lib/supabase";
import { DbMunicipality } from "@/types/database";
import { Municipality } from "@/types";

function mapDbMunicipalityToMunicipality(db: DbMunicipality): Municipality {
  return {
    id: db.id,
    name: db.name,
    cui: db.cui,
    contactPerson: {
      name: db.contact_person,
      email: db.email,
      phone: db.phone,
    },
    locality: db.locality,
  };
}

export async function fetchMunicipality(): Promise<Municipality | null> {
  const { data, error } = await supabase
    .from("municipalities")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching municipality:", error);
    return null;
  }

  return data ? mapDbMunicipalityToMunicipality(data) : null;
}
