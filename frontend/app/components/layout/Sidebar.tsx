import { useApp, useFilteredChats } from "../../state/app-context";

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const filteredChats = useFilteredChats();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sky-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="text-3xl">✈️</div>
          <div>
            <h1 className="text-xl font-bold text-sky-900 dark:text-sky-100">
              CopilotLog
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Clear Skies Ahead
            </p>
          </div>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Your Chats
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {filteredChats.length}
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-4">
          {(["all", "shared", "unshared"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => dispatch({ type: "SET_FILTER", payload: filter })}
              className={`
                px-3 py-1 text-xs font-medium rounded-md transition-colors
                ${
                  state.filter === filter
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }
              `}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Chat list */}
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">☁️</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No chats yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Upload a chat.json to get started
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() =>
                  dispatch({ type: "SELECT_CHAT", payload: chat.id })
                }
                className={`
                  w-full text-left p-3 rounded-lg transition-all
                  ${
                    state.selectedChatId === chat.id
                      ? "bg-sky-100 dark:bg-sky-900/30 border-2 border-sky-400 dark:border-sky-600"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`
                      text-sm font-medium truncate
                      ${
                        state.selectedChatId === chat.id
                          ? "text-sky-900 dark:text-sky-100"
                          : "text-slate-900 dark:text-slate-100"
                      }
                    `}
                    >
                      {chat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {chat.shared && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded">
                      Shared
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
