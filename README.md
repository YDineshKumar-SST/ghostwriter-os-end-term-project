# 🚀 GhostWriter OS - AI Persona Command Center

A centralized dashboard for managing multiple AI-themed blog personas across different platforms (Hashnode, Dev.to, Medium). Built with React, Vite, Tailwind CSS, and designed with a keyboard-first, terminal-inspired workflow.

---

## 🧠 Problem Statement

Creators and technical writers often maintain multiple publication personas across platforms like Hashnode, Dev.to, and Medium. Managing drafts, brand voice, and publication status separately is slow, fragmented, and hard to scale. GhostWriter OS solves this by giving users a single dashboard for persona-aware content planning, draft management, and publishing workflows.

- **User**: Technical blogger, content marketer, or AI writer managing multiple publication identities.
- **Problem**: Fragmented content workflows across platforms, scattered draft tracking, and weak persona consistency.
- **Why it matters**: Saves time, improves brand consistency, and turns content management into a more deliberate system.

## 📌 Current Project Status

### Implemented
- Functional React app with Tailwind UI
- Dashboard with persona-based content filtering
- CRUD operations for persona-specific content
- Keyboard command palette with Cmd/Ctrl+K
- Context API for global persona and auth state
- React Router with lazy-loaded protected routes
- Layout persistence via localStorage
- Responsive dark UI and analytics cards
- Supabase auth and database integration ready for persistence
- Demo mode enabled when Supabase credentials are not configured
- AI recommendation engine for completion guidance

