import prisma from "../config/db";

/**
 * Recalculates and updates the progress of a project based on its tasks and checklist items.
 * Progress is calculated as (total completed checklist items) / (total checklist items) * 100.
 * If a task has no checklist items, it doesn't contribute to this specific granular progress calculation,
 * or we could count completed tasks. For now, let's use checklist items for granular progress.
 */
export const updateProjectProgress = async (projectId: string) => {
  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: {
      checklistItems: true,
    },
  });

  const allItems = tasks.flatMap((t) => t.checklistItems);
  const totalItems = allItems.length;

  if (totalItems === 0) {
    // If no checklist items, maybe calculate based on completed tasks
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const totalTasks = tasks.length;
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await prisma.project.update({
      where: { id: projectId },
      data: { progress },
    });
    return progress;
  }

  const completedItems = allItems.filter((i) => i.completed).length;
  const progress = Math.round((completedItems / totalItems) * 100);

  await prisma.project.update({
    where: { id: projectId },
    data: { progress },
  });

  return progress;
};
