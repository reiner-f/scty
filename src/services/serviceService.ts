import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Service } from "@/types";

type DbService = Database["public"]["Tables"]["services"]["Row"];

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