"use client";

import { useState } from "react";
import {
  Plus,
  Clock,
  Settings,
  Shield,
  MessageSquare,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNewChat: () => void;
}

const historyItems = [
  { id: 1, title: "Compare AI writing styles", date: "Today" },
  { id: 2, title: "Code review comparison", date: "Today" },
  { id: 3, title: "Marketing copy analysis", date: "Yesterday" },
  { id: 4, title: "Technical documentation", date: "Yesterday" },
  { id: 5, title: "Creative story prompt", date: "Mar 23" },
  { id: 6, title: "API design discussion", date: "Mar 22" },
];

export function Sidebar({ darkMode, onToggleDarkMode, onNewChat }: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            History
          </span>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] px-2">
          <div className="space-y-1">
            {historyItems.map((item) => (
              <button
                key={item.id}
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 truncate">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Settings Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="space-y-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Settings</span>
          </button>
          
          {showSettings && (
            <div className="ml-6 space-y-1 py-2">
              <button
                onClick={onToggleDarkMode}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          )}
          
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>Privacy</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
