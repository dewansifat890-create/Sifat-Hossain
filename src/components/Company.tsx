import { motion } from 'motion/react';
import { ExternalLink, Layers, Play } from 'lucide-react';
import { BRAND_VIDEO_URL } from '../constants/data';

interface CompanyProps {
  onOpenModal: () => void;
}

export default function Company({ onOpenModal }: CompanyProps) {
  return (
    <section className="py-12 md:py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 relative overflow-hidden group"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-neon-blue/10 blur-[80px] md:blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-neon-blue/20 transition-colors" />
          <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-neon-purple/10 blur-[80px] md:blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 group-hover:bg-neon-purple/20 transition-colors" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div 
              animate={{ 
                rotate: [0, 10, -10, 0],
                y: [0, -10, 10, 0]
              }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] md:rounded-[40px] glass flex items-center justify-center border-neon-blue/30 shadow-[0_0_50px_rgba(0,242,255,0.1)] overflow-hidden cursor-pointer"
              onClick={onOpenModal}
            >
              {BRAND_VIDEO_URL ? (
                <video 
                  src={BRAND_VIDEO_URL} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Layers size={40} md:size={64} className="text-neon-blue mb-1 md:mb-2" />
                  <span className="text-sm md:text-2xl font-black tracking-tighter">SAID SOFT</span>
                </div>
              )}
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                SAID SOFT
              </h2>
              <p className="text-base md:text-xl text-white/70 mb-6 md:mb-8 leading-relaxed max-w-2xl">
                A premium software brand dedicated to crafting futuristic digital experiences. 
                We specialize in high-end app development, web solutions, and creative content creation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenModal}
                  className="px-6 md:px-8 py-3 md:py-4 glass rounded-2xl border-neon-blue/50 text-neon-blue font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,242,255,0.2)] text-sm md:text-base"
                >
                  Explore Brand <ExternalLink size={18} md:size={20} />
                </motion.button>
                {BRAND_VIDEO_URL && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenModal}
                    className="px-6 md:px-8 py-3 md:py-4 glass rounded-2xl border-white/20 text-white font-bold flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    Watch Video <Play size={18} md:size={20} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
