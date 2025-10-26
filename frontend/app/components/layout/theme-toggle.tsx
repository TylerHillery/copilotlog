import { useApp } from "../../state/app-context";

export default function ThemeToggle() {
  const { state, dispatch } = useApp();

  const toggleTheme = () => {
    // Simple toggle: light <-> dark
    const newTheme = state.theme === "dark" ? "light" : "dark";
    dispatch({ type: "SET_THEME", payload: newTheme });
  };

  const isDark = state.theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-accent rounded-lg transition-colors text-foreground"
      aria-label={`Toggle theme. Current: ${state.theme} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon - Light mode */}
        <svg
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* Moon icon - Dark mode */}
        <svg
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
}
