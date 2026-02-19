import { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Mail,
  Lock,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";

// Mock data
const INITIAL_MEMBERS = [
  {
    id: 1,
    name: "Alice Freeman",
    email: "alice@example.com",
    role: "Owner",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    initials: "AF",
    isLocked: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Admin",
    avatar: "",
    initials: "BS",
    isLocked: false,
  },
  {
    id: 3,
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "Member",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
    initials: "CD",
    isLocked: false,
  },
  {
    id: 4,
    name: "Dana Lee",
    email: "dana@example.com",
    role: "Member",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    initials: "DL",
    isLocked: false,
  },
];

const PENDING_INVITES = [
  {
    id: 1,
    email: "sarah.w@example.com",
    invitedAt: "2 days ago",
    status: "Pending",
  },
];

export default function TeamMembersPage() {
  const { id } = useParams();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1200px] mx-auto text-white">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Team Members
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Manage access and permissions for your workspace team.
          </p>
        </div>

        {/* Invite Section */}
        <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Invite New Members</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="pl-10 h-10 sm:h-11 bg-[#080812] border-white/5 focus:border-primary/50 transition-all rounded-xl w-full text-xs sm:text-sm"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 sm:h-11 px-6 rounded-xl transition-all text-xs sm:text-sm shadow-[0_0_20px_-8px_var(--color-primary)]">
              Send Invite
            </Button>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground/60">
            Invited members will receive an email with a link to join this
            workspace.
          </p>
        </div>

        {/* Active Members Section */}
        <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Active Members</h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                {members.length}
              </span>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter users..."
                className="pl-9 h-9 bg-[#080812] border-white/5 focus:border-primary/50 transition-all rounded-lg w-full text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold bg-[#080812]/50">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-[#080812]">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-white">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {member.email}
                    </td>
                    <td className="px-6 py-4">
                      {member.isLocked ? (
                        <div className="flex items-center gap-2 text-white/80 font-medium text-xs bg-white/5 px-2.5 py-1 rounded-lg w-fit">
                          {member.role}
                          <Lock className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-8 w-[110px] justify-between text-xs font-bold bg-white/5 border-white/5 hover:bg-white/10 hover:text-white"
                            >
                              {member.role}
                              <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[110px]"
                          >
                            <DropdownMenuItem onClick={() => {}}>
                              Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              Member
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              Viewer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!member.isLocked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="h-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 font-medium text-xs"
                        >
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing 1 to {members.length} of 12 members</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-[10px] border-white/5 bg-white/5 hover:bg-white/10 text-muted-foreground disabled:opacity-50"
                disabled
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-[10px] border-white/5 bg-white/5 hover:bg-white/10 text-muted-foreground"
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Pending Invitations</h3>
          <div className="bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden p-1">
            {PENDING_INVITES.map((invite) => (
              <div
                key={invite.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-white/[0.02] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      {invite.email}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Invited {invite.invitedAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-500 text-[10px] font-bold">
                    {invite.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] text-muted-foreground hover:text-white"
                  >
                    Resend
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] text-muted-foreground hover:text-red-400"
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
