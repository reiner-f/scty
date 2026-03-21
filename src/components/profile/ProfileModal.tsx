import React, { useState } from "react";
import { Building2, User, Mail, Phone, MapPin, Hash, ShieldCheck, Briefcase, Key, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { useApp } from "@/context/AppContext";
import { authService } from "@/services/authService";

export function ProfileModal() {
  const { user, profile, municipality, providers, isProfileOpen, closeProfile, notifySuccess, notifyError } = useApp();
  
  // Stări pentru schimbarea parolei
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!profile || !user) return null;

  let title = "Cont Utilizator";
  let subtitle = user.email;
  let MainIcon = User;
  let profileFields: any[] = [];

  if (profile.role === 'admin') {
    title = "Administrator Sistem";
    MainIcon = ShieldCheck;
    profileFields = [
      { icon: ShieldCheck, label: "Rol în platformă", value: "Administrator Global" },
      { icon: Mail, label: "Adresă Email", value: user.email, fullWidth: true },
    ];
  } else if (profile.role === 'furnizor') {
    const providerData = providers.find(p => p.id === profile.entityId);
    title = providerData?.name || "Furnizor Servicii";
    subtitle = "Partener B2B";
    MainIcon = Briefcase;
    profileFields = [
      { icon: Briefcase, label: "Denumire Companie", value: providerData?.name || "N/A" },
      { icon: Hash, label: "Cod Fiscal (CUI)", value: providerData?.cui || "N/A" },
      { icon: Mail, label: "Email Cont", value: user.email, fullWidth: true },
    ];
  } else if (profile.role === 'primarie') {
    title = municipality?.name || "Primărie";
    subtitle = municipality?.locality || "Administrație Locală";
    MainIcon = Building2;
    profileFields = [
      { icon: Building2, label: "Denumire Instituție", value: municipality?.name },
      { icon: Hash, label: "Cod Unic (CUI)", value: municipality?.cui },
      { icon: User, label: "Persoană de contact", value: municipality?.contactPerson?.name },
      { icon: Phone, label: "Telefon", value: municipality?.contactPerson?.phone },
      { icon: Mail, label: "Email Instituțional", value: user.email, fullWidth: true },
      { icon: MapPin, label: "Adresă / Localitate", value: municipality?.locality, fullWidth: true },
    ];
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return notifyError("Parola trebuie să aibă minim 6 caractere.");
    if (newPassword !== confirmPassword) return notifyError("Parolele nu coincid!");

    setIsSavingPassword(true);
    try {
      await authService.changeMyPassword(newPassword);
      notifySuccess("Parola a fost schimbată cu succes!");
      setIsChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      notifyError(err.message || "A apărut o eroare la schimbarea parolei.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleClose = () => {
    setIsChangingPassword(false);
    setNewPassword("");
    setConfirmPassword("");
    closeProfile();
  };

  return (
    <Modal isOpen={isProfileOpen} onClose={handleClose} size="lg">
      <div className="flex flex-col">
        <div className="relative pt-6 pb-6 px-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 rounded-t-2xl overflow-hidden">
          <div className="absolute -top-10 -right-10 p-6 opacity-5 pointer-events-none">
            <MainIcon className="w-48 h-48" />
          </div>
          <div className="relative flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-lg shadow-sky-200">
                <MainIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">{title}</h3>
              <p className="text-sm font-medium text-sky-600 flex items-center gap-1.5 mt-1">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white space-y-6">
          {/* Zona Detalii Cont */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Informații Cont</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profileFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <motion.div key={field.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }} className={`flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 ${field.fullWidth ? "sm:col-span-2" : "col-span-1"}`}>
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-0.5">{field.label}</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{field.value || "-"}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Zona Securitate (Schimbare Parolă) */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4 px-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Securitate</h4>
              {!isChangingPassword && (
                <Button variant="ghost" size="sm" onClick={() => setIsChangingPassword(true)} leftIcon={<Key className="w-4 h-4" />}>
                  Schimbă Parola
                </Button>
              )}
            </div>

            <AnimatePresence>
              {isChangingPassword && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  onSubmit={handlePasswordChange}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 overflow-hidden"
                >
                  <p className="text-sm text-slate-600 mb-2">Alege o parolă puternică de minim 6 caractere pentru contul tău.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Parolă Nouă" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required leftIcon={<Lock className="w-4 h-4" />} />
                    <Input label="Confirmă Parola" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required leftIcon={<Lock className="w-4 h-4" />} />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsChangingPassword(false)}>Anulează</Button>
                    <Button type="submit" variant="primary" size="sm" isLoading={isSavingPassword}>Salvează Parola</Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </Modal>
  );
}