import { supabase } from "@/lib/supabase";
import { AppRole } from "@/types";
import { createClient } from "@supabase/supabase-js";

export interface AdminUserView {
  id: string;
  email: string;
  name: string | null;
  role: AppRole | null;
  entityId: string | null;
}

const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const adminService = {
  async getAllUsers(): Promise<AdminUserView[]> {
    const { data: users, error: userError } = await supabase.from("app_users").select("*");
    const { data: profiles, error: profError } = await supabase.from("user_profiles").select("*");

    if (userError) throw userError;

    const profilesData = profiles || [];
    return (users || []).map(u => {
      const profile = profilesData.find(p => p.id === u.id);
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: profile?.role || null,
        entityId: profile?.entity_id || null,
      };
    });
  },

  async updateUserMapping(id: string, role: AppRole | null, entityId: string | null) {
    if (!role) {
      // Dacă scoatem rolul, ștergem profilul complet
      const { error } = await supabase.from("user_profiles").delete().eq("id", id);
      if (error) throw error;
      return null;
    }
    
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert({ id, role, entity_id: entityId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createUserAccountAndMap(email: string, password: string, role: AppRole, entityId: string) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Crearea utilizatorului a eșuat. Verifică parola.");

    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert({ id: authData.user.id, role: role, entity_id: entityId });

    if (profileError) throw profileError;
    return authData.user;
  },

  // NOU: Ștergerea unui utilizator folosind funcția RPC cu drepturi depline
  async deleteUser(id: string) {
    // Apelăm Super-Funcția creată în SQL Editor
    const { error } = await supabase.rpc('delete_user_and_auth', { target_user_id: id });
    
    if (error) {
      console.error("Eroare severă la ștergerea contului:", error);
      throw error;
    }
  }
};