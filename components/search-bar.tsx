"use client";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar({ onSubmit, isLoading }: { onSubmit: (q: string) => void, isLoading: boolean }) {
  const [query, setQuery] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); if(query.trim()) onSubmit(query); }} className="w-full max-w-2xl">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 focus-within:border-red-600/50">
        <input 
          className="flex-1 bg-transparent px-4 py-2 outline-none" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Ask Kyros anything..."
        />
        <Button 
          type="submit" 
          disabled={!query.trim()} // ONLY disable if text is empty
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
        >
          {isLoading ? <Sparkles className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
          <span className="ml-2">Send</span>
        </Button>
      </div>
    </form>
  );
}