import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectForm } from "@/components/dashboard/ProjectForm";
import { PROJECTS_DATA } from "@/lib/constants";

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto text-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Project{" "}
              <span className="bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Nexus
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Manage your high-impact initiatives and track team velocity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 p-1 rounded-xl shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 bg-primary text-primary-foreground rounded-lg"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-white rounded-lg"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-black h-10 sm:h-11 px-4 sm:px-6 rounded-xl shadow-[0_0_25px_-10px_var(--color-primary)] transition-all text-xs sm:text-sm">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" /> Launch
                  Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-black tracking-tight">
                    Launch New Project
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground font-medium">
                    Set up your project workspace and assemble your team.
                  </p>
                </DialogHeader>
                <ProjectForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative group w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search projects..."
              className="h-10 sm:h-11 pl-10 bg-white/5 border-white/5 focus:border-primary/50 transition-all rounded-xl w-full text-xs sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              className="flex-1 lg:flex-none border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold h-10 sm:h-11 px-3 sm:px-4 rounded-xl gap-2 text-xs sm:text-sm"
            >
              <Filter className="h-4 w-4" /> Status
            </Button>
            <Button
              variant="outline"
              className="flex-1 lg:flex-none border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold h-10 sm:h-11 px-3 sm:px-4 rounded-xl gap-2 text-xs sm:text-sm"
            >
              All Managers
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PROJECTS_DATA.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground font-medium">
            Showing 6 active projects across 4 departments.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
