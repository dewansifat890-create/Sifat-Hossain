import { motion } from 'motion/react';
import { Play, ExternalLink, Smartphone } from 'lucide-react';
import { APPS } from '../constants/data';

export default function AppHub({ isModal = false }: { isModal?: boolean }) {
  const content = (
    <div className="max-w-6xl mx-auto">
      {!isModal && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">App <span className="text-neon-purple">Hub</span></h2>
            <p className="text-white/60 max-w-md text-sm md:text-base">Discover my latest applications and digital tools built with cutting-edge technology.</p>
          </div>
          <div className="flex gap-3 md:gap-4 w-full md:w-auto">
            <div className="glass px-4 md:px-6 py-2 md:py-3 rounded-2xl border-white/10 flex-1 md:flex-none text-center">
              <span className="text-xl md:text-2xl font-bold text-neon-purple">0</span>
              <span className="text-[9px] md:text-xs block text-white/50 uppercase tracking-widest">Apps Built</span>
            </div>
            <div className="glass px-4 md:px-6 py-2 md:py-3 rounded-2xl border-white/10 flex-1 md:flex-none text-center">
              <span className="text-xl md:text-2xl font-bold text-neon-blue">0</span>
              <span className="text-[9px] md:text-xs block text-white/50 uppercase tracking-widest">Downloads</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className={`grid ${isModal ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2'} gap-4 md:gap-8`}>
        {APPS.length > 0 ? APPS.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card group overflow-hidden flex flex-col"
          >
            <div className="w-full h-32 md:h-48 overflow-hidden relative">
              <img 
                src={app.image} 
                alt={app.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full glass flex items-center justify-center text-white">
                  <Smartphone size={16} md:size={24} />
                </div>
              </div>
            </div>
            <div className="p-4 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-3 group-hover:text-neon-purple transition-colors line-clamp-1">{app.name}</h3>
                <p className="text-white/60 text-[10px] md:text-sm leading-relaxed mb-3 md:mb-6 line-clamp-2">{app.description}</p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-1.5 md:py-3 glass rounded-lg md:rounded-xl border-neon-purple/30 text-neon-purple font-bold flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-base"
                >
                  <Play size={12} md:size={18} /> <span className="hidden xs:inline">Use App</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-12 h-8 md:h-12 glass rounded-lg md:rounded-xl flex items-center justify-center text-white/50 hover:text-white"
                >
                  <ExternalLink size={12} md:size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center glass-card border-white/5">
            <p className="text-white/40 font-bold tracking-widest uppercase">No apps available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) return content;

  return (
    <section id="apps" className="py-12 md:py-20 px-6">
      {content}
    </section>
  );
}
