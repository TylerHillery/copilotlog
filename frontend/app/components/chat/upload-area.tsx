import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { useApp } from "../../state/app-context";
import type { Chat } from "../../state/app-context";

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
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
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
      } catch (err) {
        setError("Invalid JSON in clipboard");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 scale-[1.02]"
              : "border-sky-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600"
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
        />

        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className="text-6xl">✈️</div>

          {/* Text */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {isDragging ? "Drop your chat here" : "Upload Chat"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Drag & drop, click to browse, or paste JSON
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Supports VS Code Copilot chat.json files (max 5MB)
            </p>
          </div>

          {/* Button hint */}
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-medium rounded-full">
              Click to upload
            </span>
            <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
              Cmd/Ctrl + V to paste
            </span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">
                Upload failed
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
