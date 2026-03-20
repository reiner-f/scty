import { useState, useEffect } from "react";
import { Service } from "@/types";
import { fetchServices } from "@/services/serviceService";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        setIsLoading(true);
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to load services:", err);
        setError("Nu s-au putut încărca serviciile");
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, []);

  return { services, isLoading, error };
}
