/*
  Warnings:

  - You are about to drop the column `position` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity_logs" ADD COLUMN     "projectId" TEXT,
ALTER COLUMN "taskId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "position",
DROP COLUMN "type";

-- CreateIndex
CREATE INDEX "activity_logs_projectId_idx" ON "activity_logs"("projectId");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
