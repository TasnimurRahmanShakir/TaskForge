import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, ChevronDown, Zap, User } from "lucide-react";
import { taskSchema, type TaskFormValues } from "@/lib/schemas";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskFormHeader } from "./task/TaskFormHeader";
import { TaskFormTabs, type TabId } from "./task/TaskFormTabs";
import { TaskTagsField } from "./task/TaskTagsField";
import { TaskChecklist } from "./task/TaskChecklist";
import { TaskDiscussion } from "./task/TaskDiscussion";
import { TaskFormFooter } from "./task/TaskFormFooter";
import type { Task, Objective } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

interface PriorityOption {
  label: string;
  color: string;
  dot: string;
}
interface StatusOption {
  label: string;
  dot: string;
  text: string;
}
interface AssigneePreset {
  id: string;
  name: string;
  initials: string;
  image: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { label: "Urgent", color: "text-red-400", dot: "bg-red-500" },
  { label: "High", color: "text-orange-400", dot: "bg-orange-500" },
  { label: "Medium", color: "text-blue-400", dot: "bg-blue-500" },
  { label: "Low", color: "text-emerald-400", dot: "bg-emerald-500" },
];

const STATUS_OPTIONS: StatusOption[] = [
  { label: "Backlog", dot: "bg-white/30", text: "text-white/60" },
  { label: "In Progress", dot: "bg-blue-500", text: "text-blue-400" },
  { label: "In Review", dot: "bg-purple-500", text: "text-purple-400" },
  { label: "Completed", dot: "bg-emerald-500", text: "text-emerald-400" },
];

const ASSIGNEES_PRESET: AssigneePreset[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Sarah Jenkins",
    initials: "SJ",
    image: "https://i.pravatar.cc/150?u=sj",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Alex Morgan",
    initials: "AM",
    image: "https://i.pravatar.cc/150?u=am",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "John Doe",
    initials: "JD",
    image: "https://i.pravatar.cc/150?u=jd",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Mike Ross",
    initials: "MR",
    image: "https://i.pravatar.cc/150?u=mr",
  },
];

// ─── Shared Styles ────────────────────────────────────────────────────────────

const inputCls =
  "h-11 bg-white/3 border-white/10 focus:border-primary/50 focus:bg-white/5 transition-all rounded-xl text-sm text-white placeholder:text-white/25";
const dropdownBtnCls =
  "w-full h-11 bg-white/3 border-white/10 hover:bg-white/6 hover:border-white/20 rounded-xl justify-between px-3 text-sm transition-all";
const dropdownContentCls = "bg-[#0d0d1a] border-white/10 rounded-xl";
const dropdownLabelCls = "text-[10px] uppercase tracking-widest text-white/25";
const dropdownItemCls = "gap-2.5 py-2.5 cursor-pointer focus:bg-primary/10";

// ─── Component ────────────────────────────────────────────────────────────────

interface TaskFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Task>;
  projectName?: string;
  projectId?: string;
}

