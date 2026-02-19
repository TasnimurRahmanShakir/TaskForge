import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Calendar,
  Tag,
  UserPlus,
} from "lucide-react";
import type { Task, ColumnId } from "@/lib/types";

// Mock data for all tasks
const ALL_TASKS: (Task & { columnId: ColumnId })[] = [
  {
    id: 1,
    title: "Draft Campaign Brief for Q4",
    priority: "High",
    type: "Strategy",
    dueDate: "Oct 24",
    assignee: { name: "John Doe", initials: "JD", image: "" },
    columnId: "todo",
  },
  {
    id: 2,
    title: "Competitor Analysis Report",
    priority: "Medium",
    type: "Research",
    dueDate: "Oct 26",
    assignee: { name: "Alex Morgan", initials: "AM", image: "" },
    columnId: "todo",
  },
  {
    id: 3,
    title: "Design Hero Assets for Landing Page",
    priority: "Urgent",
    type: "Design • UI/UX",
    dueDate: "Tomorrow",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400",
    assignee: { name: "Sarah Konor", initials: "SK", image: "" },
    columnId: "inprogress",
  },
  {
    id: 4,
    title: "Copywriting for About Us Page",
    priority: "Low",
    type: "Content",
    dueDate: "Oct 30",
    assignee: { name: "Elena Morgan", initials: "EM", image: "" },
    columnId: "inprogress",
  },
  {
    id: 5,
    title: "Legal Approval for Terms",
    priority: "Medium",
    type: "Legal",
    dueDate: "Oct 22",
    assignee: { name: "John Doe", initials: "JD", image: "" },
    columnId: "review",
  },
  {
    id: 6,
    title: "QA Testing: Sign-up Flow",
    priority: "High",
    type: "QA • Bug Fix",
    dueDate: "Oct 25",
    assignee: { name: "Chris Evans", initials: "CE", image: "" },
    columnId: "review",
  },
  {
    id: 7,
    title: "Project Kickoff Meeting",
    priority: "Completed",
    type: "Admin",
    dueDate: "Oct 15",
    assignee: { name: "Rachel Lee", initials: "RL", image: "" },
    columnId: "done",
  },
  {
    id: 8,
    title: "Set Up Analytics Dashboard",
    priority: "Completed",
    type: "Tech",
    dueDate: "Oct 18",
    assignee: { name: "Alex Morgan", initials: "AM", image: "" },
    columnId: "done",
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(ALL_TASKS);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto text-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              All Tasks
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Manage and track all tasks across your projects.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-black h-10 sm:h-11 px-4 sm:px-6 rounded-xl shadow-[0_0_25px_-10px_var(--color-primary)] transition-all text-xs sm:text-sm">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative group w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search tasks..."
              className="h-10 sm:h-11 pl-10 bg-white/5 border-white/5 focus:border-primary/50 transition-all rounded-xl w-full text-xs sm:text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              className="flex-1 lg:flex-none border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold h-10 sm:h-11 px-3 sm:px-4 rounded-xl gap-2 text-xs sm:text-sm"
            >
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button
              variant="outline"
              className="flex-1 lg:flex-none border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold h-10 sm:h-11 px-3 sm:px-4 rounded-xl gap-2 text-xs sm:text-sm"
            >
              <Calendar className="h-4 w-4" /> Date
            </Button>
            <Button
              variant="outline"
              className="flex-1 lg:flex-none border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold h-10 sm:h-11 px-3 sm:px-4 rounded-xl gap-2 text-xs sm:text-sm"
            >
              <UserPlus className="h-4 w-4" /> Assignee
            </Button>
          </div>
          <div className="hidden lg:flex ml-auto bg-white/5 p-1 rounded-xl">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-primary text-primary-foreground rounded-lg"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-white rounded-lg"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} columnId={task.columnId} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
