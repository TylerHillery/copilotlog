# CopilotLog - Project Plan

## 🌟 Goal

A lightweight web app where users can:

- Upload or paste VS Code Copilot chat.json files
- Instantly preview and copy rendered HTML (no login required)
- If logged in, save chats and generate shareable links
- Share chats through clean URLs (e.g., copilotlog.com/s/:id)

## 🎨 Design Theme: Aviation / Pilot

Lean into the "copilot" theme with clouds, sky, and aviation aesthetics.

### Color Palette

#### Clear Skies ☀️ (Light Mode)
- **Background**: Soft sky blue gradient (`sky-50` to `blue-50`)
- **Cards/Surfaces**: Cloud white with subtle shadows (`white` with cloud shadows)
- **Primary**: Aviation blue (`sky-600`, `blue-600`)
- **Accents**: Sunset orange/amber for CTAs (`amber-500`, `orange-500`)
- **Text**: Deep navy (`slate-900`, `gray-900`)

#### Night Flight 🌙 (Dark Mode)
- **Background**: Deep midnight blue (`slate-950` with blue tint)
- **Cards/Surfaces**: Darker clouds (`slate-900`, `slate-800`)
- **Primary**: Bright sky blue (`sky-400`, `cyan-400`)
- **Accents**: Warm golden glow (`amber-400`)
- **Text**: Cloud white (`slate-50`, `gray-50`)

### Visual Elements
- **Icons**: Airplane, cloud, compass, altitude symbols
- **Illustrations**: Pilots, planes, clouds for empty states
- **Animations**: 
  - Clouds drifting in background
  - Plane taking off on upload
  - Smooth altitude changes (scroll effects)
- **Typography**: Aviation-inspired fonts for headings (e.g., "Outfit" or "Space Grotesk")

## 🧱 Core User Flows

### 1. Anonymous User

1. Visits `/`
2. Uploads chat.json (via file picker, drag & drop, or paste)
3. App parses and renders preview
4. User can:
   - Copy HTML
   - Rename chat locally
   - See a "Sign in with GitHub" prompt in sidebar
5. Chats are stored in localStorage so they persist across refresh

### 2. Logged-in User

1. Visits `/`
2. App loads their saved chats from backend
3. They can:
   - Upload new chats (saved to backend)
   - Select an existing chat → navigates to `/chats/:id`
   - Rename chat titles
   - Share/unshare chats (toggle)
   - Copy shareable URL
   - Filter sidebar by shared/unshared
   - Multi-select chats to batch share/unshare

### 3. Shareable Link

1. Anyone visits `/s/:id`
2. App loads the chat from public endpoint (no login required)
3. Displays HTML-only preview (no sidebar, no editing)
4. Fast, minimal view for sharing
5. **No SEO indexing** - includes `noindex, nofollow` meta tags

## 🌐 Route Structure

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Upload UI, preview, sidebar. Main hub for both anonymous and logged-in users. Content adapts based on auth state. |
| `/chats/:id` | Logged in | Same layout as `/` but loads a specific saved chat. |
| `/s/:id` | Public | Read-only preview of a shared chat. No sidebar, no editing. Not indexed by search engines. |

👉 **Only 3 routes** → clean and easy to maintain.

## 🧭 Frontend Architecture

### Component Structure

```
app/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx         # Sidebar + main content
│   │   └── Sidebar.tsx           # Profile, chat list, filters
│   ├── chat/
│   │   ├── UploadArea.tsx        # drag/drop, paste, file input
│   │   ├── ChatPreview.tsx       # renders HTML
│   │   ├── ChatList.tsx          # list of chats
│   │   ├── ChatFilter.tsx        # filter shared/unshared
│   │   └── EmptyState.tsx        # "Upload your first chat" with sky illustrations
│   ├── auth/
│   │   └── ProfileButton.tsx     # Login/profile dropdown
│   ├── buttons/
│   │   └── CopyButton.tsx        # Copy HTML to clipboard
│   ├── ui/
│   │   ├── Button.tsx            # Reusable with sky theme variants
│   │   ├── Card.tsx              # Cloud-styled cards
│   │   ├── Badge.tsx             # For "shared" indicators
│   │   └── Toast.tsx             # Success/error notifications
│   └── common/
│       └── LoadingSpinner.tsx    # Loading states
├── routes/
│   ├── index.tsx                 # `/` - Main hub
│   ├── chats.$id.tsx             # `/chats/:id` - Specific chat
│   └── s.$id.tsx                 # `/s/:id` - Shared read-only
└── state/
    └── AppContext.tsx            # Global state (React Context + useReducer)
```

