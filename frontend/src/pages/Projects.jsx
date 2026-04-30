import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Plus, FolderKanban, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CreateProjectDialog from "../components/CreateProjectDialog";
import moment from "moment";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  on_hold: "bg-amber-100 text-amber-700",
  completed: "bg-blue-100 text-blue-700",
  archived: "bg-slate-100 text-slate-600",
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const load = async () => {
    setLoading(true);
    const [p, t, u] = await Promise.all([
      base44.entities.Project.list("-created_date", 100),
      base44.entities.Task.list("-created_date", 500),
      base44.auth.me(),
    ]);
    setProjects(p);
    setTasks(t);
    setUser(u);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const isAdmin = user?.role === "admin";
  const filtered = projects.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <FolderKanban className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">No projects found</h3>
          <p className="text-sm text-muted-foreground">
            {projects.length === 0 ? "Create your first project to get started." : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const projectTasks = tasks.filter((t) => t.project_id === project.id);
            const done = projectTasks.filter((t) => t.status === "done").length;
            const total = projectTasks.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className={`text-[10px] ${statusStyles[project.status] || ""}`}>
                    {project.status?.replace("_", " ")}
                  </Badge>
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors mb-1 truncate">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                )}
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{done}/{total} tasks</span>
                  {project.due_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {moment(project.due_date).format("MMM D")}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={load} />
    </div>
  );
}