import { supabase } from "@/lib/supabase";
import { LoginCredentials } from "@/types";

export const authService = {
  // Conectare cu email și parolă
  async login({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Deconectare
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obținerea utilizatorului curent (pentru verificarea sesiunii)
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  // Verificarea sesiunii active
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  }
};