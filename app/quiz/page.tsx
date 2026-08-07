import QuizChat from "@/components/QuizChat";
import QuizStatic from "@/components/QuizStatic";

export const metadata = {
  title: "Take the quiz — Match",
};

// Uses the AI conversational quiz only when explicitly turned on — this
// keeps the site fully working without spending any Anthropic credits.
// Flip NEXT_PUBLIC_USE_AI_QUIZ=true in .env.local once credits are added.
export default function QuizPage() {
  const useAI = process.env.NEXT_PUBLIC_USE_AI_QUIZ === "true";

  return (
    <div className="mx-auto max-w-6xl px-6">
      {useAI ? <QuizChat /> : <QuizStatic />}
    </div>
  );
}
