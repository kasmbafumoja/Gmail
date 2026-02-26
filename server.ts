import express from "express";
import { createServer as createViteServer } from "vite";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory storage
// emails: Map<email, createdAt>
// messages: Map<email, Message[]>
interface Message {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: number;
}

const emails = new Map<string, number>();
const messages = new Map<string, Message[]>();

const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

// Auto-cleanup script
setInterval(() => {
  const now = Date.now();
  for (const [email, createdAt] of emails.entries()) {
    if (now - createdAt > EXPIRY_TIME) {
      emails.delete(email);
      messages.delete(email);
      console.log(`[Cleanup] Deleted expired email: ${email}`);
    }
  }
}, CLEANUP_INTERVAL);

// API Routes
app.post("/api/generate", (req, res) => {
  const id = uuidv4().split("-")[0];
  const email = `${id}@kasmail.temp`;
  emails.set(email, Date.now());
  messages.set(email, []);
  res.json({ email });
});

app.get("/api/inbox", (req, res) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!emails.has(email)) {
    return res.status(404).json({ error: "Email not found or expired" });
  }

  const inbox = messages.get(email) || [];
  res.json({ messages: inbox });
});

app.post("/api/receive", (req, res) => {
  const { to, from, subject, body } = req.body;

  if (!to || !from || !subject || !body) {
    return res.status(400).json({ error: "Missing required fields (to, from, subject, body)" });
  }

  if (!emails.has(to)) {
    return res.status(404).json({ error: "Recipient email not found or expired" });
  }

  const newMessage: Message = {
    id: uuidv4(),
    from,
    subject,
    body,
    timestamp: Date.now(),
  };

  const currentMessages = messages.get(to) || [];
  messages.set(to, [newMessage, ...currentMessages]);

  res.json({ success: true, message: "Email received" });
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
