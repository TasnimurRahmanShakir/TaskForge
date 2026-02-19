/*
  Warnings:

  - The `role` column on the `project_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `assigneeId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('SUPER_USER', 'PROJECT_MANAGER', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('OWNER', 'LEADER', 'MEMBER', 'VIEWER');

-- DropForeignKey
ALTER TABLE "task_tags" DROP CONSTRAINT "task_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "task_tags" DROP CONSTRAINT "task_tags_taskId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigneeId_fkey";

-- DropIndex
DROP INDEX "tasks_assigneeId_idx";

-- DropIndex
DROP INDEX "tasks_projectId_assigneeId_idx";

-- AlterTable
ALTER TABLE "project_members" DROP COLUMN "role",
ADD COLUMN     "role" "ProjectRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "teamLeaderId" TEXT;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "assigneeId",
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "GlobalRole" NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE "tags";

-- DropTable
DROP TABLE "task_tags";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "task_assignees" (
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_assignees_pkey" PRIMARY KEY ("taskId","userId")
);

-- CreateIndex
CREATE INDEX "task_assignees_userId_idx" ON "task_assignees"("userId");

-- CreateIndex
CREATE INDEX "projects_teamLeaderId_idx" ON "projects"("teamLeaderId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_teamLeaderId_fkey" FOREIGN KEY ("teamLeaderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
