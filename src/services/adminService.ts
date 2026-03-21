import { supabase } from "@/lib/supabase";
import { AppRole } from "@/types";

export interface AdminUserView {
  id: string;
  email: string;
  name: string | null;
  role: AppRole | null;
  entityId: string | null;
}

export const adminService = {
  // Aduce toți utilizatorii combinând tabela de conturi cu cea de roluri
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

  // Salvează noul rol și asocierea cu o instituție
  async updateUserMapping(id: string, role: AppRole, entityId: string | null) {
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert({ id, role, entity_id: entityId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};