import { useState, FormEvent } from "react";
import { 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MessageSquare,
  Search,
  Copy,
  Check
} from "lucide-react";

export default function App() {
  // الحالات (States)
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [trackStatus, setTrackStatus] = useState<"idle" | "searching" | "found" | "notFound">("idle");
  const [adminReply, setAdminReply] = useState("");

  // دالة النسخ
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // دالة الإرسال المتكاملة
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill out both fields.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const newTrackingCode = "PRESTIGE-" + Math.floor(10000 + Math.random() * 90000);

    try {
      // 1. حفظ في Supabase
      const supabaseResponse = await fetch("https://azbgzkuykdzjoqftpba.supabase.co/rest/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj",
        },
        body: JSON.stringify({
          name: name,
          message: message,
          tracking_code: newTrackingCode,
        }),
      });

      // 2. إرسال إيميل عبر Web3Forms
      const formData = new FormData();
      formData.append("access_key", "694d4f9e-a27a-40ee-8b6f-7a62e40d279e");
      formData.append("name", name);
      formData.append("message", message);
      formData.append("tracking_code", newTrackingCode);

      const emailResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      if (supabaseResponse.ok && emailResponse.ok) {
        setGeneratedCode(newTrackingCode);
        setStatus("success");
        setName("");
        setMessage("");
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Connection failed. Please try again.");
    }
  };

  // دالة التتبع
  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    if (!trackCode.trim()) return;
    setTrackStatus("searching");

    try {
      const response = await fetch(`https://azbgzkuykdzjoqftpba.supabase.co/rest/v1/messages?tracking_code=eq.${trackCode.trim()}`, {
        method: "GET",
        headers: {
          "apikey": "sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj",
        }
      });
      const data = await response.json();
      if (data.length === 0) {
        setTrackStatus("notFound");
      } else {
        setTrackStatus("found");
        setAdminReply(data[0].reply || "No reply yet.");
      }
    } catch (error) {
      setTrackStatus("notFound");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] p-4 md:p-16">
      <div className="max-w-lg mx-auto space-y-12">
        {/* الهيدر */}
        <div className="text-center">
            <h1 className="text-4xl font-serif text-[#F5F5F5] uppercase tracking-widest">DR-AYMEN</h1>
        </div>

        {/* نموذج الإرسال */}
        <div className="border border-[#1A1A1A] p-8 bg-[#0E0E0E]">
            {status === "success" ? (
                <div className="text-center space-y-4">
                    <CheckCircle2 className="mx-auto text-[#B08D57]" size={40} />
                    <p>Inquiry Sent! Tracking: {generatedCode}</p>
                    <button onClick={() => setStatus("idle")} className="border p-2">Send Another</button>
                </div>
            ) : (
                <form onSubmit={handleSend} className="space-y-4">
                    <input className="w-full bg-transparent border-b p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                    <textarea className="w-full bg-transparent border-b p-2" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
                    <button type="submit" className="w-full py-4 border border-[#B08D57] text-[#B08D57]">SEND INQUIRY</button>
                    {status === "error" && <p className="text-red-500">{errorMessage}</p>}
                </form>
            )}
        </div>

        {/* التتبع */}
        <div className="border border-[#1A1A1A] p-6 bg-[#0E0E0E]">
            <form onSubmit={handleTrack} className="flex gap-2">
                <input className="flex-grow bg-[#050505] p-2" placeholder="Tracking Code" value={trackCode} onChange={e => setTrackCode(e.target.value)} />
                <button type="submit" className="p-2 border border-[#B08D57] text-[#B08D57]">CHECK</button>
            </form>
            {trackStatus === "found" && <p className="mt-4 text-[#B08D57]">Reply: {adminReply}</p>}
        </div>
      </div>
    </div>
  );
}
