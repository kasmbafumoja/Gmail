import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Copy, RefreshCw, Mail, Send, CheckCircle2, AlertCircle, 
  Sparkles, Zap, Ghost, Rocket, Star, Heart, Coffee, 
  Terminal, ShieldCheck, Clock, MousePointer2, Orbit,
  Moon, Sun, Atom
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: number;
  color: string;
}

const VIBRANT_COLORS = [
  "#FF00E5", // Pink
  "#00E5FF", // Cyan
  "#FF8A00", // Orange
  "#00FF00", // Green
  "#7000FF", // Purple
  "#FFDE00", // Yellow
];

// Floating Doodle Component
const Doodle = ({ icon: Icon, color, delay }: { icon: any, color: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2],
      y: [0, -40, 0],
      rotate: [0, 20, -20, 0],
      scale: [1, 1.2, 1]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className="absolute pointer-events-none z-0"
    style={{ color }}
  >
    <Icon size={64} strokeWidth={1} />
  </motion.div>
);

// Rotating Text Component
const RotatingText = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="text-[15vw] font-black whitespace-nowrap flex gap-40 opacity-[0.05] text-white select-none"
    >
      <span>TERMUX MD.</span>
      <span>TERMUX MD.</span>
      <span>TERMUX MD.</span>
    </motion.div>
  </div>
);

