import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { authService } from "./services/authService";
import { Login } from "./pages/Login";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { CreateRequest } from "./pages/CreateRequest";
import { RequestHistory } from "./pages/RequestHistory";
import { AppProvider } from "./context/AppContext";
import { UserProfile } from "./types";
import { Loader2 } from "lucide-react";

function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Funcție robustă pentru verificarea inițială
    const initializeAuth = async () => {
      try {
        const data = await authService.getSession();
        if (mounted && data) {
          setSession(data);
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Eroare severă la verificarea sesiunii:", error);
      } finally {
        if (mounted) setLoading(false); // Oprește spinner-ul GARANTAT
      }
    };

    initializeAuth();

    // 2. Ascultăm modificările de stare
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession) {
        try {
          const userProfile = await authService.getUserProfile(newSession.user.id);
          if (mounted) {
            setSession(newSession);
            setProfile(userProfile);
          }
        } catch (error) {
          console.error("Eroare la obținerea profilului live:", error);
        }
      } else {
        if (mounted) {
          setSession(null);
          setProfile(null);
        }
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
        <p className="text-slate-500 font-medium">Se verifică datele utilizatorului...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppProvider user={session?.user} profile={profile}>
        {!session ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {profile?.role === 'primarie' && (
                <Route path="/create-request" element={<CreateRequest />} />
              )}
              <Route path="/history" element={<RequestHistory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        )}
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;