import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Linkedin, Code, LayoutTemplate, Database, ShieldCheck } from "lucide-react";
import { Button } from "@/components/common/Button";
import { NetworkBackground } from "@/components/layout/NetworkBackground";

// Datele echipei (poți modifica numele și descrierile cum dorești)
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Alexandru Popescu",
    role: "Frontend Architect",
    description: "A creat interfața premium, animațiile fluide și experiența utilizatorului (UX) folosind React și Tailwind CSS.",
    icon: LayoutTemplate,
    linkedin: "https://linkedin.com",
    color: "from-sky-400 to-blue-500"
  },
  {
    id: 2,
    name: "Mihai Ionescu",
    role: "Backend Developer",
    description: "A proiectat arhitectura bazei de date în Supabase, securitatea (RLS) și logica de sincronizare în timp real.",
    icon: Database,
    linkedin: "https://linkedin.com",
    color: "from-indigo-400 to-purple-500"
  },
  {
    id: 3,
    name: "Elena Radu",
    role: "Fullstack Engineer",
    description: "A integrat funcționalitățile complexe de filtrare, sistemul de roluri și serviciile de autentificare.",
    icon: Code,
    linkedin: "https://linkedin.com",
    color: "from-emerald-400 to-teal-500"
  },
  {
    id: 4,
    name: "Andrei Dumitrescu",
    role: "Security & QA",
    description: "S-a asigurat că platforma este impenetrabilă, gestionând permisiunile și testând riguros fiecare flux.",
    icon: ShieldCheck,
    linkedin: "https://linkedin.com",
    color: "from-rose-400 to-orange-500"
  }
];

export function Team() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900 overflow-hidden selection:bg-sky-500/30">
      
      {/* Fundalul animat */}
      <NetworkBackground />

      {/* Butonul de Întoarcere - Poziționat sus, în afara fluxului */}
      <div className="relative z-20 pt-8 px-6 md:px-12">
        <Button 
          variant="outline" 
          // navigate(-1) te întoarce fix la pagina anterioară
          onClick={() => navigate(-1)} 
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md"
        >
          Înapoi la platformă
        </Button>
      </div>

      {/* Conținutul Principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Echipa <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">Centria</span>
          </h1>
          <p className="text-sky-200 text-lg max-w-xl mx-auto font-medium">
            Oamenii pasionați care au transformat viziunea unei administrații publice digitale în realitate.
          </p>
        </motion.div>

        {/* Grid-ul cu Carduri */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {TEAM_MEMBERS.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-2"
              >
                {/* Iconița Rolului (Avatar) */}
                <div className={`w-16 h-16 rounded-2xl mb-5 flex items-center justify-center bg-gradient-to-br ${member.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-sky-300 uppercase tracking-wider mb-4">{member.role}</p>
                
                <p className="text-sky-100/80 text-sm leading-relaxed mb-6 flex-1">
                  {member.description}
                </p>

                {/* Buton LinkedIn */}
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-sky-600 hover:border-sky-500 transition-all duration-300 font-medium group/btn"
                >
                  <Linkedin className="w-5 h-5 text-sky-300 group-hover/btn:text-white transition-colors" />
                  <span>Conectează-te</span>
                </a>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}