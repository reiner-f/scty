import { supabase } from "@/lib/supabase";
import { LoginCredentials, UserProfile } from "@/types";

export const authService = {
  async login({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    console.log("-> [AuthService] Cerem profilul pentru ID-ul:", userId);

    try {
      // Creăm cererea către Supabase
      const fetchProfile = supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      // Creăm o bombă cu ceas (5 secunde)
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("TIMEOUT_BAZA_DE_DATE")), 5000)
      );

      // Le punem la întrecere: care termină prima?
      const response: any = await Promise.race([fetchProfile, timeout]);

      if (response.error) {
        console.error("-> [AuthService] Supabase a returnat o eroare:", response.error);
        return null;
      }

      console.log("-> [AuthService] Date primite cu succes:", response.data);

      if (!response.data) return null;

      return {
        id: response.data.id,
        role: response.data.role,
        entityId: response.data.entity_id,
      };

    } catch (error: any) {
      if (error.message === "TIMEOUT_BAZA_DE_DATE") {
        console.error("❌ [AuthService] Baza de date NU a răspuns în 5 secunde! (Timeout)");
      } else {
        console.error("❌ [AuthService] Eroare critică:", error);
      }
      return null;
    }
  },
  async getSession() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return null;

    // AICI E MODIFICAREA: Folosim 'authService' în loc de 'this'
    const profile = await authService.getUserProfile(session.user.id);

    return {
      ...session,
      profile,
    };
  }
};