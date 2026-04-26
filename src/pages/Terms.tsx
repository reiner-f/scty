import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, FileText, Scale, ShieldCheck } from "lucide-react";
import { Button } from "@/components/common/Button";

// Structura de date pentru termeni - ușor de modificat pe viitor fără a strica UI-ul
const TERMS_SECTIONS = [
  {
    id: "introducere",
    title: "1. Introducere și Acceptare",
    content: (
      <>
        <p>
          Bine ați venit pe platforma <strong>Centria</strong>. Prezentul document stabilește termenii și condițiile de utilizare a platformei web și a serviciilor oferite prin intermediul acesteia.
        </p>
        <p>
          Prin accesarea, înregistrarea sau utilizarea aplicației Centria, confirmați că ați citit, ați înțeles și sunteți de acord să respectați acești Termeni și Condiții. Dacă nu sunteți de acord cu oricare dintre prevederi, vă rugăm să nu utilizați platforma.
        </p>
      </>
    )
  },
  {
    id: "servicii",
    title: "2. Descrierea Serviciilor",
    content: (
      <>
        <p>
          Centria este o platformă software B2B/B2G concepută pentru a eficientiza comunicarea și gestionarea sarcinilor între instituțiile publice (Primării) și entitățile private (Furnizori de servicii).
        </p>
        <p>
          Platforma permite crearea de cereri, atribuirea acestora către furnizori, urmărirea statusului în timp real și generarea de statistici. Centria acționează strict ca un furnizor de infrastructură software (SaaS) și nu este parte a contractelor comerciale încheiate direct între Primării și Furnizori.
        </p>
      </>
    )
  },
  {
    id: "conturi",
    title: "3. Conturi și Securitate",
    content: (
      <>
        <p>
          Pentru a utiliza funcționalitățile platformei, trebuie să dețineți un cont aprobat de un administrator. Sunteți pe deplin responsabil pentru păstrarea confidențialității credențialelor (adresa de email și parola).
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Nu aveți voie să transferați contul sau să oferiți acces unor terțe persoane neautorizate.</li>
          <li>Orice activitate desfășurată sub contul dumneavoastră este considerată a fi autorizată de dumneavoastră.</li>
          <li>Ne rezervăm dreptul de a suspenda temporar sau permanent conturile care prezintă activități suspecte sau care încalcă acești termeni.</li>
        </ul>
      </>
    )
  },
  {
    id: "roluri",
    title: "4. Roluri și Responsabilități",
    content: (
      <>
        <p><strong>Utilizatorii de tip Primărie:</strong> Sunt responsabili pentru acuratețea datelor introduse în cereri și pentru legalitatea solicitărilor efectuate către furnizori prin intermediul platformei.</p>
        <p><strong>Utilizatorii de tip Furnizor:</strong> Sunt responsabili pentru actualizarea corectă și la timp a statusului lucrărilor și pentru respectarea standardelor de calitate agreate cu instituțiile publice în afara platformei noastre.</p>
      </>
    )
  },
  {
    id: "date",
    title: "5. Prelucrarea Datelor (GDPR)",
    content: (
      <>
        <p>
          Respectăm intimitatea dumneavoastră și legislația europeană privind protecția datelor (GDPR). Datele personale colectate (nume, adrese de email, jurnale de activitate) sunt folosite strict pentru funcționarea platformei și autentificare.
        </p>
        <p>
          Nu vindem și nu înstrăinăm datele către terți în scopuri de marketing. Pentru detalii complete, vă rugăm să consultați Politica noastră de Confidențialitate.
        </p>
      </>
    )
  },
  {
    id: "limitare",
    title: "6. Limitarea Răspunderii",
    content: (
      <>
        <p>
          Aplicația Centria este furnizată „așa cum este” și „așa cum este disponibilă”. Echipa de dezvoltare nu garantează că platforma va fi lipsită de erori sau că va funcționa fără întreruperi 100% din timp.
        </p>
        <p>
          În măsura maximă permisă de lege, echipa Centria nu va fi răspunzătoare pentru daune directe, indirecte, accidentale sau pierderi de profit rezultate din: utilizarea sau imposibilitatea de utilizare a platformei, pierderea de date cauzată de utilizatori sau disputele financiare/legale dintre Primării și Furnizori.
        </p>
      </>
    )
  },
  {
    id: "modificari",
    title: "7. Modificarea Termenilor",
    content: (
      <>
        <p>
          Ne rezervăm dreptul de a modifica acești Termeni și Condiții în orice moment, pentru a reflecta schimbări legislative sau actualizări ale aplicației. 
        </p>
        <p>
          Utilizatorii vor fi notificați în platformă în cazul unor schimbări majore. Continuarea utilizării platformei după publicarea modificărilor reprezintă acceptul dumneavoastră.
        </p>
      </>
    )
  }
];

export function Terms() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>(TERMS_SECTIONS[0].id);

  // Un mic hook pentru a detecta ce secțiune este vizibilă pe ecran (scroll spy)
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = TERMS_SECTIONS.map(s => document.getElementById(s.id));
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          // Dacă secțiunea este în partea de sus a ferestrei (offset de 150px pentru header)
          if (rect.top <= 150) {
            setActiveSection(TERMS_SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Spațiu de respiro sus
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-sky-200 transition-colors duration-300">
      
      {/* Header simplu și profesional */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="hidden sm:flex border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Înapoi
            </Button>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              className="sm:hidden p-2 border-slate-200 text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-sky-700">
              <Scale className="w-6 h-6" />
              <span className="font-bold text-xl tracking-tight hidden sm:block">Legal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Navigare (Meniu stânga) */}
        <div className="lg:w-1/4 hidden lg:block">
          <div className="sticky top-32 space-y-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-3">
              Cuprins Document
            </h4>
            {TERMS_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Conținutul efectiv (Textul) */}
        <div className="lg:w-3/4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12"
          >
            {/* Titlu Pagină */}
            <div className="mb-12 border-b border-slate-100 pb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-6">
                <ShieldCheck className="w-4 h-4" />
                Document Oficial
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Termeni și Condiții
              </h1>
              <p className="text-slate-500 flex items-center gap-2">
                Ultima actualizare: <span className="font-medium text-slate-700">20 Aprilie 2026</span>
              </p>
            </div>

            {/* Secțiunile generate dinamic */}
            <div className="space-y-12">
              {TERMS_SECTIONS.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    {section.title}
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Secțiune Contact Suport în subsolul documentului */}
            <div className="mt-16 pt-8 border-t border-slate-100 bg-slate-50 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Aveți întrebări?</h3>
              <p className="text-slate-600 text-sm">
                Dacă aveți neclarități în privința acestor Termeni și Condiții, vă rugăm să contactați echipa de suport Centria la adresa de email: <a href="mailto:suport@centria.ro" className="text-sky-600 font-medium hover:underline">suport@centria.ro</a>.
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}