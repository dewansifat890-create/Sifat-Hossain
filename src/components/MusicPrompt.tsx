import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VolumeX, Volume2, X } from 'lucide-react';

export default function MusicPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Hide after 7 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 7000);

      return () => clearTimeout(hideTimer);
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleMute = () => {
    window.dispatchEvent(new CustomEvent('toggle-bg-music'));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.5 }}
          className="fixed bottom-24 left-8 z-[60] glass-card p-4 border-neon-blue/30 flex items-center gap-4 shadow-[0_0_30px_rgba(0,242,255,0.2)]"
        >
          <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue animate-pulse">
            <Volume2 size={16} />
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] font-bold text-white uppercase tracking-widest">Music Playing</p>
            <p className="text-[7px] text-white/40 uppercase tracking-tighter">Annoyed? Turn it off here.</p>
          </div>
          <div className="flex gap-2 ml-2">
            <button 
              onClick={handleMute}
              className="p-1.5 glass rounded-lg text-neon-pink hover:bg-neon-pink/10 transition-colors"
              title="Turn off music"
            >
              <VolumeX size={14} />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-white/5 rounded-lg text-white/30 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
