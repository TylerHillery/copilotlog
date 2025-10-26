import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useApp, useFilteredChats } from "../../state/app-context";

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const filteredChats = useFilteredChats();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <svg 
            className="w-8 h-8 text-sidebar-primary" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div>
            <h1 className="text-xl font-semibold text-sidebar-foreground">
              CopilotLog
            </h1>
            <p className="text-sm text-muted-foreground">
              Clear Skies Ahead
            </p>
          </div>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider">
            Your Chats
          </h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {filteredChats.length}
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-4">
          {(["all", "shared", "unshared"] as const).map((filter) => (
            <Button
              key={filter}
              onClick={() => dispatch({ type: "SET_FILTER", payload: filter })}
              variant={state.filter === filter ? "default" : "secondary"}
              size="sm"
              className="flex-1"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>

        {/* Chat list */}
        {filteredChats.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3 opacity-50">☁️</div>
            <p className="text-sm text-muted-foreground font-medium">
              No chats yet
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Upload a chat.json to get started
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                onClick={() =>
                  dispatch({ type: "SELECT_CHAT", payload: chat.id })
                }
                className={`
                  cursor-pointer transition-all hover:shadow-md hover:border-primary/50
                  ${
                    state.selectedChatId === chat.id
                      ? "ring-2 ring-primary bg-accent/30"
                      : ""
                  }
                `}
              >
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate text-card-foreground">
                        {chat.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {chat.shared && (
                      <Badge variant="secondary" className="shrink-0">Shared</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
