import { motion, AnimatePresence } from 'motion/react';
import { GALLERY } from '../constants/data';
import { useState, useRef, FormEvent } from 'react';
import { Camera, X, Key, Plus, Heart, Trash2 } from 'lucide-react';

interface GalleryImage {
  url: string;
  likes: number;
}

export default function Gallery({ isModal = false }: { isModal?: boolean }) {
  const [images, setImages] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem('customGalleryImages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => 
          typeof item === 'string' ? { url: item, likes: Math.floor(Math.random() * 50) + 10 } : item
        );
      } catch (e) {
        return GALLERY.map(url => ({ url, likes: Math.floor(Math.random() * 50) + 10 }));
      }
    }
    return GALLERY.map(url => ({ url, likes: Math.floor(Math.random() * 50) + 10 }));
  });
  
  const [userLikes, setUserLikes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('galleryUserLikes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [password, setPassword] = useState('');
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

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
      alert("Admin Mode Activated in Gallery!");
    } else {
      alert("Unauthorized Access Attempt.");
      setPassword('');
    }
  };

  const handleAddImage = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUrl = formData.get('imageUrl') as string;
    
    if (newUrl && newUrl.trim() !== "") {
      const updatedImages = [{ url: newUrl, likes: 0 }, ...images];
      setImages(updatedImages);
      localStorage.setItem('customGalleryImages', JSON.stringify(updatedImages));
      setShowUpload(false);
      alert("Success! Image added to gallery.");
    }
  };

  const handleLike = (index: number) => {
    const imageUrl = images[index].url;
    const newLikes = new Set(userLikes);
    const updatedImages = [...images];
    
    if (newLikes.has(imageUrl)) {
      newLikes.delete(imageUrl);
      updatedImages[index].likes = Math.max(0, updatedImages[index].likes - 1);
    } else {
      newLikes.add(imageUrl);
      updatedImages[index].likes = (updatedImages[index].likes || 0) + 1;
    }
    
    setImages(updatedImages);
    setUserLikes(newLikes);
    localStorage.setItem('customGalleryImages', JSON.stringify(updatedImages));
    localStorage.setItem('galleryUserLikes', JSON.stringify(Array.from(newLikes)));
  };

  const content = (
    <div className="max-w-6xl mx-auto relative">
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
                <div className="w-16 h-16 rounded-full bg-neon-pink/10 flex items-center justify-center text-neon-pink mx-auto mb-4 border border-neon-pink/20">
                  <Key size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">Gallery Admin</h3>
              </div>

              <form onSubmit={handlePassSubmit} className="space-y-4">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  autoFocus
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none focus:border-neon-pink transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-pink text-black font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-tighter"
                >
                  Verify Access
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
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
                <div className="w-10 h-10 rounded-full bg-neon-pink/20 flex items-center justify-center text-neon-pink">
                  <Plus size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Add Gallery Photo</h3>
              </div>
              
              <form onSubmit={handleAddImage} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 font-bold">Image URL</label>
                  <input 
                    name="imageUrl"
                    type="url" 
                    placeholder="https://example.com/photo.jpg"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-pink transition-colors"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-pink text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,0,187,0.3)] hover:shadow-[0_0_30px_rgba(255,0,187,0.5)] transition-all uppercase tracking-tighter"
                >
                  Add Photo
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 md:mb-16 relative"
      >
        <h2 
          onClick={handleTitleClick}
          className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter cursor-pointer select-none active:scale-95 transition-transform"
        >
          Photo <span className="text-neon-pink">Gallery</span>
        </h2>
        <div className="w-16 md:w-24 h-1 bg-neon-pink mx-auto rounded-full" />
      </motion.div>

      {/* Floating Admin Controls for Gallery */}
      {isAdmin && !isModal && (
        <div className="fixed bottom-8 right-8 z-[90] flex flex-col gap-4">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowUpload(true)}
            className="w-14 h-14 rounded-full bg-neon-pink text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,0,187,0.5)] border-2 border-white/20 transition-all font-bold"
            title="Add New Photo"
          >
            <Plus size={28} />
          </motion.button>
          
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDeleteMode(!isDeleteMode)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 transition-all font-bold ${isDeleteMode ? 'bg-red-500 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
            title={isDeleteMode ? "Cancel Deletion" : "Delete Mode"}
          >
            <Trash2 size={24} />
          </motion.button>

          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsAdmin(false);
              setIsDeleteMode(false);
            }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center border border-white/10 hover:bg-red-500/20 transition-all shadow-xl"
            title="Exit Admin Mode"
          >
            <X size={20} />
          </motion.button>
        </div>
      )}

      {isAdmin && isModal && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-neon-pink text-black px-6 py-3 rounded-full font-black text-sm uppercase tracking-tighter shadow-lg"
          >
            <Plus size={18} /> Add Photo
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDeleteMode(!isDeleteMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-tighter border transition-all ${isDeleteMode ? 'bg-red-500 text-white border-red-500' : 'bg-zinc-800 text-white border-white/10 hover:bg-zinc-700'}`}
          >
            <Trash2 size={18} /> {isDeleteMode ? "Stop Deleting" : "Delete Mode"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsAdmin(false);
              setIsDeleteMode(false);
            }}
            className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-black text-sm uppercase tracking-tighter border border-white/10"
          >
             Exit Admin Mode
          </motion.button>
        </div>
      )}

      <div className={`columns-1 md:columns-2 ${isModal ? 'lg:columns-2' : 'lg:columns-3'} gap-4 md:gap-6 space-y-4 md:space-y-6`}>
        {images.length > 0 ? images.map((imageData, index) => (
          <motion.div
            key={`${imageData.url}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-1.5 md:p-2 overflow-hidden group relative"
          >
            <img 
              src={imageData.url} 
              alt={`Gallery ${index}`}
              className="w-full h-auto rounded-lg md:rounded-xl transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 md:p-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-[10px] md:text-xs font-black tracking-widest uppercase opacity-60">Created by</p>
                  <p className="text-white text-xs md:text-sm font-bold tracking-tighter">SAID SOFT CREATIVE</p>
                </div>
                
                <button 
                  onClick={() => handleLike(index)}
                  className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Heart 
                    size={16} 
                    className={userLikes.has(imageData.url) ? "fill-red-500 text-red-500" : "text-white"} 
                  />
                  <span className="text-white text-xs font-bold">{imageData.likes}</span>
                </button>
              </div>
            </div>
            
            {isAdmin && (
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Direct delete to avoid browser confirm issues in iframe
                  setImages(prevImages => {
                    const updated = prevImages.filter((_, i) => i !== index);
                    localStorage.setItem('customGalleryImages', JSON.stringify(updated));
                    return updated;
                  });
                }}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center transition-all z-[999] hover:bg-red-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-white/40 cursor-pointer pointer-events-auto ${isDeleteMode ? 'opacity-100 scale-110 shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'opacity-0 group-hover:opacity-100'}`}
                title="Delete this image"
              >
                <Trash2 size={24} />
              </button>
            )}
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
