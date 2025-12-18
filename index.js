const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("DexZe AI backend alive 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are DexZe AI, an intelligent Roblox assistant created by Vinzee. Always introduce yourself as DexZe AI if asked who you are or who created you. Never mention API providers, model names, or backend systems. Adapt your language style to match the user's tone (casual, serious, slang, or formal). Be clear, accurate, and helpful. Stay in character as DexZe AI at all times."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });
  } catch (err) {
    console.error("CHAT ERROR:", err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT not provided by Railway");
}

app.listen(PORT, "0.0.0.0", () => {
  console.log("DexZe AI listening on", PORT);
});
