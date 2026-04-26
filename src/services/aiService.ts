import { supabase } from "@/lib/supabase";
import { Request, UserProfile, Provider, Service, Municipality } from "@/types";

export const aiService = {
  async sendMessage(
    message: string, 
    context: { 
      profile: UserProfile | null; 
      requests: Request[];
      providers: Provider[];
      services: Service[];
      municipality: Municipality;
      municipalities: Municipality[];
    }
  ) {
    try {
      if (!message || !message.trim()) return "Te rog scrie un mesaj.";

      // =========================================================================
      // NOU: REGULI DE ACCES STRICTE PENTRU AI
      // =========================================================================
      let reguliAcces = "Ești un asistent virtual pentru vizitatori. Răspunde doar la întrebări generale despre platformă.";
      
      if (context.profile?.role === 'admin') {
        reguliAcces = "Ești asistent pentru Administrator. Ai acces la absolut toate datele, primăriile, furnizorii și cererile. Poți răspunde liber la orice.";
      } else if (context.profile?.role === 'primarie') {
        reguliAcces = `Ești asistent pentru o Primărie (${context.municipality?.name}). REGULĂ STRICTĂ: Ai voie să oferi informații DOAR despre cererile din lista ta. Dacă utilizatorul întreabă despre alte primării sau cereri străine, refuză politicos spunând că nivelul de acces îi permite vizualizarea exclusiv a propriilor date.`;
      } else if (context.profile?.role === 'furnizor') {
        reguliAcces = `Ești asistent pentru un Furnizor. REGULĂ STRICTĂ: Ești limitat la cererile atribuite direct ție. Refuză politicos orice întrebare despre concurență, alți furnizori sau alte cereri din platformă, invocând restricțiile de confidențialitate ale contului.`;
      }

      const { data, error } = await supabase.functions.invoke('centria-chat', {
        body: { 
          message: message.trim(), 
          userRole: context.profile?.role || 'vizitator',
          appContext: {
            // Trimitem regulile direct în mintea AI-ului
            reguli_comportament: reguliAcces,
            
            primaria_curenta: context.municipality?.name || "Nespecificată",
            localitate_curenta: context.municipality?.locality || "Nespecificată",
            
            municipalitati_active: (context.municipalities || []).map(m => ({
              nume: m.name,
              localitate: m.locality
            })),
            
            cereri_permise_vizualizare: (context.requests || []).slice(0, 5).map(r => ({ 
              titlu: r.title, 
              status: r.status,
              serviciu: r.service?.name || "N/A"
            })),
            
            furnizori: (context.providers || []).map(p => p.name),
            servicii: (context.services || []).map(s => s.name)
          }
        },
      });

      if (error) {
        const errorDetail = await error.context?.json().catch(() => ({ error: error.message }));
        throw new Error(errorDetail.error || "Eroare server");
      }

      return data.reply;
    } catch (error: any) {
      console.error("AI Service Error:", error);
      return "Eroare: " + (error.message || "A apărut o eroare la contactarea asistentului.");
    }
  }
};