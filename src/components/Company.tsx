import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Layers, Play, Video, X, Key, Plus, Trash2 } from 'lucide-react';
import { BRAND_VIDEO_URL } from '../constants/data';
import { useState, useRef, FormEvent } from 'react';
import { getEmbedUrl } from '../lib/videoUtils';

interface CompanyProps {
  onOpenModal: () => void;
}

export default function Company({ onOpenModal }: CompanyProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [password, setPassword] = useState('');
  const [videoUrl, setVideoUrl] = useState(localStorage.getItem('customBrandVideo') || BRAND_VIDEO_URL);
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const handleVisionClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 600) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 3) {
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
      alert("Admin Mode Activated for Company Video!");
    } else {
      alert("Unauthorized Access Attempt.");
      setPassword('');
    }
  };

  const handleUpdateVideo = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUrl = formData.get('videoUrl') as string;
    
    if (newUrl && newUrl.trim() !== "") {
      setVideoUrl(newUrl);
      localStorage.setItem('customBrandVideo', newUrl);
      setShowUpload(false);
      alert("Success! Brand video updated.");
    }
  };

  return (
    <section className="py-12 md:py-20 px-6 overflow-hidden relative">
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
                <h3 className="text-xl font-bold text-white">Company Admin</h3>
              </div>

              <form onSubmit={handlePassSubmit} className="space-y-4">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  autoFocus
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none focus:border-neon-blue transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-blue text-black font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-tighter"
                >
                  Verify Access
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowUpload(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <Video size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Update Brand Video</h3>
              </div>
              
              <form onSubmit={handleUpdateVideo} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 font-bold">Video URL</label>
                  <input 
                    name="videoUrl"
                    type="url" 
                    placeholder="https://example.com/video.mp4"
                    required
                    defaultValue={videoUrl || ""}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-blue text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all uppercase tracking-tighter"
                >
                  Save Video
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                rotate: [0, 5, -5, 0],
                y: [0, -5, 5, 0]
              }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="w-32 h-32 md:w-56 md:h-56 rounded-[32px] md:rounded-[40px] glass flex items-center justify-center border-neon-blue/30 shadow-[0_0_50px_rgba(0,242,255,0.1)] overflow-hidden cursor-pointer relative"
              onClick={onOpenModal}
            >
              {(() => {
                const video = getEmbedUrl(videoUrl);
                if (video.type === 'youtube') {
                  return (
                    <iframe 
                      src={video.url} 
                      className="w-full h-full border-none pointer-events-none"
                    />
                  );
                } else if (video.type === 'direct') {
                  return (
                    <video 
                      src={video.url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  );
                }
                return (
                  <div className="flex flex-col items-center">
                    <Layers size={40} className="text-neon-blue mb-1 md:mb-2" />
                    <span className="text-sm md:text-2xl font-black tracking-tighter">SAID SOFT</span>
                    <span className="text-[8px] md:text-xs text-white/30 uppercase mt-1">Brand Video Coming Soon</span>
                  </div>
                );
              })()}
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                  SAID SOFT
                </h2>
                {isAdmin && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowUpload(true)}
                      className="w-10 h-10 rounded-full bg-neon-blue text-black flex items-center justify-center shadow-lg transition-all"
                    >
                      <Video size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        // Direct action to avoid confirm blocking
                        setVideoUrl(""); 
                        localStorage.setItem('customBrandVideo', "");
                        alert("Video removed successfully!");
                      }}
                      className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transition-all z-[100] border border-white/20 hover:bg-red-700"
                      title="Delete Video"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsAdmin(false)}
                      className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10 transition-all"
                    >
                      <X size={14} />
                    </motion.button>
                  </div>
                )}
              </div>
              
              <p 
                onClick={handleVisionClick}
                className="text-xs md:text-sm font-black text-neon-blue uppercase tracking-[0.3em] mb-2 cursor-pointer select-none active:scale-95 transition-transform"
              >
                Our Vision
              </p>
              
              <p className="text-base md:text-lg text-white/70 mb-6 md:mb-8 leading-relaxed max-w-2xl">
                A premium software brand dedicated to crafting futuristic digital experiences. 
                We specialize in high-end app development, web solutions, and creative content creation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenModal}
                  className="px-6 md:px-8 py-3 md:py-4 glass rounded-2xl border-neon-blue/50 text-neon-blue font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,242,255,0.2)] text-sm md:text-base transition-all"
                >
                  Explore Brand <ExternalLink size={18} md:size={20} />
                </motion.button>
                {videoUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenModal}
                    className="px-6 md:px-8 py-3 md:py-4 glass rounded-2xl border-white/20 text-white font-bold flex items-center justify-center gap-2 text-sm md:text-base border border-white/10 transition-all"
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
