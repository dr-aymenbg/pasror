import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Escape HTML utility for Telegram HTML parse_mode
const escapeHTML = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Contact Message Route sending directly to Telegram Chat
  app.post("/api/send-message", async (req, res) => {
    try {
      const { name, message } = req.body;

      if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "Please provide your name." });
      }

      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Please write a message." });
      }

      const token = process.env.TELEGRAM_BOT_TOKEN || "7177739698:AAH3JQMeXy5gZXK39XQOHyFBTyPv4JUhZ7s";
      const chatId = process.env.TELEGRAM_CHAT_ID || "1391907071";

      const formattedMessage = `<b>⚜️ New Message from Landing Page ⚜️</b>\n\n<b>👤 Name:</b> ${escapeHTML(name.trim())}\n<b>💬 Message:</b> ${escapeHTML(message.trim())}`;

      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: formattedMessage,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Telegram API Error response:", errorText);
        return res.status(502).json({ error: "We encountered an issue posting the message to Telegram." });
      }

      const data = await response.json();
      return res.json({ success: true, data });
    } catch (error: any) {
      console.error("Error in /api/send-message:", error);
      return res.status(500).json({ error: "A server issue prevented sending your message." });
    }
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
