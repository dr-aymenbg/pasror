import { useState, FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

// --- الإعدادات (تأكد من دقتها) ---
const SUPABASE_URL = "https://azbgzkuykdzjoqftpba.supabase.co"; 
const SUPABASE_API_KEY = "sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj";
const WEB3FORMS_ACCESS_KEY = "694d4f9e-a27a-40ee-8b6f-7a62e40d279e";
// --------------------------------

export default function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [trackStatus, setTrackStatus] = useState<"idle" | "searching" | "found" | "notFound">("idle");
  const [adminReply, setAdminReply] = useState("");

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill out all fields.");
      return;
    }

    setStatus("submitting");
    const newTrackingCode = "PRESTIGE-" + Math.floor(10000 + Math.random() * 90000);

    try {
      // 1. إرسال إلى Supabase
      const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_API_KEY,
          "Prefer": "return=representation"
        },
        body: JSON.stringify({ name, message, tracking_code: newTrackingCode }),
      });

      if (!supabaseRes.ok) throw new Error("Database error");

      // 2. إرسال إلى Web3Forms
      const emailRes = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          message,
          tracking_code: newTrackingCode,
          subject: "New Message via Portfolio"
        }),
      });

      if (!emailRes.ok) throw new Error("Email error");

      setGeneratedCode(newTrackingCode);
      setStatus("success");
      setName("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Connection failed. Check your Supabase URL in the code.");
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
      if (data.length === 0) setTrackStatus("notFound");
      else { setTrackStatus("found"); setAdminReply(data[0].reply || "No reply yet."); }
    } catch (e) { setTrackStatus("notFound"); }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-8">
        <div className="border border-[#1A1A1A] p-8 bg-[#0E0E0E]">
          {status === "success" ? (
             <div className="text-center space-y-4">
               <CheckCircle2 className="mx-auto text-[#B08D57]" size={40} />
               <p>Message Sent! Code: {generatedCode}</p>
             </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <input className="w-full bg-[#050505] border border-[#202020] p-3 text-white" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              <textarea className="w-full bg-[#050505] border border-[#202020] p-3 text-white" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
              <button type="submit" disabled={status === "submitting"} className="w-full py-3 border border-[#B08D57] text-[#B08D57] uppercase tracking-widest hover:bg-[#B08D57] hover:text-black">
                {status === "submitting" ? "Sending..." : "Send Inquiry"}
              </button>
              {status === "error" && <p className="text-red-500 text-sm">{errorMessage}</p>}
            </form>
          )}
        </div>
        
        <div className="border border-[#1A1A1A] p-6 bg-[#0E0E0E]">
            <form onSubmit={handleTrack} className="flex gap-2">
                <input className="flex-grow bg-[#050505] border border-[#202020] p-2 text-white" placeholder="Tracking Code" value={trackCode} onChange={e => setTrackCode(e.target.value)} />
                <button type="submit" className="px-4 border border-[#B08D57] text-[#B08D57]">CHECK</button>
            </form>
            {trackStatus === "found" && <p className="mt-4 text-[#B08D57]">Reply: {adminReply}</p>}
        </div>
      </div>
    </div>
  );
}
