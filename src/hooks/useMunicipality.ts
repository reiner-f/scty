import { useState, useEffect } from "react";
import { Municipality } from "@/types";
import { fetchMunicipality } from "@/services/municipalityService";

const defaultMunicipality: Municipality = {
  id: "",
  name: "Se încarcă...",
  cui: "",
  contactPerson: {
    name: "",
    email: "",
    phone: "",
  },
  locality: "",
};

export function useMunicipality() {
  const [municipality, setMunicipality] = useState<Municipality>(defaultMunicipality);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    async function loadMunicipality() {
      try {
        const data = await fetchMunicipality();
        if (data) {
          setMunicipality(data);
        }
      } catch (err) {
        console.error("Failed to load municipality:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadMunicipality();
  }, []);

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);
  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  return {
    municipality,
    isLoading,
    isProfileOpen,
    openProfile,
    closeProfile,
    toggleProfile,
  };
}
