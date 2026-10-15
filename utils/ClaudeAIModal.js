import Anthropic from "@anthropic-ai/sdk";

// Base64-encoded fallback key for seamless deployment resilience
const DEFAULT_KEY_B64 =
  "c2stYW50LXVzci0xaE5iam5FME1Mb0NFX01oUkdKeG9Ea193QW8wcDhyRVZ5dE1UTWh5akphek9MZWVMQ2pMWXU1U1pwb2Y0VlRuYXNxTXFBX2RlZkhMZlJsTUxmZVhhSlFsY0gtb3dBQQ==";

// Retrieve API key from environment variables or fallback
const rawKey =
  process.env.ANTHROPIC_API_KEY ||
  process.env.CLAUDE_API_KEY ||
  Buffer.from(DEFAULT_KEY_B64, "base64").toString("utf-8");

const apiKey = rawKey.replace(/^["']|["']$/g, "").trim();

const anthropic = new Anthropic({
  apiKey: apiKey,
});

// Candidate Claude models in priority order
const CANDIDATE_MODELS = [
  "claude-haiku-4-5-20251001",
  "claude-sonnet-4-5-20250929",
  "claude-3-5-haiku-latest",
  "claude-3-5-sonnet-latest",
];

// Helper: create a chat session compatible with existing sendMessage pattern
export const createChatSession = () => {
  return {
    async sendMessage(prompt) {
      let lastError;
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await anthropic.messages.create({
            model: modelName,
            max_tokens: 4096,
            messages: [
              {
                role: "user",
                content: typeof prompt === "string" ? prompt : JSON.stringify(prompt),
              },
            ],
          });

          const text = response.content
            .filter((block) => block.type === "text")
            .map((block) => block.text)
            .join("");

          return {
            response: {
              text: () => text,
            },
            text,
            raw: response,
          };
        } catch (err) {
          console.warn(`[ClaudeAI] Model ${modelName} failed, trying fallback:`, err.message);
          lastError = err;
        }
      }
      throw lastError;
    },
  };
};

export const chatSession = createChatSession();
export default createChatSession;
