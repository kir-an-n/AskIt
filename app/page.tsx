"use client";

import { useState } from "react";
import { Sparkles, Activity, Share2 } from "lucide-react";
import { Sidebar } from "../components/sidebar";
import { SearchBar } from "../components/search-bar";
import { ModelSelector } from "../components/model-selector";
import { FlashCard } from "../components/flash-card";

type AIModel = "chatgpt" | "gemini" | "claude" | "grok";

const sampleResponses: Record<AIModel, string[]> = {
  chatgpt: ["GPT-4o suggests this approach for your query.", "Strategic analysis complete."],
  claude: ["Claude 3.5 Sonnet recommends focusing on efficiency.", "Analysis shows high probability of success."],
  grok: ["Fetching from Groq Llama 3 backend..."],
  gemini: ["Fetching from Gemini 1.5 Flash backend..."], 
};

export default function Proper5Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedModels, setSelectedModels] = useState<AIModel[]>(["gemini"]);
  const [loadingModels, setLoadingModels] = useState<AIModel[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [latencies, setLatencies] = useState<Record<string, string>>({});

  const toggleModel = (model: AIModel) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleNewChat = () => {
    setResponses({});
    setLatencies({});
    setLoadingModels([]);
  };

  const handleSubmit = async (query: string) => {
    if (selectedModels.length === 0) return;
    setLoadingModels(selectedModels);

    for (const model of selectedModels) {
      const startTime = performance.now();

      // Real API call for Gemini and Grok
      if (model === "gemini" || model === "grok") {
        try {
          const response = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: query, 
                model_choice: model 
            }),
          });

          const data = await response.json();
          const endTime = performance.now();
          
          setLatencies(prev => ({ ...prev, [model]: ((endTime - startTime) / 1000).toFixed(2) }));
          setResponses((prev) => ({ ...prev, [model]: data.answer || "No response." }));
        } catch (err) {
          setResponses((prev) => ({ ...prev, [model]: "Error: API Offline." }));
        }
        setLoadingModels((prev) => prev.filter((m) => m !== model));
      } else {
        // Simulated for ChatGPT/Claude
        const delay = Math.random() * 2000 + 1000;
        setTimeout(() => {
          const endTime = performance.now();
          const modelResponses = sampleResponses[model];
          setLatencies(prev => ({ ...prev, [model]: ((endTime - startTime) / 1000).toFixed(2) }));
          setResponses((prev) => ({
            ...prev,
            [model]: modelResponses[Math.floor(Math.random() * modelResponses.length)],
          }));
          setLoadingModels((prev) => prev.filter((m) => m !== model));
        }, delay);
      }
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark bg-[#050505] text-white" : "bg-gray-50 text-black"}`}>
      <Sidebar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} onNewChat={handleNewChat} />
      <main className="ml-64 flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-black/60 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-6 py-6 text-center">
            <div className="mb-1 flex items-center justify-center gap-3">
              <div className="rounded-full bg-red-600/20 p-2"><Sparkles className="h-5 w-5 text-red-600" /></div>
              <h1 className="text-xl font-black uppercase tracking-[0.2em]">Kyros</h1>
            </div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Aggregated AI Intelligence • IIIT Nagpur</p>
            <div className="mt-6 mb-6 flex justify-center"><SearchBar onSubmit={handleSubmit} isLoading={loadingModels.length > 0} /></div>
            <ModelSelector selectedModels={selectedModels} onToggleModel={toggleModel} />
          </div>
        </header>

        <section className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 md:grid-cols-2">
            {(["gemini", "chatgpt", "claude", "grok"] as AIModel[]).map((model) => (
              <div key={model} className={`group relative rounded-3xl border transition-all duration-500 ${selectedModels.includes(model) ? "border-red-600/30 bg-white/[0.03] opacity-100 shadow-2xl" : "border-transparent bg-transparent opacity-20 grayscale pointer-events-none"}`}>
                <div className="flex items-center justify-between px-6 pt-6">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${responses[model] ? 'bg-green-500 animate-pulse' : 'bg-red-600'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{model} Engine</span>
                  </div>
                  {latencies[model] && <div className="flex items-center gap-1 text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded-md"><Activity className="h-3 w-3" />{latencies[model]}s</div>}
                </div>
                <div className="p-4"><FlashCard model={model} content={responses[model]} isLoading={loadingModels.includes(model)} /></div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}