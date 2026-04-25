import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, User, Share2, MoreVertical, Volume2, VolumeX, Gift, PartyPopper, Heart, Flower2, TreePine, Star, Cake, Sun, Moon, Cloud, Zap, Sparkles, Smile, Coffee, ShieldCheck } from 'lucide-react';
import { DOODLES } from '../constants/data';
import { getAiDoodle } from '../services/geminiDoodle';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const doodleIconMap: Record<string, any> = {
  Gift,
  PartyPopper,
  Heart,
  Flower2,
  TreePine,
  Star,
  Cake,
  Sun,
  Moon,
  Cloud,
  Zap,
  Sparkles,
  Smile,
  Coffee
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentDoodle, setCurrentDoodle] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const adminUid = "NTRgYWTnThQvYwrh5qfJ1R4K9oh2";
        setIsAdminUser(user.uid === adminUid || user.email === "dewansifat890@gmail.com");
      } else {
        setIsAdminUser(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    // Check for today's doodle
    const checkDoodles = async (allDoodles: any[]) => {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${month}-${day}`;
      
      const doodle = allDoodles.find((d: any) => d.date === dateStr);
      if (doodle) {
        setCurrentDoodle(doodle);
      } else {
        // If no manual doodle, ask Gemini
        const aiDoodle = await getAiDoodle();
        if (aiDoodle) {
          setCurrentDoodle(aiDoodle);
        } else {
          setCurrentDoodle(null);
        }
      }
    };

    // Listen for doodles in Firestore
    const doodlesQuery = query(collection(db, 'doodles'));
    const unsubscribeDoodles = onSnapshot(doodlesQuery, (snapshot) => {
      let allDoodles: any[] = [...DOODLES];
      if (!snapshot.empty) {
        const fetchedDoodles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        allDoodles = [...allDoodles, ...fetchedDoodles];
      }
      checkDoodles(allDoodles);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'doodles');
      checkDoodles(DOODLES);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      unsubscribeDoodles();
    };
  }, []);

  const handleToggleMusic = () => {
    window.dispatchEvent(new CustomEvent('toggle-bg-music'));
    setIsMuted(!isMuted);
    setIsMoreMenuOpen(false);
  };

  const navLinks = [
    { name: 'Profile', href: '#profile', icon: User },
    { name: 'Socials', href: '#socials', icon: Share2 },
    ...(isAdminUser ? [{ name: 'Admin', href: '/admin-messages', icon: ShieldCheck }] : [])
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${isScrolled ? 'py-1 md:py-4' : 'py-2 md:py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`glass rounded-xl md:rounded-3xl px-3 md:px-8 py-1.5 md:py-4 flex items-center justify-between border-white/10 transition-all duration-500 ${isScrolled ? 'mx-1 md:mx-4 shadow-2xl' : 'mx-0'}`}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-black text-sm md:text-xl">
              S
            </div>
            <span className="text-base md:text-xl font-black tracking-tighter hidden md:block">SIFAT</span>
          </motion.div>

          {/* Doodle Section */}
          <AnimatePresence>
            {currentDoodle && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full glass border-white/5 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ color: currentDoodle.color }}
                >
                  {(() => {
                    const Icon = doodleIconMap[currentDoodle.icon] || Star;
                    return <Icon size={18} className="md:w-6 md:h-6" />;
                  })()}
                </motion.div>
                <span className="text-[10px] md:text-xs font-bold tracking-tight text-white/80 whitespace-nowrap">
                  {currentDoodle.message}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-neon-blue transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <div className="relative" ref={moreMenuRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <MoreVertical size={20} />
              </motion.button>

              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-xl border-white/10 shadow-2xl overflow-hidden"
                  >
                    <button
                      onClick={handleToggleMusic}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm font-bold text-white/80"
                    >
                      <div className="w-8 h-8 rounded-lg bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </div>
                      Music: {isMuted ? 'OFF' : 'ON'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 glass rounded-xl border-neon-blue/50 text-neon-blue text-sm font-bold flex items-center gap-2"
            >
              Contact <ChevronRight size={16} />
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative" ref={moreMenuRef}>
              <button 
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="text-white/60 p-1"
              >
                <MoreVertical size={20} />
              </button>
              
              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-40 glass rounded-xl border-white/10 shadow-2xl overflow-hidden"
                  >
                    <button
                      onClick={handleToggleMusic}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-xs font-bold text-white/80"
                    >
                      <div className="w-6 h-6 rounded-md bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </div>
                      Music: {isMuted ? 'OFF' : 'ON'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              className="text-white p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="md:hidden overflow-hidden glass mx-4 mt-2 rounded-2xl border-white/10 shadow-2xl"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a 
                    key={link.name} 
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg glass flex items-center justify-center text-neon-blue group-hover:neon-glow">
                      <Icon size={20} />
                    </div>
                    <span className="text-lg font-bold tracking-tighter group-hover:text-neon-blue transition-colors">
                      {link.name}
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
