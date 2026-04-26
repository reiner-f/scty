import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Mail, Lock, LogIn, AlertCircle, 
  ShieldCheck, Building, Briefcase 
} from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/authService";
import { useApp } from "@/context/AppContext";
import { NetworkBackground } from "@/components/layout/NetworkBackground";

// Importul logoului tău
import logoImg from "@/assets/logo.png"; 

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
    // Fundalul paginii primește același gradient ca header-ul pentru continuitate vizuală
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-600 overflow-hidden">
      
      {/* Rețeaua din fundal */}
      <NetworkBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        // Card compact (max-w-md), garantează vizibilitatea totală fără scroll
        className="w-full max-w-md relative z-10"
      >
        {/* Cardul principal: Fundal alb, margini rotunjite și o umbră spectaculoasă pentru adâncime */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ring-1 ring-black/5">
          
          {/* HEADER CARD: Nuanța ta de albastru, cu efect de lumină subtil din partea de sus */}
          <div className="relative bg-gradient-to-b from-sky-540 to-sky-800 py-8 px-6 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-70 pointer-events-none"></div>
            
            <img 
              src={logoImg} 
              alt="Logo" 
              className="relative z-10 h-14 md:h-16 w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-transform duration-500 hover:scale-105" 
            />
          </div>

          {/* CORP FORMULAR: Alb curat, text închis la culoare, ușor de privit */}
          <div className="p-6 md:px-8 md:py-8">
            <form onSubmit={handleManualLogin} className="space-y-4">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2.5 text-rose-700 text-sm overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-tight">{error}</span>
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
                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
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
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>

              <Button
                type="submit"
                // Buton principal asortat cu headerul, efect fin de ridicare la hover
                className="w-full py-3.5 text-base font-semibold shadow-md bg-sky-600 hover:bg-sky-700 text-white mt-4 transition-all duration-200 hover:shadow-lg hover:shadow-sky-600/30 hover:-translate-y-0.5"
                isLoading={isLoading}
                disabled={isLoading}
                leftIcon={!isLoading && <LogIn className="w-5 h-5" />}
              >
                {isLoading ? "Se verifică..." : "Autentificare"}
              </Button>
            </form>

            {/* Secțiunea de Completare Rapidă (Quick Fill) */}
            <div className="mt-8 pt-6 border-t border-slate-100 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Acces Rapid
              </span>
              
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin("admin")}
                  className="flex flex-col gap-1.5 py-3 bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-300 transition-all duration-200 group"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-slate-600 group-hover:text-sky-800">Admin</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin("primarie")}
                  className="flex flex-col gap-1.5 py-3 bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-300 transition-all duration-200 group"
                >
                  <Building className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-slate-600 group-hover:text-sky-800">Primărie</span>
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin("furnizor")}
                  className="flex flex-col gap-1.5 py-3 bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-300 transition-all duration-200 group"
                >
                  <Briefcase className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-slate-600 group-hover:text-sky-800">Furnizor</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}