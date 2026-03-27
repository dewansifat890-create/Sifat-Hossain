import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Loader2, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const systemPrompt = `You are Neura Board, the official AI assistant for Dewan Sifat Hossain's portfolio website and his company, SAID SOFT. 

CRITICAL RULES:
1. ONLY answer questions related to Dewan Sifat Hossain, his work, his skills, his company SAID SOFT, and this website.
2. If a user asks about anything else (e.g., general knowledge, math, other people, coding help for other projects), politely refuse and say: "I am Neura Board, and I only provide information about Dewan Sifat Hossain and his digital world."
3. Keep your answers clear, professional, and futuristic.
4. LANGUAGE SUPPORT: You can communicate in ANY language, including Bengali (বাংলা), English, etc. Always respond in the language the user uses.
5. Use the following information to answer accurately:
   - Name: Dewan Sifat Hossain
   - Role: Futuristic Developer & Content Creator from Bangladesh.
   - Company: SAID SOFT (Founder & Lead).
   - SAID SOFT Information: A premium software brand dedicated to crafting futuristic digital experiences. Specializes in high-end app development, web solutions, and creative content creation.
   - Skills: App Development, Website Development, Video Editing, Photo Editing, YouTube Content Creation, Facebook Content Creator.
   - Apps/Projects: Smart Tasker (AI Task Management), Said Soft Editor (Video Tool), Neon Messenger (Encrypted Chat), Hopenity Social.
   - Socials: Active on Facebook, Instagram, TikTok, Twitter, and Hopenity.
   - Mission: Crafting digital experiences and standing for justice (#JusticeForHadi).
6. Always speak in a high-tech, helpful, and polite tone.`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      connectWebSocket("", true);
    }
  }, []);

  const connectWebSocket = (message: string, initChat: boolean) => {
    setIsLoading(true);
    const url = "wss://backend.buildpicoapps.com/api/chatbot/chat";
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      ws.send(
        JSON.stringify({
          chatId: chatId,
          appId: "rate-rather",
          systemPrompt: systemPrompt,
          message: initChat ? "A very short welcome message from Neura Board" : message,
        })
      );
    });

    // Add an empty model message to update
    setMessages(prev => [...prev, { role: 'model', text: "" }]);

    ws.onmessage = (event) => {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.role === 'model') {
          lastMsg.text += event.data;
        }
        return [...newMessages];
      });
    };

    ws.onclose = (event) => {
      setIsLoading(false);
      wsRef.current = null;
    };

    ws.onerror = () => {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.role === 'model' && lastMsg.text === "") {
          lastMsg.text = "Error getting response from server. Refresh the page and try again.";
        }
        return [...newMessages];
      });
      setIsLoading(false);
      wsRef.current = null;
    };
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    
    connectWebSocket(userMessage, false);
  };

  const clearChat = () => {
    if (wsRef.current) wsRef.current.close();
    setMessages([]);
    connectWebSocket("", true);
  };

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start gap-4" ref={chatContainerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, x: -20 }}
            className="w-80 md:w-96 h-[500px] glass-card flex flex-col border-neon-purple/20 shadow-[0_0_50px_rgba(188,19,254,0.1)]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neon-purple/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-neon-purple neon-glow">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tighter text-white uppercase">
                    Neura Board
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">AI Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChat}
                  title="Clear Chat"
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                msg.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-neon-purple/20 border border-neon-purple/30 text-white rounded-tr-none' 
                        : 'glass border-white/10 text-white/80 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                )
              ))}
              {isLoading && !wsRef.current && (
                <div className="flex justify-start">
                  <div className="glass p-3 rounded-2xl rounded-tl-none border-white/10">
                    <Loader2 size={16} className="animate-spin text-neon-purple" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-neon-purple flex items-center justify-center text-white hover:neon-glow transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full glass flex items-center justify-center border-neon-purple/50 text-neon-purple shadow-[0_0_20px_rgba(188,19,254,0.3)] relative group"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        
        {!isOpen && (
          <motion.div 
            className="absolute -top-1 -right-1 w-5 h-5 bg-neon-purple rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles size={12} className="text-white" />
          </motion.div>
        )}

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute left-full ml-4 px-3 py-1.5 glass rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border-neon-purple/30">
            Chat with Neura Board
          </div>
        )}
      </motion.button>
    </div>
  );
}
