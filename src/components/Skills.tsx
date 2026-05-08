import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Globe, Video, Image as ImageIcon, Youtube, Facebook, Key, X, Plus, Terminal } from 'lucide-react';
import { SKILLS } from '../constants/data';
import { useState, useRef, FormEvent, useEffect } from 'react';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [password, setPassword] = useState('');
  const [skillsData, setSkillsData] = useState(() => {
    const saved = localStorage.getItem('customSkillsData');
    return saved ? JSON.parse(saved) : SKILLS;
  });

  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-sticker-admin'));
    }, 5000); // 5 seconds
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTitleClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 600) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 2) {
      setShowPassModal(true);
      tapCountRef.current = 0;
    }
  };

  const handlePassSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '374212') {
      setIsAdmin(true);
      setShowPassModal(false);
      setPassword('');
      alert("Skills Edit Mode Activated!");
    } else {
      alert("Unauthorized Access Attempt.");
      setPassword('');
    }
  };

  const handleSkillClick = (url: string) => {
    if (isAdmin) return; // Don't navigate in admin mode
    if (url === 'modal:app-hub') {
      onOpenAppHub();
    } else if (url === 'scroll:top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSkill = {
      name: formData.get('name') as string,
      icon: (formData.get('icon') as string) || 'Globe',
      url: (formData.get('url') as string) || '#'
    };
    
    const updated = [...skillsData, newSkill];
    setSkillsData(updated);
    localStorage.setItem('customSkillsData', JSON.stringify(updated));
    (e.target as HTMLFormElement).reset();
  };

  const removeSkill = (index: number) => {
    const updated = skillsData.filter((_: any, i: number) => i !== index);
    setSkillsData(updated);
    localStorage.setItem('customSkillsData', JSON.stringify(updated));
  };

  return (
    <section id="skills" className="py-12 md:py-20 px-6 bg-white/[0.02] relative">
      {/* Password Modal */}
      <AnimatePresence>
        {showPassModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPassModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue mx-auto mb-4 border border-neon-blue/20">
                  <Key size={28} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Enter Passcode</h3>
              </div>

              <form onSubmit={handlePassSubmit} className="space-y-4">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  autoFocus
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg tracking-[0.5em] focus:outline-none focus:border-neon-blue transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-neon-blue text-black font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-tighter"
                >
                  Confirm
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter">Customize Skills</h3>

              <div className="max-h-[400px] overflow-y-auto mb-8 space-y-4 pr-2 scrollbar-hide">
                {skillsData.map((skill: any, idx: number) => (
                  <div key={idx} className="bg-white/[0.05] p-5 rounded-2xl border border-white/5 space-y-3 relative group">
                    <button 
                      onClick={() => removeSkill(idx)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition-colors bg-red-500/10 p-2 rounded-lg"
                    >
                      <X size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1 font-bold">Skill Name</label>
                        <input 
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const updated = [...skillsData];
                            updated[idx].name = e.target.value;
                            setSkillsData(updated);
                            localStorage.setItem('customSkillsData', JSON.stringify(updated));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-neon-blue outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1 font-bold">Icon Type</label>
                        <select 
                          value={skill.icon}
                          onChange={(e) => {
                            const updated = [...skillsData];
                            updated[idx].icon = e.target.value;
                            setSkillsData(updated);
                            localStorage.setItem('customSkillsData', JSON.stringify(updated));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-neon-blue outline-none"
                        >
                          <option value="Globe">Web Icon</option>
                          <option value="Smartphone">App Icon</option>
                          <option value="Video">Video Icon</option>
                          <option value="Image">Photo Icon</option>
                          <option value="Youtube">Youtube Icon</option>
                          <option value="Facebook">Facebook Icon</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1 font-bold">Redirect URL</label>
                        <input 
                          type="text"
                          value={skill.url}
                          placeholder="https://..."
                          onChange={(e) => {
                            const updated = [...skillsData];
                            updated[idx].url = e.target.value;
                            setSkillsData(updated);
                            localStorage.setItem('customSkillsData', JSON.stringify(updated));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-neon-blue outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSkill} className="space-y-4 pt-6 border-t border-white/10">
                <p className="text-xs font-black uppercase tracking-widest text-white/30">Add New Expertise</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    name="name"
                    required
                    placeholder="Expertise Name (e.g. Website Developer)"
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none"
                  />
                  <select 
                    name="icon"
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none"
                  >
                    <option value="Globe">Web Icon</option>
                    <option value="Smartphone">App Icon</option>
                    <option value="Video">Video Icon</option>
                    <option value="Image">Photo Icon</option>
                    <option value="Youtube">Youtube Icon</option>
                    <option value="Facebook">Facebook Icon</option>
                  </select>
                  <div className="md:col-span-2">
                    <input 
                      name="url"
                      placeholder="URL (e.g. https://facebook.com/your-profile)"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-neon-blue text-black font-black py-4 rounded-xl uppercase tracking-tighter"
                >
                  Add to List
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16 relative group"
        >
          <div className="flex flex-col items-center gap-3">
             <motion.div
               onMouseDown={startLongPress}
               onMouseUp={endLongPress}
               onMouseLeave={endLongPress}
               onTouchStart={startLongPress}
               onTouchEnd={endLongPress}
               className="w-12 h-12 md:w-16 md:h-16 rounded-2xl glass flex items-center justify-center text-neon-blue border-neon-blue/20 hover:neon-glow transition-all cursor-pointer active:scale-95"
             >
               <Terminal size={32} />
             </motion.div>
             <h2 
               onClick={handleTitleClick}
               className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter cursor-pointer select-none active:scale-95 transition-transform"
             >
               Expertise & <span className="text-neon-blue">Skills</span>
             </h2>
          </div>
          <div className="w-20 md:w-24 h-1 bg-neon-blue mx-auto rounded-full" />
          
          {isAdmin && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setShowEditModal(true)}
                className="bg-neon-blue text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest"
              >
                Edit Skills
              </motion.button>
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setIsAdmin(false)}
                className="bg-white/10 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-white/10"
              >
                Exit
              </motion.button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {skillsData.map((skill: any, index: number) => {
            const Icon = iconMap[skill.icon] || Globe;
            return (
              <motion.div
                key={index}
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
                {isAdmin && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSkill(index);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/20"
                  >
                    <X size={12} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