### Deployment readiness
- ✅ Backend integration scaffolding is in place
- ✅ Authentication and protected routes enabled
- ✅ Persistent data model prepared for Supabase
- ✅ AI-driven next-action suggestions are implemented
- ✅ `.env.example` added for Supabase credentials

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Setup & Installation](#setup--installation)
6. [Components Documentation](#components-documentation)
7. [Context & State Management](#context--state-management)
8. [Custom Hooks](#custom-hooks)
9. [Keyboard Shortcuts](#keyboard-shortcuts)
10. [Data Models](#data-models)
11. [How to Add New Features](#how-to-add-new-features)
12. [Future Roadmap](#future-roadmap)
13. [Styling Guide](#styling-guide)

---

## 🎯 Project Overview

**GhostWriter OS** is a blog content management system designed for creators managing multiple personas across different platforms. Instead of switching between Hashnode, Dev.to, and Medium dashboards, everything is centralized here with:

- **5 Pre-built Personas**: Tech Guru, Dev Insights, AI Whisperer, Code Ninja, Future Tech
- **Content CRUD**: Create, edit, delete blog drafts with status tracking (Draft/Published)
- **Analytics Dashboard**: Quick stats on persona health, post counts, targets
- **AI Assistant**: Refreshable plan recommendations, topic queue generation, and content idea sequencing
- **Keyboard-First UX**: Cmd+K (Mac) or Ctrl+K (Windows/Linux) for instant command access
- **Dark Terminal UI**: Professional, eye-friendly dark theme with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

---

## 📌 What is this project about?

GhostWriter OS helps content creators organize, plan, and publish persona-driven content from one interface. It is built to support multiple content brands or author personalities at once, giving each persona its own goal tracking, recommendation engine, and publishing workflow.

The project blends:
- persona-specific content planning
- intelligent AI assistance
- quick drafts and publishing workflows
- data-driven analytics for consistency and growth

This is not just a blogging tool. It is a persona-aware command center that makes content creation repeatable, clear, and easier to manage.

---

## 💡 How this project helps

### 1. Reduce context switching
Creators no longer need separate dashboards for different platforms. Each persona has its own workspace, making it easier to stay focused on one content identity at a time.

### 2. Improve planning and content flow
AI recommendations help reduce wasted time by suggesting next topics, trimming the plan to a single actionable item, automatically generating a new blog topic when you refresh the AI plan, and building a queue of future topic ideas.

### 3. Maintain consistency
The analytics dashboard measures publishing rhythm, draft health, and audience-focused content gaps so creators can stay consistent with fewer manual checks.

### 4. Speed up content production
The AI Blog Generator and comment generator accelerate drafts, helping creators move from idea to publishable content faster.

### 5. Present a polished, modern workflow
The UI is designed as a terminal-inspired, dark-mode command center that feels modern and professional for creators who want a premium workspace.

---

## 🚀 Who should use it?

This project is ideal for:
- technical bloggers managing multiple niches
- marketing teams keeping separate brand voices
- creators publishing on Medium, Dev.to, Hashnode, and similar platforms
- anyone who wants persona-driven content planning with AI support

---

## 🧭 How to use GhostWriter OS

### Step 1: Choose a persona
Open the dashboard, then click a persona card to switch the active persona and filter posts by that identity.

### Step 2: Review the AI plan
Use the **Refresh AI plan** button to see a single recommendation, add a new topic to the queued ideas list, and automatically update the blog generator input with a fresh topic suggestion.

### Step 3: Generate content
Enter a topic into the blog topic field and click **Generate blog**. AI produces a draft you can review and publish as a new persona post.

### Step 4: Manage drafts
Use the quick add modal to create new content ideas, edit existing drafts, or delete posts. Posts are filtered by the selected persona.

### Step 5: Check analytics
Open the analytics page to see performance insights, content health, and recommendations for the current persona.

---

## 🎬 Demo video overview

A short demo video should cover the following steps:

1. **Intro screen**
   - Show the GhostWriter OS dashboard
   - Explain the concept of persona-driven content management

2. **Persona switch**
   - Click a persona card
   - Highlight the persona details and brand color

3. **Refresh AI plan**
   - Press the **Refresh AI plan** button
   - Show how the recommendation is reduced to one note
   - Show the blog topic input updating with a new suggested topic

4. **Generate blog content**
   - Enter a topic or use the auto-generated topic
   - Click **Generate blog**
   - Show the generated draft content

5. **Publish draft**
   - Publish the blog draft
   - Show the new post added to the persona list

6. **Analytics view**
   - Navigate to Analytics
   - Show content performance and AI recommendations

### Suggested script for a 90-second video

- "This is GhostWriter OS, a persona-based content command center for creators."
- "You can switch personas and keep each brand's content separate."
- "Refresh the AI plan and you'll get a single focused recommendation plus a fresh topic idea."
- "Generate a blog draft in seconds, then publish it to the current persona."
- "Finally, use analytics to track content health and plan your next move."

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 19.2.4 | Component-based UI |
| **Build Tool** | Vite 8.0.4 | Fast HMR & production builds |
| **Routing** | React Router 7.14.1 | Page navigation & lazy loading |
| **Styling** | Tailwind CSS 3.4.4 | Utility-first dark theme |
| **Icon Library** | Lucide React 1.8.0 | 400+ SVG icons |
| **State Management** | Context API | Global persona state |
| **PostCSS** | v8.5.10 | CSS processing for Tailwind |
| **Autoprefixer** | v10.5.0 | Browser compatibility |
| **Backend (Future)** | Supabase | PostgreSQL + Auth + Storage |

**Dependencies installed in**: `d:\code\REACT\end term project\rnd term project\`

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root app wrapper, header nav, router setup
├── index.css                  # Tailwind imports + global dark theme styles
├── main.jsx                   # React DOM mount point
├── App.css                    # Component-specific styles (if needed)
│
├── components/                # Reusable UI components
│   ├── CommandPalette.jsx      # Cmd+K search/nav component (keyboard-first)
│   ├── PersonaStats.jsx        # Analytics cards (memo-optimized)
│   └── QuickAddModal.jsx       # Modal for add/edit blog posts
│
├── pages/                     # Route page components (lazy-loaded)
│   ├── Dashboard.jsx          # Main content page with posts table/grid + CRUD
│   └── Settings.jsx           # Persona & workspace settings
│
├── context/                   # Global state management
│   └── PersonaContext.jsx     # Persona state + usePersona hook
│
├── hooks/                     # Custom React hooks
│   └── useLocalStorage.js     # Persist layout preference to localStorage
│
└── services/                  # API/external service calls (empty, ready for Supabase)
    └── (future: supabase.js, api.js, auth.js, etc.)
```

---

## ✨ Features

### 1. **Multi-Persona Management** 
- Switch between 5 blog personas instantly
- Each persona has unique: name, platform, niche, brand color
- Context API keeps state synced globally

### 2. **Content Dashboard**
- View all posts for selected persona
- **Table view**: Title, Platform, Status, Date, Edit/Delete actions
- **Grid view**: Beautiful card layout with hover animations
- Real-time search by post title
- 7 mock posts pre-loaded for demo

### 3. **CRUD Operations**
- **Create**: Click "Quick Add" → Modal → Fill details → Save
- **Read**: View in table or grid, auto-filtered by persona
- **Update**: Click Edit → Modal pre-fills → Update title/status/platform
- **Delete**: Click trash icon → Instant removal

### 4. **Analytics Dashboard** 
- **AI-Powered Content Insights**: Analyzes your publishing patterns and provides strategic recommendations
- **Performance Metrics**: Track total posts, published count, engagement rates, consistency scores
- **Persona Health Tracking**: Monitor each persona's content pipeline health
- **Content Gap Analysis**: Get AI recommendations on missing content types
- **Posting Schedule Optimization**: Receive data-driven posting time recommendations
- **Growth Opportunities**: Discover collaboration and cross-platform opportunities
- **Refresh Analysis Button**: Run fresh analysis with one click
- **Automatic Fallback**: Uses offline analysis when API is unavailable

### 5. **AI Features** (Configurable in Settings)
- **Blog Post Generation**: Generate comprehensive blog posts with AI
  - Customizable by persona niche
  - 1500-token in-depth content
  - Sections and conclusion included
  
- **Trending Topics**: Get trending topic ideas for your niche
  - 5 curated topic suggestions
  - Includes engagement potential estimates
  - Platform recommendations (YouTube, Blog, TikTok, etc.)
  - Current trend analysis
  
- **Vlog Descriptions**: Generate video content scripts and metadata
  - Engaging video titles (max 60 chars)
  - Compelling descriptions
  - 5 key talking points
  - Relevant tags
  - Optimal video length recommendations
  
- **Smart Comments**: Generate authentic engagement comments
  - Thoughtful and platform-appropriate
  - Based on post content
  - Multiple suggestions for variety
  
- **Performance Analyzer**: Detailed content performance analysis
  - Strategy assessment
  - Consistency scoring (1-10)
  - Content gap identification
  - Recommended posting schedules
  - Growth opportunity mapping

### 6. **Resilient API Handling** ⚡
- **Automatic Retry Logic**: Handles 503 and 429 errors with exponential backoff
  - Up to 3 retry attempts
  - Exponential backoff: 1s → 2s → 4s
  - Smart error detection
  
- **Error Graceful Fallback**: Works offline when API is unavailable
  - Pre-computed local recommendations
  - Mock analytics data
  - Smooth UX even without AI API
  
- **Custom AI Provider Support**: Configure any OpenAI-compatible API
  - Custom endpoint URLs
  - Custom header names for API keys
  - Bearer token or custom header support

### 7. **Command Palette** (Keyboard-First)
- **Open**: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
- **Close**: Escape key
- Search & switch personas
- Navigate to Dashboard or Settings
- Fuzzy search on all available commands

### 8. **Dark Terminal Theme**
- Professional slate/gray palette (#07080d background)
- Sky-blue accents (#0ea5e9) for CTAs
- Smooth transitions on all interactive elements
- Mobile-first responsive design with Tailwind
- Fully optimized for dark mode

### 9. **Layout Persistence**
- Save List vs Grid preference to browser localStorage
- Auto-restore on page reload
- Uses custom `useLocalStorage` hook

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** 16+
- **npm** or **yarn**
- **Git** (optional)

### Quick Start

```bash
# 1. Navigate to project
cd "d:\code\REACT\end term project\rnd term project"

# 2. Install dependencies (if needed)
npm install

# 3. Copy the example env file and set Supabase values
copy .env.example .env
# then edit .env with your Supabase URL and ANON key

# 4. Start development server
npm run dev
```

> If port 5173 is already in use, Vite may start on the next available port, such as `http://localhost:5174`.
>
> If Supabase credentials are missing, the app still loads using local sample content, but auth and persistent storage require `.env` to be configured.

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Output: dist/ folder (ready to deploy)
```

### Linting

```bash
npm run lint
```

---

## 📦 Components Documentation

### **App.jsx** (Root Component)
Root wrapper with routing, header navigation, and command palette.

**Structure**
```jsx
<PersonaProvider>
  <Router>
    <header>                    // Sticky top nav with logo + nav links
    <main>
      <Suspense>              // Lazy loading boundary
        <Routes>              // Dashboard & Settings routes
    <CommandPalette />        // Cmd+K modal (overlays all pages)
```

**Header Navigation**
- Logo/Brand: "GhostWriter OS - AI Persona Command Center"
- Nav links: Dashboard, Settings (with active state styling)
- Keyboard hint: "Cmd+K" badge

**Styling**: Dark theme with backdrop-blur header, sticky positioning

---

### **Dashboard.jsx** (Main Content Page)
Complete content management interface with analytics, search, and CRUD.

**State Variables**
```javascript
const [posts, setPosts] = useState(initialPosts);          // All blog posts
const [search, setSearch] = useState("");                 // Search filter
const [isModalOpen, setIsModalOpen] = useState(false);    // Modal visibility
const [editingPost, setEditingPost] = useState(null);     // Current post being edited
const [layout, setLayout] = useLocalStorage("layout", "list"); // List or Grid view
```

**Key Methods**
- `handleAddPost(newPost)` → Append post to state
- `handleEditPost(updatedPost)` → Update existing post
- `handleDeletePost(id)` → Remove post by ID
- `openEditModal(post)` → Populate modal for editing

**UI Sections**
1. **Persona Header** (Top section)
   - Current persona name, platform, niche
   - Description of content focus
   - Brand color indicator

2. **Quick Persona Switcher** (Left grid)
   - 2-4 quick-switch buttons for personas
   - Highlights active persona
   - One-click to switch and filter posts

3. **Content Pulse Stats** (Right section)
   - Total posts live for persona
   - Published count
   - Draft count

4. **PersonaStats Component** (Full width)
   - 3 analytics cards with icons
   - Hover animations & transitions

5. **Controls Bar** (Above content)
   - Search input (real-time title filter)
   - Layout toggle: List vs Grid buttons
   - "Quick Add" button (opens modal)

6. **Content Display** (Main area)
   - **List view**: Table with columns (Title, Platform, Status, Date, Actions)
   - **Grid view**: 3-column responsive card layout
   - Empty state message if no posts match filters
   - Each row/card has Edit & Delete buttons

---

### **Settings.jsx** (Settings & Config Page)
Workspace settings and persona configuration.

**Features**
- Display current persona details (color swatch, name, platform, niche)
- Info cards explaining workflow
- Future space for advanced settings

**Content Sections**
1. **Persona Configuration Card**
   - Current persona overview
   - Settings & notes about workspace

2. **Info Cards** (3 columns)
   - Build workflow explanation
   - Live persona data notes (Supabase future integration)
   - Safe defaults information

3. **Persona Details Section**
   - Brand color swatch (colored box)
   - Persona focus/niche label

---

### **CommandPalette.jsx** (Keyboard Command Center)
Modal search interface for keyboard-driven navigation.

**Keyboard Controls**
- `Cmd+K` / `Ctrl+K` → Toggle open/close
- `Escape` → Close palette
- Arrow keys / Enter → Select action (standard browser behavior)
- Input auto-focuses when opened

**Available Commands** (Auto-generated + Static)
- **Persona Switcher** (dynamic): "Switch to [Persona Name]" × 5
- **Navigate Dashboard**: Go to Dashboard
- **Navigate Settings**: Go to Settings
- **Search Drafts**: Placeholder for future draft search
- **View Health**: Placeholder for persona health info

**Styling**
- Full-screen dark overlay with backdrop-blur
- Centered modal (max-width: 600px)
- Smooth slide-in animation
- Accessible input with placeholder text

**Search Behavior**
- Fuzzy filters actions by label text
- Real-time as you type
- "No matching commands" message if empty result

---

### **PersonaStats.jsx** (Analytics Cards)
Three stat cards showing persona performance metrics.

**Props**
```javascript
posts: Array  // All posts (component filters by currentPersona)
```

**Optimization**
- Wrapped with `React.memo` to prevent unnecessary re-renders
- Only re-renders when `posts` array reference changes

**Calculated Stats**
1. **Total Posts Published**
   - Filters posts where status = "Published"
   - Icon: TrendingUp (green)
   
2. **Target vs Actual**
   - Shows: `{publishedCount}/{target}`
   - Target hardcoded to 10 (changeable in code)
   - Icon: Target (blue)
   
3. **Persona Health**
   - "Healthy" if total posts > 5
   - "Needs Attention" if ≤ 5
   - Icon: Heart (green/red based on status)

**Styling**
- Cards have hover scale (105%) + shadow animations
- Responsive grid: 1 col mobile, 3 cols desktop
- Dark slate background with border & shadow

---

### **QuickAddModal.jsx** (Add/Edit Form Modal)
Reusable modal for creating and editing blog posts.

**Props**
```javascript
onClose: Function          // () => void - Close handler
onSave: Function           // (post) => void - Save handler
post?: Object              // Post object if editing, undefined if creating
```

**Form Fields**
1. **Title** (text input)
   - Required field
   - Placeholder: "Post title"

2. **Platform** (dropdown)
   - Options: Hashnode, Dev.to, Medium
   - Required field

3. **Status** (dropdown)
   - Options: Draft, Published
   - Default: Draft

**Behavior**
- If `post` prop: Pre-fills form + Title = "Edit Post"
- If `post` is null: Clear form + Title = "Add New Draft"
- Save button closes modal automatically
- Escapes close modal (browser default)
- Auto-assigns current persona ID on save

**Styling**
- Centered modal with dark slate background
- Border + shadow for depth
- Rounded corners (3xl pattern)

---

## 🌍 Context & State Management

### **PersonaContext.jsx**
Global state provider for multi-persona management using React Context API.

**Setup**
```javascript
import { PersonaProvider } from "./context/PersonaContext";

// Wrap app
<PersonaProvider>
  <App />
</PersonaProvider>
```

**Hook Usage**
```javascript
import { usePersona } from "../context/PersonaContext";

const MyComponent = () => {
  const { personas, currentPersona, switchPersona } = usePersona();
  // ...
};
```

**Context Value**
```javascript
{
  personas: Array,              // All 5 personas
  currentPersona: Persona,      // Currently selected (default: personas[0])
  switchPersona: (id) => void   // Switch to persona by ID
}
```

**Persona Data Structure**
```javascript
{
  id: number,           // 1-5
  name: string,         // Display name
  platform: string,     // "Hashnode", "Dev.to", "Medium"
  niche: string,        // Content focus: "AI/ML", "Web Dev", etc.
  brandColor: string    // Hex color: "#00ff00", "#ff0000", etc.
}
```

**Pre-loaded Personas** (5 Total)
| ID | Name | Platform | Niche | Color |
|----|------|----------|-------|-------|
| 1 | Tech Guru | Hashnode | AI/ML | #00ff00 |
| 2 | Dev Insights | Dev.to | Web Dev | #ff0000 |
| 3 | AI Whisperer | Medium | AI Ethics | #0000ff |
| 4 | Code Ninja | Hashnode | Programming | #ffff00 |
| 5 | Future Tech | Dev.to | Emerging Tech | #ff00ff |

**Error Handling**
- `usePersona()` throws error if called outside `<PersonaProvider>`
- Check console for error message to debug

---

## 🎣 Custom Hooks

### **useLocalStorage(key, initialValue)**

**Purpose**: Persist React state to browser localStorage with auto-recovery on reload.

**Usage**
```javascript
import useLocalStorage from "../hooks/useLocalStorage";

const MyComponent = () => {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  
  // Read: theme === "dark"
  // Write: setTheme("light") → Auto-saves to localStorage
  // Reload page → theme is restored
};
```

**Behavior**
- On mount: Reads from localStorage, falls back to `initialValue` if not found
- On setState: Updates React state AND localStorage immediately
- Handles JSON serialization (stringify/parse)
- Error handling for browser restrictions (incognito, quota exceeded)

**Currently Used For**
- `layout` key: Persists List vs Grid view preference

**Future Implementations**
- Theme preference (light/dark)
- Draft auto-save
- User settings/sidebar state
- Persona favorites
- Recent searches

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Cmd+K** (Mac) | Open/Close Command Palette |
| **Ctrl+K** (Windows/Linux) | Open/Close Command Palette |
| **Escape** | Close Command Palette |
| *Tab* (Future) | Navigate between drafts in table |
| *Enter* (Future) | Open selected draft for edit |

---

## 📊 Data Models

### **Post Object**
Single blog post/draft data structure.

```javascript
{
  id: number,                    // Timestamp-based unique ID
  title: string,                 // Blog post title
  platform: string,              // "Hashnode" | "Dev.to" | "Medium"
  status: string,                // "Draft" | "Published"
  date: string,                  // ISO format: "YYYY-MM-DD"
  personaId: number              // 1-5 (Foreign key to Persona)
}
```

**Example**
```javascript
{
  id: 1712188800000,
  title: "Getting Started with React 19",
  platform: "Dev.to",
  status: "Published",
  date: "2026-04-15",
  personaId: 2
}
```

**Validation Rules**
- `title`: Non-empty string (1-200 chars)
- `platform`: Must match one of 3 platforms
- `status`: Draft or Published only
- `date`: Valid YYYY-MM-DD format
- `personaId`: 1-5 (valid persona ID)

---

### **Persona Object**
Blog persona/identity configuration.

```javascript
{
  id: number,           // 1-5, unique identifier
  name: string,         // Display name: "Tech Guru"
  platform: string,     // Primary platform: "Hashnode"
  niche: string,        // Content focus: "AI/ML"
  brandColor: string    // Hex color: "#00ff00"
}
```

---

## 🔧 How to Add New Features

### **Add a New Persona**

**Step 1**: Update `src/context/PersonaContext.jsx`
```javascript
const initialPersonas = [
  // ... existing personas (1-5)
  {
    id: 6,
    name: "Web3 Architect",
    platform: "Mirror",
    niche: "Blockchain",
    brandColor: "#ff7a18"
  }
];
```

**Automatic Updates**
- CommandPalette will show new persona in switcher
- Dashboard quick-switch will include it
- All components using `usePersona()` will see it

---

### **Add a New Blog Post (Mock Data)**

**Step 1**: Update `src/pages/Dashboard.jsx` initialPosts
```javascript
const initialPosts = [
  // ... existing posts
  {
    id: 1712448000000,
    title: "Smart Contract Auditing Best Practices",
    platform: "Mirror",
    status: "Draft",
    date: "2026-04-20",
    personaId: 6  // Your new persona ID
  }
];
```

**Behavior**
- Dashboard automatically filters by `currentPersona.id`
- New post will appear when persona 6 is selected
- Grid/List views will both display it

---

### **Add a New Page/Route**

**Step 1**: Create new page file
```jsx
// src/pages/Analytics.jsx
import React from "react";

const Analytics = () => {
  return <div className="p-8"><h1>Analytics Dashboard</h1></div>;
};

export default Analytics;
```

**Step 2**: Update `src/App.jsx`
```javascript
import { lazy } from "react";

const Analytics = lazy(() => import("./pages/Analytics"));

// Inside Routes:
<Route path="/analytics" element={<Analytics />} />
```

**Step 3**: Add nav link in header
```jsx
<NavLink to="/analytics" className={...}>Analytics</NavLink>
```

**Step 4**: Add to CommandPalette
```javascript
// In src/components/CommandPalette.jsx actions array:
{ type: "navigate", path: "/analytics", label: "Go to Analytics", icon: BarChart3 }
```

---

### **Add a New UI Component**

**Step 1**: Create component file
```jsx
// src/components/MyComponent.jsx
import React from "react";

const MyComponent = React.memo(({ data }) => {
  return <div className="rounded-3xl border border-slate-800/80">...</div>;
});

export default MyComponent;
```

**Step 2**: Use in parent file
```jsx
import MyComponent from "../components/MyComponent";

<MyComponent data={someData} />
```

**Best Practices**
- Wrap in `React.memo()` if receives same props often
- Use Tailwind classes (avoid inline styles)
- Follow dark theme color palette
- Add prop validation with TypeScript or PropTypes

---

### **Use localStorage for New Preference**

```javascript
import useLocalStorage from "../hooks/useLocalStorage";

const [sidebar, setSidebar] = useLocalStorage("sidebarOpen", true);

// Call setSidebar() to update + persist
return <button onClick={() => setSidebar(false)}>Close Sidebar</button>;
```

---

### **Connect to Supabase (Future Integration)**

**Step 1**: Create service file
```javascript
// src/services/supabase.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);
```

**Step 2**: Add API layer
```javascript
// src/services/api.js
import { supabase } from "./supabase";

export const fetchPosts = async (personaId) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("personaId", personaId);
  
  if (error) throw error;
  return data;
};

export const addPost = async (post) => {
  const { data, error } = await supabase
    .from("posts")
    .insert([post]);
  
  if (error) throw error;
  return data[0];
};
```

**Step 3**: Replace mock data in Dashboard
```javascript
// Remove: const [posts, setPosts] = useState(initialPosts);
// Add:
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadPosts = async () => {
    try {
      const data = await fetchPosts(currentPersona.id);
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };
  
  loadPosts();
}, [currentPersona.id]);
```

---

## 📈 Future Roadmap

### **Phase 1** ✅ (Current)
- [x] Multi-persona management
- [x] CRUD operations (mocks)
- [x] Dark theme UI
- [x] Keyboard command palette
- [x] Layout toggle (List/Grid)

### **Phase 2** (Next)
- [ ] Supabase PostgreSQL integration
- [ ] User authentication (email/password)
- [ ] Real-time post sync
- [ ] Persona table (user owns personas)

### **Phase 3** (Advanced)
- [ ] Rich text editor (TipTap)
- [ ] Draft auto-save (30s interval)
- [ ] Post templates by platform
- [ ] Analytics graphs & charts
- [ ] Scheduled publishing (cron)

### **Phase 4** (Platforms)
- [ ] Hashnode API (auto-publish)
- [ ] Dev.to API integration
- [ ] Medium API integration
- [ ] LinkedIn cross-posting

### **Phase 5** (AI Features)
- [ ] OpenAI content generation
- [ ] Auto-tagging system
- [ ] SEO optimization suggestions
- [ ] Tone/voice analyzer (matches persona)
- [ ] DALL-E image generation

### **Phase 6** (Polish)
- [ ] E2E tests (Cypress)
- [ ] Unit tests (Vitest)
- [ ] Mobile app (React Native)
- [ ] Light theme option
- [ ] Internationalization (i18n)
- [ ] Performance optimization

---

## 🎨 Styling Guide

### **Color Palette** (Dark Theme Only)

```css
/* Backgrounds */
#07080d              → Primary background (darkest)
#0f172a (slate-950)  → Header/overlay background
#1e293b (slate-900)  → Card/section background
#334155 (slate-700)  → Borders, subtle elements

/* Text Colors */
#f1f5f9 (slate-100)  → Primary text
#cbd5e1 (slate-300)  → Secondary text
#94a3b8 (slate-400)  → Tertiary text (disabled, hints)
#64748b (slate-500)  → Placeholder, inactive

/* Accent Colors (CTAs & Highlights) */
#0ea5e9 (sky-500)    → Primary button background
#0284c7 (sky-600)    → Primary button hover
#38bdf8 (sky-400)    → Primary text/labels

/* Status Colors */
#10b981 (emerald-500) → Success/published
#ef4444 (rose-500)   → Danger/error
#f59e0b (amber-500)  → Warning/pending
```

### **Tailwind Class Conventions**

**Spacing** (4px units)
- `p-4` = 1rem (16px)
- `p-6` = 1.5rem (24px)
- `gap-6` = 1.5rem space between items

**Border Radius**
- `rounded-full` = 9999px (buttons, badges)
- `rounded-3xl` = 1.5rem (cards, large elements)
- `rounded-2xl` = 1rem (medium components)
- `rounded-lg` = 0.5rem (small elements)

**Shadows & Depth**
- `shadow-lg` = Normal shadows on cards
- `shadow-xl` = Hover/elevated state
- `shadow-[0_24px_120px_rgba(15,23,42,0.35)]` = Custom deep shadow (high-z modals)

**Transitions**
- `transition` = Smooth animation (opacity, transform, colors)
- `transition duration-300` = 300ms timing
- `hover:scale-105` = Scale up 105% on hover
- `hover:shadow-xl` = Add shadow on hover

**Responsive Prefixes** (Mobile-First)
- Base (no prefix) = Mobile (0px+)
- `sm:` = Small (640px+)
- `md:` = Medium (768px+)
- `lg:` = Large (1024px+)
- `xl:` = X-Large (1280px+)

**Dark Mode** (Always Active)
- All colors already optimized for dark
- No `dark:` prefix needed
- Remove light-mode styles if converting from other projects

---

### **Common Component Classes**

**Buttons**
```jsx
// Primary CTA
className="rounded-full bg-sky-500 text-white px-4 py-2 hover:bg-sky-400 transition"

// Secondary
className="rounded-full border border-slate-800/80 bg-slate-900/80 text-slate-200 px-4 py-2 hover:bg-slate-800"
```

**Cards**
```jsx
className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-lg hover:shadow-xl transition"
```

**Inputs**
```jsx
className="rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
```

**Badge/Label**
```jsx
className="inline-block rounded-full bg-sky-500/15 px-3 py-1 text-sm text-sky-400"
```

---

## 🐛 Troubleshooting

### **Port Already in Use?**
```bash
# Vite auto-increments to 5174, 5175...
# Or stop process using port 5173:
# Windows:
netstat -ano | findstr :5173
taskkill /PID <pid> /F

# macOS/Linux:
lsof -i :5173
kill -9 <pid>
```

### **Tailwind CSS Not Compiling?**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### **Context/State Not Updating?**
- Verify component is child of `<PersonaProvider>`
- Check `usePersona()` is called in function body (not conditionally)
- Confirm `switchPersona(id)` gets valid ID (1-5)
- Check React DevTools for state changes

### **localStorage Not Working?**
- Browser incognito/private mode disables it
- Check QuotaExceededError in console
- Clear browser cache/storage if corrupted
- ~5MB limit per domain

---

## 📝 Development Tips

1. **Use React DevTools** to inspect context state
2. **Network tab** to mock future API calls
3. **Lighthouse** to check performance before deploy
4. **Mobile view** to test responsive design
5. **Console errors** for debugging component issues
6. **Git commits** frequently (good practice)

---

## 📞 Support & Questions

**Setup Issues**: Check Node version, npm cache
**Component Questions**: Review `/components` and `/pages` folders
**Styling Issues**: Refer to Tailwind docs + test in browser DevTools
**State Issues**: Check Context in `/context`, use React DevTools
**Future Features**: See roadmap section above

---

## 📄 License & Credits

Built for educational & portfolio purposes.  
Feel free to fork, modify, and use as template!

---

**Last Updated**: April 18, 2026  
**Version**: 1.0.0 (React + Vite + Tailwind MVP)  
**Next Phase**: Supabase Backend Integration  
**Built by**: GhostWriter Development Team
