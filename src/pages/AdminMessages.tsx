import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, User, MessageSquare, Clock, ShieldCheck, ChevronRight, Star, Plus, Trash2, Calendar, Palette, Type } from 'lucide-react';
import { DOODLES } from '../constants/data';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
  userId: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState<'messages' | 'doodles'>('messages');
  const [adminDoodles, setAdminDoodles] = useState(DOODLES);
  const [newDoodle, setNewDoodle] = useState({ date: '', message: '', icon: 'Star', color: '#00F2FF' });
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'INIT') {
        setMessages(data.data);
      } else if (data.type === 'NEW_MESSAGE') {
        setMessages(prev => [...prev, data.data]);
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedUserId]);

  const users = Array.from(new Set(messages.map(m => m.userId)));
  const selectedUserMessages = messages.filter(m => m.userId === selectedUserId);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedUserId || !socketRef.current) return;

    const payload = {
      text: replyText,
      sender: 'admin',
      userId: selectedUserId,
    };

    socketRef.current.send(JSON.stringify({
      type: 'ADMIN_REPLY',
      payload
    }));

    setReplyText("");
  };

  const handleAddDoodle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoodle.date || !newDoodle.message) return;
    
    const updated = [...adminDoodles, newDoodle];
    setAdminDoodles(updated);
    localStorage.setItem('custom_doodles', JSON.stringify(updated));
    setNewDoodle({ date: '', message: '', icon: 'Star', color: '#00F2FF' });
    
    // Notify other parts of the app (if they listen)
    window.dispatchEvent(new CustomEvent('doodles-updated'));
  };

  const handleDeleteDoodle = (index: number) => {
    const updated = adminDoodles.filter((_, i) => i !== index);
    setAdminDoodles(updated);
    localStorage.setItem('custom_doodles', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('doodles-updated'));
  };

  useEffect(() => {
    const saved = localStorage.getItem('custom_doodles');
    if (saved) {
      setAdminDoodles(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto mb-6 flex gap-4">
        <button 
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'glass border-neon-blue text-neon-blue shadow-[0_0_20px_rgba(0,242,255,0.2)]' : 'text-white/40 hover:text-white'}`}
        >
          <MessageSquare size={18} /> MESSAGES
        </button>
        <button 
          onClick={() => setActiveTab('doodles')}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'doodles' ? 'glass border-neon-purple text-neon-purple shadow-[0_0_20px_rgba(188,19,254,0.2)]' : 'text-white/40 hover:text-white'}`}
        >
          <Star size={18} /> DOODLE MANAGER
        </button>
      </div>

      <div className="max-w-6xl mx-auto h-[80vh] glass-card border-neon-blue/20 flex flex-col md:flex-row overflow-hidden">
        {activeTab === 'messages' ? (
          <>
            {/* Sidebar - User List */}
            <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-white/[0.02]">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
              <MessageSquare className="text-neon-blue" />
              MESSAGE HUB
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">Admin Control Center</p>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {users.length === 0 ? (
              <div className="p-8 text-center text-white/20">
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              users.map(userId => {
                const userMsgs = messages.filter(m => m.userId === userId);
                const lastMsg = userMsgs[userMsgs.length - 1];
                const isSelected = selectedUserId === userId;
                
                return (
                  <button
                    key={userId}
                    onClick={() => setSelectedUserId(userId)}
                    className={`w-full p-4 flex items-center gap-4 transition-all border-b border-white/5 ${
                      isSelected ? 'bg-neon-blue/10 border-l-4 border-l-neon-blue' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                      <User size={20} />
                    </div>
                    <div className="flex-grow text-left overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold truncate">{userId}</span>
                        <span className="text-[8px] text-white/30">
                          {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 truncate mt-1">{lastMsg.text}</p>
                    </div>
                    <ChevronRight size={14} className="text-white/20" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-grow flex flex-col bg-black/40">
          {selectedUserId ? (
            <>
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neon-blue/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{selectedUserId}</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                      <span className="text-[8px] text-neon-blue uppercase tracking-widest font-bold">Active Session</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  <Clock size={12} />
                  <span>Real-time Sync Active</span>
                </div>
              </div>

              <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide"
              >
                {selectedUserMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                      msg.sender === 'admin' 
                        ? 'bg-neon-blue/20 border border-neon-blue/30 text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === 'admin' ? (
                          <ShieldCheck size={12} className="text-neon-blue" />
                        ) : (
                          <User size={12} className="text-white/40" />
                        )}
                        <span className="text-[8px] uppercase tracking-widest font-bold opacity-40">
                          {msg.sender === 'admin' ? 'You (Admin)' : 'User'}
                        </span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className="text-[8px] mt-2 opacity-30 text-right">
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReply} className="p-6 border-t border-white/10 bg-white/[0.02]">
                <div className="flex gap-4">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply to user..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-neon-blue/50 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 glass rounded-2xl flex items-center justify-center gap-2 text-neon-blue font-bold hover:bg-neon-blue/10 transition-all group"
                  >
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    REPLY
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10 mb-6 animate-pulse">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-xl font-bold text-white/60">Select a conversation</h3>
              <p className="text-sm text-white/30 max-w-xs mt-2">Choose a user from the sidebar to view their message history and send a reply.</p>
            </div>
          )}
        </div>
      </>
    ) : (
      <div className="flex-grow flex flex-col p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-neon-purple">DOODLE MANAGER</h2>
                <p className="text-xs text-white/40 uppercase tracking-[0.3em] mt-1">Customize Special Day Greetings</p>
              </div>
              <div className="glass px-4 py-2 rounded-lg border-neon-purple/20 text-[10px] font-bold text-neon-purple uppercase tracking-widest">
                Google Style Doodles
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add New Doodle Form */}
              <div className="glass-card p-6 border-white/5 bg-white/[0.01]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Plus className="text-neon-purple" size={20} />
                  ADD NEW DOODLE
                </h3>
                <form onSubmit={handleAddDoodle} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} /> Date (MM-DD)
                    </label>
                    <input 
                      value={newDoodle.date}
                      onChange={e => setNewDoodle({...newDoodle, date: e.target.value})}
                      placeholder="e.g. 03-27"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-purple/50 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Type size={12} /> Message
                    </label>
                    <input 
                      value={newDoodle.message}
                      onChange={e => setNewDoodle({...newDoodle, message: e.target.value})}
                      placeholder="e.g. Happy Eid Mubarak!"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-purple/50 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Star size={12} /> Icon
                      </label>
                      <select 
                        value={newDoodle.icon}
                        onChange={e => setNewDoodle({...newDoodle, icon: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-purple/50 outline-none transition-all appearance-none"
                      >
                        <option value="Star">Star</option>
                        <option value="Gift">Gift</option>
                        <option value="PartyPopper">Party Popper</option>
                        <option value="Heart">Heart</option>
                        <option value="Flower2">Flower</option>
                        <option value="TreePine">Christmas Tree</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Palette size={12} /> Accent Color
                      </label>
                      <input 
                        type="color"
                        value={newDoodle.color}
                        onChange={e => setNewDoodle({...newDoodle, color: e.target.value})}
                        className="w-full h-[46px] bg-white/5 border border-white/10 rounded-xl px-2 py-1 cursor-pointer"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 glass rounded-xl border-neon-purple/50 text-neon-purple font-black uppercase tracking-widest hover:bg-neon-purple/10 transition-all mt-4"
                  >
                    SAVE DOODLE
                  </button>
                </form>
              </div>

              {/* Current Doodles List */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4 text-white/60">ACTIVE DOODLES</h3>
                <div className="space-y-3">
                  {adminDoodles.map((d, i) => (
                    <div key={i} className="glass-card p-4 border-white/5 flex items-center justify-between group hover:border-neon-purple/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl glass flex items-center justify-center shadow-lg"
                          style={{ color: d.color }}
                        >
                          <Star size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-neon-purple">{d.date}</span>
                            <span className="text-[10px] text-white/20 uppercase tracking-widest">Active</span>
                          </div>
                          <p className="text-sm font-bold text-white/80">{d.message}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteDoodle(i)}
                        className="p-2 text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
