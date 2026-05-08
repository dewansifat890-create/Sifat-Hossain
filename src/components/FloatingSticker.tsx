import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Settings, ShieldCheck } from 'lucide-react';

interface StickerData {
  name: string;
  url: string;
  image: string;
  exists: boolean;
}

export default function FloatingSticker() {
  const [data, setData] = useState<StickerData>(() => {
    const saved = localStorage.getItem('softwareStickerData');
    return saved ? JSON.parse(saved) : {
      name: 'New Software',
      url: 'https://play.google.com/store',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&h=200&auto=format&fit=crop',
      exists: true
    };
  });

  const [isVisible, setIsVisible] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handleTrigger = () => {
      setIsVerifying(true);
    };
    window.addEventListener('open-sticker-admin', handleTrigger);
    return () => window.removeEventListener('open-sticker-admin', handleTrigger);
  }, []);

  const handleSave = (newData: StickerData) => {
    setData(newData);
    localStorage.setItem('softwareStickerData', JSON.stringify(newData));
    setShowAdmin(false);
    setIsVerifying(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '374212') {
      setShowAdmin(true);
      setIsVerifying(false);
      setPassword('');
    } else {
      alert("Invalid Access Code.");
      setPassword('');
    }
  };

  if (!data.exists || !isVisible) return null;

  return (
    <>
      {/* Sticker UI */}
      <div className="fixed bottom-6 right-6 z-[100] pointer-events-auto">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              className="relative group p-2 glass border-white/10 bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center"
            >
              {/* Close button for User (temporary) */}
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-800 text-white/50 rounded-full flex items-center justify-center hover:text-white transition-colors"
                title="Remove temporarily"
              >
                <X size={12} />
              </button>

              <div 
                onClick={() => window.open(data.url, '_blank')}
                className="cursor-pointer flex flex-col items-center gap-2 p-1"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 group-hover:border-neon-purple transition-colors duration-300">
                  <img src={data.image} alt={data.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <ExternalLink size={20} className="text-white" />
                  </div>
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-white/60 group-hover:text-neon-purple transition-colors">
                  {data.name}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isVerifying && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-neon-purple" size={24} />
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Sticker Config</h3>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoFocus
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-purple outline-none text-center tracking-[1em]"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsVerifying(false)} className="flex-1 text-white/40 text-xs font-bold uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="flex-[2] bg-neon-purple text-black font-black py-3 rounded-xl uppercase tracking-tighter">Authorize</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showAdmin && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Sticker Admin</h3>
                <button onClick={() => setShowAdmin(false)}><X className="text-white/40" /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/30 uppercase font-black tracking-widest">Software Name</label>
                  <input 
                    type="text" 
                    defaultValue={data.name}
                    id="sticker-name"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/30 uppercase font-black tracking-widest">Software Image URL</label>
                  <input 
                    type="text" 
                    defaultValue={data.image}
                    id="sticker-image"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/30 uppercase font-black tracking-widest">Store/App URL</label>
                  <input 
                    type="text" 
                    defaultValue={data.url}
                    id="sticker-url"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                  <input 
                    type="checkbox" 
                    defaultChecked={data.exists}
                    id="sticker-exists"
                    className="w-5 h-5 accent-neon-purple"
                  />
                  <div>
                    <p className="text-xs text-white font-bold uppercase">Show Sticker Globally</p>
                    <p className="text-[9px] text-white/30 uppercase">Uncheck to remove permanently for everyone</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    handleSave({
                      name: (document.getElementById('sticker-name') as HTMLInputElement).value,
                      image: (document.getElementById('sticker-image') as HTMLInputElement).value,
                      url: (document.getElementById('sticker-url') as HTMLInputElement).value,
                      exists: (document.getElementById('sticker-exists') as HTMLInputElement).checked
                    });
                  }}
                  className="w-full bg-neon-purple text-black font-black py-4 rounded-xl shadow-lg hover:neon-glow transition-all uppercase tracking-tighter"
                >
                  Apply Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
