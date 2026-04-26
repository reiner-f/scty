import { useState, useEffect } from "react";
import { Provider } from "@/types";
import { fetchProviders } from "@/services/providerService";

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProviders() {
      try {
        setIsLoading(true);
        const data = await fetchProviders();
        setProviders(data);
      } catch (err) {
        console.error("Failed to load providers:", err);
        setError("Nu s-au putut încărca furnizorii");
      } finally {
        setIsLoading(false);
      }
    }

    loadProviders();
  }, []);

  return { providers, isLoading, error };
}