### State Management

Using React's built-in Context + useReducer (no external deps).

```typescript
interface Chat {
  id: string
  title: string
  html: string
  shared: boolean
}

interface AppState {
  user: null | { id: string; name: string; avatar?: string }
  chats: Chat[]
  selectedChatId: string | null
  filter: 'all' | 'shared' | 'unshared'
  ui: {
    sidebarOpen: boolean  // For mobile
    uploadMode: 'file' | 'paste' | null
  }
}
```

### LocalStorage Strategy

```typescript
// Namespace localStorage keys
const STORAGE_KEYS = {
  CHATS: 'copilotlog_chats',
  SELECTED: 'copilotlog_selected',
  THEME: 'copilotlog_theme'
}

// Add versioning for future migrations
interface StorageData {
  version: number
  chats: Chat[]
}
```

## 🧰 Key Features

| Feature | Status | Implementation Notes |
|---------|--------|---------------------|
| Upload JSON | ✅ MVP | File input / drag-drop / paste area, parse & render |
| Preview & Copy HTML | ✅ MVP | Render parsed HTML + "Copy" button |
| Local storage persistence | ✅ MVP | Anonymous users keep their chats |
| Authentication (GitHub) | 🔜 Phase 2 | Use Supabase OAuth |
| Save & manage chats | 🔜 Phase 2 | Store in backend after login |
| Share/unshare chats | 🔜 Phase 2 | Generate `/s/:id` links, toggle shared |
| Shared read-only view | 🔜 Phase 2 | Minimal UI for public viewing |
| JSON validation | 🔜 Phase 2 | Use Zod for schema validation |
| HTML sanitization | 🔜 Phase 2 | Use DOMPurify before rendering |
| Chat filtering & multi-select | 🧭 Phase 3 | For power users managing many chats |
| Markdown export (optional) | 🧭 Future | Transform chat data to markdown |

## 🪝 Hooks and State

- **useState** for small local UI concerns (e.g., drag/drop hover)
- **useReducer + createContext** for global state
  - Handles user, chats, selected chat
  - Easily dispatch actions from anywhere
- **useEffect** for:
  - Syncing chats to localStorage
  - Hydrating state on load
  - Loading chat by URL param (`/chats/:id`)

## 🪪 Auth & Backend (Phase 2)

Use **Supabase** for:
- GitHub OAuth login
- User profile storage
- Storing chats (id, title, html, shared flag)

### REST Endpoints

- `GET /api/chats` - List user's chats
- `GET /api/chats/:id` - Get specific chat (auth required for private, public for shared)
- `POST /api/chats` - Create new chat
- `PATCH /api/chats/:id` - Update chat (title, shared flag)
- `DELETE /api/chats/:id` - Delete chat
- `GET /api/public/:id` - Public endpoint for `/s/:id` (no auth required)

## 🧭 Development Phases

### 🟢 Phase 1 — MVP

**Goal**: Get core functionality working with local storage only.

- [ ] Upload + preview + copy HTML
- [ ] Local state management (Context + useReducer)
- [ ] Sidebar with local chat list
- [ ] Persistent chats via localStorage
- [ ] Aviation/pilot theme (Clear Skies & Night Flight)
- [ ] Responsive design
- [ ] Basic error handling
- [ ] URL: only `/` (no auth yet)

