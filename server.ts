import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const PORT = 3000;
const MESSAGES_FILE = path.join(process.cwd(), "messages.json");

// Load messages from file or initialize empty
let messages: any[] = [];
if (fs.existsSync(MESSAGES_FILE)) {
  try {
    messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
  } catch (e) {
    messages = [];
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());

  // API to get all messages (for admin)
  app.get("/api/messages", (req, res) => {
    res.json(messages);
  });

  // WebSocket handling
  wss.on("connection", (ws) => {
    console.log("New client connected");

    // Send existing messages to the new client
    ws.send(JSON.stringify({ type: "INIT", data: messages }));

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === "USER_MESSAGE" || message.type === "ADMIN_REPLY") {
          const newMessage = {
            ...message.payload,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          };
          
          messages.push(newMessage);
          
          // Persist to file
          fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

          // Broadcast to all connected clients
          const broadcastData = JSON.stringify({ type: "NEW_MESSAGE", data: newMessage });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        }
      } catch (e) {
        console.error("Error processing message:", e);
      }
    });
  });

  // Vite middleware for development
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

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
