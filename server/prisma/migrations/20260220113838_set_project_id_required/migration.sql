/*
  Warnings:

  - Made the column `projectId` on table `activity_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "activity_logs" ALTER COLUMN "projectId" SET NOT NULL;
