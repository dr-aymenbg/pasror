import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Feather, 
  User, 
  MessageSquare,
  Search,
  ArrowLeft
} from "lucide-react";
import { supabase } from "./supabaseClient"; // تأكد من وجود هذا الملف

export default function App() {
  const [view, setView] = useState<"form" | "success" | "tracker">("form");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [fetchedReply, setFetchedReply] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill out both fields.");
      return;
    }

    setStatus("submitting");
    const code = generateCode();

    try {
      // 1. الإرسال للإيميل
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "694d4f9e-a27a-40ee-8b6f-7a62e40d279e",
          name,
          message,
          subject: `New Inquiry - Code: ${code}`
        }),
      });

      // 2. التخزين في Supabase
      const { error } = await supabase
        .from('messages')
        .insert([{ name, message, tracking_code: code }]);

      if (error) throw error;

      setTrackingCode(code);
      setStatus("success");
      setName("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setErrorMessage("Connection failed.");
    }
  };

  const checkStatus = async () => {
    setStatus("submitting");
    const { data, error } = await supabase
      .from('messages')
      .select('reply')
      .eq('tracking_code', trackingCode.toUpperCase())
      .single();

    setStatus("idle");
    if (data && data.reply) {
      setFetchedReply(data.reply);
    } else {
      setFetchedReply("No response found for this code or invalid code.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-classic/30 selection:text-white bg-[#0A0A0A] text-[#E5E5E5] relative overflow-hidden font-sans border-[8px] md:border-[16px] border-[#151515]">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 p-8 md:p-16 opacity-[0.03] pointer-events-none">
        <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor" className="text-white"><path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" /></svg>
      </div>

      <header className="pt-16 md:pt-24 px-6 text-center z-10">
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-[0.15em] text-[#F5F5F5] uppercase">DR-AYMEN</h1>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12 z-10 w-full max-w-lg mx-auto">
        <motion.div className="w-full bg-[#0E0E0E] border border-[#1A1A1A] shadow-2xl p-8 md:p-12 relative rounded-none">
          
          <AnimatePresence mode="wait">
            {/* VIEW: FORM */}
            {view === "form" && (
              <motion.form key="form" onSubmit={handleSend} className="space-y-10">
                <div className="text-center mb-12"><h2 className="font-serif text-4xl italic font-light text-[#F5F5F5]">Correspondence</h2></div>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-transparent border-b border-[#2A2A2A] pb-3 text-xl italic text-white focus:outline-none focus:border-[#B08D57]" />
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your private message..." className="w-full bg-transparent border-b border-[#2A2A2A] pb-3 text-xl italic text-white focus:outline-none focus:border-[#B08D57]" />
                
                <button type="submit" className="w-full py-5 border border-[#B08D57] text-[#B08D57] uppercase tracking-[0.3em] hover:bg-[#B08D57] hover:text-black transition-all">
                  {status === "submitting" ? "Transmitting..." : "Send Inquiry"}
                </button>
                
                <button type="button" onClick={() => setView("tracker")} className="w-full text-center text-[10px] uppercase tracking-[0.3em] text-stone-600 underline">Track Status</button>
              </motion.form>
            )}

            {/* VIEW: SUCCESS (Tracking Code) */}
  {/* VIEW: SUCCESS (Tracking Code) */}
            {view === "success" || status === "success" ? (
              <motion.div key="success" className="text-center py-10 space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#B08D57]">Inquiry Conveyed</p>
                <div className="text-5xl font-mono text-[#B08D57]">{trackingCode}</div>
                
                {/* التعليمات الجديدة باللغتين */}
                <div className="space-y-3 border-t border-[#1A1A1A] pt-6">
                  <p className="text-[#B08D57] text-[10px] uppercase tracking-[0.2em]">
                    How to track / كيفية المتابعة
                  </p>
                  <p className="text-stone-400 text-[10px] leading-relaxed max-w-[280px] mx-auto">
                    Keep this code safe. Return to "Track Status" later and enter it to view your response.
                    <br />
                    <span className="text-stone-500">احتفظ بهذا الكود. عُد إلى صفحة "متابعة الحالة" لاحقاً وأدخله للاطلاع على الرد.</span>
                  </p>
                </div>

                <button onClick={() => { setStatus("idle"); setView("form"); }} className="underline text-[10px] uppercase tracking-[0.2em] text-white hover:text-[#B08D57] transition-colors">
                  Back / عودة
                </button>
              </motion.div>
            ) : null}
            {/* VIEW: TRACKER */}
            {view === "tracker" && (
              <motion.div key="tracker" className="space-y-6">
                <h2 className="text-xl font-serif text-center">Track Status</h2>
                <input value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} placeholder="Enter Tracking Code" className="w-full bg-transparent border-b border-[#2A2A2A] pb-2 text-center text-xl italic focus:outline-none focus:border-[#B08D57]" />
                <button onClick={checkStatus} className="w-full py-3 border border-[#B08D57] text-[#B08D57] uppercase text-xs tracking-[0.3em]">Check Status</button>
                {fetchedReply && <p className="p-4 bg-[#151515] border border-[#B08D57]/30 text-sm italic">{fetchedReply}</p>}
                <button onClick={() => setView("form")} className="flex items-center gap-2 text-xs text-stone-600"><ArrowLeft size={14} /> Back</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
