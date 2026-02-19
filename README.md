# TaskForge 🚀

A modern, high-performance project and task management application built with a premium design aesthetic and a robust backend.

## 🛠 Tech Stack

### Frontend (Client)

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (Shadcn patterns)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)

### Backend (Server)

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express v5](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma v7](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [JWT](https://jwt.io/) (Access & Refresh Tokens)
- **Hashing:** [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Documentation:** [Scalar](https://scalar.com/) + [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- **Validation:** [Zod](https://zod.dev/)
- **File Uploads:** [Multer](https://github.com/expressjs/multer)

## ✨ Key Features

### 🔐 Authentication

- **User Registration:** Support for profile image uploads and role selection (`SUPER_USER`, `PROJECT_MANAGER`, `MEMBER`).
- **Secure Login:** JWT-based authentication with "Remember Me" support (extends session to 7 days).
- **Password Hashing:** Industry-standard security using bcrypt.

### 📊 Project & Task Management

- **Dashboard:** Overview of projects, productivity charts, and recent tasks.
- **Projects:** Create and manage projects with status tracking (`ON_TRACK`, `AT_RISK`, `DELAYED`, `COMPLETED`).
- **Tasks:** Kanban-style task management with priorities, assignees, and progress tracking.
- **Team Management:** Role-based access control within projects.

### 📖 API Documentation

- Interactive API reference powered by **Scalar**. Available at `/reference` on the server.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TasnimurRahmanShakir/TaskForge.git
   cd TaskForge
   ```

2. **Backend Setup:**

   ```bash
   cd server
   npm install
   # Create .env file based on the implementation plan
   # Run migrations
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📁 Directory Structure

```text
TaskForge/
├── client/           # React frontend application
│   ├── src/          # Source code
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application views
│   │   └── lib/        # Utilities and config
├── server/           # Express backend API
│   ├── src/          # Source code
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/     # API endpoints
│   │   ├── config/     # Database and documentation config
│   │   └── utils/      # Helpers and schemas
│   └── prisma/       # Database schema and migrations
```

## 📜 License

This project is for demonstration purposes.
