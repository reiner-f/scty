import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import { aiService } from "@/services/aiService";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
}

//niste butoane pentru raspusnuri rapide
const QUICK_REPLIES = [
  "Cine a creat aplicația?",
  "Ce funcții ai?",
  "Rezumat cereri",
  "Cum resetez parola?",
  "Contact suport"
];

export function Chatbot() {
  const { profile, filteredRequests, providers, services, municipality, allMunicipalities } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      text: "Bună! Sunt asistentul tău Centria. Cum te pot ajuta astăzi?", 
      sender: "bot" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  //functia genereaza raspunsuri locale, fara tokeni  
  const getLocalResponse = (query: string): string | null => {
    const q = query.toLowerCase().trim();
    
    if (q === "cine a creat aplicația?" || q.includes("dezvoltatori") || q.includes("cine te-a creat")) {
      return "Aplicația Centria a fost dezvoltată de **Balan-Ionuț**.";
    }
    
    if (q === "ce funcții ai?" || q.includes("ce poți face")) {
      return "Te pot ajuta să navighezi prin platformă! Îți pot oferi informații despre:\n• Statusul cererilor tale\n• Furnizorii disponibili\n• Serviciile oferite în platformă\n\nÎntreabă-mă orice!";
    }

    if (q === "rezumat cereri" || q.includes("câte cereri am")) {
      const total = filteredRequests.length;
      const accepted = filteredRequests.filter(r => r.status === 'accepted').length;
      const pending = filteredRequests.filter(r => r.status === 'pending').length;
      return `Momentan, ai acces la **${total} cereri** în sistem.\nDintre acestea:\n• **${accepted}** sunt acceptate\n• **${pending}** sunt în așteptare.`;
    }

    if (q.includes("resetare parolă") || q.includes("resetez parola") || q.includes("uitat parola") || q === "cum resetez parola?") {
      return "Pentru a-ți reseta parola, te rugăm să folosești opțiunea **„Am uitat parola”** de pe ecranul principal de autentificare. Vei primi un email cu instrucțiunile necesare pentru a seta o parolă nouă.";
    }

    if (q.includes("contact suport") || q.includes("email de suport") || q.includes("ajutor tehnic") || q.includes("contact")) {
      return "Echipa noastră de suport îți stă mereu la dispoziție! \n\nNe poți contacta la adresa de email: **suport@centria.ro** (adresă demo). Încercăm să răspundem la toate solicitările în maximum 24 de ore lucrătoare.";
    }

    return null; //null, daca nu e preluat local
  };

  const handleSend = async (e?: React.FormEvent, predefinedText?: string) => {
    if (e) e.preventDefault();
    const messageToSend = predefinedText || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), text: messageToSend, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    // veirificare implicita, locala
    const localResponse = getLocalResponse(messageToSend);
    
    if (localResponse) {
      setIsLoading(true);
      setTimeout(() => {
        const botMsg: Message = { id: (Date.now() + 1).toString(), text: localResponse, sender: "bot" };
        setMessages(prev => [...prev, botMsg]);
        setIsLoading(false);
      }, 600);
      return; 
    }

    //nepreluare locala, trimis spre openai
    setIsLoading(true);
    try {
      const response = await aiService.sendMessage(messageToSend, { 
        profile, 
        requests: filteredRequests,
        providers,
        services,
        municipality,
        municipalities: allMunicipalities
      });
      
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: response, sender: "bot" };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = { 
        id: "error", 
        text: "Îmi pare rău, am întâmpinat o problemă de conexiune.", 
        sender: "bot" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, y: 20, filter: "blur(10px)" }}
            className="absolute bottom-16 right-0 w-[320px] sm:w-[400px] h-[550px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold block text-sm">Asistent Centria</span>
                  <span className="text-[10px] text-sky-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Online • Hibrid (AI + Local)
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mesaje */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 transition-colors">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 transition-colors ${msg.sender === "user" ? "bg-sky-100 dark:bg-sky-900" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"}`}>
                      {msg.sender === "user" ? <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> : <Bot className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap transition-colors ${msg.sender === "user" ? "bg-sky-600 text-white rounded-tr-none" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none"}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm transition-colors">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                    <span className="text-xs text-slate-400 dark:text-slate-300 font-medium">Procesez...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sugestii (Quick Replies) */}
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-hide transition-colors">
              <div className="flex gap-2 pb-1">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(undefined, reply)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-slate-600 transition-colors disabled:opacity-50 shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => handleSend(e)} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Întreabă-mă ceva..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-sky-600 text-white p-2.5 rounded-xl hover:bg-sky-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buton Principal */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl flex items-center justify-center text-white shadow-xl hover:shadow-sky-500/40 transition-all border border-white/20"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <MessageSquare className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}