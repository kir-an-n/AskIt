"use client";

import { useState } from "react";
import { Wand2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSubmit, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
    }
  };

  const handleOptimize = () => {
    if (!query.trim()) return;
    
    setIsOptimizing(true);
    // Simulate prompt optimization
    setTimeout(() => {
      const optimizedPrompts = [
        `Please provide a comprehensive and detailed response to: ${query}. Include examples where relevant and structure your answer clearly.`,
        `Analyze and respond thoughtfully to the following: ${query}. Consider multiple perspectives and provide actionable insights.`,
        `${query} - Please elaborate with specific details, best practices, and any important considerations.`,
      ];
      setQuery(optimizedPrompts[Math.floor(Math.random() * optimizedPrompts.length)]);
      setIsOptimizing(false);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-primary/5 transition-shadow focus-within:shadow-xl focus-within:shadow-primary/10">
          {/* Magic Wand Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleOptimize}
            disabled={!query.trim() || isOptimizing}
            className={cn(
              "shrink-0 rounded-xl text-muted-foreground transition-all hover:bg-lavender hover:text-primary",
              isOptimizing && "animate-pulse"
            )}
            title="Optimize prompt"
          >
            {isOptimizing ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <Wand2 className="h-5 w-5" />
            )}
          </Button>

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything to all AI models..."
            className="flex-1 bg-transparent px-2 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="shrink-0 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Send</span>
          </Button>
        </div>

        {/* Helper Text */}
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Wand2 className="mr-1 inline-block h-3 w-3" />
          Use the magic wand to optimize your prompt for better responses
        </p>
      </div>
    </form>
  );
}
