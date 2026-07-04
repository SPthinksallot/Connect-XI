const axios = require("axios");
const { asyncHandler, sendSuccess, sendError } = require("../utils/helpers");

const OPENROUTER_BASE = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_MODEL = "openai/gpt-4o-mini"; // cost-effective default

const openRouterChat = async (messages, model = DEFAULT_MODEL) => {
  const response = await axios.post(
    `${OPENROUTER_BASE}/chat/completions`,
    { model, messages, temperature: 0.7, max_tokens: 512 },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
        "X-Title": "Yaap",
      },
    }
  );
  return response.data.choices[0].message.content.trim();
};

// @desc   Generate smart reply suggestions
// @route  POST /api/ai/smart-reply
const smartReply = asyncHandler(async (req, res) => {
  const { messages = [] } = req.body;
  if (!messages.length) return sendError(res, "Messages context is required", 400);

  const context = messages
    .slice(-6)
    .map((m) => `${m.senderName}: ${m.content}`)
    .join("\n");

  const prompt = `You are a helpful messaging assistant. Based on this conversation, generate exactly 3 short, natural reply suggestions (max 8 words each). Return ONLY a JSON array of 3 strings, nothing else.\n\nConversation:\n${context}`;

  const raw = await openRouterChat([{ role: "user", content: prompt }]);

  let suggestions = [];
  try {
    // Strip markdown code blocks if present
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    suggestions = JSON.parse(cleaned);
    if (!Array.isArray(suggestions)) throw new Error();
    suggestions = suggestions.slice(0, 3).map(String);
  } catch {
    // Fallback: split by newlines or commas
    suggestions = raw.split(/[\n,]/).map((s) => s.replace(/^["'\d.\s\-`]+/, "").trim()).filter(Boolean).slice(0, 3);
  }

  sendSuccess(res, { suggestions });
});

// @desc   Summarize chat history
// @route  POST /api/ai/summarize
const summarizeChat = asyncHandler(async (req, res) => {
  const { messages = [] } = req.body;
  if (messages.length < 3) return sendError(res, "Need at least 3 messages to summarize", 400);

  const context = messages
    .map((m) => `${m.senderName}: ${m.content || "[media]"}`)
    .join("\n");

  const prompt = `Summarize this chat conversation concisely in 3-5 bullet points. Focus on key decisions, action items, and important information. Format as a JSON object: { "range": "<time range>", "bullets": ["...", "..."] }\n\nConversation:\n${context}`;

  const raw = await openRouterChat([{ role: "user", content: prompt }]);

  let summary;
  try {
    summary = JSON.parse(raw);
  } catch {
    summary = { range: "Recent messages", bullets: [raw] };
  }

  sendSuccess(res, { summary });
});

// @desc   Translate a message
// @route  POST /api/ai/translate
const translateMessage = asyncHandler(async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text) return sendError(res, "Text is required", 400);
  if (!["en", "hi"].includes(targetLang)) return sendError(res, "Supported languages: en, hi", 400);

  const langName = targetLang === "hi" ? "Hindi" : "English";
  const prompt = `Translate the following text to ${langName}. Return ONLY the translated text, nothing else:\n\n"${text}"`;

  const translated = await openRouterChat([{ role: "user", content: prompt }]);

  sendSuccess(res, { original: text, translated, targetLang });
});

module.exports = { smartReply, summarizeChat, translateMessage };
