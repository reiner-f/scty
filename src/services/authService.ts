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

  // NOU: Funcție care aduce rolul utilizatorului
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Eroare la obținerea profilului:", error);
      return null;
    }

    return {
      id: data.id,
      role: data.role,
      entityId: data.entity_id,
    };
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