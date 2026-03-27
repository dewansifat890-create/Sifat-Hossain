import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Snowflake, Link as LinkIcon } from 'lucide-react';
import { SOCIALS } from '../constants/data';

const iconMap: Record<string, any> = {
  Facebook,
  Instagram,
  Twitter,
  Snowflake,
  Link: LinkIcon
};

export default function Socials() {
  return (
    <section id="socials" className="py-12 md:py-20 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 border-neon-blue/20"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-8 md:mb-12 tracking-tighter">CONNECT WITH <span className="text-neon-blue">SIFAT</span></h2>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {SOCIALS.map((social, index) => {
              const Icon = iconMap[social.icon] || LinkIcon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="group flex flex-col items-center gap-3 md:gap-4"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[24px] glass flex items-center justify-center text-white/50 group-hover:text-neon-blue group-hover:neon-glow group-hover:border-neon-blue/50 transition-all duration-300">
                    <Icon size={24} md:size={32} />
                  </div>
                  <span className="text-[10px] md:text-sm font-bold tracking-widest text-white/40 group-hover:text-white transition-colors uppercase">{social.name}</span>
                </motion.a>
              );
            })}
          </div>
          
          <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-hadi-music'))}
              className="text-center md:text-left cursor-pointer group"
            >
              <p className="text-3xl md:text-4xl font-black tracking-tighter text-neon-blue group-hover:neon-glow transition-all duration-300">#JusticeForHadi</p>
              <p className="text-white/40 text-xs md:text-sm mt-2 group-hover:text-white/60 transition-colors">Standing for what is right. (Click to play/stop tribute)</p>
            </motion.div>
            <div className="flex gap-8 md:gap-12">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold">0</p>
                <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold">0</p>
                <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">Likes</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
