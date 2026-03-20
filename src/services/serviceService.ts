import { supabase } from "@/lib/supabase";
import { DbService } from "@/types/database";
import { Service } from "@/types";

function mapDbServiceToService(db: DbService): Service {
  return {
    id: db.id,
    name: db.name,
    description: db.description || "",
  };
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching services:", error);
    throw error;
  }

  return (data || []).map(mapDbServiceToService);
}
