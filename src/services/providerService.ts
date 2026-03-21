import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Provider } from "@/types";

// Extragem tipul corect din structura Supabase
type DbProvider = Database["public"]["Tables"]["providers"]["Row"];

function mapDbProviderToProvider(db: DbProvider): Provider {
// ... restul codului ramane la fel
  return { id: db.id, name: db.name, cui: db.cui, services: [] };
}

export async function fetchProviders(): Promise<Provider[]> {
  const { data, error } = await supabase.from("providers").select("*").order("name");
  if (error) throw error;
  return (data || []).map(mapDbProviderToProvider);
}

// NOU: Funcție pentru Admin
export async function createProvider(name: string, cui: string, email: string): Promise<Provider> {
  const { data, error } = await supabase
    .from("providers")
    .insert([{ name, cui, email }])
    .select()
    .single();
  if (error) throw error;
  return mapDbProviderToProvider(data);
}