import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProjectForm } from "@/components/dashboard/ProjectForm";
import { PROJECTS_DATA } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = PROJECTS_DATA.find((p) => p.id === parseInt(id ?? ""));

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-black text-white">Project Not Found</h2>
          <p className="text-muted-foreground">
            The project you are trying to edit does not exist.
          </p>
          <Button
            onClick={() => navigate("/projects")}
            variant="outline"
            className="rounded-xl"
          >
            Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent text-primary hover:text-white transition-colors gap-2 font-bold text-xs uppercase tracking-widest"
            onClick={() => navigate("/projects")}
          >
            <ChevronLeft className="h-4 w-4" /> Back to Nexus
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Edit <span className="text-primary">{project.name}</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Update project milestones, team members, and metadata.
            </p>
          </div>
        </div>
        <div className="glass-morphism border border-white/5 p-8 rounded-2xl">
          <ProjectForm
            initialData={project}
            onSuccess={() => navigate("/projects")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
