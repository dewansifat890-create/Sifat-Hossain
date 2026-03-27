import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function WelcomeAnimation({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    setShow(true);
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const letters = "WELCOME".split("");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="relative">
        <div className="flex gap-2 md:gap-4">
          {letters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -90, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotateX: 0, 
                scale: 1,
                textShadow: [
                  "0 0 0px rgba(0,242,255,0)",
                  "0 0 20px rgba(0,242,255,0.8)",
                  "0 0 10px rgba(0,242,255,0.4)"
                ]
              }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
                textShadow: {
                  type: "tween",
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
              className="text-5xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]"
            >
              {char}
            </motion.span>
          ))}
        </div>
        
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="h-[2px] w-full bg-gradient-to-r from-transparent via-neon-blue to-transparent mt-4"
        />
      </div>
      
      {/* Background Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/20 blur-[150px] rounded-full pointer-events-none" 
      />
    </motion.div>
  );
}
