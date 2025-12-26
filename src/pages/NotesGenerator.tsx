import { useState, useEffect } from "react";
import { FileText, Sparkles, Loader2, Copy, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Note {
  id: string;
  title: string;
  content: string | null;
  subject: string | null;
  created_at: string;
}

const NotesGenerator = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch saved notes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setSavedNotes(data || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Missing topic",
        description: "Please enter a topic to generate notes.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to generate notes.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Generate notes (mock AI generation)
    const mockNotes = `# ${topic}

## Overview
${topic} is a fundamental concept that forms the basis for understanding more complex ideas in this field.

## Key Concepts

### 1. Definition
- A clear and concise definition of the main concept
- Historical context and origin
- Related terminology

### 2. Core Principles
- **Principle 1**: The foundational element that drives the concept
- **Principle 2**: Secondary mechanisms and their interactions
- **Principle 3**: Advanced applications and implications

### 3. Important Formulas/Rules
- Formula 1: Basic application
- Formula 2: Extended use cases
- Rule 1: Key constraint to remember

## Examples

### Example 1: Basic Application
Step-by-step walkthrough of a simple problem demonstrating the core concept.

### Example 2: Advanced Application
A more complex scenario showing how multiple principles work together.

## Common Mistakes to Avoid
1. Confusing related but distinct concepts
2. Overlooking edge cases
3. Misapplying formulas in wrong contexts

## Summary Points
- Key takeaway 1: The most important thing to remember
- Key takeaway 2: Critical for exam preparation
- Key takeaway 3: Often tested concept

## Further Reading
- Recommended textbook chapters
- Related topics to explore
- Practice problem suggestions`;

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from("notes")
        .insert({
          title: topic,
          content: mockNotes,
          subject: topic,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedNotes(mockNotes);
      setSavedNotes((prev) => [data, ...prev]);
      setSelectedNote(data);
      setTopic("");
      
      toast({
        title: "Notes generated!",
        description: "Your exam-oriented notes are ready and saved.",
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const content = selectedNote?.content || generatedNotes;
    if (content) {
      navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Notes copied to clipboard.",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      setSavedNotes((prev) => prev.filter((n) => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setGeneratedNotes(null);
      }
      
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive",
      });
    }
  };

  const displayContent = selectedNote?.content || generatedNotes;

  return (
    <>
      <Helmet>
        <title>Notes Generator - StudyAI</title>
      </Helmet>
      <DashboardHeader title="AI Notes Generator" subtitle="Generate comprehensive, exam-oriented notes instantly" />

      <div className="p-6">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-8 p-6 rounded-xl glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Generate Notes</h2>
              <p className="text-sm text-muted-foreground">Enter any topic or concept</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="topic" className="sr-only">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Binary Search Trees, Newton's Laws, Photosynthesis"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-12"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <Button
              onClick={handleGenerate}
              variant="hero"
              className="h-12 px-6"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Saved Notes Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-4 rounded-xl glass-card">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Saved Notes</h3>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : savedNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No saved notes yet</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {savedNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedNote?.id === note.id
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => {
                        setSelectedNote(note);
                        setGeneratedNotes(null);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{note.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(note.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Display */}
          <div className="lg:col-span-3">
            {displayContent ? (
              <div className="p-6 rounded-xl glass-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {selectedNote?.title || "Generated Notes"}
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-foreground bg-muted/50 p-6 rounded-lg overflow-x-auto">
                    {displayContent}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl glass-card text-center py-12">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Ready to Generate Notes
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter any topic above and our AI will create comprehensive, well-structured notes perfect for exam preparation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesGenerator;