import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // phục vụ index.html, script.js, style.css

let conversationHistory = [
  { role: "system", content: "Bạn là một trợ lý AI nói tiếng Việt, thân thiện, nhớ cuộc trò chuyện." }
];

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;

  conversationHistory.push({ role: "user", content: userInput });

  // Chỉ giữ lại 20 lượt gần nhất
  if (conversationHistory.length > 20) {
    conversationHistory = [conversationHistory[0], ...conversationHistory.slice(-19)];
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversationHistory,
    });

    const botReply = completion.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: botReply });

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Đã có lỗi xảy ra khi gọi API." });
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
