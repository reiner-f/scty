import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { authService } from "./services/authService";
import { Login } from "./pages/Login";
import { Team } from "./pages/Team"; // Asigură-te că ai creat fișierul pages/Team.tsx
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

    async function initAuth() {
      try {
        const sessionData = await authService.getSession();
        if (mounted) {
          if (sessionData) {
            setSession(sessionData);
            setProfile(sessionData.profile);
          } else {
            setSession(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Eroare la inițializarea aplicației:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      if (event === 'INITIAL_SESSION') return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setProfile(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN') {
        setLoading(true);
        initAuth();
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(newSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-5">
        <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-xl text-slate-800 font-bold">Se încarcă</p>
          <p className="text-slate-500 font-medium">Pregătim platforma Centria...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppProvider user={session?.user} profile={profile}>
        <Routes>
          {/* CAZ 1: Utilizator neautentificat */}
          {!session ? (
            <>
              <Route path="/login" element={<Login />} />
              {/* Permitem vizualizarea echipei chiar și fără login (opțional) */}
              <Route path="/team" element={<Team />} /> 
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            /* CAZ 2: Utilizator autentificat */
            <>
              {/* Ruta TEAM - FĂRĂ HEADER (este în afara Layout-ului) */}
              <Route path="/team" element={<Team />} />

              {/* Toate rutele care au nevoie de Header și Footer sunt grupate aici sub Layout */}
              <Route
                path="*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      {profile?.role === "primarie" && (
                        <Route path="/create-request" element={<CreateRequest />} />
                      )}
                      <Route path="/history" element={<RequestHistory />} />
                      {/* Redirecționare către Dashboard pentru orice altă rută neexistentă */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                }
              />
            </>
          )}
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;