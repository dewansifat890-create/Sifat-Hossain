import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, FormEvent, useRef } from 'react';
import { Send, X, MessageSquare, User, ShieldCheck, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
  userId: string;
}

export default function MessageSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [userId] = useState(() => {
    const savedId = localStorage.getItem('chat_user_id');
    if (savedId) return savedId;
    const newId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_user_id', newId);
    return newId;
  });
  
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggleMusic = () => {
    window.dispatchEvent(new CustomEvent('toggle-bg-music'));
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'INIT') {
        // Filter messages for this user
        const userMsgs = data.data.filter((m: any) => m.userId === userId);
        setChatMessages(userMsgs);
      } else if (data.type === 'NEW_MESSAGE') {
        if (data.data.userId === userId) {
          setChatMessages(prev => [...prev, data.data]);
        }
      }
    };

    return () => socket.close();
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isOpen]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // ... rest of the interval logic ...

    if (isMobile) {
      const interval = setInterval(() => {
        setShowText(true);
        setTimeout(() => setShowText(false), 5000);
      }, 60000);

      // Initial appearance after 5 seconds
      const initialTimeout = setTimeout(() => {
        setShowText(true);
        setTimeout(() => setShowText(false), 5000);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(initialTimeout);
      };
    } else {
      const interval = setInterval(() => {
        setShowText(true);
        setTimeout(() => setShowText(false), 7000);
      }, 17000);
      
      const initialTimeout = setTimeout(() => {
        setShowText(true);
        setTimeout(() => setShowText(false), 7000);
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(initialTimeout);
      };
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current) return;

    const payload = {
      text: message,
      sender: 'user',
      userId: userId,
    };

    socketRef.current.send(JSON.stringify({
      type: 'USER_MESSAGE',
      payload
    }));

    setMessage("");
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: showText ? 1 : 0, x: showText ? 0 : 20 }}
        className="glass px-4 py-2 rounded-full text-sm font-medium border-neon-blue/30 pointer-events-none"
      >
        After visiting my website, what do you think about me?
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full glass flex items-center justify-center border-neon-blue/50 text-neon-blue shadow-[0_0_20px_rgba(0,242,255,0.3)] relative"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && chatMessages.some(m => m.sender === 'admin') && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-pink rounded-full animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 glass-card border-neon-blue/20 flex flex-col h-[500px] overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neon-blue/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Sifat</h3>
                  <p className="text-[10px] text-neon-blue uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                    <MessageSquare size={24} />
                  </div>
                  <p className="text-sm text-white/40">No messages yet. Send a message to start a conversation with Sifat!</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-neon-blue/20 border border-neon-blue/30 text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'
                    }`}>
                      <p>{msg.text}</p>
                      <p className="text-[8px] mt-1 opacity-40 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-neon-blue hover:bg-neon-blue/10 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
