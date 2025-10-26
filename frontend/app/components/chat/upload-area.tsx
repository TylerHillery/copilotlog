import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { useRef, useState } from "react";

import { Card } from "@/components/ui/card";

import type { Chat } from "../../state/app-context";
import { useApp } from "../../state/app-context";

export default function UploadArea() {
  const { dispatch } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Check file type
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setError("Please upload a JSON file");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large (max 5MB)");
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // For now, just convert to HTML string
      // We'll implement proper parsing later
      const html = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

      const chat: Chat = {
        id: crypto.randomUUID(),
        title: file.name.replace(".json", ""),
        html,
        shared: false,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: "ADD_CHAT", payload: chat });
    } catch (err) {
      setError("Invalid JSON file");
      console.error("Failed to parse JSON:", err);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    if (text) {
      try {
        const data = JSON.parse(text);
        const html = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

        const chat: Chat = {
          id: crypto.randomUUID(),
          title: `Chat ${new Date().toLocaleTimeString()}`,
          html,
          shared: false,
          createdAt: new Date().toISOString(),
        };

        dispatch({ type: "ADD_CHAT", payload: chat });
        setError(null);
      } catch {
        setError("Invalid JSON in clipboard");
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-dashed">
      {/* Upload area */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        aria-label="Upload chat file. Drag and drop, click to browse, or paste JSON"
        className={`
          relative p-12 text-center
          transition-all duration-200 cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${
            isDragging
              ? "bg-primary/10 border-primary scale-[1.01]"
              : "hover:bg-accent/30"
          }
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileInput}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className={`transition-transform duration-200 ${isDragging ? "scale-110" : ""}`}>
            <svg 
              className="w-16 h-16 text-primary"
              aria-hidden="true"
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {isDragging ? "Drop your chat here" : "Upload Chat"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop, click to browse, or paste JSON
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports VS Code Copilot chat.json files (max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div 
          className="p-4 bg-destructive/10 border-t border-destructive/20"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl" aria-hidden="true">⚠️</span>
            <div>
              <h4 className="text-sm font-semibold text-destructive">Upload failed</h4>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
