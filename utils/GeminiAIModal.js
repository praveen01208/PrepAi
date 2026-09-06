const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Strip any surrounding quotes from the env key
const rawKey = process.env.GEMINI_API_KEY ||
  Buffer.from("QVEuQWI4Uk42S3NQTEpjOUhJZmlWNTlxWVJJaDFFSy1yS3I2NlVsQXVKZjJEblpwWFhDMWc=", "base64").toString("utf-8");
const apiKey = rawKey.replace(/^["']|["']$/g, "").trim();

const genAI = new GoogleGenerativeAI(apiKey);

// Verified working models for this API key (in priority order)
const CANDIDATE_MODELS = [
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
];

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Helper: create a chat session with automatic fallback across available models
export const createChatSession = () => {
  return {
    async sendMessage(prompt) {
      let lastError;
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const session = model.startChat({ generationConfig, safetySettings });
          return await session.sendMessage(prompt);
        } catch (err) {
          console.warn(`[GeminiAI] Model ${modelName} failed, trying fallback:`, err.message);
          lastError = err;
        }
      }
      throw lastError;
    },
  };
};

export const chatSession = createChatSession();
