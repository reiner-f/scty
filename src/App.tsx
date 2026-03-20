import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { Login } from "./pages/Login";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { CreateRequest } from "./pages/CreateRequest";
import { RequestHistory } from "./pages/RequestHistory";
import { AppProvider } from "./context/AppContext";
import { Loader2 } from "lucide-react";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificăm sesiunea imediat ce se încarcă app-ul
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Ascultăm în timp real dacă utilizatorul dă Login sau Logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Ecran de încărcare până verificăm dacă e logat
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppProvider>
        {!session ? (
          /* Rute accesibile FĂRĂ login */
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          /* Rute securizate (DOAR cu login) */
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-request" element={<CreateRequest />} />
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