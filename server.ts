import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Route: Process Leads and fire Webhook
  app.post("/api/lead", async (req, res) => {
    try {
      const { name, email, whatsapp, score, levelName, scores, gargalo, customWebhookUrl, respostasCompletas } = req.body;

      if (!name || !email || !whatsapp) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes: nome, email ou whatsapp." });
      }

      // Read from custom client parameter or express system env
      const webhookUrl = customWebhookUrl || process.env.VITE_MAKE_WEBHOOK_URL || process.env.MAKE_WEBHOOK_URL;

      // Format payload for Webconverte CRM / Telegram / MAKE
      const payload = {
        timestamp: new Date().toISOString(),
        name,
        email,
        whatsapp,
        scoreFinal: `${Math.round(score * 100)}%`,
        levelName,
        pilarPresenca: scores?.presence ?? 0,
        pilarInstagram: scores?.instagram ?? 0,
        pilarWhatsapp: scores?.whatsapp ?? 0,
        pilarMetricas: scores?.metrics ?? 0,
        maiorGargalo: gargalo,
        leadSource: "Quiz de Maturidade Digital para Psicólogos - Webconverte",
        whatsappLink: `https://wa.me/55${whatsapp.replace(/\D/g, "")}`,
        respostasCompletas: respostasCompletas ?? ""
      };

      let webhookSent = false;
      let webhookStatus = "";

      if (webhookUrl && webhookUrl.trim() !== "" && webhookUrl.startsWith("http")) {
        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          webhookSent = response.ok;
          webhookStatus = `Status ${response.status} - ${response.statusText}`;
        } catch (webhookErr: any) {
          console.error("Error sending webhook request:", webhookErr);
          webhookStatus = `Falha de conexão: ${webhookErr.message || "Erro desconhecido"}`;
        }
      } else {
        webhookStatus = "Webhook não configurado (URL inválida ou vazia)";
      }

      return res.status(200).json({
        success: true,
        webhookSent,
        webhookStatus,
        webhookUrlUsed: webhookUrl ? `${webhookUrl.substring(0, Math.min(30, webhookUrl.length))}...` : null,
        payload
      });
    } catch (err: any) {
      console.error("Lead submission endpoint failure:", err);
      return res.status(500).json({ error: "Erro interno no servidor", details: err.message });
    }
  });

  // Serve app resources based on node environment
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
