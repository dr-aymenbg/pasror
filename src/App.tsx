import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MessageSquare,
  Search,
  Copy,
  Check
} from "lucide-react";

export default function App() {
  // حالات نموذج إرسال الرسالة
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  
  // لحفظ الكود الذي تم إنشاؤه وإظهاره للمستخدم
  const [generatedCode, setGeneratedCode] = useState("");

  // حالات نظام تتبع الردود
  const [trackCode, setTrackCode] = useState("");
  const [trackStatus, setTrackStatus] = useState<"idle" | "searching" | "found" | "notFound">("idle");
  const [adminReply, setAdminReply] = useState("");

  // دالة نسخ الكود
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // دالة إرسال الرسالة إلى Supabase
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill out both fields.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    // توليد كود التتبع أولاً لحفظه وإظهاره للمستخدم
    const newTrackingCode = "PRESTIGE-" + Math.floor(10000 + Math.random() * 90000);

    try {
      const response = await fetch("https://azbgzkuykdzjoqftpba.supabase.co/rest/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj",
          "Authorization": "Bearer sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj",
        },
        body: JSON.stringify({
          name: name,
          message: message,
          tracking_code: newTrackingCode,
        }),
      });

      if (response.ok) {
        setGeneratedCode(newTrackingCode); // حفظ الكود لعرضه
        setStatus("success");
        setName("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong with the server.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Connection failed.");
    }
  };

  // دالة تتبع وجلب الرد من Supabase
  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    if (!trackCode.trim()) return;

    setTrackStatus("searching");

    try {
      const response = await fetch(`https://azbgzkuykdzjoqftpba.supabase.co/rest/v1/messages?tracking_code=eq.${trackCode.trim()}`, {
        method: "GET",
        headers: {
          "apikey": "sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj",
          "Authorization": "Bearer sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj",
        }
      });

      const data = await response.json();

      if (data.length === 0) {
        setTrackStatus("notFound");
      } else {
        setTrackStatus("found");
        setAdminReply(data[0].reply || "");
      }
    } catch (error) {
      setTrackStatus("notFound");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-classic/30 selection:text-white bg-[#0A0A0A] text-[#E5E5E5] relative overflow-hidden font-sans border-[8px] md:border-[16px] border-[#151515]">
      
      {/* الخلفية النجمية */}
      <div className="absolute top-0 right-0 p-8 md:p-16 opacity-[0.03] pointer-events-none">
        <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor" className="text-white">
          <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" />
        </svg>
      </div>

      <div className="absolute top-4 left-4 right-4 bottom-4 border border-gold-classic/5 pointer-events-none" />

      {/* العلامات المائية */}
      <div className="absolute top-8 left-8 hidden md:flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase font-serif text-gold-classic/50 pointer-events-none">
        <Compass size={11} className="text-[#B08D57]" />
        <span>Private Message Server</span>
      </div>
      <div className="absolute top-8 right-8 hidden md:flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase font-mono text-gold-classic/50 pointer-events-none">
        <span>EST. 2026 / PRESTIGE SECURE</span>
      </div>

      {/* الهيدر */}
      <header className="pt-16 md:pt-20 px-6 text-center z-10">
        <div className="inline-flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-14 h-14 rounded-full border border-[#B08D57]/20 flex items-center justify-center mb-5 relative"
          >
            <div className="absolute inset-[3px] rounded-full border border-dashed border-[#B08D57]/10" />
            <span className="font-serif text-sm tracking-wider text-[#B08D57] font-light">DA</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="space-y-3">
            <h1 className="font-serif text-3xl md:text-5xl font-light tracking-[0.15em] text-[#F5F5F5] uppercase">
              DR-Aymen
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-[1px] bg-[#B08D57]/30"></span>
              <p className="font-sans text-[8px] md:text-[9px] tracking-[0.45em] uppercase text-[#B08D57] font-light">
                Leave or Track a message
              </p>
              <span className="w-6 h-[1px] bg-[#B08D57]/30"></span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* منطقة المحتوى الرئيسية */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-10 z-10 w-full max-w-lg mx-auto space-y-8">
        
        {/* 1. بطاقة إرسال الرسائل */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full bg-[#0E0E0E] border border-[#1A1A1A] p-8 md:p-10 relative"
        >
          <div className="absolute inset-[4px] border border-[#1A1A1A]/50 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl italic font-light text-[#F5F5F5] mb-1">Correspondence</h2>
              <p className="font-sans text-[8px] uppercase tracking-[0.45em] opacity-40 text-[#B08D57]">Private Direct Inquiry</p>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 text-center flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 bg-[#151515] border border-[#B08D57]/30 rounded-full flex items-center justify-center text-[#B08D57]">
                    <CheckCircle2 size={24} strokeWidth={1} />
                  </div>
                  <p className="font-serif text-lg text-[#F5F5F5]">Inquiry Safely Conveyed</p>
                  
                  {/* عرض كود التتبع الجديد للمرسل لنسخه */}
                  <div className="w-full bg-[#050505] border border-[#202020] p-4 my-2 text-center space-y-2">
                    <p className="text-[9px] uppercase tracking-widest text-[#B08D57]">Your Private Tracking Code:</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-mono text-base tracking-wider text-white select-all">{generatedCode}</span>
                      <button 
                        onClick={() => copyToClipboard(generatedCode)}
                        className="p-1 hover:text-[#B08D57] text-neutral-500 transition-colors"
                        title="Copy Code"
                      >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-[8px] text-neutral-500 italic">Save this code to check for Dr-Aymen's response later.</p>
                  </div>

                  <button onClick={() => setStatus("idle")} className="px-4 py-2 border border-[#B08D57]/40 text-[#B08D57] text-[9px] tracking-widest uppercase hover:bg-[#B08D57] hover:text-black transition-all">
                    Send Another Note
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSend} className="space-y-6">
                  <div className="relative border-b border-[#2A2A2A] pb-2 focus-within:border-[#B08D57] transition-colors">
                    <label className="block font-sans text-[8px] uppercase tracking-[0.3em] mb-2 text-[#B08D57] opacity-65">Full Name</label>
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-[#B08D57]/50" />
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Lord Alexander" className="w-full bg-transparent border-none p-0 text-lg italic text-white outline-none focus:ring-0 placeholder:text-neutral-800" disabled={status === "submitting"} />
                    </div>
                  </div>

                  <div className="relative border-b border-[#2A2A2A] pb-2 focus-within:border-[#B08D57] transition-colors">
                    <label className="block font-sans text-[8px] uppercase tracking-[0.3em] mb-2 text-[#B08D57] opacity-65">Your Message</label>
                    <div className="flex items-start gap-2">
                      <MessageSquare size={12} className="text-[#B08D57]/50 mt-1" />
                      <textarea rows={2} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your private message..." className="w-full bg-transparent border-none p-0 text-lg italic text-white outline-none focus:ring-0 resize-none placeholder:text-neutral-800" disabled={status === "submitting"} />
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="p-2 bg-red-950/20 border border-red-800/20 text-red-300 text-[10px] flex items-center gap-2">
                      <AlertCircle size={12} className="text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button type="submit" disabled={status === "submitting"} className="w-full py-4 border border-[#B08D57] text-[#B08D57] text-[10px] uppercase tracking-[0.45em] hover:bg-[#B08D57] hover:text-black transition-all duration-500 disabled:opacity-50">
                    {status === "submitting" ? "Transmitting..." : "Send Inquiry"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 2. بطاقة تتبع الردود */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-full bg-[#0E0E0E] border border-[#1A1A1A] p-6 relative"
        >
          <div className="absolute inset-[4px] border border-[#1A1A1A]/30 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-2">
              <Search size={14} className="text-[#B08D57]" />
              <h3 className="font-serif text-sm tracking-wider text-stone-300 uppercase">Track Archive Reply</h3>
            </div>

            <form onSubmit={handleTrack} className="flex gap-2">
              <input 
                type="text" 
                required 
                value={trackCode} 
                onChange={(e) => setTrackCode(e.target.value)} 
                placeholder="Enter Tracking Code (e.g., PRESTIGE-84404)" 
                className="flex-grow bg-[#050505] border border-[#202020] px-3 py-2 text-xs font-mono text-white focus:border-[#B08D57] outline-none placeholder:text-neutral-700"
              />
              <button type="submit" className="px-4 py-2 bg-[#101010] border border-[#B08D57]/40 text-[#B08D57] text-[10px] uppercase tracking-wider hover:bg-[#B08D57] hover:text-black transition-all">
                {trackStatus === "searching" ? "..." : "Check"}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {trackStatus === "notFound" && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-red-400 font-sans flex items-center gap-1">
                  <AlertCircle size={12} /> Code not found in the secure log.
                </motion.p>
              )}

              {trackStatus === "found" && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-[#121212] border border-[#222] space-y-1">
                  <p className="text-[9px] uppercase tracking-widest text-[#B08D57] font-sans">Official Response:</p>
                  <p className="text-sm italic text-white font-serif">
                    {adminReply ? adminReply : "Message received. Terminal response is pending. Please verify later."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </main>

      {/* الفوتر */}
      <footer className="pb-12 pt-6 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#151515] z-10">
        <p className="font-sans text-[8px] uppercase tracking-[0.35em] opacity-35">
          ESTABLISHED MMXXVI — DR-AYMEN • GENEVA • LONDON
        </p>
        <div className="flex items-center gap-2">
          <span className="w-8 h-[1px] bg-[#B08D57] opacity-30"></span>
          <p className="font-sans text-[8px] uppercase tracking-[0.35em] opacity-50 text-[#B08D57]">Private Portal</p>
        </div>
      </footer>
    </div>
  );
}
