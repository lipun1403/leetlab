import { Agent, run } from "@openai/agents";
import { checkInputGuardrail } from "../ai/guard.js";
import { getHistory, addToHistory } from "../ai/chatHistory.js";


const codingAgent = new Agent({
  name: "LeetLab Assistant",
  model: "gpt-4.1-mini",
  instructions: `
You are an AI coding assistant for a LeetCode-style platform.

STRICT RULES:
- DO NOT provide full code solutions
- DO NOT give exact answers
- DO NOT return copy-paste code

YOU MUST:
- Explain approach step-by-step
- Give hints and intuition
- Suggest data structures
- Help users think, not solve

If user asks for full code:
→ Politely refuse and guide instead

Tone:
- Friendly
- Encouraging
- Mentor-like
`,
});

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id || "guest";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const isUnsafe = await checkInputGuardrail(message);

    if (isUnsafe) {
       const replyByGuardRail = "I can’t provide full solutions, but I can guide you step-by-step. What part are you stuck on?";
       addToHistory(userId, { role: "user", content: message });
       addToHistory(userId, { role: "assistant", content: replyByGuardRail });
      return res.status(200).json({
        reply: replyByGuardRail,
      });
    }

    const history = getHistory(userId) || [];

    // ✅ Convert history → string context
    const context = history
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
      )
      .join("\n");

    const finalPrompt = `
        Previous conversation:
        ${context}

        Current question:
        ${message}
        `;

    const response = await run(codingAgent, finalPrompt);

    const reply =
      response?.output?.[0]?.content?.[0]?.text ||
      response?.finalOutput ||
      "No response";

    addToHistory(userId, { role: "user", content: message });
    addToHistory(userId, { role: "assistant", content: reply });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat controller error:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};