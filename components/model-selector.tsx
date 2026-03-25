"use client";

import { cn } from "@/lib/utils";

export type AIModel = "chatgpt" | "gemini" | "claude" | "grok";

interface ModelSelectorProps {
  selectedModels: AIModel[];
  onToggleModel: (model: AIModel) => void;
}

const models: { id: AIModel; name: string; color: string; bgColor: string }[] = [
  { id: "chatgpt", name: "ChatGPT", color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-950" },
  { id: "gemini", name: "Gemini", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950" },
  { id: "claude", name: "Claude", color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950" },
  { id: "grok", name: "Grok", color: "text-gray-800 dark:text-gray-200", bgColor: "bg-gray-100 dark:bg-gray-800" },
];

// SVG Icons for each AI model
const ModelIcon = ({ model, className }: { model: AIModel; className?: string }) => {
  switch (model) {
    case "chatgpt":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.6 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
        </svg>
      );
    case "gemini":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0C5.352 0 0 5.352 0 12s5.352 12 12 12 12-5.352 12-12S18.648 0 12 0zm0 2.4c5.28 0 9.6 4.32 9.6 9.6s-4.32 9.6-9.6 9.6-9.6-4.32-9.6-9.6 4.32-9.6 9.6-9.6zm0 1.44a8.16 8.16 0 1 0 0 16.32 8.16 8.16 0 0 0 0-16.32zm3.84 4.08L12 11.76l-3.84-3.84-.96.96L11.04 12l-3.84 3.84.96.96L12 12.96l3.84 3.84.96-.96L12.96 12l3.84-3.84-.96-.96z"/>
        </svg>
      );
    case "claude":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      );
    case "grok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
  }
};

export function ModelSelector({ selectedModels, onToggleModel }: ModelSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {models.map((model) => {
        const isSelected = selectedModels.includes(model.id);
        return (
          <button
            key={model.id}
            onClick={() => onToggleModel(model.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all",
              isSelected
                ? `${model.bgColor} ${model.color} border-current shadow-md`
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50"
            )}
          >
            <ModelIcon model={model.id} className={cn("h-5 w-5", isSelected ? model.color : "text-current")} />
            <span>{model.name}</span>
            {isSelected && (
              <span className="flex h-2 w-2 rounded-full bg-current" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { ModelIcon };
