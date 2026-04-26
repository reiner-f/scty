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
    try {
      // ⚠️ REPARAT: Supabase gestionează automat timeout-urile și reconectările
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        role: data.role,
        entityId: data.entity_id,
      };
    } catch (error: any) {
      console.error("❌ [AuthService] Eroare la citirea profilului:", error);
      return null;
    }
  },

  async getSession() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return null;

    // Folosim 'authService' în loc de 'this'
    const profile = await authService.getUserProfile(session.user.id);

    return {
      ...session,
      profile,
    };
  }, // <--- AICI AM ADĂUGAT VIRGULA LIPSĂ!

  // NOU: Schimbarea propriei parole
  async changeMyPassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }
};