export function TaskForm({
  onSuccess,
  initialData,
  projectName = "Project Alpha",
  projectId,
}: TaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [checklist, setChecklist] = useState<Objective[]>(
    initialData?.checklistItems || [],
  );
  const [activeTab, setActiveTab] = useState<TabId>("details");

  const form = useForm<TaskFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      priority: initialData?.priority ?? "Medium",
      assignees:
        initialData?.assignees?.map((a) => ({
          id: a.user.id,
          name: a.user.name,
          image: a.user.profileImage,
          initials: a.user.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
        })) ?? [],
      dueDate: initialData?.dueDate ?? "",
      estimate: initialData?.estimate ?? "",
      tags: initialData?.tags ?? ["Marketing", "Q3"],
      status: initialData?.status ?? "Backlog",
      checklistItems: initialData?.checklistItems ?? [],
    },
  });

  const tags = form.watch("tags") ?? [];
  const priority = form.watch("priority");
  const status = form.watch("status");

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.label === priority);
  const currentStatus = STATUS_OPTIONS.find((s) => s.label === status);
  const pendingCount = checklist.filter((o) => !o.completed).length;

  const onSubmit = async (values: TaskFormValues) => {
    console.log("Submitting Task Form:", values);
    setIsLoading(true);
    try {
      const isEditing = !!initialData?.id;

      const payload = {
        ...values,
        checklist: checklist,
        assignees: values.assignees?.map((a) => a.id) || [],
        projectId:
          initialData?.projectId ||
          projectId ||
          "99999999-9999-9999-9999-999999999999",
      };

      console.log("Submission Payload:", payload);

      if (isEditing) {
        await api.patch(`/tasks/${initialData.id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Form Validation Errors:", errors);
    if (errors.title || errors.status || errors.priority) {
      setActiveTab("details");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col h-full bg-[#080812] text-foreground overflow-hidden"
      >
        <TaskFormHeader
          projectName={projectName}
          isEditing={!!initialData}
          onClose={() => onSuccess?.()}
        />
        <TaskFormTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingCount={pendingCount}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4 sm:p-6 space-y-5"
              >
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                        Task Title *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Design the landing page hero section"
                          className={inputCls}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                        Description
                      </FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Add context, goals, or acceptance criteria..."
                          rows={4}
                          className="w-full bg-white/3 border border-white/10 focus:border-primary/50 focus:bg-white/5 transition-all rounded-xl text-sm text-white placeholder:text-white/25 p-3 resize-none focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Status + Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                          Status
                        </FormLabel>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={dropdownBtnCls}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "h-2 w-2 rounded-full shrink-0",
                                      currentStatus?.dot,
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "font-medium",
                                      currentStatus?.text,
                                    )}
                                  >
                                    {String(field.value ?? "Backlog")}
                                  </span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-white/25 shrink-0" />
                              </Button>
                            </FormControl>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className={cn(dropdownContentCls, "w-48")}
                          >
                            <DropdownMenuLabel className={dropdownLabelCls}>
                              Set Status
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/6" />
                            {STATUS_OPTIONS.map((s) => (
                              <DropdownMenuItem
                                key={s.label}
                                className={dropdownItemCls}
                                onClick={() => field.onChange(s.label)}
                              >
                                <div
                                  className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    s.dot,
                                  )}
                                />
                                <span
                                  className={cn("font-medium text-sm", s.text)}
                                >
                                  {s.label}
                                </span>
                                {String(field.value) === s.label && (
                                  <Check className="ml-auto h-3.5 w-3.5 text-white/40" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                          Priority
                        </FormLabel>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={dropdownBtnCls}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "h-2 w-2 rounded-full shrink-0",
                                      currentPriority?.dot,
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "font-medium",
                                      currentPriority?.color,
                                    )}
                                  >
                                    {field.value}
                                  </span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-white/25 shrink-0" />
                              </Button>
                            </FormControl>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className={cn(dropdownContentCls, "w-44")}
                          >
                            <DropdownMenuLabel className={dropdownLabelCls}>
                              Set Priority
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/6" />
                            {PRIORITY_OPTIONS.map((p) => (
                              <DropdownMenuItem
                                key={p.label}
                                className={dropdownItemCls}
                                onClick={() => field.onChange(p.label)}
                              >
                                <div
                                  className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    p.dot,
                                  )}
                                />
                                <span
                                  className={cn("font-medium text-sm", p.color)}
                                >
                                  {p.label}
                                </span>
                                {field.value === p.label && (
                                  <Check className="ml-auto h-3.5 w-3.5 text-white/40" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Assignees */}
                <FormField
                  control={form.control}
                  name="assignees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                        Assignees
                      </FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={dropdownBtnCls}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {field.value && field.value.length > 0 ? (
                                  <div className="flex -space-x-2">
                                    {field.value.map((user, idx) => (
                                      <Avatar
                                        key={idx}
                                        className="h-6 w-6 border-2 border-[#080812] shrink-0"
                                      >
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback className="bg-primary/20 text-primary text-[9px] font-black">
                                          {user.initials}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                    <span className="ml-2 font-medium text-white truncate text-xs self-center">
                                      {field.value.length} Assigned
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <User className="h-4 w-4 text-white/30 shrink-0" />
                                    <span className="text-white/30">
                                      Assign to someone
                                    </span>
                                  </>
                                )}
                              </div>
                              <ChevronDown className="h-4 w-4 text-white/25 shrink-0" />
                            </Button>
                          </FormControl>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className={cn(dropdownContentCls, "w-56")}
                        >
                          <DropdownMenuLabel className={dropdownLabelCls}>
                            Team Members
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/6" />
                          {ASSIGNEES_PRESET.map((user) => {
                            const isSelected = field.value?.some(
                              (u) => u.name === user.name,
                            );
                            return (
                              <DropdownMenuItem
                                key={user.name}
                                className={dropdownItemCls}
                                onClick={() => {
                                  const current = field.value || [];
                                  if (isSelected) {
                                    field.onChange(
                                      current.filter(
                                        (u) => u.name !== user.name,
                                      ),
                                    );
                                  } else {
                                    field.onChange([...current, user]);
                                  }
                                }}
                              >
                                <Avatar className="h-6 w-6 shrink-0">
                                  <AvatarImage src={user.image} />
                                  <AvatarFallback className="bg-primary/20 text-primary text-[9px] font-black">
                                    {user.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm text-white/80 truncate">
                                  {user.name}
                                </span>
                                {isSelected && (
                                  <Check className="ml-auto h-3.5 w-3.5 text-primary shrink-0" />
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                          {field.value && field.value.length > 0 && (
                            <>
                              <DropdownMenuSeparator className="bg-white/6" />
                              <DropdownMenuItem
                                className="gap-2 py-2 cursor-pointer text-red-400/70 focus:bg-red-500/10 focus:text-red-400"
                                onClick={() => field.onChange([])}
                              >
                                <span className="text-sm">
                                  Clear all assignees
                                </span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormItem>
                  )}
                />

                {/* Due Date + Estimate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                          Due Date
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                            <Input
                              type="date"
                              className={cn(inputCls, "pl-9 scheme-dark")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estimate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                          Estimate
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                            <Input
                              placeholder="e.g. 4 points"
                              className={cn(inputCls, "pl-9")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                        Tags
                      </FormLabel>
                      <TaskTagsField
                        tags={tags}
                        onChange={(newTags) => form.setValue("tags", newTags)}
                      />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {activeTab === "checklist" && (
              <motion.div
                key="checklist"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4 sm:p-6"
              >
                <TaskChecklist
                  taskId={initialData?.id}
                  objectives={checklist}
                  onChange={setChecklist}
                />
              </motion.div>
            )}

            {activeTab === "discussion" && (
              <motion.div
                key="discussion"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4 sm:p-6"
              >
                <TaskDiscussion task={initialData as Task} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TaskFormFooter
          isLoading={isLoading}
          isEditing={!!initialData}
          onCancel={() => onSuccess?.()}
        />
      </form>
    </Form>
  );
}
