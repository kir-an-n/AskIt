"use client";

import { useState } from "react";
import { Sparkles, Activity } from "lucide-react";
import { Sidebar } from "../components/sidebar";
import { SearchBar } from "../components/search-bar";
import { ModelSelector } from "../components/model-selector";
import { FlashCard } from "../components/flash-card";

type AIModel = "chatgpt" | "gemini" | "claude" | "grok";

export default function Proper5Dashboard() {
  const [selectedModels, setSelectedModels] = useState<AIModel[]>(["gemini", "grok"]);
  const [loadingModels, setLoadingModels] = useState<AIModel[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [latencies, setLatencies] = useState<Record<string, string>>({});

  const handleSubmit = async (query: string) => {
    if (selectedModels.length === 0) return;
    setLoadingModels(selectedModels);

    for (const model of selectedModels) {
      const startTime = performance.now();
      
      if (model === "gemini" || model === "grok") {
        try {
          const response = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: query, model_choice: model }),
          });
          const data = await response.json();
          const endTime = performance.now();
          setLatencies(p => ({ ...p, [model]: ((endTime - startTime) / 1000).toFixed(2) }));
          setResponses(p => ({ ...p, [model]: data.answer }));
        } catch (err) {
          setResponses(p => ({ ...p, [model]: "Error: Backend unreachable." }));
        } finally {
          setLoadingModels(p => p.filter(m => m !== model));
        }
      } else {
        // Mock responses for others
        setTimeout(() => {
          setResponses(p => ({ ...p, [model]: "Simulated response for " + model }));
          setLoadingModels(p => p.filter(m => m !== model));
        }, 1500);
      }
    }
  };

  return (
    <div className="flex min-h-screen dark bg-[#050505] text-white">
      <Sidebar darkMode={true} onToggleDarkMode={() => {}} onNewChat={() => setResponses({})} />
      <main className="ml-64 flex flex-1 flex-col">
        <header className="p-10 text-center">
          <h1 className="text-xl font-black uppercase tracking-widest">Kyros</h1>
          <div className="mt-6 flex justify-center">
            <SearchBar onSubmit={handleSubmit} isLoading={loadingModels.length > 0} />
          </div>
          <ModelSelector selectedModels={selectedModels} onToggleModel={(m) => setSelectedModels(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])} />
        </header>
        <section className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {["gemini", "chatgpt", "claude", "grok"].map((model) => (
            <div key={model} className={`p-6 rounded-3xl border ${selectedModels.includes(model as AIModel) ? "border-red-600/30 opacity-100" : "opacity-20"}`}>
               <div className="flex justify-between text-[10px] text-gray-400 uppercase mb-4">
                 <span>{model} Engine</span>
                 {latencies[model] && <span>{latencies[model]}s</span>}
               </div>
               <FlashCard model={model} content={responses[model]} isLoading={loadingModels.includes(model as AIModel)} />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}