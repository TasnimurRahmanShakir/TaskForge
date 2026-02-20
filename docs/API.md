# API Documentation 🔌

TaskForge provides a RESTful API built with **Express v5** and **Prisma v7**. All endpoints are protected by JWT authentication unless otherwise specified.

## 🔑 Authentication Routes (`/api/auth`)

| Method  | Endpoint     | Description                                           | Perms  |
| :------ | :----------- | :---------------------------------------------------- | :----- |
| `POST`  | `/signup`    | Registers a new user.                                 | Public |
| `POST`  | `/token`     | Authenticates a user and returns JWT + Refresh Token. | Public |
| `PATCH` | `/update-me` | Updates current user profile image or name.           | User   |

## 📁 Project Routes (`/api/projects`)

| Method | Endpoint        | Description                                     | Perms   |
| :----- | :-------------- | :---------------------------------------------- | :------ |
| `GET`  | `/`             | List all projects current user is a member of.  | User    |
| `POST` | `/`             | Create a new project.                           | Manager |
| `GET`  | `/:id`          | Fetch detailed project information.             | Member  |
| `GET`  | `/:id/activity` | Fetch a chronological feed of project activity. | Member  |

## 📋 Task Routes (`/api/tasks`)

| Method   | Endpoint | Description                                    | Perms          |
| :------- | :------- | :--------------------------------------------- | :------------- |
| `GET`    | `/`      | Fetch all tasks for a specific project.        | Member         |
| `GET`    | `/:id`   | Fetch a single task by ID with full relations. | Member         |
| `POST`   | `/`      | Create a new task within a project.            | Manager/Leader |
| `PATCH`  | `/:id`   | Update task status, priority, or metadata.     | Member         |
| `DELETE` | `/:id`   | Permanently delete a task.                     | Manager        |

## 💬 Comment Routes (`/api/comments`)

| Method | Endpoint        | Description                             | Perms  |
| :----- | :-------------- | :-------------------------------------- | :----- |
| `POST` | `/`             | Post a new comment on a task.           | Member |
| `GET`  | `/task/:taskId` | Fetch all comments for a specific task. | Member |

---

## 🛠 Interaction Details

### Request Headers

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Success Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "task": { ... }
  }
}
```

### Error Response (404 Not Found)

```json
{
  "status": "error",
  "message": "Task not found."
}
```
