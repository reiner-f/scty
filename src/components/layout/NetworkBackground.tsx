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

// Servicii reale, externalizate frecvent de primării
const SERVICES = [
  "Asfaltare", "Salubritate", "Dezăpezire", "Dezinsecție", "Iluminat", 
  "Digitalizare", "Consultanță", "Proiectare", "Cadastru", "Construcții", 
  "Peisagistică", "Securitate", "Mentenanță", "Audit", "Birotică", 
  "Mobilier", "Curățenie", "Arhitectură", "Evenimente", "Catering"
];

const CONFIG = {
  particleCount: 50, 
  connectionDistance: 190, 
  speed: 0.32,
  // Configurarea logo-ului central animat
  logo: {
    text: "CENTRIA",
    baseSize: 64,
    yOffset: -120, // Mutat mai sus pentru a sta peste formular
    pulseSpeed: 0.006, 
    pulseRange: 0.15, 
  }
};

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  isMunicipality: boolean;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    
    this.isMunicipality = Math.random() > 0.5;
    const sourceArray = this.isMunicipality ? MUNICIPALITIES : SERVICES;
    this.text = sourceArray[Math.floor(Math.random() * sourceArray.length)];
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= canvasWidth) this.vx *= -1;
    if (this.y <= 0 || this.y >= canvasHeight) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.isMunicipality ? '#0284c7' : '#7c3aed'; 
    ctx.fill();

    ctx.font = "500 11px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(this.text, this.x + 8, this.y + 4);
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
    
    // Variabile pentru animația logo-ului
    let logoPulseFactor = 0;
    let logoPulseDirection = 1;

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
      for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const drawNetwork = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      // ============================================================================
      // 1. DESENARE LOGO CENTRAL "CENTRIA"
      // ============================================================================
      
      // Actualizăm factorul de pulse (0 -> 1 -> 0)
      logoPulseFactor += CONFIG.logo.pulseSpeed * logoPulseDirection;
      if (logoPulseFactor >= 1 || logoPulseFactor <= 0) {
        logoPulseDirection *= -1;
      }
      
      // Calculăm opacitatea pulsatorie (baza + fluctuația)
      const currentAlpha = 0.8 + (logoPulseFactor - 0.5) * 2 * CONFIG.logo.pulseRange;
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const logoSize = Math.max(32, Math.min(CONFIG.logo.baseSize, width * 0.12));
      ctx.font = `800 ${logoSize}px Inter, system-ui, sans-serif`;
      
      const logoY = centerY + CONFIG.logo.yOffset;

      const gradient = ctx.createLinearGradient(
        centerX - logoSize * 2, 
        logoY, 
        centerX + logoSize * 2, 
        logoY
      );
      gradient.addColorStop(0, `rgba(124, 58, 237, ${currentAlpha})`);
      gradient.addColorStop(1, `rgba(79, 70, 229, ${currentAlpha})`);

      // EROAREA ERA AICI (am eliminat spațiul din currentAlpha)
      ctx.shadowColor = `rgba(139, 92, 246, ${currentAlpha * 0.4})`; 
      ctx.shadowBlur = logoSize / 2; 
      ctx.fillStyle = gradient;
      
      ctx.fillText(CONFIG.logo.text, centerX, logoY);
      
      // Resetăm glow-ul pentru a nu afecta liniile și punctele
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      // ============================================================================
      // 2. DESENARE REȚEA (Linii și Puncte)
      // ============================================================================

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONFIG.connectionDistance) {
            const opacity = 1 - (distance / CONFIG.connectionDistance);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.18})`; 
            ctx.lineWidth = 1;
            ctx.stroke();
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