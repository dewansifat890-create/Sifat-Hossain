import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import WelcomeAnimation from './components/WelcomeAnimation';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Skills from './components/Skills';
import Company from './components/Company';
import AppHub from './components/AppHub';
import Gallery from './components/Gallery';
import Socials from './components/Socials';
import ChatBot from './components/ChatBot';
import MusicManager from './components/MusicManager';
import MusicPrompt from './components/MusicPrompt';
import Modal from './components/Modal';
import AdminMessages from './pages/AdminMessages';
import { PROFILE_IMAGE, APPS, BRAND_VIDEO_URL } from './constants/data';
import { Layers } from 'lucide-react';
import { db, auth } from './firebase';
import { doc, onSnapshot, updateDoc, increment as firestoreIncrement, getDoc, setDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isAppHubModalOpen, setIsAppHubModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const isAdminPage = window.location.pathname === '/admin-messages';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (isAdminPage) {
    return <AdminMessages />;
  }

  return (
    <div className="relative min-h-screen bg-[#050505] selection:bg-neon-blue selection:text-black">
      <AnimatePresence>
        {showWelcome && (
          <WelcomeAnimation onComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          {/* Background Grid & Glows */}
          <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full" />
            <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-neon-pink/5 blur-[120px] rounded-full" />
          </div>

          {/* Interactive Cursor Glow */}
          <motion.div 
            className="fixed w-[400px] h-[400px] bg-neon-blue/5 blur-[100px] rounded-full pointer-events-none z-0"
            animate={{
              x: mousePos.x - 200,
              y: mousePos.y - 200,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
          />

          <Navbar />
          
          <main className="pt-16 md:pt-24">
            {/* Hero Section */}
            <section className="min-h-[70vh] md:min-h-[80vh] flex flex-col items-center justify-center px-6 text-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-4 md:mb-8"
              >
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-[28px] md:rounded-[40px] glass flex items-center justify-center border-neon-blue/30 shadow-[0_0_50px_rgba(0,242,255,0.2)] animate-float overflow-hidden">
                  <img 
                    src={PROFILE_IMAGE} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-3xl md:text-8xl font-black tracking-tight mb-3 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight"
              >
                DEWAN SIFAT <br className="hidden md:block" /> HOSSAIN
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base md:text-2xl text-white/60 font-medium tracking-tight max-w-2xl px-4"
              >
                Futuristic Developer & Content Creator from Bangladesh. 
                Crafting digital experiences at <span className="text-neon-blue font-bold">SAID SOFT</span>.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 md:mt-12 flex flex-col items-center gap-8"
              >
                <div className="flex justify-center gap-4 md:gap-12">
                  {/* Gallery Shortcut Icon */}
                  <motion.div
                    onClick={() => setIsGalleryModalOpen(true)}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="group flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full glass flex items-center justify-center text-neon-pink border-neon-pink/30 shadow-[0_0_20px_rgba(255,0,229,0.1)] group-hover:neon-glow transition-all duration-300">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="md:w-6 md:h-6"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                    <span className="text-[7px] md:text-[9px] font-medium tracking-[0.3em] text-white/30 group-hover:text-neon-pink transition-colors uppercase">View Gallery</span>
                  </motion.div>

                  {/* App Hub Shortcut Icon */}
                  <motion.div
                    onClick={() => window.open('https://darling-hummingbird-8a9e74.netlify.app/', '_blank')}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="group flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full glass flex items-center justify-center text-neon-purple border-neon-purple/30 shadow-[0_0_20px_rgba(191,0,255,0.1)] group-hover:neon-glow transition-all duration-300">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="md:w-6 md:h-6"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
                      </svg>
                    </div>
                    <span className="text-[7px] md:text-[9px] font-medium tracking-[0.3em] text-white/30 group-hover:text-neon-purple transition-colors uppercase">Explore App Hub</span>
                  </motion.div>

                  {/* Skills Shortcut Icon */}
                  <motion.a
                    href="#skills"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="group flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full glass flex items-center justify-center text-neon-blue border-neon-blue/30 shadow-[0_0_20px_rgba(0,242,255,0.1)] group-hover:neon-glow transition-all duration-300">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="md:w-6 md:h-6"
                      >
                        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/>
                      </svg>
                    </div>
                    <span className="text-[7px] md:text-[9px] font-medium tracking-[0.3em] text-white/30 group-hover:text-neon-blue transition-colors uppercase">Expertise & Skills</span>
                  </motion.a>
                </div>
              </motion.div>
            </section>

            <Profile />
            
            <Skills onOpenAppHub={() => setIsAppHubModalOpen(true)} />
            <Company onOpenModal={() => setIsBrandModalOpen(true)} />
            <Socials />

            {/* Footer */}
            <footer className="py-8 md:py-12 px-6 text-center border-t border-white/5">
              <p className="text-white/40 text-[10px] md:text-sm font-medium tracking-widest uppercase">
                &copy; {new Date().getFullYear()} DEWAN SIFAT HOSSAIN. ALL RIGHTS RESERVED.
              </p>
              <p className="text-neon-blue text-[10px] md:text-xs font-bold mt-2 tracking-tighter">
                DESIGNED BY SAID SOFT
              </p>
            </footer>
          </main>

          <ChatBot />
          <MusicManager />
          <MusicPrompt />

          {/* Modals */}
          <Modal 
            isOpen={isGalleryModalOpen} 
            onClose={() => setIsGalleryModalOpen(false)} 
            title="Photo Gallery" 
            accentColor="neon-pink"
          >
            <Gallery isModal />
          </Modal>

          <Modal 
            isOpen={isAppHubModalOpen} 
            onClose={() => setIsAppHubModalOpen(false)} 
            title="App Hub" 
            accentColor="neon-purple"
          >
            <AppHub isModal />
          </Modal>

          <Modal 
            isOpen={isBrandModalOpen} 
            onClose={() => setIsBrandModalOpen(false)} 
            title="Explore SAID SOFT" 
            accentColor="neon-blue"
          >
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-3xl overflow-hidden glass border-white/10 mb-8 relative group">
                {BRAND_VIDEO_URL ? (
                  <video 
                    src={BRAND_VIDEO_URL} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                    <Layers size={64} className="mb-4 animate-pulse" />
                    <p className="font-bold tracking-widest uppercase">Brand Video Coming Soon</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 border-neon-blue/20">
                  <h3 className="text-2xl font-bold mb-4 text-neon-blue uppercase tracking-tighter">Our Vision</h3>
                  <p className="text-white/60 leading-relaxed">
                    At SAID SOFT, we believe in pushing the boundaries of what's possible in the digital realm. 
                    Our mission is to create software that isn't just functional, but truly futuristic and immersive.
                  </p>
                </div>
                <div className="glass-card p-8 border-neon-purple/20">
                  <h3 className="text-2xl font-bold mb-4 text-neon-purple uppercase tracking-tighter">Core Services</h3>
                  <ul className="space-y-2 text-white/60">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                      High-End App Development
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                      Futuristic Web Solutions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
                      Creative Content Strategy
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Modal>
        </motion.div>
      )}

      {/* Floating Particles Background */}
      {!showWelcome && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              animate={{
                y: [null, Math.random() * -500],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
