import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

// ─── Response Cache (prevents duplicate API calls) ────────────────────────────
const responseCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

const getCached = (key) => {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.value;
};
const setCache = (key, value) => responseCache.set(key, { value, timestamp: Date.now() });

// ─── PRIMARY: Google Gemini Direct API ────────────────────────────────────────
const callGeminiDirect = async (prompt, systemPrompt) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("NO_GEMINI_KEY");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const config = { 
    temperature: 0.5,
    maxOutputTokens: 1000,
  };
  
  // Using gemini-1.5-flash-latest which is the most stable production model.
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash-latest", 
    config,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: systemPrompt ? [{ text: systemPrompt }] : undefined,
  });

  return response.text;
};

// ─── BACKUP: OpenRouter API ───────────────────────────────────────────────────
const callOpenRouter = async (prompt, systemPrompt) => {
  if (!process.env.OPENROUTER_API_KEY) throw new Error("NO_OPENROUTER_KEY");

  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  // openrouter/auto automatically selects a working model. 
  // We also include specific common free models as explicit fallbacks.
  const models = [
    "openrouter/auto", 
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-2-9b-it:free"
  ];

  for (const model of models) {
    try {
      console.log(`   Trying OpenRouter model: ${model}...`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": "RecruiteX AI",
        },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1000 }),
      });
      
      const data = await res.json();
      if (data.error) {
        console.warn(`   Model ${model} error: ${data.error.message || JSON.stringify(data.error)}`);
        continue;
      }
      
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      console.warn(`   Fetch error for ${model}: ${err.message}`);
    }
  }
  throw new Error("AI services are currently busy. Please try again in a moment.");
};



// ─── Main Export ──────────────────────────────────────────────────────────────
export const runAI = async (prompt, systemPrompt = null) => {
  // Cache check
  const cacheKey = `${systemPrompt?.slice(0, 50) || ""}::${prompt}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log("✅ Cache hit — returning saved response");
    return cached;
  }

  // Strategy: Try Gemini Direct first, then OpenRouter as backup
  try {
    console.log("🤖 Trying: Google Gemini Direct API...");
    const reply = await callGeminiDirect(prompt, systemPrompt);
    console.log("✅ Gemini Direct success!");
    setCache(cacheKey, reply);
    return reply;
  } catch (err) {
    console.warn(`⚠️ Gemini Direct failed: ${err.message}`);
    // If it's a quota issue, we definitely want to try backup
  }

  try {
    console.log("🤖 Trying: OpenRouter backup...");
    const reply = await callOpenRouter(prompt, systemPrompt);
    console.log("✅ OpenRouter backup success!");
    setCache(cacheKey, reply);
    return reply;
  } catch (err) {
    console.error(`❌ All AI services failed: ${err.message}`);
    throw err;
  }
};

