import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/common/Button";
import { NetworkBackground } from "@/components/layout/NetworkBackground";

const MY_PROFILE = {
  name: "Balan Mugurel-Ionuț",
  role: "Software Developer", 
  imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQG8YNLTNvso9Q/profile-displayphoto-scale_400_400/B56ZjgJwBfH8Ao-/0/1756107311096?e=1778112000&v=beta&t=BzGmSlReFK8cMy5wmC5uIwAaf9DBiCwolhm5PqiY32M", 
  linkedin:  "https://www.linkedin.com/in/ionu%C8%9B-balan/",
  github: "https://github.com/reiner-f/",
};

export function Team() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900 overflow-hidden selection:bg-sky-500/30 font-sans">
      
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
        
        {/* Cardul Personal */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          // Modificat pentru o singură persoană: 1 coloană pe mobil, 2 pe ecrane mari
          className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl mx-auto shadow-2xl rounded-sm overflow-hidden border border-white/10"
        >
          {/* Partea Stângă: Poza */}
          <div className="aspect-square md:aspect-auto bg-slate-200 relative overflow-hidden group">
            <img 
              src={MY_PROFILE.imageUrl} 
              alt={MY_PROFILE.name} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
            />
          </div>
          
          {/* Partea Dreaptă: Informații (Culoare LinkedIn: #0a66c2) */}
          <div className="aspect-square md:aspect-auto bg-[#0a66c2] text-white p-8 sm:p-12 flex flex-col items-center justify-center relative text-center">
            {/* Săgețica decorativă (vizibilă doar pe desktop) */}
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#0a66c2] rotate-45"></div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">{MY_PROFILE.name}</h1>
            <p className="text-sky-200 text-lg sm:text-xl mb-10 font-medium tracking-wide">
              {MY_PROFILE.role}
            </p>
            
            <div className="flex items-center gap-6">
              <a 
                href={MY_PROFILE.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300" 
                title="LinkedIn"
              >
                <Linkedin className="w-7 h-7" /> 
              </a>
              <a 
                href={MY_PROFILE.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300" 
                title="GitHub"
              >
                <Github className="w-7 h-7" /> 
              </a>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
}