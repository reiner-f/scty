import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'log-to-file',
      configureServer(server) {
        console.log("\n🚀 Plugin-ul pentru scrierea și citirea Logurilor s-a încărcat cu succes!\n");
        
        server.middlewares.use('/api/log', (req, res) => {
          const logFilePath = path.resolve(process.cwd(), 'src', 'activity-logs.json');

          // ==========================================
          // 1. LOGICA DE CITIRE (Metoda GET)
          // Se execută la pornirea aplicației (în AppContext)
          // ==========================================
          if (req.method === 'GET') {
            console.log("📥 Am interceptat o cerere de CITIRE (GET) pe /api/log!");
            try {
              if (fs.existsSync(logFilePath)) {
                const fileContent = fs.readFileSync(logFilePath, 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(fileContent);
              } else {
                // Dacă fișierul nu există încă, returnăm un array gol
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify([])); 
              }
            } catch (e: any) {
              console.error("❌ Eroare la citirea fișierului:", e.message);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Nu am putut citi fișierul" }));
            }
            return; // Oprim execuția aici pentru GET
          }

          // ==========================================
          // 2. LOGICA DE SCRIERE (Metoda POST)
          // Se execută când adaugi o activitate nouă
          // ==========================================
          if (req.method === 'POST') {
            console.log("📥 Am interceptat o cerere de SCRIERE (POST) pe /api/log!");
            let body = '';
            
            req.on('data', chunk => { body += chunk.toString(); });
            
            req.on('end', () => {
              try {
                const newLog = JSON.parse(body);
                console.log("💾 Încerc să salvez în:", logFilePath);
                
                let logs: any[] = [];
                // Citim ce exista deja în fișier pentru a nu pierde istoricul
                if (fs.existsSync(logFilePath)) {
                  const fileContent = fs.readFileSync(logFilePath, 'utf-8');
                  if (fileContent) logs = JSON.parse(fileContent);
                }
                
                // Adăugăm la început și păstrăm doar ultimele 100 de loguri
                logs.unshift(newLog);
                if (logs.length > 100) logs = logs.slice(0, 100);
                
                fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
                
                console.log("✅ Fișierul a fost scris/actualizat cu succes!\n");
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e: any) {
                console.error("❌ Eroare FATALĂ la scriere:", e.message);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
            return; // Oprim execuția aici pentru POST
          }

          // Dacă cererea nu este nici GET, nici POST
          res.statusCode = 404;
          res.end();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});