import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, LifeBuoy, Mail, Phone, Clock, MessageSquare, ChevronDown, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Chatbot } from "@/components/chatbot/Chatbot";

const FAQS = [
  {
    question: "Cum pot reseta parola contului meu?",
    answer: "Pentru a reseta parola, accesați ecranul de autentificare și faceți click pe opțiunea 'Am uitat parola'. Veți primi un email cu un link securizat pentru setarea unei parole noi."
  },
  {
    question: "Cine poate adăuga cereri noi în sistem?",
    answer: "Doar utilizatorii cu rol de 'Primărie' pot crea și aloca cereri noi în platformă. Furnizorii pot doar să le vizualizeze și să le actualizeze statusul."
  },
  {
    question: "Cum sunt notificat când primesc o cerere?",
    answer: "Platforma folosește un sistem de notificări în timp real. Veți primi o alertă în aplicație imediat ce o primărie vă alocă o nouă sarcină."
  },
  {
    question: "Cât timp durează rezolvarea unui tichet de suport?",
    answer: "Echipa noastră tehnică preia tichetele în ordinea sosirii. Timpul mediu de răspuns este de 2-4 ore în timpul programului de lucru (Luni-Vineri, 09:00 - 17:00)."
  }
];

export function Support() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Stările pentru formular și trimitere email
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Problemă de autentificare",
    message: ""
  });

  // Funcția care trimite emailul real
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          subject: `Tichet Suport Centria: ${formData.subject}`,
          from_name: formData.name,
          replyto: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        // Resetăm formularul după trimitere
        setFormData({ name: "", email: "", subject: "Problemă de autentificare", message: "" });
        
        // Ascundem mesajul de succes după 5 secunde
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("A apărut o problemă la trimiterea mesajului. Te rugăm să încerci din nou.");
      }
    } catch (error) {
      console.error("Eroare trimitere email:", error);
      alert("Eroare de conexiune. Verifică internetul și încearcă din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-sky-200 pb-20 relative transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)} variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} className="hidden sm:flex border-slate-200 text-slate-600 hover:bg-slate-100">
              Înapoi
            </Button>
            <Button onClick={() => navigate(-1)} variant="outline" className="sm:hidden p-2 border-slate-200 text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-sky-700">
              <LifeBuoy className="w-6 h-6" />
              <span className="font-bold text-xl tracking-tight hidden sm:block">Suport Tehnic</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Titlu Secțiune */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Cum te putem ajuta astăzi?</h1>
            <p className="text-lg text-slate-500">Suntem aici pentru a ne asigura că experiența ta cu platforma Centria este impecabilă. Alege metoda de contact preferată sau consultă răspunsurile rapide de mai jos.</p>
          </motion.div>
        </div>

        {/* Carduri Informații Contact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4"><Mail className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Suport prin Email</h3>
            <p className="text-slate-500 text-sm mb-4">Trimite-ne un mesaj detaliat și îți vom răspunde în cel mai scurt timp posibil.</p>
            <a href="mailto:suport@centria.ro" className="text-sky-600 font-semibold hover:text-sky-700 mt-auto">suport@centria.ro</a>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><Phone className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Suport Telefonic</h3>
            <p className="text-slate-500 text-sm mb-4">Pentru urgențe critice sau probleme de acces, ne poți contacta direct.</p>
            <a href="tel:+40700000000" className="text-emerald-600 font-semibold hover:text-emerald-700 mt-auto">+40 700 000 000</a>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4"><Clock className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Program de Lucru</h3>
            <p className="text-slate-500 text-sm mb-4">Echipa noastră de tehnicieni este disponibilă în timpul orelor de program.</p>
            <span className="text-amber-600 font-semibold mt-auto">Luni - Vineri: 09:00 - 17:00</span>
          </div>
        </motion.div>

        {/* Secțiunea de Formular și FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Formular de Contact */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-bold text-slate-900">Trimite un mesaj</h2>
            </div>

            {/* Mesaj de succes vizual */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-medium text-sm">Mesajul a fost trimis cu succes! Te vom contacta curând.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSupportSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Numele tău</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Ex: Popescu Ion" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresa de email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="nume@institutie.ro" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subiect / Problemă întâmpinată</label>
                <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none bg-slate-50 focus:bg-white">
                  <option>Problemă de autentificare</option>
                  <option>Eroare la adăugarea unei cereri</option>
                  <option>Bug vizual sau funcțional</option>
                  <option>Sugestie de îmbunătățire</option>
                  <option>Altele</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Detalii suplimentare</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={4} placeholder="Descrie problema cât mai detaliat..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none bg-slate-50 focus:bg-white resize-none"></textarea>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl shadow-md flex justify-center items-center gap-2">
                {isSubmitting ? "Se trimite..." : <><Send className="w-4 h-4" /> Trimite Tichet</>}
              </Button>
            </form>
          </motion.div>

          {/* Întrebări Frecvente (Accordion) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Întrebări Frecvente</h2>
            <div className="space-y-3">
              {FAQS.map((faq, index) => (
                <div key={index} className={`border rounded-2xl overflow-hidden transition-colors ${openFaq === index ? 'bg-white border-sky-200 shadow-sm' : 'bg-transparent border-slate-200 hover:border-slate-300 hover:bg-white/50'}`}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left outline-none">
                    <span className={`font-semibold pr-4 ${openFaq === index ? 'text-sky-700' : 'text-slate-700'}`}>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-sky-600' : 'text-slate-400'}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5 pt-0 text-slate-600 leading-relaxed text-sm border-t border-slate-100 mt-2">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Asistent Centria Banner */}
            <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Încearcă Asistentul Centria AI!</h3>
              <p className="text-slate-300 text-sm mb-6 relative z-10">Ai o întrebare rapidă? Asistentul nostru inteligent din colțul ecranului îți poate oferi răspunsuri instantanee fără a mai deschide un tichet.</p>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 relative z-10" onClick={() => document.querySelector<HTMLButtonElement>('button.w-14.h-14')?.click()}>
                Deschide Chat-ul
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
      <Chatbot />
    </div>
  );
}