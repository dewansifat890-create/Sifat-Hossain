import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { Cake, Star, X } from 'lucide-react';

export default function BirthdayCelebration() {
  const [isBirthday, setIsBirthday] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkBirthday = () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      
      const isTodaySifatsDay = (month === 5 && date === 16);
      setIsBirthday(isTodaySifatsDay);
    };

    checkBirthday();
    const interval = setInterval(checkBirthday, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isBirthday || !canvasRef.current || !isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      gravity: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.gravity = 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 0.012;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const colors = ['#bf00ff', '#00e5ff', '#ff007f', '#ffffff', '#7bb2ff'];

    const createFirework = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.05) {
        createFirework(Math.random() * canvas.width, Math.random() * (canvas.height * 0.6));
      }

      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBirthday, isVisible]);

  if (!isBirthday || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 50, y: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 50, y: 50 }}
              className="relative p-6 glass-card border-neon-purple/30 bg-black/80 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(191,0,255,0.2)] flex flex-col items-center group"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
              >
                <X size={14} strokeWidth={3} />
              </button>

              {/* Cartoon Animation - Floating Birthday Character */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
                className="mb-3"
              >
                <div className="relative">
                  <div className="bg-neon-purple w-12 h-12 rounded-full flex items-center justify-center text-black border-2 border-white/50">
                    <Cake size={24} />
                  </div>
                  {/* Cartoon Eyes */}
                  <div className="absolute top-2 left-3 w-2 h-2 bg-black rounded-full animate-pulse" />
                  <div className="absolute top-2 right-3 w-2 h-2 bg-black rounded-full animate-pulse" />
                </div>
              </motion.div>

              <div className="text-center">
                <h2 className="text-lg font-black italic tracking-tighter text-white mb-1">
                  HAPPY <span className="text-neon-purple">BIRTHDAY</span>
                </h2>
                <p className="text-neon-blue font-black tracking-widest text-[10px] uppercase">
                  DEWAN SIFAT
                </p>
                
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                    >
                      <Star size={10} className="text-white fill-white" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
