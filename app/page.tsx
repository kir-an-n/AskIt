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
  grok: ["Grok-2 (beta) says: That's interesting!", "Checking real-time X trends for you."],
  gemini: ["Fetching response from your Python backend..."], 
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

    // 🔗 DYNAMIC API URL: Uses your Render URL if on Vercel, else Localhost
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    for (const model of selectedModels) {
      const startTime = performance.now();

      if (model === "gemini") {
        try {
          const response = await fetch(`${API_BASE_URL}/ask-gemini`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: query }),
          });

          const data = await response.json();
          const endTime = performance.now();
          
          setLatencies(prev => ({ ...prev, [model]: ((endTime - startTime) / 1000).toFixed(2) }));
          setResponses((prev) => ({ ...prev, [model]: data.answer || "No response." }));
        } catch (err) {
          setResponses((prev) => ({ ...prev, [model]: "Error: API Offline. Check Render/Localhost." }));
        }
        setLoadingModels((prev) => prev.filter((m) => m !== "gemini"));
      } else {
        // SIMULATED LATENCY FOR OTHERS
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
        {/* Header Section */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-black/60 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-6 py-6">
            <div className="mb-6 text-center">
              <div className="mb-1 flex items-center justify-center gap-3">
                <div className="rounded-full bg-red-600/20 p-2">
                  <Sparkles className="h-5 w-5 text-red-600" />
                </div>
                <h1 className="text-xl font-black uppercase tracking-[0.2em]">Kyros</h1>
              </div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                Aggregated AI Intelligence • IIIT Nagpur
              </p>
            </div>

            <div className="mb-6 flex justify-center"><SearchBar onSubmit={handleSubmit} isLoading={loadingModels.length > 0} /></div>
            <ModelSelector selectedModels={selectedModels} onToggleModel={toggleModel} />
          </div>
        </header>

        {/* Cards Grid - Modern Comparison Layout */}
        <section className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {(["gemini", "chatgpt", "claude", "grok"] as AIModel[]).map((model) => (
                <div
                  key={model}
                  className={`group relative transition-all duration-500 rounded-3xl border ${
                    selectedModels.includes(model)
                      ? "border-red-600/30 bg-white/[0.03] opacity-100 shadow-2xl"
                      : "border-transparent bg-transparent opacity-20 grayscale pointer-events-none"
                  }`}
                >
                  {/* Status & Latency Badge */}
                  <div className="flex items-center justify-between px-6 pt-6">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${responses[model] ? 'bg-green-500 animate-pulse' : 'bg-red-600'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{model} Engine</span>
                    </div>
                    {latencies[model] && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                        <Activity className="h-3 w-3" />
                        {latencies[model]}s
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <FlashCard
                      model={model}
                      content={responses[model]}
                      isLoading={loadingModels.includes(model)}
                    />
                  </div>

                  {/* Quick Actions */}
                  {responses[model] && (
                    <div className="flex justify-end gap-3 px-6 pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-gray-500 hover:text-white transition-colors"><Share2 className="h-4 w-4" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-black/40 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-[10px] text-gray-600 font-medium uppercase tracking-[0.3em]">
              Dev: Kiran • Built for Scale 2026
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}