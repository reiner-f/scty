import React, { useState } from "react";
import { motion } from "motion/react";
import { Building2, Mail, Lock, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/authService";
import { useApp } from "@/context/AppContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await authService.login({ email, password });
      notifySuccess("Bun venit în platforma Centria!");
    } catch (err: any) {
      // Mesaje de eroare prietenoase pentru utilizator
      if (err.message.includes("Invalid login credentials")) {
        setError("Email-ul sau parola sunt incorecte.");
      } else {
        setError("A apărut o eroare de conexiune. Încearcă din nou.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-sky-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-sky-100 overflow-hidden">
          <div className="p-8">
            {/* Branding */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 mb-4">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Centria</h1>
              <p className="text-slate-500 font-medium">Administrație Publică Inteligentă</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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
                <div className="flex justify-end">
                  <button type="button" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                    Ai uitat parola?
                  </button>
                </div>
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
          </div>
          
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-1">
            <p className="text-xs text-slate-400 text-center">
              Sistem securizat. Accesul neautorizat este monitorizat.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}