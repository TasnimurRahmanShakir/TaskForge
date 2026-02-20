import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Shield,
  User as UserIcon,
  Loader2,
  FolderOpen,
  Search,
  Trash2,
} from "lucide-react";
import { getImageUrl } from "@/lib/media";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string | null;
  createdAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = async (search?: string) => {
    try {
      setLoading(search ? false : true);
      const url = search
        ? `/auth/users?search=${encodeURIComponent(search)}`
        : "/auth/users";
      const data = await api.get<{ users: User[] }>(url);
      setUsers(data.users);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      setUpdatingId(userId);
      await api.post("/auth/update-role", { userId, role: newRole });
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setUpdatingId(user.id);
      await api.delete(`/auth/users/${user.id}`);
      setUsers(users.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_USER":
        return (
          <Badge variant="default" className="bg-red-500 hover:bg-red-600">
            Super Admin
          </Badge>
        );
      case "PROJECT_MANAGER":
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            PM
          </Badge>
        );
      default:
        return <Badge variant="secondary">Member</Badge>;
    }
  };

  if (loading && !searchTerm) {
    return (
      <DashboardLayout>
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and permissions across the platform.
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-black/20 border-white/10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Platform Users</CardTitle>
              <CardDescription>
                A total of {users.length} users registered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-white/5">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-4 group"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-white/10 group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={getImageUrl(user.profileImage)} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block">
                        {getRoleBadge(user.role)}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            disabled={updatingId === user.id}
                          >
                            <span className="sr-only">Open menu</span>
                            {updatingId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[160px] bg-neutral-900 border-white/10 text-white"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem
                            className="flex items-center gap-2 focus:bg-white/5 cursor-pointer"
                            onClick={() =>
                              handleUpdateRole(user.id, "SUPER_USER")
                            }
                          >
                            <Shield className="h-4 w-4 text-red-500" />
                            <span>Set as Admin</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 focus:bg-white/5 cursor-pointer"
                            onClick={() =>
                              handleUpdateRole(user.id, "PROJECT_MANAGER")
                            }
                          >
                            <FolderOpen className="h-4 w-4 text-blue-500" />
                            <span>Set as PM</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 focus:bg-white/5 cursor-pointer"
                            onClick={() => handleUpdateRole(user.id, "MEMBER")}
                          >
                            <UserIcon className="h-4 w-4" />
                            <span>Set as Member</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem
                            className="flex items-center gap-2 focus:bg-red-500/10 text-red-500 cursor-pointer"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
