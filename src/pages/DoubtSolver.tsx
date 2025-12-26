import { useState, useEffect } from "react";
import { MessageCircle, Send, Loader2, User, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Doubt {
  id: string;
  question: string;
  answer: string | null;
  resolved: boolean | null;
  created_at: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const DoubtSolver = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedDoubts, setSavedDoubts] = useState<Doubt[]>([]);
  const [isLoadingDoubts, setIsLoadingDoubts] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch saved doubts
  useEffect(() => {
    const fetchDoubts = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("doubts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) throw error;
        setSavedDoubts(data || []);
      } catch (error) {
        console.error("Error fetching doubts:", error);
      } finally {
        setIsLoadingDoubts(false);
      }
    };

    fetchDoubts();
  }, [user]);

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast({
        title: "Empty question",
        description: "Please enter your question.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to ask questions.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion("");
    setIsLoading(true);

    // Generate mock response
    const mockResponse = `Great question! Let me explain this clearly.

**Understanding the Concept:**

${currentQuestion.includes("?") ? currentQuestion : `Regarding "${currentQuestion}"`}

Here's a step-by-step breakdown:

**1. Core Explanation**
The fundamental principle behind this concept is based on established theories. It works by applying specific rules that govern the relationship between different elements.

**2. Key Points to Remember**
• Point 1: The primary factor that influences the outcome
• Point 2: Secondary considerations that modify the result
• Point 3: Edge cases and exceptions to be aware of

**3. Practical Example**
Consider this scenario: If you apply the concept in a real-world situation, you would follow these steps:
- Step 1: Identify the relevant variables
- Step 2: Apply the appropriate formula or principle
- Step 3: Calculate or derive the result

**4. Common Misconceptions**
Many students confuse this with a similar concept. The key difference is in how we approach the initial conditions.

**Summary:**
Remember, the essence of this concept lies in understanding the underlying principles rather than memorizing formulas. Practice with varied examples to build intuition.

Would you like me to explain any part in more detail?`;

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from("doubts")
        .insert({
          question: currentQuestion,
          answer: mockResponse,
          resolved: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mockResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSavedDoubts((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error saving doubt:", error);
      toast({
        title: "Error",
        description: "Failed to save your question.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoubt = (doubt: Doubt) => {
    const msgs: Message[] = [
      { id: `${doubt.id}-q`, role: "user", content: doubt.question },
    ];
    if (doubt.answer) {
      msgs.push({ id: `${doubt.id}-a`, role: "assistant", content: doubt.answer });
    }
    setMessages(msgs);
  };

  const deleteDoubt = async (id: string) => {
    try {
      const { error } = await supabase
        .from("doubts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSavedDoubts((prev) => prev.filter((d) => d.id !== id));
      toast({
        title: "Doubt deleted",
        description: "The question has been removed.",
      });
    } catch (error) {
      console.error("Error deleting doubt:", error);
      toast({
        title: "Error",
        description: "Failed to delete question.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Doubt Solver - StudyAI</title>
      </Helmet>
      <DashboardHeader title="AI Doubt Solver" subtitle="Get instant explanations for any academic question" />

      <div className="p-6 h-[calc(100vh-5rem)] flex gap-6">
        {/* Previous Questions Sidebar */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="p-4 rounded-xl glass-card h-full">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Recent Questions</h3>
            {isLoadingDoubts ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : savedDoubts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No questions yet</p>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-15rem)] overflow-y-auto">
                {savedDoubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors group"
                    onClick={() => loadDoubt(doubt)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-foreground line-clamp-2">{doubt.question}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDoubt(doubt.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(doubt.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mb-6">
                  <MessageCircle className="w-10 h-10 text-secondary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                  Ask Any Academic Question
                </h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  Get clear, detailed explanations with examples. Perfect for understanding complex concepts and preparing for exams.
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {[
                    "Explain the Pythagorean theorem",
                    "What is photosynthesis?",
                    "How do linked lists work?",
                    "Newton's third law examples",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuestion(suggestion)}
                      className="px-4 py-2 rounded-full text-sm bg-muted hover:bg-muted/80 text-foreground transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-secondary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] p-4 rounded-2xl",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      )}
                    >
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {message.content}
                      </pre>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="p-4 rounded-2xl rounded-bl-sm bg-muted">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="max-w-3xl mx-auto w-full">
            <div className="p-4 rounded-xl glass-card">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Ask your question here... (e.g., Explain the concept of recursion with an example)"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="min-h-[60px] max-h-[200px] resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSubmit}
                  variant="hero"
                  size="icon"
                  className="h-auto aspect-square"
                  disabled={isLoading || !question.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoubtSolver;