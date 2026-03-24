import { useState, useEffect } from "react";
import { Municipality, UserProfile } from "@/types";
import { supabase } from "@/lib/supabase";

const defaultMunicipality: Municipality = {
  id: "",
  name: "Nu este asociat",
  cui: "",
  contactPerson: { name: "", email: "", phone: "" },
  locality: "",
};

export function useMunicipality(profile: UserProfile | null) {
  const [municipality, setMunicipality] = useState<Municipality>(defaultMunicipality);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    async function loadMunicipality() {
      // Căutăm datele DOAR dacă cel logat este o primărie
      if (profile?.role === 'primarie' && profile.entityId) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('municipalities')
            .select('*')
            .eq('id', profile.entityId)
            .single();
            
          if (data && !error) {
           setMunicipality({
              id: data.id,
              name: data.name,
              cui: data.cui,
              contactPerson: {
                name: data.contact_person,
                email: data.email,
                phone: data.phone,
              },
              locality: data.locality,
              isBlocked: data.is_blocked, // NOU
              blockReason: data.block_reason, // NOU
            });
          }
        } catch (err) {
          console.error("Failed to load municipality:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMunicipality(defaultMunicipality);
        setIsLoading(false);
      }
    }

    loadMunicipality();
  }, [profile]);

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