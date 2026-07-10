
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Feather, 
  User, 
  MessageSquare
} from "lucide-react";

export default function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill out both fields.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: "694d4f9e-a27a-40ee-8b6f-7a62e40d279e",
          name: name,
          message: message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setName("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Connection failed.");
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-classic/30 selection:text-white bg-[#0A0A0A] text-[#E5E5E5] relative overflow-hidden font-sans border-[8px] md:border-[16px] border-[#151515]">
      
      {/* Exquisite starry background graphic element from the design */}
      <div className="absolute top-0 right-0 p-8 md:p-16 opacity-[0.03] pointer-events-none">
        <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor" className="text-white">
          <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" />
        </svg>
      </div>

      <div className="absolute top-1/2 left-0 -translate-y-1/2 p-8 opacity-[0.015] pointer-events-none">
        <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor" className="text-white">
          <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" />
        </svg>
      </div>

      {/* Classical vintage accent border details */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-gold-classic/5 pointer-events-none" />

      {/* Subtle classical watermarks in corners */}
      <div className="absolute top-8 left-8 hidden md:flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase font-serif text-gold-classic/50 pointer-events-none">
        <Compass size={11} className="animate-spin-slow text-[#B08D57]" />
        <span>Private Message Server</span>
      </div>
      <div className="absolute top-8 right-8 hidden md:flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase font-mono text-gold-classic/50 pointer-events-none">
        <span>EST. 2026 / PRESTIGE SECURE</span>
      </div>

      {/* Header section (The Crest & Minimal Title) */}
      <header className="pt-16 md:pt-24 px-6 text-center z-10">
        <div className="inline-flex flex-col items-center">
          {/* Elegant Crest */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-14 h-14 rounded-full border border-[#B08D57]/20 flex items-center justify-center mb-5 relative hover:border-[#B08D57]/60 transition-colors duration-500"
          >
            <div className="absolute inset-[3px] rounded-full border border-dashed border-[#B08D57]/10" />
            <span className="font-serif text-sm tracking-wider text-[#B08D57] font-light">DA</span>
          </motion.div>

          {/* VANE & CO. level brand title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="space-y-3"
          >
            <h1 className="font-serif text-3xl md:text-5xl font-light tracking-[0.15em] text-[#F5F5F5] uppercase">
              DR-Aymen
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-[1px] bg-[#B08D57]/30"></span>
              <p className="font-sans text-[8px] md:text-[9px] tracking-[0.45em] uppercase text-[#B08D57] font-light">
                Leave a message here
              </p>
              <span className="w-6 h-[1px] bg-[#B08D57]/30"></span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Correspondence Form Area */}
      <main className="flex-grow flex items-center justify-center px-6 py-12 z-10 w-full max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="w-full bg-[#0E0E0E] border border-[#1A1A1A] shadow-2xl p-8 md:p-12 relative rounded-none"
        >
          {/* Deluxe thin interior accent border to double down on craft elegance */}
          <div className="absolute inset-[4px] border border-[#1A1A1A]/50 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl italic font-light text-[#F5F5F5] mb-2">
                Correspondence
              </h2>
              <p className="font-sans text-[9px] uppercase tracking-[0.45em] opacity-40 text-gold-classic">
                Private Direct Inquiry
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-10 text-center flex flex-col items-center justify-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-[#151515] border border-[#B08D57]/30 rounded-full flex items-center justify-center text-[#B08D57]"
                  >
                    <CheckCircle2 size={32} strokeWidth={1} />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="font-serif text-xl text-[#F5F5F5] tracking-wide">Inquiry Safely Conveyed</p>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed font-sans">
                      Thank you. Your message has been routed directly to the private terminal. A confirmation or response will follow securely.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStatus("idle")}
                    className="mt-6 px-6 py-3 border border-[#B08D57] text-[#B08D57] hover:bg-[#B08D57] hover:text-black text-[10px] tracking-[0.3em] font-sans uppercase transition-all duration-300 cursor-pointer"
                  >
                    Send Another Note
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSend}
                  className="space-y-10"
                >
                  {/* Name field (High elegance border-b style) */}
                  <div className="relative border-b border-[#2A2A2A] pb-3 group focus-within:border-[#B08D57] transition-colors duration-400">
                    <label 
                      htmlFor="name" 
                      className="block font-sans text-[9px] uppercase tracking-[0.3em] mb-4 text-[#B08D57] opacity-65 font-medium"
                    >
                      Full Name
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="text-[#B08D57]/50 mt-0.5">
                        <User size={14} strokeWidth={1.5} />
                      </div>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Lord Alexander Julian"
                        className="w-full bg-transparent border-none p-0 text-xl italic text-white focus:ring-0 outline-none placeholder:text-stone-800 disabled:opacity-50"
                        disabled={status === "submitting"}
                      />
                    </div>
                  </div>

                  {/* Message field (High elegance border-b style) */}
                  <div className="relative border-b border-[#2A2A2A] pb-3 group focus-within:border-[#B08D57] transition-colors duration-400">
                    <label 
                      htmlFor="message" 
                      className="block font-sans text-[9px] uppercase tracking-[0.3em] mb-4 text-[#B08D57] opacity-65 font-medium"
                    >
                      Your Message
                    </label>
                    <div className="flex items-start gap-3">
                      <div className="text-[#B08D57]/50 mt-1.5">
                        <MessageSquare size={14} strokeWidth={1.5} />
                      </div>
                      <textarea
                        id="message"
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your private message here..."
                        className="w-full bg-transparent border-none p-0 text-xl italic text-white focus:ring-0 outline-none resize-none placeholder:text-stone-800 leading-relaxed disabled:opacity-50"
                        disabled={status === "submitting"}
                      />
                    </div>
                  </div>

                  {/* Feedback Message */}
                  {status === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-950/20 border border-red-800/20 text-red-300 text-xs flex items-start gap-2"
                    >
                      <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={status === "submitting"}
                      className="relative w-full py-5 border border-[#B08D57] text-[#B08D57] font-sans text-[11px] uppercase tracking-[0.45em] hover:bg-[#B08D57] hover:text-black transition-all duration-500 cursor-pointer disabled:bg-neutral-900 disabled:border-[#2A2A2A] disabled:text-stone-600 disabled:cursor-not-allowed group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {status === "submitting" ? (
                          <>
                            <Feather size={14} className="animate-pulse text-[#B08D57] group-hover:text-black" />
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <Send size={12} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#B08D57]/80 group-hover:text-black" />
                            <span>Send Inquiry</span>
                          </>
                        )}
                      </span>
                      {/* Subtlest premium slider reflection inside button */}
                      <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-12 -translate-x-full group-hover:animate-shine pointer-events-none" />
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Footer (ESTABLISHED MCM... Look) */}
      <footer className="pb-12 pt-8 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#151515] z-10">
        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.35em] opacity-35 text-center md:text-left">
            ESTABLISHED MMXXVI — DR-AYMEN • GENEVA • LONDON
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-12 h-[1px] bg-[#B08D57] opacity-30"></span>
          <p className="font-sans text-[9px] uppercase tracking-[0.35em] opacity-50 text-[#B08D57]">
            Private Portal
          </p>
        </div>
      </footer>
    </div>
  );
}
