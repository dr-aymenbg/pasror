import { useState, FormEvent } from "react";
import { CheckCircle2, Send, Loader2, Search } from "lucide-react";

// تم وضع الرابط الصحيح من لوحة التحكم (بدون أي أخطاء إملائية)
const SUPABASE_URL = "https://azbgzkuykdzjoqftpba.supabase.co"; 
const SUPABASE_API_KEY = "sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj";
const WEB3FORMS_ACCESS_KEY = "694d4f9e-a27a-40ee-8b6f-7a62e40d279e";

export default function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [generatedCode, setGeneratedCode] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [trackStatus, setTrackStatus] = useState<"idle" | "searching" | "found" | "notFound">("idle");
  const [adminReply, setAdminReply] = useState("");

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setStatus("submitting");
    const newTrackingCode = "PRESTIGE-" + Math.floor(10000 + Math.random() * 90000);

    try {
      // إرسال البيانات (Supabase)
      const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_API_KEY,
          "Prefer": "return=representation"
        },
        body: JSON.stringify({ name, message, tracking_code: newTrackingCode }),
      });

      if (!supabaseRes.ok) throw new Error("Database failed");

      // إرسال إيميل (Web3Forms)
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, name, message, tracking_code: newTrackingCode, subject: "New Inquiry" }),
      });

      setGeneratedCode(newTrackingCode);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    setTrackStatus("searching");
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?tracking_code=eq.${trackCode.trim()}`, {
        method: "GET",
        headers: { "apikey": SUPABASE_API_KEY }
      });
      const data = await response.json();
      if (data.length > 0) { setTrackStatus("found"); setAdminReply(data[0].reply || "No reply yet."); }
      else setTrackStatus("notFound");
    } catch (e) { setTrackStatus("notFound"); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-6 flex flex-col items-center justify-center selection:bg-[#B08D57] selection:text-white">
      <div className="w-full max-w-md space-y-10">
        
        {/* Header/Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-widest text-[#B08D57]">CONTACT</h1>
          <div className="h-px w-16 bg-[#B08D57] mx-auto"></div>
        </div>

        {/* Contact Form */}
        <div className="border border-[#1A1A1A] p-8 bg-[#0A0A0A] shadow-2xl">
          {status === "success" ? (
             <div className="text-center space-y-4 py-8">
               <CheckCircle2 className="mx-auto text-[#B08D57]" size={48} />
               <h2 className="text-xl">Message Sent</h2>
               <p className="text-[#B08D57] font-mono">{generatedCode}</p>
             </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-6">
              <input className="w-full bg-transparent border-b border-[#202020] p-2 focus:border-[#B08D57] outline-none transition-colors" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              <textarea className="w-full bg-transparent border-b border-[#202020] p-2 focus:border-[#B08D57] outline-none transition-colors h-32" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
              <button disabled={status === "submitting"} className="w-full py-3 border border-[#B08D57] text-[#B08D57] hover:bg-[#B08D57] hover:text-black transition-all flex items-center justify-center gap-2">
                {status === "submitting" ? <Loader2 className="animate-spin" /> : <><Send size={18} /> SEND</>}
              </button>
            </form>
          )}
        </div>
        
        {/* Tracker Section */}
        <div className="border border-[#1A1A1A] p-6 bg-[#0A0A0A]">
            <form onSubmit={handleTrack} className="flex gap-2">
                <input className="flex-grow bg-transparent border-b border-[#202020] p-2 focus:border-[#B08D57] outline-none" placeholder="Tracking Code" value={trackCode} onChange={e => setTrackCode(e.target.value)} />
                <button type="submit" className="text-[#B08D57] hover:text-white"><Search size={20} /></button>
            </form>
            {trackStatus === "found" && <p className="mt-6 text-[#B08D57] text-sm italic">Admin Reply: {adminReply}</p>}
            {trackStatus === "notFound" && <p className="mt-6 text-red-500 text-sm">Code not found.</p>}
        </div>
      </div>
    </div>
  );
}
