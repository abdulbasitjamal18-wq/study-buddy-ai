import { useState } from "react";
import { FileText, Sparkles, Loader2, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

const NotesGenerator = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Missing topic",
        description: "Please enter a topic to generate notes.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
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

      setGeneratedNotes(mockNotes);
      setIsGenerating(false);
      toast({
        title: "Notes generated!",
        description: "Your exam-oriented notes are ready.",
      });
    }, 2000);
  };

  const handleCopy = () => {
    if (generatedNotes) {
      navigator.clipboard.writeText(generatedNotes);
      toast({
        title: "Copied!",
        description: "Notes copied to clipboard.",
      });
    }
  };

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

        {/* Generated Notes */}
        {generatedNotes ? (
          <div className="max-w-4xl mx-auto p-6 rounded-xl glass-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Generated Notes</h2>
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
                {generatedNotes}
              </pre>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-12">
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
    </>
  );
};

export default NotesGenerator;
