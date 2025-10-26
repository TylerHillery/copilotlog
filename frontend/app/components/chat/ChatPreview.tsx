import { useState } from "react";
import { useSelectedChat } from "../../state/AppContext";

export default function ChatPreview() {
  const selectedChat = useSelectedChat();
  const [copied, setCopied] = useState(false);

  if (!selectedChat) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="text-8xl mb-6">☁️</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Ready for takeoff
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
          Upload a VS Code Copilot chat to preview and copy the HTML.
          Your chats are saved locally in your browser.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedChat.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between gap-4 p-6 card">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
            {selectedChat.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Created {new Date(selectedChat.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${
                copied
                  ? "bg-green-500 text-white"
                  : "btn-primary"
              }
            `}
          >
            {copied ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy HTML
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Preview
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {Math.round(selectedChat.html.length / 1024)}KB
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-6 overflow-auto max-h-[600px]">
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedChat.html }}
          />
        </div>
      </div>

      {/* Info card */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              Anonymous mode
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Your chat is saved locally in your browser. Sign in to share it with others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
