# TaskForge 🚀

TaskForge is a high-performance, enterprise-ready project management ecosystem. It combines a sophisticated **Glassmorphism UI** with a scalable **Node.js/Prisma** infrastructure to deliver a state-of-the-art team collaboration platform.

---

## � Documentation Hub

For deep dives into specific areas of the ecosystem, please refer to our professional documentation:

### 🏛 [System Architecture](./docs/ARCHITECTURE.md)

_Technical overview of the end-to-end system flow, security model, and database design._

### 🎨 [Frontend Components](./docs/COMPONENTS.md)

_Detailed breakdown of the React 19 component library, design system, and state management._

### 🧠 [Backend Logic & Controllers](./server/docs/CONTROLLERS.md)

_Deep dive into business logic orchestration, RBAC implementation, and database persistence layers._

### � [Detailed API Reference](./docs/API.md)

_Granular documentation of all RESTful endpoints, request/response schemas, and authentication._

---

## � Core Value Propositions

- **Precision Task Tracking**: Dynamic Kanban workflows with high-fidelity detail views.
- **Audit-Ready Activity Logs**: Automatic project-wide tracing of every team action.
- **Glassmorphism Design System**: A premium, modern aesthetic focused on user focus and clarity.
- **Multi-Tenant Scoping**: Strict project-level isolation and hierarchical RBAC.

---

## 🛠 Technology Stack

| Layer        | Technologies                                            |
| :----------- | :------------------------------------------------------ |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Zustand |
| **Backend**  | Node.js (Express v5), Prisma v7, Zod Validation         |
| **Database** | PostgreSQL                                              |
| **DevOps**   | Scalar API Docs, Swagger JSDoc, JWT Auth                |

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js (v20+)
- PostgreSQL

### 2. Environment Configuration

Create a `.env` in the `/server` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskforge"
JWT_SECRET="your_secure_secret"
```

### 3. Deployment

```bash
# Setup Backend
cd server && npm install
npx prisma migrate dev
npm run dev

# Setup Frontend
cd ../client && npm install
npm run dev
```

---

## 📁 Repository Structure

```text
TaskForge/
├── client/          # Premium React 19 Application
├── server/          # High-Performance API Infrastructure
├── docs/            # Granular System Documentation
└── prisma/          # Persistence Schema & Migrations
```

---

## 📜 Development & License

Developed for high-performance team collaboration demonstration. All rights reserved.
