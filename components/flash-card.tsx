"use client";

import { useState } from "react";
import { Download, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { type AIModel, ModelIcon } from "./model-selector";
import ReactMarkdown from "react-markdown";

interface FlashCardProps {
  model: AIModel;
  content: string;
  isLoading: boolean;
}

const modelMeta: Record<AIModel, { name: string; color: string; bgColor: string; borderColor: string }> = {
  chatgpt: { 
    name: "ChatGPT", 
    color: "text-emerald-600 dark:text-emerald-400", 
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    borderColor: "border-emerald-200 dark:border-emerald-800"
  },
  gemini: { 
    name: "Gemini", 
    color: "text-blue-600 dark:text-blue-400", 
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  claude: { 
    name: "Claude", 
    color: "text-orange-600 dark:text-orange-400", 
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  grok: { 
    name: "Grok", 
    color: "text-gray-800 dark:text-gray-200", 
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
    borderColor: "border-gray-200 dark:border-gray-700"
  },
};

export function FlashCard({ model, content, isLoading }: FlashCardProps) {
  const [copied, setCopied] = useState(false);
  const meta = modelMeta[model];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    // Create a simple text-based PDF download
    const blob = new Blob([`${meta.name} Response\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${meta.name.toLowerCase()}-response.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md",
        meta.borderColor
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center gap-2 border-b px-4 py-3", meta.bgColor, meta.borderColor)}>
        <ModelIcon model={model} className={cn("h-5 w-5", meta.color)} />
        <h3 className={cn("font-semibold", meta.color)}>{meta.name}</h3>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex h-full min-h-[200px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className={cn("h-8 w-8 animate-spin", meta.color)} />
              <p className="text-sm text-muted-foreground">Generating response...</p>
            </div>
          </div>
        ) : content ? (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center">
            <p className="text-center text-sm text-muted-foreground">
              Enter a prompt above to get a response from {meta.name}
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {content && !isLoading && (
        <div className={cn("flex items-center justify-end gap-2 border-t px-4 py-3", meta.borderColor)}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadPDF}
            className="text-muted-foreground hover:text-foreground"
          >
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
}

export default FlashCard;