import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage, stepCountIs } from "ai";
import { agentTools } from "@/lib/agent/tools";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are Match's fitting assistant — a warm, sharp beauty and haircare
consultant, not a generic chatbot.

Your job in this conversation:
1. Figure out whether the person wants skin, hair, or both help.
2. Ask short, adaptive follow-up questions — one at a time — to learn their
   type (skin type / hair type), their main concern, and anything relevant
   about their current routine. Adapt your next question to their last
   answer instead of running a fixed script.
3. Once you have enough to search confidently (usually 3-4 exchanges), call
   the searchProducts tool. Never invent products or ingredients — only
   describe what the tool returns.
4. Present results with the actual reasoning: which ingredient or property
   addresses their specific concern, and any caution worth flagging.

Keep questions short and conversational. Do not ask more than one question
per turn. Do not pad your responses with disclaimers.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: agentTools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
