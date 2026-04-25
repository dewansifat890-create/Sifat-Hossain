import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, FormEvent, useRef } from 'react';
import { Send, X, MessageSquare, User, ShieldCheck, Volume2, VolumeX, Mail } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, Timestamp, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getGemini, SYSTEM_PROMPT } from '../services/gemini';

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

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin' | 'bot';
  timestamp: any;
  userId: string;
}

export default function MessageSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure user is authenticated (anonymously if needed) to send/receive messages
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        setAuthError(false);
      } else {
        signInAnonymously(auth).catch(err => {
          console.error("Auth error:", err);
          if (err.code === 'auth/configuration-not-found') {
            setAuthError(true);
            // Fallback to a local ID so the UI doesn't break, 
            // though Firestore writes might still fail depending on rules.
            const localId = localStorage.getItem('chat_fallback_id') || 'visitor_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_fallback_id', localId);
            setCurrentUserId(localId);
            console.warn("HINT: Please enable 'Anonymous' authentication in your Firebase Console (Build > Authentication > Sign-in method).");
          }
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    // Listen for messages in Firestore for this user
    const q = query(
      collection(db, 'messages'),
      where('userId', '==', currentUserId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      // Sort client-side to avoid requiring a composite index in Firestore
      const sortedMsgs = msgs.sort((a, b) => {
        const timeA = a.timestamp?.toMillis?.() || Date.now();
        const timeB = b.timestamp?.toMillis?.() || Date.now();
        return timeA - timeB;
      });
      
      setChatMessages(sortedMsgs);
    }, (error) => {
      if (error.message.includes('The query requires an index')) {
        console.error("HINT: Please click the link in the error message to create the required Firestore index.");
      }
      handleFirestoreError(error, OperationType.GET, 'messages');
    });

    return () => unsubscribe();
  }, [currentUserId]);

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

  const handleClearChat = async () => {
    if (!currentUserId) return;
    
    try {
      const q = query(
        collection(db, 'messages'),
        where('userId', '==', currentUserId)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => {
        batch.delete(d.ref);
      });
      await batch.commit();
      
      // Auto-reply after clearing
      setTimeout(async () => {
        try {
          await addDoc(collection(db, 'messages'), {
            text: "Chat cleared successfully. How can I assist you today?",
            sender: 'bot',
            userId: currentUserId,
            timestamp: serverTimestamp(),
            status: 'read'
          });
        } catch (e) {
          console.error("Welcome msg error:", e);
        }
      }, 500);
    } catch (error) {
      console.error("Clear chat error:", error);
    }
  };

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUserId) return;

    const userMsgText = message;
    try {
      await addDoc(collection(db, 'messages'), {
        text: userMsgText,
        sender: 'user',
        userId: currentUserId,
        timestamp: serverTimestamp(),
        status: 'unread'
      });
      setMessage("");

      // Trigger AI Auto-reply
      // We simulate a short delay for realism
      setTimeout(async () => {
        try {
          const ai = getGemini();
          
          // Simple context building
          const history = chatMessages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }));

          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
              ...history as any,
              { role: 'user', parts: [{ text: userMsgText }] }
            ],
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: 0.7,
            }
          });

          const aiText = response.text || "Thank you for your message. Please contact Dewan Sifat Hossain at dewansifat890@gmail.com for direct help.";

          await addDoc(collection(db, 'messages'), {
            text: aiText,
            sender: 'bot',
            userId: currentUserId,
            timestamp: serverTimestamp(),
            status: 'read'
          });
        } catch (err) {
          console.error("Auto-reply error:", err);
        }
      }, 2000);

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'messages');
    }
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
        {!isOpen && chatMessages.some(m => m.sender === 'admin' || m.sender === 'bot') && (
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
                <a 
                  href="mailto:dewansifat890@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Send Email"
                  className="text-white/40 hover:text-neon-blue transition-colors p-1"
                >
                  <Mail size={16} />
                </a>
                <button 
                  onClick={handleClearChat}
                  title="Clear Chat"
                  className="text-white/40 hover:text-red-400 transition-colors p-1"
                >
                  <MessageSquare size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 hide-scrollbar"
            >
              {authError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 text-center mb-4">
                  <p className="font-bold mb-1">Firebase Auth Error!</p>
                  Please enable "Anonymous" authentication in your Firebase Console to use the message system.
                </div>
              )}
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
                        {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
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
