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

  // ⚠️ REPARAT: Folosim funcția RPC atomică! Niciun "client fantomă" nu mai este posibil.
  async createUserAccountAndMap(email: string, password: string, role: AppRole, entityId: string) {
    const { data: newUserId, error } = await supabase.rpc('admin_create_user_and_profile', {
      p_email: email,
      p_password: password,
      p_role: role,
      p_entity_id: entityId
    });

    if (error) {
      console.error("Eroare la crearea contului în tranzacție:", error);
      throw new Error("Nu s-a putut crea contul de utilizator.");
    }

    return newUserId;
  },

  async deleteUser(id: string) {
    const { error } = await supabase.rpc('delete_user_and_auth', { target_user_id: id });
    if (error) {
      console.error("Eroare severă la ștergerea contului:", error);
      throw error;
    }
  },

  async changeUserPassword(userId: string, newPassword: string) {
    const { error } = await supabase.rpc('admin_change_user_password', { 
      target_user_id: userId,
      new_password: newPassword
    });
    if (error) throw error;
  }
};