**Timeline**: 1-2 weeks

### 🟡 Phase 2 — Auth & Share

**Goal**: Add authentication and sharing capabilities.

- [ ] GitHub login via Supabase
- [ ] Save chats to backend
- [ ] `/chats/:id` route
- [ ] `/s/:id` public shareable link with `noindex` meta tags
- [ ] Share/unshare toggle
- [ ] JSON validation with Zod
- [ ] HTML sanitization with DOMPurify
- [ ] Migrate localStorage chats to backend on first login

**Timeline**: 2-3 weeks

### 🟠 Phase 3 — Power Features

**Goal**: Advanced features for power users.

- [ ] Chat filtering (shared/unshared)
- [ ] Multi-select share/unshare
- [ ] Title editing
- [ ] Search functionality
- [ ] Keyboard shortcuts (`Cmd+V` to paste, `Cmd+C` to copy)
- [ ] Chat thumbnails (preview first message)
- [ ] Markdown export (optional)

**Timeline**: 1-2 weeks

## 🧭 Tech Stack

- **Frontend**: React + React Router v7 + TailwindCSS v4
- **State**: React Context + useReducer
- **Auth & DB**: Supabase
- **Validation**: Zod (Phase 2)
- **Sanitization**: DOMPurify (Phase 2)
- **Hosting**: Vercel / Netlify (or any static host + serverless functions)

## 🚀 Quick Wins for Better UX

1. **Keyboard shortcuts**: `Cmd+V` to paste, `Cmd+C` to copy HTML
2. **Auto-save indicator**: "Saved locally" toast
3. **Chat thumbnails**: Show first message as preview
4. **Search**: Filter chats by title (Phase 3)
5. **Dark mode toggle**: Manual override with sun/moon icon
6. **File size limits**: Max 5MB for uploads
7. **Upload progress**: For larger files

## 🎯 Phase 1 MVP Priorities

### Week 1 - Core Upload & Preview
1. ✅ Set up routing structure
2. ✅ Create AppLayout + Sidebar
3. ✅ Build UploadArea with drag/drop + paste
4. ✅ Parse JSON and render preview
5. ✅ Implement localStorage persistence
6. ✅ Copy HTML to clipboard

### Week 2 - Polish & Theme
1. ✅ Apply pilot/sky theme (colors, shadows, spacing)
2. ✅ Add animations (clouds drifting, smooth transitions)
3. ✅ Responsive design (mobile-first)
4. ✅ Error states and loading spinners
5. ✅ Empty states with encouraging copy

## 📝 Implementation Notes

### Security Considerations
- **XSS Prevention**: Sanitize all HTML with DOMPurify before rendering (Phase 2)
- **File Size Limits**: Enforce max 5MB uploads to prevent abuse
- **Rate Limiting**: Add on backend for sharing endpoints (Phase 2)
- **CORS**: Configure properly for Supabase integration

### SEO Strategy
- Main pages (`/`, `/chats/:id`): Normal SEO
- Shared links (`/s/:id`): `noindex, nofollow` - keep them unlisted
- No Open Graph tags needed for shared links

### Accessibility
- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- Focus management for modals/dropdowns
- Color contrast meeting WCAG AA standards

### Performance
- Code splitting per route
- Lazy load heavy components
- Optimize images/illustrations
- Cache static assets

## ✅ Why This Plan Works

1. **Lightweight early** - No complex dependencies for MVP
2. **Built-in React features** - Context + useReducer, no Redux needed
3. **Clean URL structure** - Only 3 routes, easy to reason about
4. **Natural upgrade path** - MVP → Auth → Sharing flows logically
5. **Easy to maintain** - Simple architecture, clear component boundaries
6. **Cohesive theme** - Aviation/pilot metaphor throughout
7. **Privacy-first** - localStorage for anonymous users, no SEO for shared links

---

**Status**: ✅ Plan finalized and ready for implementation

**Next Steps**: Begin Phase 1 MVP development
