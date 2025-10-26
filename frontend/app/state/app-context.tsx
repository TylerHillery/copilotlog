import type { Dispatch, ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

// Storage keys
const STORAGE_KEYS = {
  CHATS: "copilotlog_chats",
  SELECTED: "copilotlog_selected",
  VERSION: "copilotlog_version",
  THEME: "copilotlog_theme",
} as const;

const STORAGE_VERSION = 1;

// Types
export interface Chat {
  id: string;
  title: string;
  html: string;
  shared: boolean;
  createdAt: string;
}

export interface AppState {
  user: null | { id: string; name: string; avatar?: string };
  chats: Chat[];
  selectedChatId: string | null;
  filter: "all" | "shared" | "unshared";
  theme: "light" | "dark";
  ui: {
    sidebarOpen: boolean;
    uploadMode: "file" | "paste" | null;
  };
}

type Action =
  | { type: "SET_USER"; payload: AppState["user"] }
  | { type: "ADD_CHAT"; payload: Chat }
  | { type: "UPDATE_CHAT"; payload: { id: string; updates: Partial<Chat> } }
  | { type: "DELETE_CHAT"; payload: string }
  | { type: "SELECT_CHAT"; payload: string | null }
  | { type: "SET_CHATS"; payload: Chat[] }
  | { type: "SET_FILTER"; payload: AppState["filter"] }
  | { type: "SET_THEME"; payload: AppState["theme"] }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_UPLOAD_MODE"; payload: AppState["ui"]["uploadMode"] };

// Initial state
const initialState: AppState = {
  user: null,
  chats: [],
  selectedChatId: null,
  filter: "all",
  theme: "light",
  ui: {
    sidebarOpen: false, // Start collapsed for anonymous users
    uploadMode: null,
  },
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "ADD_CHAT":
      return {
        ...state,
        chats: [action.payload, ...state.chats],
        selectedChatId: action.payload.id,
        // Open sidebar when first chat is added
        ui: {
          ...state.ui,
          sidebarOpen: true,
        },
      };

    case "UPDATE_CHAT":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.id
            ? { ...chat, ...action.payload.updates }
            : chat
        ),
      };

    case "DELETE_CHAT":
      return {
        ...state,
        chats: state.chats.filter((chat) => chat.id !== action.payload),
        selectedChatId:
          state.selectedChatId === action.payload
            ? null
            : state.selectedChatId,
      };

    case "SELECT_CHAT":
      return { ...state, selectedChatId: action.payload };

    case "SET_CHATS":
      return { ...state, chats: action.payload };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
      };

    case "SET_UPLOAD_MODE":
      return {
        ...state,
        ui: { ...state.ui, uploadMode: action.payload },
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
    }
  | undefined
>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    // Hydrate from localStorage on init
    if (typeof window === "undefined") return initial;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHATS);
      const selectedId = localStorage.getItem(STORAGE_KEYS.SELECTED);
      const version = localStorage.getItem(STORAGE_KEYS.VERSION);
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      
      // Use stored theme if exists, otherwise detect from system preference
      const theme: AppState["theme"] =
        storedTheme === "dark" || storedTheme === "light"
          ? storedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

      // Theme is already applied by inline script in root.tsx

      if (stored && version === String(STORAGE_VERSION)) {
        const chats = JSON.parse(stored) as Chat[];
        return {
          ...initial,
          chats,
          selectedChatId: selectedId,
          theme,
          // Open sidebar if user has chats
          ui: {
            ...initial.ui,
            sidebarOpen: chats.length > 0,
          },
        };
      } else {
        // Load theme even if no chats stored
        return {
          ...initial,
          theme,
        };
      }
    } catch (error) {
      console.error("Failed to hydrate from localStorage:", error);
    }

    return initial;
  });

  // Sync to localStorage when chats change
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(state.chats));
      localStorage.setItem(STORAGE_KEYS.VERSION, String(STORAGE_VERSION));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [state.chats]);

  // Sync selected chat to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (state.selectedChatId) {
        localStorage.setItem(STORAGE_KEYS.SELECTED, state.selectedChatId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED);
      }
    } catch (error) {
      console.error("Failed to save selected chat:", error);
    }
  }, [state.selectedChatId]);

  // Sync theme to localStorage and apply to document
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      
      // Apply theme to document
      const root = document.documentElement;
      root.classList.toggle("dark", state.theme === "dark");
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

// Selectors
export function useSelectedChat() {
  const { state } = useApp();
  return state.chats.find((chat) => chat.id === state.selectedChatId) || null;
}

export function useFilteredChats() {
  const { state } = useApp();
  if (state.filter === "all") return state.chats;
  if (state.filter === "shared")
    return state.chats.filter((chat) => chat.shared);
  return state.chats.filter((chat) => !chat.shared);
}
