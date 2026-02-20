import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  X,
  Check,
  ChevronDown,
  User as UserIcon,
  Users as UsersIcon,
  Save,
} from "lucide-react";
import { projectSchema, type ProjectFormValues } from "@/lib/schemas";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/lib/types";

const STATUS_OPTIONS = ["On Track", "At Risk", "Delayed", "Completed"] as const;
interface ColorOption {
  name: string;
  class: string;
}
const COLOR_OPTIONS: ColorOption[] = [
  { name: "Blue", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  {
    name: "Purple",
    class: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    name: "Emerald",
    class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    name: "Amber",
    class: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  { name: "Primary", class: "bg-primary/10 text-primary border-primary/20" },
];
const MANAGERS_PRESET = [
  "Alex Morgan",
  "Sarah Konor",
  "John Doe",
  "Mike Ross",
  "Elena Gilbert",
  "Chris Evans",
];
const TEAM_MEMBERS_PRESET = ["JD", "SK", "RL", "AM", "PK", "SM", "TQ", "LK"];

interface ProjectFormProps {
  onSuccess?: (values?: ProjectFormValues) => void;
  initialData?: Partial<Project>;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export function ProjectForm({ onSuccess, initialData }: ProjectFormProps) {
  const { user: currentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const isEditing = !!initialData;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.get<{ users: User[] }>("/auth/users");
        setAvailableUsers(data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      manager: initialData?.managerId ?? "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      status:
        (initialData?.status as ProjectFormValues["status"]) ?? "On Track",
      teamMembers: initialData?.memberIds ?? [],
      color:
        initialData?.color ?? "bg-primary/10 text-primary border-primary/20",
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      setIsLoading(true);

      const payload = {
        name: values.name,
        startDate: values.startDate,
        status: values.status.toUpperCase().replace(" ", "_"),
        color: values.color,
        managerId: values.manager,
        memberIds: values.teamMembers,
        // Since the prompt doesn't have a separate leader field, we can use the manager or first member
        teamLeaderId: values.manager,
      };

      if (isEditing) {
        await api.patch(`/projects/${initialData!.id}`, payload);
      } else {
        await api.post("/projects/create", payload);
      }

      onSuccess?.(values);
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    } finally {
      setIsLoading(false);
    }
  }

  const toggleTeamMember = (memberId: string) => {
    const currentMembers = form.getValues("teamMembers");
    form.setValue(
      "teamMembers",
      currentMembers.includes(memberId)
        ? currentMembers.filter((m) => m !== memberId)
        : [...currentMembers, memberId],
    );
    form.trigger("teamMembers");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Project Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                  Project Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Q4 Marketing Campaign"
                    className="h-12 bg-white/3 border-white/5 focus:border-primary/50 transition-all rounded-xl text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-[10px]" />
              </FormItem>
            )}
          />

          {/* Manager */}
          <FormField
            control={form.control}
            name="manager"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                  Project Manager
                </FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10 transition-all rounded-xl justify-between px-4 font-medium text-sm",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          {availableUsers.find((u) => u.id === field.value)
                            ?.name || "Select Manager"}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] bg-[#0d0d1a] border-white/10 rounded-xl"
                    align="start"
                  >
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
                      Available Managers
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {availableUsers
                      .filter(
                        (u) =>
                          u.role === "PROJECT_MANAGER" &&
                          u.id !== currentUser?.id,
                      )
                      .map((user) => (
                        <DropdownMenuItem
                          key={user.id}
                          className="py-2.5 cursor-pointer focus:bg-primary/20 focus:text-primary transition-colors gap-2"
                          onClick={() => field.onChange(user.id)}
                        >
                          {user.name}
                          {field.value === user.id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage className="text-red-400 text-[10px]" />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                  Start Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="h-12 bg-white/3 border-white/5 focus:border-primary/50 transition-all rounded-xl scheme-dark text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-[10px]" />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                  Initial Status
                </FormLabel>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => field.onChange(status)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all border",
                        field.value === status
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white/2 text-muted-foreground border-white/5 hover:bg-white/5",
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <FormMessage className="text-red-400 text-[10px]" />
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                  Theme Color
                </FormLabel>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => field.onChange(opt.class)}
                      className={cn(
                        "h-8 w-8 rounded-lg border transition-all flex items-center justify-center",
                        opt.class.split(" ")[0].replace("/10", ""),
                        field.value === opt.class
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d0d1a]"
                          : "opacity-60 hover:opacity-100",
                      )}
                    >
                      {field.value === opt.class && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
                <FormMessage className="text-red-400 text-[10px]" />
              </FormItem>
            )}
          />

          {/* Team Members */}
          <FormField
            control={form.control}
            name="teamMembers"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                  Team Contributors
                </FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-auto min-h-[48px] bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10 transition-all rounded-xl justify-between px-4 py-2",
                          field.value.length === 0 && "text-muted-foreground",
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <UsersIcon className="h-4 w-4 text-muted-foreground mr-1" />
                          {field.value.length > 0 ? (
                            field.value.map((id: string) => {
                              const user = availableUsers.find(
                                (u) => u.id === id,
                              );
                              return (
                                <Badge
                                  key={id}
                                  variant="secondary"
                                  className="h-6 bg-primary/20 text-primary border-primary/20 text-[10px] font-bold px-2 rounded-lg"
                                >
                                  {user?.name || id.substring(0, 4)}
                                </Badge>
                              );
                            })
                          ) : (
                            <span className="text-sm">
                              Select team members...
                            </span>
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                      </Button>
                    </FormControl>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] bg-[#0d0d1a] border-white/10 rounded-xl max-h-[300px] overflow-y-auto custom-scrollbar"
                    align="start"
                  >
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
                      Project Contributors
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {availableUsers.map((user) => (
                      <DropdownMenuCheckboxItem
                        key={user.id}
                        className="py-2.5 cursor-pointer focus:bg-primary/20 focus:text-primary"
                        checked={field.value.includes(user.id)}
                        onCheckedChange={() => toggleTeamMember(user.id)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <span className="font-bold tracking-wider">
                          {user.name}
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage className="text-red-400 text-[10px]" />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-12 rounded-xl shadow-[0_0_30px_-10px_var(--color-primary)] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  {isEditing ? "Updating Project..." : "Creating Project..."}
                </span>
              </>
            ) : (
              <>
                {isEditing ? (
                  <Save className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                <span>{isEditing ? "Save Changes" : "Launch Project"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
