import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Search, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [view, setView] = useState<"form" | "success" | "tracker">("form");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [fetchedReply, setFetchedReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // دالة توليد كود عشوائي
  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  // إرسال البيانات (إيميل + قاعدة بيانات)
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const code = generateCode();

    // 1. إرسال للإيميل عبر Web3Forms
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

    // 2. حفظ في Supabase
    const { error } = await supabase
      .from('messages')
      .insert([{ name, message, tracking_code: code }]);

    setLoading(false);
    if (!error) {
      setTrackingCode(code);
      setView("success");
    } else {
      alert("حدث خطأ أثناء الاتصال بقاعدة البيانات");
    }
  };

  // البحث عن رد
  const checkStatus = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('reply')
      .eq('tracking_code', trackingCode.toUpperCase())
      .single();

    setLoading(false);
    if (data && data.reply) {
      setFetchedReply(data.reply);
    } else {
      setFetchedReply("لا يوجد رد حالياً أو كود التتبع غير صحيح.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#0E0E0E] border border-[#1A1A1A] p-8 shadow-2xl">
        <AnimatePresence mode="wait">
          
          {/* شاشة النموذج */}
          {view === "form" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-serif mb-8 text-[#F5F5F5]">إرسال استفسار</h2>
              <form onSubmit={handleSend} className="space-y-6">
                <input className="w-full bg-transparent border-b border-[#2A2A2A] pb-2 outline-none focus:border-[#B08D57] transition-all" placeholder="الاسم" onChange={(e) => setName(e.target.value)} required />
                <textarea className="w-full bg-transparent border-b border-[#2A2A2A] pb-2 outline-none focus:border-[#B08D57] transition-all min-h-[100px]" placeholder="الرسالة" onChange={(e) => setMessage(e.target.value)} required />
                <button type="submit" disabled={loading} className="w-full py-3 border border-[#B08D57] text-[#B08D57] hover:bg-[#B08D57] hover:text-black transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={16} /> إرسال الاستفسار</>}
                </button>
              </form>
              <button onClick={() => setView("tracker")} className="w-full mt-6 text-[10px] uppercase tracking-[0.2em] text-stone-600 underline">متابعة حالة سابقة</button>
            </motion.div>
          )}

          {/* شاشة النجاح */}
          {view === "success" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <CheckCircle2 size={48} className="mx-auto text-[#B08D57] mb-4" />
              <p className="text-sm text-stone-400">تم استلام رسالتك بنجاح. كود التتبع الخاص بك:</p>
              <div className="text-4xl font-mono text-[#B08D57] my-6 tracking-widest">{trackingCode}</div>
              <button onClick={() => setView("form")} className="text-xs underline">العودة للرئيسية</button>
            </motion.div>
          )}

          {/* شاشة التتبع */}
          {view === "tracker" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-serif mb-8">متابعة الطلب</h2>
              <input className="w-full bg-transparent border-b border-[#2A2A2A] pb-2 outline-none focus:border-[#B08D57] mb-6" placeholder="أدخل كود التتبع" onChange={(e) => setTrackingCode(e.target.value)} />
              <button onClick={checkStatus} className="w-full py-3 border border-[#B08D57] hover:bg-[#B08D57] hover:text-black transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <><Search size={16} /> فحص الحالة</>}
              </button>
              {fetchedReply && <div className="mt-6 p-4 bg-[#151515] border-l-2 border-[#B08D57] text-sm text-stone-300">{fetchedReply}</div>}
              <button onClick={() => setView("form")} className="mt-8 flex items-center gap-2 text-xs text-stone-600"><ArrowLeft size={14} /> العودة</button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
