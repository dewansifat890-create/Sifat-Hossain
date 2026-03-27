import { motion } from 'motion/react';
import { GALLERY } from '../constants/data';

export default function Gallery({ isModal = false }: { isModal?: boolean }) {
  const content = (
    <div className="max-w-6xl mx-auto">
      {!isModal && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">Photo <span className="text-neon-pink">Gallery</span></h2>
          <div className="w-16 md:w-24 h-1 bg-neon-pink mx-auto rounded-full" />
        </motion.div>
      )}

      <div className={`columns-1 md:columns-2 ${isModal ? 'lg:columns-2' : 'lg:columns-3'} gap-4 md:gap-6 space-y-4 md:space-y-6`}>
        {GALLERY.length > 0 ? GALLERY.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-1.5 md:p-2 overflow-hidden group relative"
          >
            <img 
              src={img} 
              alt={`Gallery ${index}`}
              className="w-full h-auto rounded-lg md:rounded-xl transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 md:p-6">
              <p className="text-white text-xs md:text-sm font-bold tracking-tighter">SAID SOFT CREATIVE</p>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center glass-card border-white/5">
            <p className="text-white/40 font-bold tracking-widest uppercase">No photos in gallery yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) return content;

  return (
    <section id="gallery" className="py-12 md:py-20 px-6">
      {content}
    </section>
  );
}
