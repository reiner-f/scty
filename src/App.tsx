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
  const [loadingMessage, setLoadingMessage] = useState("Se conectează la baza de date...");

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (!mounted) return;
      
      try {
        setLoadingMessage("Se verifică sesiunea ta...");
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase Auth Error:", error.message);
          throw error;
        }

        if (activeSession && mounted) {
          setLoadingMessage("Se încarcă profilul tău de utilizator...");
          const userProfile = await authService.getUserProfile(activeSession.user.id);
          
          setSession(activeSession);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Eroare severă de inițializare:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("🔄 Stare nouă Supabase:", event);
      if (!mounted) return;

      // Unii clienți Supabase folosesc INITIAL_SESSION, alții SIGNED_IN
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (newSession) {
          try {
            setLoading(true);
            setLoadingMessage("Se aduc datele profilului...");
            console.log("⬇️ Descărcăm profilul pentru ID:", newSession.user.id);
            
            const userProfile = await authService.getUserProfile(newSession.user.id);
            console.log("✅ Profil descărcat:", userProfile);

            if (mounted) {
              setSession(newSession);
              setProfile(userProfile);
            }
          } catch (err) {
            console.error("❌ Eroare la descărcarea profilului (SIGNED_IN):", err);
          } finally {
            console.log("⏹️ Oprim ecranul de încărcare (garanție).");
            if (mounted) setLoading(false);
          }
        }
      } 
      else if (event === 'TOKEN_REFRESHED') {
        if (newSession && mounted) {
          setSession(newSession);
        }
      } 
      else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setSession(null);
          setProfile(null);
          setLoading(false);
        }
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
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-xl text-slate-800 font-bold">Vă rugăm așteptați</p>
          <p className="text-slate-500 font-medium">{loadingMessage}</p>
        </div>
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