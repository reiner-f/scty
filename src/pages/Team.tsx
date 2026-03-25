import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Linkedin } from "lucide-react";
import { Button } from "@/components/common/Button";
import { NetworkBackground } from "@/components/layout/NetworkBackground";

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Balan Ionuț",
    role: "Frontend Architect",
    description: "A creat interfața premium, animațiile fluide și experiența utilizatorului (UX) folosind React și Tailwind CSS.",
    imageUrl: "https://ui-avatars.com/api/?name=Balan+Ionut&background=e2e8f0&color=475569&size=512",
    linkedin: "https://linkedin.com",
  },
  {
    id: 2,
    name: "Stanichevici Victor",
    role: "Backend Developer",
    description: "A proiectat arhitectura bazei de date în Supabase, securitatea (RLS) și logica de sincronizare în timp real.",
    imageUrl: "https://ui-avatars.com/api/?name=Stanichevici+Victor&background=e2e8f0&color=475569&size=512",
    linkedin: "https://linkedin.com",
  },
  {
    id: 3,
    name: "Varvaroi Dalia",
    role: "Fullstack Engineer",
    description: "A integrat funcționalitățile complexe de filtrare, sistemul de roluri și serviciile de autentificare.",
    imageUrl: "https://ui-avatars.com/api/?name=Varvaroi+Dalia&background=e2e8f0&color=475569&size=512",
    linkedin: "https://linkedin.com",
  },
  {
    id: 4,
    name: "Curcă Maria-Codrina",
    role: "Security & QA",
    description: "S-a asigurat că platforma este impenetrabilă, gestionând permisiunile și testând riguros fiecare flux.",
    imageUrl: "https://ui-avatars.com/api/?name=Curca+Maria-Codrina&background=e2e8f0&color=475569&size=512",
    linkedin: "https://linkedin.com",
  }
];

export function Team() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900 overflow-hidden selection:bg-sky-500/30">
      
      {/* Fundalul animat cu rețeaua */}
      <NetworkBackground />

      {/* Butonul de Întoarcere */}
      <div className="relative z-20 pt-8 px-6 md:px-12">
        <Button 
          onClick={() => navigate(-1)} 
          leftIcon={<ArrowLeft className="w-5 h-5" />}
          className="bg-[#0a66c2] hover:bg-[#004182] text-white border-transparent shadow-lg transition-colors"
        >
          Înapoi la platformă
        </Button>
      </div>

      {/* Conținutul Principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
        
        {/* Grid-ul "Checkerboard" */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          // Toate elementele din grilă vor fi forțate să fie pătrate prin "aspect-square" pe copiii lor
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mx-auto shadow-2xl rounded-sm overflow-hidden border border-white/10"
        >
          {/* ----- RÂNDUL 1 ----- */}
          
          {/* Membru 1: Poză (Stânga sus) */}
          <div className="aspect-square bg-slate-200 relative overflow-hidden group">
            <img src={TEAM_MEMBERS[0].imageUrl} alt={TEAM_MEMBERS[0].name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          
          {/* Membru 1: Text (Culoare LinkedIn: #0a66c2) */}
          <div className="aspect-square bg-[#0a66c2] text-white p-6 sm:p-8 flex flex-col justify-center relative">
            <div className="hidden lg:block absolute top-10 -left-3 w-6 h-6 bg-[#0a66c2] rotate-45"></div>
            
            <h3 className="text-xl sm:text-2xl font-bold mb-1">{TEAM_MEMBERS[0].name}</h3>
            {/* Folosim un albastru foarte deschis pentru rol, ca să iasă în evidență pe fundalul LinkedIn */}
            <p className="text-sky-100 font-medium mb-3 sm:mb-4">{TEAM_MEMBERS[0].role}</p>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1">{TEAM_MEMBERS[0].description}</p>
            <a href={TEAM_MEMBERS[0].linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit text-white hover:text-sky-200 transition-colors">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-xs sm:text-sm font-semibold">LinkedIn</span>
            </a>
          </div>

          {/* Membru 2: Poză */}
          <div className="aspect-square bg-slate-200 relative overflow-hidden group">
            <img src={TEAM_MEMBERS[1].imageUrl} alt={TEAM_MEMBERS[1].name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          
          {/* Membru 2: Text (Alb) */}
          <div className="aspect-square bg-white text-slate-800 p-6 sm:p-8 flex flex-col justify-center relative">
             <div className="hidden lg:block absolute top-10 -left-3 w-6 h-6 bg-white rotate-45"></div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{TEAM_MEMBERS[1].name}</h3>
            <p className="text-slate-500 font-medium mb-3 sm:mb-4">{TEAM_MEMBERS[1].role}</p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1">{TEAM_MEMBERS[1].description}</p>
            <a href={TEAM_MEMBERS[1].linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit text-slate-400 hover:text-[#0a66c2] transition-colors">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-xs sm:text-sm font-semibold">LinkedIn</span>
            </a>
          </div>

          {/* ----- RÂNDUL 2 ----- */}
          
          {/* Membru 3: Text (Alb) */}
          <div className="aspect-square bg-white text-slate-800 p-6 sm:p-8 flex flex-col justify-center relative order-last md:order-none lg:order-none">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{TEAM_MEMBERS[2].name}</h3>
            <p className="text-slate-500 font-medium mb-3 sm:mb-4">{TEAM_MEMBERS[2].role}</p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1">{TEAM_MEMBERS[2].description}</p>
            <a href={TEAM_MEMBERS[2].linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit text-slate-400 hover:text-[#0a66c2] transition-colors">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-xs sm:text-sm font-semibold">LinkedIn</span>
            </a>
          </div>

          {/* Membru 3: Poză */}
          <div className="aspect-square bg-slate-200 relative overflow-hidden group">
            <img src={TEAM_MEMBERS[2].imageUrl} alt={TEAM_MEMBERS[2].name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            <div className="hidden lg:block absolute top-10 -left-3 w-6 h-6 bg-white rotate-45 z-10"></div>
          </div>

          {/* Membru 4: Text (Culoare LinkedIn: #0a66c2) */}
          <div className="aspect-square bg-[#0a66c2] text-white p-6 sm:p-8 flex flex-col justify-center relative order-last md:order-none lg:order-none">
            <h3 className="text-xl sm:text-2xl font-bold mb-1">{TEAM_MEMBERS[3].name}</h3>
            <p className="text-sky-100 font-medium mb-3 sm:mb-4">{TEAM_MEMBERS[3].role}</p>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1">{TEAM_MEMBERS[3].description}</p>
            <a href={TEAM_MEMBERS[3].linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit text-white hover:text-sky-200 transition-colors">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-xs sm:text-sm font-semibold">LinkedIn</span>
            </a>
          </div>

          {/* Membru 4: Poză */}
          <div className="aspect-square bg-slate-200 relative overflow-hidden group">
            <img src={TEAM_MEMBERS[3].imageUrl} alt={TEAM_MEMBERS[3].name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            <div className="hidden lg:block absolute top-10 -left-3 w-6 h-6 bg-[#0a66c2] rotate-45 z-10"></div>
          </div>

        </motion.div>

      </div>
    </div>
  );
}