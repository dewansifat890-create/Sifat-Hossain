import { motion, AnimatePresence } from 'motion/react';
import { Play, ExternalLink, X, Key } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';

export default function AppHub({ isModal = false, autoShowAdmin = false }: { isModal?: boolean, autoShowAdmin?: boolean }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassModal, setShowPassModal] = useState(autoShowAdmin);

  useEffect(() => {
    if (autoShowAdmin) setShowPassModal(true);
  }, [autoShowAdmin]);

  const [password, setPassword] = useState('');
  const [shortcutUrl, setShortcutUrl] = useState(localStorage.getItem('appHubShortcutUrl') || 'https://darling-hummingbird-8a9e74.netlify.app/');

  const handlePassSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '374212') {
      setIsAdmin(true);
      setShowPassModal(false);
      setPassword('');
    } else {
      alert("Unauthorized Access.");
      setPassword('');
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setShortcutUrl(newUrl);
    localStorage.setItem('appHubShortcutUrl', newUrl);
    window.dispatchEvent(new Event('storage'));
  };

  const content = (
    <div className="max-w-4xl mx-auto relative px-4">
      {/* Password Modal */}
      <AnimatePresence>
        {showPassModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80"
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
                <div className="w-16 h-16 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple mx-auto mb-4 border border-neon-purple/20">
                  <Key size={28} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Admin Access</h3>
              </div>

              <form onSubmit={handlePassSubmit} className="space-y-4">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  autoFocus
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg tracking-[0.5em] focus:outline-none focus:border-neon-purple transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-neon-purple text-black font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-tighter"
                >
                  Verify
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <div className="inline-block px-4 py-1.5 glass border-neon-purple/20 text-neon-purple text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
          Global Shortcut Link
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Link <span className="text-neon-purple">Customize</span>
        </h2>
        <p className="text-white/40 max-w-lg mx-auto text-xs md:text-sm uppercase tracking-widest font-medium italic">
          Set the destination for your home screen icon
        </p>
      </motion.div>

      <div className="glass-card p-6 md:p-12 border-white/5 flex flex-col items-center gap-6 md:gap-8 bg-white/[0.02] relative">
        {isAdmin && (
          <div className="absolute top-4 left-4">
            <span className="flex items-center gap-2 text-neon-purple text-[8px] font-black uppercase tracking-widest bg-neon-purple/10 px-3 py-1 rounded-full border border-neon-purple/30">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
              Editing Mode
            </span>
          </div>
        )}

        <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl glass flex items-center justify-center text-neon-purple border-neon-purple/20 shadow-[0_0_30px_rgba(191,0,255,0.1)]">
          <ExternalLink size={32} />
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tighter">Current Link</h3>
            <p className="text-white/30 text-[10px] md:text-xs font-mono break-all px-4">{shortcutUrl}</p>
          </div>

          <div className="h-px w-full bg-white/5" />

          {isAdmin ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-neon-purple font-black">Destination URL</label>
                <input 
                  type="text"
                  value={shortcutUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon-purple transition-all outline-none text-sm md:text-base font-medium"
                />
              </div>
              <button 
                onClick={() => setIsAdmin(false)}
                className="w-full bg-neon-purple text-black font-black py-4 rounded-xl uppercase tracking-tighter shadow-[0_0_20px_rgba(191,0,255,0.2)] hover:scale-[1.02] transition-transform"
              >
                Save Destination
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.open(shortcutUrl, '_blank')}
                className="w-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-black py-4 md:py-5 rounded-2xl uppercase tracking-widest hover:bg-neon-purple hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <Play size={16} /> Open Destination
              </button>
              <button
                onClick={() => setShowPassModal(true)}
                className="flex items-center justify-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                <Key size={12} /> Link Customize
              </button>
            </div>
          )}
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="glass p-3 md:p-4 rounded-2xl border-white/5 flex flex-col items-center">
            <span className="text-neon-purple font-black text-lg md:text-xl">Active</span>
            <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/30">System</span>
          </div>
          <div className="glass p-3 md:p-4 rounded-2xl border-white/5 flex flex-col items-center">
            <span className="text-white/60 font-black text-lg md:text-xl">7s</span>
            <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/30">Hold Admin</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) return content;

  return (
    <section id="apps" className="py-12 md:py-20 px-6 bg-white/[0.01]">
      {content}
    </section>
  );
}
