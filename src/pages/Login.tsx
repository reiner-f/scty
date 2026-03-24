import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, Mail, Lock, LogIn, AlertCircle, 
  ShieldCheck, Building, Briefcase 
} from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/authService";
import { useApp } from "@/context/AppContext";
import { NetworkBackground } from "@/components/layout/NetworkBackground"; // <-- Importul noului fundal

const DEMO_ACCOUNTS = {
  admin: { email: "admin@centria.ro", password: "" },
  primarie: { email: "primarie@centria.ro", password: "" },
  furnizor: { email: "furnizor@centria.ro", password: "" }
};

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess } = useApp();

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login({ email: loginEmail, password: loginPass });
      notifySuccess("Bun venit în platforma Centria!");
    } catch (err: any) {
      if (err.message.includes("Invalid login credentials")) {
        setError("Email-ul sau parola sunt incorecte.");
      } else {
        setError("A apărut o eroare de conexiune. Încearcă din nou.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    performLogin(email, password);
  };

  const handleQuickLogin = (role: keyof typeof DEMO_ACCOUNTS) => {
    const acc = DEMO_ACCOUNTS[role];
    setEmail(acc.email);
    setPassword(acc.password);
    
    if (acc.password) {
      performLogin(acc.email, acc.password);
    } else {
      setError(null);
    }
  };

  return (
    // Părintele a devenit "relative" și "overflow-hidden"
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 overflow-hidden">
      
      {/* MAGIA AICI: Componenta animată pe fundal */}
      <NetworkBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        // Cardul trebuie să fie relative și z-10 pentru a sta PESTE animație
        className="w-full max-w-md relative z-10"
      >
        {/* Am modificat bg-white în bg-white/85 și am adăugat backdrop-blur-xl pentru un efect premium corporatist */}
        <div className="bg-white/85 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-sky-900/10 overflow-hidden">
          <div className="p-8">
            {/* Branding */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 mb-4">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Centria</h1>
              <p className="text-slate-500 font-medium text-center">Administrație Publică Inteligentă</p>
            </div>

            {/* Formularul Clasic */}
            <form onSubmit={handleManualLogin} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              <Input
                label="Email Instituțional"
                type="email"
                autoComplete="email"
                placeholder="nume.prenume@primarie.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />

              <div className="space-y-1">
                <Input
                  label="Parolă"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg font-bold shadow-lg shadow-primary-100"
                isLoading={isLoading}
                disabled={isLoading}
                leftIcon={!isLoading && <LogIn className="w-5 h-5" />}
              >
                {isLoading ? "Se verifică..." : "Intră în cont"}
              </Button>
            </form>

            {/* Secțiunea de Completare Rapidă (Quick Fill) */}
            <div className="mt-8 pt-6 border-t border-slate-200/60">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-4">
                Completare Rapidă Email
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin("admin")}
                  className="flex flex-col gap-1 py-3 h-auto bg-white/50 hover:bg-white"
                >
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <span className="text-xs">Admin</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin("primarie")}
                  className="flex flex-col gap-1 py-3 h-auto bg-white/50 hover:bg-white"
                >
                  <Building className="w-5 h-5 text-sky-600" />
                  <span className="text-xs">Primărie</span>
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin("furnizor")}
                  className="flex flex-col gap-1 py-3 h-auto bg-white/50 hover:bg-white"
                >
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">Furnizor</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}