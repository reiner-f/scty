# Centria ERP & Ticketing Platform

![Status Proiect](https://img.shields.io/badge/Status-Finalizat-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Centria** este o platformă web modernă de tip SaaS (B2G/B2B) concepută pentru a eficientiza fluxul de lucru și comunicarea dintre instituțiile publice (Primării) și entitățile private (Furnizori de servicii). Aplicația centralizează gestiunea cererilor de intervenție, oferind transparență totală, rapoarte automate și asistență bazată pe Inteligență Artificială.
---
## 📸 Galerie Interfață

### 🔐 Autentificare & Securitate
<div align="center">
  <img src="screenshots/login.png" alt="Ecran Login" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</div>

### 📊 Panouri de Control (Dashboards)
<table>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/admin.png" alt="Panou Administrator"/>
      <br/><b>Panou Administrator</b>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/panel1.png" alt="Dashboard 1"/>
      <br/><b>Utilizatori (Panel 1)</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="screenshots/panel2.png" alt="Dashboard 2"/>
      <br/><b>Primării (Panel 2)</b>
    </td>
    <td align="center">
      <img src="screenshots/panel3.png" alt="Dashboard 3"/>
      <br/><b>Furnizori (Panel 3)</b>
    </td>
  </tr>
</table>

### 🤖 Asistent Virtual (AI Chatbot)
<table>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/chatbot_1.png" alt="Chatbot AI - Conversație"/>
      <br/><b>Sugestii și Răspunsuri Rapide</b>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/chatbot_2.png" alt="Chatbot AI - Răspunsuri Rapide"/>
      <br/><b>Conversație AI Inteligentă</b>
    </td>
  </tr>
</table>

### 📄 Export Enterprise (PDF & Excel)
<table>
  <tr>
    <td width="50%" align="center">
      <img src="screenshots/export_pdf_xlsx.png" alt="Meniu Export"/>
      <br/><b>Selecție și Export Date</b>
    </td>
    <td width="50%" align="center">
      <img src="screenshots/pdf_report.png" alt="Raport PDF Generat"/>
      <br/><b>Raport PDF</b>
    </td>
  </tr>
</table>

### 📧 Sistem Suport & Monitorizare
<table>
  <tr>
    <td width="33%" align="center">
      <img src="screenshots/email_creating.png" alt="Trimitere Tichet"/>
      <br/><b>Creare Tichet Suport</b>
    </td>
    <td width="33%" align="center">
      <img src="screenshots/email_received.png" alt="Tichet Primit"/>
      <br/><b>Email Primit în Inbox</b>
    </td>
    <td width="33%" align="center">
      <img src="screenshots/notif_json.png" alt="Sistem Notificări JSON"/>
      <br/><b>Istoric Activitate (JSON Logs)</b>
    </td>
  </tr>
</table>

## 🗺️ Diagrama de Ansamblu (High-Level Overview) (Use Case)

```mermaid
flowchart LR
    %% Stiluri pentru actori
    classDef actorStyle fill:#2A303C,stroke:#61DAFB,stroke-width:2px,color:#fff;
    
    %% Actorii principali
    Admin(("Administrator")):::actorStyle
    Primarie(("Primărie")):::actorStyle
    Furnizor(("Furnizor")):::actorStyle
    SistemAI(("Asistent AI (Gemini)")):::actorStyle

    %% Sistemul (Aplicația Centria)
    subgraph Centria["Centria ERP & Ticketing Platform"]
        direction TB
        Auth(["Autentificare securizată"])
        
        Creare(["Creare Cerere Intervenție"])
        Vizualizare(["Vizualizare Dashboard (Real-time)"])
        Update(["Actualizare Status Cerere"])
        
        Export(["Export Rapoarte PDF / Excel"])
        Chat(["Comunicare Chatbot"])
        Tichet(["Generare Tichet Suport"])
        
        MgmtUsers(["Management Utilizatori & Roluri"])
        MgmtLogs(["Monitorizare Jurnal Audit / JSON"])
    end

    %% Relațiile Administratorului
    Admin --> Auth
    Admin --> Vizualizare
    Admin --> Export
    Admin --> Chat
    Admin --> MgmtUsers
    Admin --> MgmtLogs

    %% Relațiile Primăriei
    Primarie --> Auth
    Primarie --> Creare
    Primarie --> Vizualizare
    Primarie --> Export
    Primarie --> Chat
    Primarie --> Tichet

    %% Relațiile Furnizorului
    Furnizor --> Auth
    Furnizor --> Vizualizare
    Furnizor --> Update
    Furnizor --> Export
    Furnizor --> Chat
    Furnizor --> Tichet

    %% Legătura cu sistemul extern (AI)
    Chat -. "procesează întrebările" .-> SistemAI
```
### 🏛️ Fluxul de Lucru: Modul Primărie

```mermaid
flowchart LR
    %% Stiluri pentru actori
    classDef actorStyle fill:#2A303C,stroke:#61DAFB,stroke-width:2px,color:#fff;
    
    %% Actorii principali
    Primarie(("Primărie")):::actorStyle
    SistemAI(("Asistent AI (Gemini)")):::actorStyle

    %% Sistemul (Aplicația Centria)
    subgraph Centria["Centria ERP - Perspectiva Primăriei"]
        direction TB
        Auth(["Autentificare securizată"])
        Creare(["Creare Cerere Intervenție"])
        Vizualizare(["Vizualizare Dashboard (Real-time)"])
        Export(["Export Rapoarte PDF / Excel"])
        Chat(["Comunicare Chatbot"])
        Tichet(["Generare Tichet Suport"])
    end

    %% Relațiile Primăriei
    Primarie --> Auth
    Primarie --> Creare
    Primarie --> Vizualizare
    Primarie --> Export
    Primarie --> Chat
    Primarie --> Tichet

    %% Legătura cu sistemul extern (AI)
    Chat -. "procesează întrebările" .-> SistemAI
```
## 🚀 Funcționalități Principale

### 🔐 Management Avansat al Accesului (RBAC)
* **3 Roluri Distincte:** Administrator, Primărie și Furnizor.
* **Securitate la nivel de rând (RLS):** Politici stricte în baza de date (PostgreSQL) care garantează că fiecare utilizator vede doar datele la care are dreptul legal.

### ⚡ Actualizări în Timp Real (Real-time)
* Integrare cu **Supabase Realtime** pentru sincronizarea instantanee a statusurilor cererilor. Orice modificare făcută de un furnizor este vizibilă instantaneu în dashboard-ul primăriei, fără reîncărcarea paginii.

### 🤖 Asistent Virtual Inteligent (Hybrid AI)
* Chatbot integrat cu **Gemini AI** prin Supabase Edge Functions.
* **Context-Aware:** Asistentul utilizează un "System Prompt" dinamic care restrânge informațiile oferite în funcție de rolul și permisiunile utilizatorului autentificat.
* Logică hibridă pentru optimizarea costurilor și viteză de răspuns.

### 📄 Module de Export Enterprise
* **Export PDF Profesional:** Generat pe client cu suport complet pentru diacritice (fonturi Roboto preîncărcate), logo custom și formatare tabelară.
* **Export Excel:** Generare de fișiere `.xlsx` formatate pentru analiză de date folosind librăria `XLSX`.
* **Selecție Manuală:** Posibilitatea de a exporta doar cererile selectate individual prin checkbox-uri.

### 🎨 UI/UX și Performanță
* **Interfață Adaptivă:** Design complet responsive realizat cu Tailwind CSS.
* **Visual FX:** Fundal animat complex generat prin API-ul HTML5 Canvas (rețea de noduri interconectate).
* **Dark Mode:** Suport nativ pentru modul întunecat/luminos cu persistență locală.
* **Animații:** Tranziții fluide între pagini și modale folosind Framer Motion.

---

## 🛠️ Stack Tehnologic

* **Frontend:** React 18, TypeScript, Vite.
* **Backend & Auth:** Supabase (PostgreSQL).
* **Stilizare:** Tailwind CSS, Lucide React (iconițe).
* **AI:** Google Gemini API.
* **Librării Export:** jsPDF, jspdf-autotable, XLSX.
* **Monitorizare:** Plugin custom Vite pentru salvarea logurilor de activitate în format JSON (local).

---

## 📦 Instalare și Configurare

1. **Clonare Repository:**
   ```bash
   git clone [https://github.com/reiner-f/scty.git](https://github.com/reiner-f/scty.git)
   cd scty
2. **Instalare Dependențe:**
    ```bash
    npm install
3. **Configurare Variabile de Mediu:**
    Creați un fișier .env în rădăcina proiectului și adăugați cheile necesare:
    ```bash
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key
4. **Rulare în Mod Dezvoltare:**
    ```bash
    npm run dev

### 🛡️ Securitate și Audit ##
**Activity Logging:** Orice acțiune critică (creare cerere, modificare status) este interceptată de un plugin middleware personalizat și salvată într-un jurnal de audit local.
**Environment Safety:** Cheile sensibile sunt gestionate prin variabile de mediu, nefiind expuse în codul sursă urcat pe GitHub *(via .gitignore)*.
## 👨‍💻 Autor

Bălan Mugurel - Software Developer

* [LinkedIn](https://www.linkedin.com/in/ionu%C8%9B-balan/)
* [GitHub](https://github.com/reiner-f)

## 📜 Licență

Acest proiect este dezvoltat în scop academic pentru cursul „Dezvoltarea Aplicațiilor Web”. Toate drepturile rezervate autorului.
## 📂 Structura Proiectului ##

```text
src/
├── components/      # Componente reutilizabile (UI, Modale, Dashboards)
├── context/         # Managementul stării globale (AppContext)
├── hooks/           # Hook-uri personalizate (useLocalStorage, etc.)
├── lib/             # Configurări biblioteci externe (Supabase)
├── pages/           # Paginile principale (History, Dashboard, Login)
├── services/        # Logica de business (API calls, Exporturi, AI)
├── types/           # Definiții TypeScript (Interfețe, Enum-uri)
└── utils/           # Funcții ajutătoare (formatare date, helper-i CSS) 

