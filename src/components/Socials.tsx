import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Instagram, Twitter, Snowflake, Link as LinkIcon, Key, X, Plus } from 'lucide-react';
import { SOCIALS } from '../constants/data';

const iconMap: Record<string, any> = {
  Facebook,
  Instagram,
  Twitter,
  Snowflake,
  Link: LinkIcon
};

export default function Socials() {
  const [followers, setFollowers] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [password, setPassword] = useState('');
  const [socialsData, setSocialsData] = useState(() => {
    const saved = localStorage.getItem('customSocialsData');
    return saved ? JSON.parse(saved) : SOCIALS;
  });

  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  useEffect(() => {
    // Load from local storage
    const storedFollowers = localStorage.getItem('localFollowers');
    const storedLikes = localStorage.getItem('localLikes');

    if (storedFollowers) setFollowers(parseInt(storedFollowers));
    else setFollowers(0);
    
    if (storedLikes) setLikes(parseInt(storedLikes));
    else setLikes(0);
  }, []);

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
      alert("Socials Edit Mode Activated!");
    } else {
      alert("Unauthorized Access Attempt.");
      setPassword('');
    }
  };

  const handleAddSocial = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSocial = {
      name: formData.get('name') as string,
      icon: (formData.get('icon') as string) || 'Link',
      url: (formData.get('url') as string) || '#'
    };
    
    const updated = [...socialsData, newSocial];
    setSocialsData(updated);
    localStorage.setItem('customSocialsData', JSON.stringify(updated));
    (e.target as HTMLFormElement).reset();
  };

  const removeSocial = (index: number) => {
    const updated = socialsData.filter((_: any, i: number) => i !== index);
    setSocialsData(updated);
    localStorage.setItem('customSocialsData', JSON.stringify(updated));
  };

  const handleFollow = () => {
    const newCount = followers + 1;
    setFollowers(newCount);
    localStorage.setItem('localFollowers', newCount.toString());
  };

  const handleLike = () => {
    const newCount = likes + 1;
    setLikes(newCount);
    localStorage.setItem('localLikes', newCount.toString());
  };

  return (
    <section id="socials" className="py-12 md:py-20 px-6 bg-white/[0.02] relative">
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
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Social Admin Access</h3>
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
                  Verify Access
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

              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter">Customize Socials</h3>

              <div className="max-h-[400px] overflow-y-auto mb-8 space-y-4 pr-2 scrollbar-hide">
                {socialsData.map((social: any, idx: number) => (
                  <div key={idx} className="bg-white/[0.05] p-5 rounded-2xl border border-white/5 space-y-3 relative group">
                    <button 
                      onClick={() => removeSocial(idx)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition-colors bg-red-500/10 p-2 rounded-lg"
                    >
                      <X size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1 font-bold">Platform Name</label>
                        <input 
                          type="text"
                          value={social.name}
                          onChange={(e) => {
                            const updated = [...socialsData];
                            updated[idx].name = e.target.value;
                            setSocialsData(updated);
                            localStorage.setItem('customSocialsData', JSON.stringify(updated));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-neon-blue outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1 font-bold">Icon Type</label>
                        <select 
                          value={social.icon}
                          onChange={(e) => {
                            const updated = [...socialsData];
                            updated[idx].icon = e.target.value;
                            setSocialsData(updated);
                            localStorage.setItem('customSocialsData', JSON.stringify(updated));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-neon-blue outline-none"
                        >
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Snowflake">Portfolio/Web</option>
                          <option value="Link">General Link</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1 font-bold">Profile URL</label>
                        <input 
                          type="text"
                          value={social.url}
                          placeholder="https://..."
                          onChange={(e) => {
                            const updated = [...socialsData];
                            updated[idx].url = e.target.value;
                            setSocialsData(updated);
                            localStorage.setItem('customSocialsData', JSON.stringify(updated));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-neon-blue outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSocial} className="space-y-4 pt-6 border-t border-white/10">
                <p className="text-xs font-black uppercase tracking-widest text-white/30">Add New Connection</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    name="name"
                    required
                    placeholder="Platform Name (e.g. TikTok)"
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none"
                  />
                  <select 
                    name="icon"
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Snowflake">Portfolio</option>
                    <option value="Link">Link</option>
                  </select>
                  <div className="md:col-span-2">
                    <input 
                      name="url"
                      placeholder="URL (e.g. https://tiktok.com/@user)"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-neon-blue text-black font-black py-4 rounded-xl uppercase tracking-tighter"
                >
                  Add Platform
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 border-neon-blue/20 relative group/social-section"
        >
          <h2 
            onClick={handleTitleClick}
            className="text-3xl md:text-4xl font-black mb-8 md:mb-12 tracking-tighter cursor-pointer select-none active:scale-95 transition-transform"
          >
            CONNECT WITH <span className="text-neon-blue">SIFAT</span>
          </h2>

          {isAdmin && (
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEditModal(true)}
                className="w-10 h-10 rounded-full bg-neon-blue text-black flex items-center justify-center shadow-lg transition-all"
                title="Edit Socials"
              >
                <Plus size={18} />
              </motion.button>
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAdmin(false)}
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20 transition-all"
                title="Exit Admin"
              >
                <X size={18} />
              </motion.button>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {socialsData.map((social: any, index: number) => {
              const Icon = iconMap[social.icon] || LinkIcon;
              return (
                <motion.div
                  key={index}
                  onClick={() => {
                    if (isAdmin) return;
                    if (social.url === 'scroll:top' || social.name.toLowerCase() === 'hopenity') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (social.url && social.url !== '#') {
                      window.open(social.url, '_blank');
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={isAdmin ? {} : { y: -10, scale: 1.1 }}
                  whileTap={isAdmin ? {} : { scale: 0.9 }}
                  className={`group flex flex-col items-center gap-3 md:gap-4 ${isAdmin ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[24px] glass flex items-center justify-center text-white/50 group-hover:text-neon-blue group-hover:neon-glow group-hover:border-neon-blue/50 transition-all duration-300 relative">
                    <Icon size={24} md:size={32} />
                    {isAdmin && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeSocial(index);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/20 text-white"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] md:text-sm font-bold tracking-widest text-white/40 group-hover:text-white transition-colors uppercase">{social.name}</span>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                // Detect double click manually to handle single click for OFF
                if (e.detail === 2) {
                  window.dispatchEvent(new CustomEvent('hadi-music-on'));
                } else if (e.detail === 1) {
                  // Wait a bit to ensure it's not a double click
                  setTimeout(() => {
                    // Check if it's still 1 click
                    window.dispatchEvent(new CustomEvent('hadi-music-off'));
                  }, 250);
                }
              }}
              className="text-center md:text-left group cursor-pointer"
            >
              <p className="text-3xl md:text-4xl font-black tracking-tighter text-neon-blue group-hover:neon-glow transition-all duration-300">#JusticeForHadi</p>
              <p className="text-white/40 text-xs md:text-sm mt-2 transition-colors uppercase tracking-[0.2em] font-black">1-Click Off • 2-Click On</p>
            </motion.div>
            <div className="flex gap-8 md:gap-12">
              <div className="text-center flex flex-col items-center">
                <p className="text-xl md:text-2xl font-bold tabular-nums">{followers.toLocaleString()}</p>
                <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest mb-2">Followers</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8, rotate: -5 }}
                  onClick={handleFollow}
                  className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all bg-neon-blue text-black shadow-[0_0_15px_rgba(0,242,255,0.4)] active:shadow-[0_0_20px_rgba(0,242,255,0.6)]"
                >
                  Follow
                </motion.button>
              </div>
              <div className="text-center flex flex-col items-center">
                <p className="text-xl md:text-2xl font-bold tabular-nums">{likes.toLocaleString()}</p>
                <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest mb-1">Likes</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8, rotate: 5 }}
                  onClick={handleLike}
                  className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all bg-neon-purple text-white shadow-[0_0_15px_rgba(191,0,255,0.4)] active:shadow-[0_0_20px_rgba(191,0,255,0.6)]"
                >
                  Like
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
