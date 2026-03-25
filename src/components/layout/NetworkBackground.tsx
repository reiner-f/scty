import React, { useEffect, useRef } from 'react';

// Toate cele 41 de reședințe de județ + București
const MUNICIPALITIES = [
  "București", "Alba Iulia", "Arad", "Pitești", "Bacău", "Oradea", "Bistrița", "Botoșani",
  "Brașov", "Brăila", "Buzău", "Reșița", "Călărași", "Cluj-Napoca", "Constanța", "Sfântu Gheorghe",
  "Târgoviște", "Craiova", "Galați", "Giurgiu", "Târgu Jiu", "Miercurea Ciuc", "Deva", "Slobozia",
  "Iași", "Baia Mare", "Turnu Severin", "Târgu Mureș", "Piatra Neamț", "Slatina", "Ploiești",
  "Satu Mare", "Zalău", "Sibiu", "Suceava", "Alexandria", "Timișoara", "Tulcea", "Vaslui",
  "Râmnicu Vâlcea", "Focșani"
];

// Serviciile actualizate
const SERVICES = [
  "Amenajare spații verzi",
  "Colectare deșeuri",
  "Curățenie stradală",
  "Deszăpezire",
  "Iluminat public",
  "Întreținere drumuri",
  "Reparații clădiri publice",
  "Transport public"
];

const CONFIG = {
  particleCount: 30, 
  connectionDistance: 250, 
  speed: 0.7, // <-- Viteza a fost mărită considerabil aici (înainte era 0.25)
  fontSize: 16, 
  particleRadius: 6 
};

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  isMunicipality: boolean;

  constructor(canvasWidth: number, canvasHeight: number, assignedText: string, isMuni: boolean) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    
    this.isMunicipality = isMuni;
    this.text = assignedText;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= canvasWidth) this.vx *= -1;
    if (this.y <= 0 || this.y >= canvasHeight) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, CONFIG.particleRadius, 0, Math.PI * 2);
    // Orașele sunt albastre, Serviciile sunt mov
    ctx.fillStyle = this.isMunicipality ? '#0284c7' : '#7c3aed'; 
    ctx.fill();

    ctx.font = `600 ${CONFIG.fontSize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = "#64748b";
    ctx.fillText(this.text, this.x + 12, this.y + 5); 
  }
}

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Amestecăm array-urile
      const shuffledMuni = [...MUNICIPALITIES].sort(() => 0.5 - Math.random());
      const shuffledServices = [...SERVICES].sort(() => 0.5 - Math.random());

      // Împărțim aproximativ 60% orașe, 40% servicii
      const numServices = Math.min(Math.floor(CONFIG.particleCount * 0.4), shuffledServices.length);
      const numMuni = Math.min(CONFIG.particleCount - numServices, shuffledMuni.length);

      for (let i = 0; i < numMuni; i++) {
        particles.push(new Particle(width, height, shuffledMuni[i], true));
      }

      for (let i = 0; i < numServices; i++) {
        particles.push(new Particle(width, height, shuffledServices[i], false));
      }
    };

    const drawNetwork = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      ctx.clearRect(0, 0, width, height);

      // ============================================================================
      // DESENARE REȚEA (Linii și Puncte)
      // ============================================================================

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          
          // CONDIȚIA CHEIE: Se leagă doar dacă unul e Oraș și celălalt e Serviciu
          if (particles[i].isMunicipality !== particles[j].isMunicipality) {
            
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.connectionDistance) {
              const opacity = 1 - (distance / CONFIG.connectionDistance);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              // Linie movalie semitransparentă, cu grosime de 2px
              ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.45})`; 
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        }
      }

      particles.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(drawNetwork);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawNetwork();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-80 bg-slate-50"
    />
  );
}