export default function App() {
  const [email, setEmail] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [copying, setCopying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10); // 10s countdown for refresh

  const generateEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", { method: "POST" });
      const data = await res.json();
      setEmail(data.email);
      setMessages([]);
    } catch (err) {
      setError("Erreur Cosmique! Réessaie plus tard. 🛸");
    } finally {
      setLoading(false);
    }
  };

  const fetchInbox = useCallback(async () => {
    if (!email) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/inbox?email=${encodeURIComponent(email)}`);
      if (res.status === 404) {
        setEmail("");
        setMessages([]);
        setError("Ton email a été aspiré par un trou noir (expiré). 🕳️");
        return;
      }
      const data = await res.json();
      const coloredMessages = data.messages.map((m: any) => ({
        ...m,
        color: m.color || VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)]
      }));
      setMessages(coloredMessages);
    } catch (err) {
      console.error("Failed to fetch inbox", err);
    } finally {
      setRefreshing(false);
      setTimeLeft(10); // Reset countdown
    }
  }, [email]);

  // 10s Auto-refresh logic
  useEffect(() => {
    if (!email) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchInbox();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [email, fetchInbox]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const simulateEmail = async () => {
    if (!email) return;
    try {
      await fetch("/api/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          from: "universe-bot@kas.space",
          subject: "Message Intergalactique 🌌",
          body: "Bienvenue dans le Kas Universe. Ton message a traversé des années-lumière pour arriver ici !",
        }),
      });
      fetchInbox();
    } catch (err) {
      console.error("Failed to simulate email", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-sans text-white p-4 md:p-8 overflow-x-hidden relative">
      {/* Universe Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1A1A2E_0%,#0A0A0F_100%)]" />
        <RotatingText />
        <Doodle icon={Orbit} color="#FF00E5" delay={0} />
        <div className="absolute top-1/4 right-10"><Doodle icon={Rocket} color="#00E5FF" delay={1} /></div>
        <div className="absolute bottom-1/4 left-10"><Doodle icon={Star} color="#FFDE00" delay={2} /></div>
        <div className="absolute top-3/4 right-1/3"><Doodle icon={Atom} color="#00FF00" delay={3} /></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block mb-6"
          >
            <span className="bg-[#FF00E5] text-white text-xs font-black px-4 py-1 uppercase tracking-widest rounded-full border-2 border-white shadow-[0_0_15px_#FF00E5]">
              Kas Universe Edition • v3.0
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-[0_0_20px_#00E5FF]"
          >
            Kas Mail
          </motion.h1>
          
          <p className="text-xl font-bold bg-[#1A1A2E] text-[#00E5FF] inline-block px-6 py-2 border-4 border-[#00E5FF] shadow-[8px_8px_0px_#FF00E5] uppercase italic">
            L'Email de l'Espace Profond 🚀
          </p>
        </header>

        {/* Main Action Area */}
        <motion.div 
          layout
          className="bg-[#1A1A2E] border-8 border-[#00E5FF] p-6 md:p-10 shadow-[20px_20px_0px_#FF00E5] mb-16 relative overflow-hidden"
        >
          {!email ? (
            <div className="text-center py-16">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateEmail}
                disabled={loading}
                className="bg-[#FF00E5] text-white text-3xl md:text-5xl font-black px-12 py-10 border-4 border-white shadow-[12px_12px_0px_#00E5FF] hover:shadow-none transition-all disabled:opacity-50"
              >
                {loading ? "LANCEMENT..." : "GÉNÉRER MON EMAIL"}
              </motion.button>
              {error && (
                <div className="mt-8 text-[#FF00E5] font-black text-xl uppercase animate-pulse">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row items-stretch gap-6">
                <div className="flex-1 bg-black border-4 border-[#00E5FF] p-6 flex items-center justify-between overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF00E5] to-[#00E5FF]" />
                  <span className="text-xl md:text-3xl font-mono font-black text-[#00E5FF] truncate mr-4">
                    {email}
                  </span>
                  <button 
                    onClick={copyToClipboard}
                    className="bg-[#FF00E5] p-4 border-4 border-white hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_#00E5FF]"
                  >
                    {copying ? <CheckCircle2 size={32} /> : <Copy size={32} />}
                  </button>
                </div>
                <button
                  onClick={generateEmail}
                  className="bg-white text-black font-black px-8 py-4 border-4 border-[#FF00E5] shadow-[6px_6px_0px_#00E5FF] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 text-xl"
                >
                  <RefreshCw size={28} /> RESET
                </button>
              </div>

              <div className="flex flex-wrap gap-6 justify-between items-center bg-black/50 p-6 border-4 border-[#FF00E5]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={fetchInbox}
                    disabled={refreshing}
                    className="bg-[#00E5FF] text-black font-black px-6 py-3 border-2 border-white hover:bg-[#FF00E5] hover:text-white transition-all flex items-center gap-3 uppercase text-lg"
                  >
                    <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} /> 
                    Rafraîchir
                  </button>
                  <button
                    onClick={simulateEmail}
                    className="text-[#FFDE00] font-black underline decoration-4 hover:text-white transition-colors uppercase text-sm"
                  >
                    Tester l'Espace
                  </button>
                </div>
                
                <div className="flex items-center gap-8 font-black text-sm uppercase">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#00FF00] rounded-full animate-ping" />
                    <span className="text-[#00FF00]">Auto-Sync: {timeLeft}s</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#00E5FF]">
                    <ShieldCheck size={18} /> Crypté
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Inbox Section */}
        <div className="space-y-10">
          <h2 className="text-6xl font-black uppercase italic flex items-center gap-6">
            <Orbit size={50} className="text-[#FF00E5]" />
            Inbox
          </h2>

          <div className="min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-black/30 border-8 border-[#00E5FF] border-dashed p-20 text-center"
                >
                  <Ghost size={100} className="mx-auto text-white/10 mb-8" />
                  <p className="text-4xl font-black uppercase tracking-tighter text-white/20">
                    Le Vide Spatial... 🌌
                  </p>
                </motion.div>
              ) : (
                <div className="grid gap-10">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-[#1A1A2E] border-8 border-white p-10 shadow-[15px_15px_0px_#00E5FF] relative group"
                    >
                      <div className="absolute top-0 left-0 w-full h-4" style={{ backgroundColor: msg.color }} />
                      
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 mt-6">
                        <div>
                          <p className="text-sm font-black uppercase text-[#00E5FF] mb-2 tracking-widest">
                            Signal de: {msg.from}
                          </p>
                          <h3 className="text-4xl font-black leading-none uppercase tracking-tighter">
                            {msg.subject}
                          </h3>
                        </div>
                        <span className="text-lg font-black bg-white text-black px-4 py-2 border-4 border-[#FF00E5]">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="bg-black/50 border-4 border-[#00E5FF] p-8 font-bold text-2xl leading-relaxed text-white/90">
                        {msg.body}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <div className="text-xs font-black uppercase text-[#FF00E5] flex items-center gap-2">
                          <Zap size={16} /> Transmission Reçue
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-40 pb-20 text-center">
          <div className="inline-block bg-[#FF00E5] text-white px-12 py-6 border-8 border-white shadow-[15px_15px_0px_#00E5FF] mb-12">
            <p className="font-black uppercase text-3xl tracking-tighter">
              Kas Universe • TERMUX MD.
            </p>
          </div>
          
          <div className="flex justify-center gap-12 font-black uppercase text-sm tracking-[0.3em] text-[#00E5FF]">
            <span>Anonyme</span>
            <span>Rapide</span>
            <span>Infini</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
