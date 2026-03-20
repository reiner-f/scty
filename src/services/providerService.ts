import { supabase } from "@/lib/supabase";
import { DbProvider } from "@/types/database";
import { Provider } from "@/types";

function mapDbProviderToProvider(db: DbProvider): Provider {
  return {
    id: db.id,
    name: db.name,
    cui: db.cui,
    services: [],
  };
}

export async function fetchProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching providers:", error);
    throw error;
  }

  return (data || []).map(mapDbProviderToProvider);
}
