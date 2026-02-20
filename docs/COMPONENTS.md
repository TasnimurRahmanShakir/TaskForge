# Frontend Documentation 🎨

TaskForge's frontend is built with a modern, component-driven architecture using **React 19**, **Vite**, and **Tailwind CSS v4**.

## 🏗 Component Architecture

We follow an atomic-inspired design system with high-reusability and a focus on "Glassmorphism" aesthetics.

### 📋 Core Components

| Component           | Description                              | key Features                                                          |
| :------------------ | :--------------------------------------- | :-------------------------------------------------------------------- |
| `KanbanBoard`       | Orchestrates the task workflow.          | Drag-drop (simulated), status grouping, real-time filtering.          |
| `TaskCard`          | High-fidelity preview of a task.         | Priority badges, assignee avatars, progress bars, quick-action menus. |
| `TaskForm`          | Unified modal for task creation/editing. | Dynamic tabs (Details, Checklist, Discussion), Zod validation.        |
| `TaskDiscussion`    | Real-time-style collaboration interface. | Glassmorphism design, relative timestamps, author context.            |
| `ProductivityChart` | Visual analytics for team performance.   | Responsive line/bar charts showing task completion velocity.          |
| `StatCard`          | Dashboard overview metrics.              | Animated counters, trend indicators, lucide-react iconography.        |

### 🛠 UI Primitives (Design System)

We use a custom design system based on **Radix UI** primitives:

- **Dialog/Modal**: Using `DialogContent` for premium centered overlays.
- **Badge**: Dynamic styling for `Priority` and `Status` using HSL-tailored colors.
- **Avatar**: Integrated fallback logic with user initials and profile image support.
- **Tooltip**: Built-in interactive hints for all icon-only actions.

## 🔄 State Management

We use **Zend** for lightweight, high-performance state management:

- `useAuthStore`: Manages user sessions, JWT refresh cycles, and global user context.
- `useProjectStore`: (Planned) For local caching of project-specific data.

## 🎨 Styling System

TaskForge uses a custom **Tailwind CSS v4** configuration:

- **Glassmorphism**: A combination of `backdrop-blur`, `bg-white/5`, and subtle `border-white/10`.
- **Dynamic Themes**: Tailored HSL colors for `Urgent` (Red), `High` (Orange), etc.
- **Micro-Animations**: **Framer Motion** is used for layout transitions and hover effects.
