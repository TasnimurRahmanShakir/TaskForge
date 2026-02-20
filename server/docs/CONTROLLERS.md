# Backend Framework: Controllers & Logic 🧠

TaskForge's backend logic is organized into clean, single-responsibility controllers that leverage **Prisma** for type-safe database interactions and **Zod** for request validation.

## 🏗 Modular Architecture

### 🛡 Auth Controller (`auth.controller.ts`)

Manages the security perimeter of the application.

- **Session Engineering**: Implements dual-token (Access + Refresh) logic to balance security and user convenience.
- **Hierarchical Role Assignment**: Automatically assigns roles based on the global RBAC schema.

### 📁 Project Controller (`project.controller.ts`)

Orchestrates high-level team workspaces.

- **Progress Computation**: Dynamically calculates project completion percentage based on child task statuses.
- **Resource Management**: Handles project member enrollment and role updates.

### 📋 Task Controller (`task.controller.ts`)

The "engine room" of the application handling complex state transitions.

- **Unified Task Fetching**: Optimized queries that include assignees, checklist items, and project context in a single database hit.
- **State Transition Safeguards**: Ensures that only authorized users can transition tasks across the Kanban columns.
- **Metadata Sync**: Intelligently handles batch updates for checklist items and tag synchronization.

### 💬 Comment Controller (`comment.controller.ts`)

Manages team collaboration strings.

- **Activity Pipeline**: Automatically triggers a project-wide `ActivityLog` entry whenever a comment is created.
- **Contextual Retrieval**: Optimized for fetching conversation threads associated with specific tasks.

## 🔄 Common Patterns

### `catchAsync` Utility

A wrapper around Express handlers that eliminates the need for repetitive `try/catch` blocks, ensuring all errors are passed to the global error-handling middleware.

### `AuthRequest` Middleware

Extends the standard Express Request object to include type-safe user context (`req.user`), populated from the JWT payload.

### Hierarchical RBAC Logic

Permissions are checked in two layers:

1. **Global Role**: (e.g., `SUPER_USER`) across the entire platform.
2. **Project Role**: (e.g., `LEADER`, `MEMBER`) specific to individual project workspaces.
