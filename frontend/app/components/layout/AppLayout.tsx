import { useApp } from "../../state/AppContext";
import ThemeToggle from "./ThemeToggle";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function AppLayout({ children, sidebar }: AppLayoutProps) {
  const { state, dispatch } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Sidebar */}
      <aside
        className={`
          ${state.ui.sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-80 
          card border-r border-sky-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out
        `}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Sidebar toggle - only show if user has chats or is logged in */}
              {(state.chats.length > 0 || state.user) && (
                <button
                  onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <svg
                    className="w-6 h-6 text-slate-700 dark:text-slate-300"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              {/* Logo/Title */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">✈️</span>
                <h1 className="text-lg font-bold text-sky-900 dark:text-sky-100">
                  CopilotLog
                </h1>
              </div>
            </div>

            {/* Auth button */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {!state.user && (
                <button className="btn-accent text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Log in with GitHub
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {state.ui.sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40"
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
        />
      )}
    </div>
  );
}
