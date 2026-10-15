import Anthropic from "@anthropic-ai/sdk";

// Retrieve API key from environment variables
const rawKey =
  process.env.ANTHROPIC_API_KEY ||
  process.env.CLAUDE_API_KEY ||
  "";

const apiKey = rawKey.replace(/^["']|["']$/g, "").trim();

const anthropic = new Anthropic({
  apiKey: apiKey || "dummy-key-for-build",
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
