import { motion } from 'motion/react';
import { Smartphone, Globe, Video, Image as ImageIcon, Youtube, Facebook } from 'lucide-react';
import { SKILLS } from '../constants/data';

const iconMap: Record<string, any> = {
  Smartphone,
  Globe,
  Video,
  Image: ImageIcon,
  Youtube,
  Facebook
};

interface SkillsProps {
  onOpenAppHub: () => void;
}

export default function Skills({ onOpenAppHub }: SkillsProps) {
  const handleSkillClick = (url: string) => {
    if (url === 'modal:app-hub') {
      onOpenAppHub();
    } else if (url === 'scroll:top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="skills" className="py-12 md:py-20 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">Expertise & <span className="text-neon-blue">Skills</span></h2>
          <div className="w-20 md:w-24 h-1 bg-neon-blue mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {SKILLS.map((skill, index) => {
            const Icon = iconMap[skill.icon] || Globe;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSkillClick(skill.url || '#')}
                className="glass-card p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4 text-center border-white/5 cursor-pointer group"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl glass flex items-center justify-center text-neon-blue group-hover:neon-glow transition-all">
                  <Icon size={24} md:size={32} />
                </div>
                <p className="font-medium text-xs md:text-base leading-tight group-hover:text-neon-blue transition-colors">{skill.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
