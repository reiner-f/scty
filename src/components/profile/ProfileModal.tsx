import React from "react";
import { Building2, User, Mail, Phone, MapPin, Hash, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Modal } from "../common/Modal";
import { useApp } from "@/context/AppContext";

export function ProfileModal() {
  const { municipality, isProfileOpen, closeProfile } = useApp();

  // Dacă nu există datele, prevenim erorile la randare
  if (!municipality) return null;

  const profileFields = [
    { icon: Building2, label: "Denumire Instituție", value: municipality.name },
    { icon: Hash, label: "Cod Unic (CUI)", value: municipality.cui },
    { icon: User, label: "Persoană de contact", value: municipality.contactPerson.name },
    { icon: Phone, label: "Telefon", value: municipality.contactPerson.phone },
    { icon: Mail, label: "Email", value: municipality.contactPerson.email, fullWidth: true },
    { icon: MapPin, label: "Adresă / Localitate", value: municipality.locality, fullWidth: true },
  ];

  return (
    <Modal 
      isOpen={isProfileOpen} 
      onClose={closeProfile} 
      // Am scos titlul standard din Modal, pentru că vom face un antet custom (mai spectaculos) mai jos
      size="lg" 
    >
      <div className="flex flex-col">
        {/* Antetul Profilului (Cover & Avatar) */}
        <div className="relative pt-6 pb-6 px-6 bg-gradient-to-br from-sky-50 to-white border-b border-slate-100 rounded-t-2xl">
          {/* Un element decorativ de fundal */}
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Building2 className="w-32 h-32" />
          </div>

          <div className="relative flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-lg shadow-sky-200">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              {/* Badge de "Cont Verificat" */}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {municipality.name}
              </h3>
              <p className="text-sm font-medium text-sky-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4" />
                {municipality.locality}
              </p>
            </div>
          </div>
        </div>

        {/* Zona de Date (Grid Layout) */}
        <div className="p-6 bg-white">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
            Informații Oficiale
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profileFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.label}
                  // Animație în cascadă (fiecare card apare cu o mică întârziere)
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors ${
                    field.fullWidth ? "sm:col-span-2" : "col-span-1"
                  }`}
                >
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Tipografie reparată: Label mic și discret, valoare vizibilă */}
                    <p className="text-xs font-medium text-slate-500 mb-0.5">
                      {field.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {field.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}