import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Plus, Trash2, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TaskCard from "../components/TaskCard";
import CreateTaskDialog from "../components/CreateTaskDialog";
import TaskDetailDialog from "../components/TaskDetailDialog";

const columns = [
  { key: "todo", label: "To Do", color: "bg-slate-400" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { key: "in_review", label: "In Review", color: "bg-violet-500" },
  { key: "done", label: "Done", color: "bg-emerald-500" },
];

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const load = async () => {
    setLoading(true);
    const [p, t, u] = await Promise.all([
      base44.entities.Project.get(projectId),
      base44.entities.Task.filter({ project_id: projectId }, "-created_date", 200),
      base44.auth.me(),
    ]);
    setProject(p);
    setTasks(t);
    setUser(u);
    setLoading(false);
  };

  useEffect(() => { load(); }, [projectId]);

  const isAdmin = user?.role === "admin";

  const handleStatusChange = async (newStatus) => {
    await base44.entities.Project.update(projectId, { status: newStatus });
    setProject((p) => ({ ...p, status: newStatus }));
  };

  const handleDeleteProject = async () => {
    if (!confirm("Delete this project and all its tasks?")) return;
    const projectTasks = await base44.entities.Task.filter({ project_id: projectId });
    for (const t of projectTasks) {
      await base44.entities.Task.delete(t.id);
    }
    await base44.entities.Project.delete(projectId);
    window.location.href = "/projects";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/projects" className="text-primary hover:underline text-sm mt-2 inline-block">Back to Projects</Link>
      </div>
    );
  }

  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            {project.description && <p className="text-muted-foreground mt-1 max-w-xl">{project.description}</p>}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                {isAdmin ? (
                  <Select value={project.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary" className="text-xs capitalize">{project.status}</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{pct}% complete</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add Task
            </Button>
            {isAdmin && (
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={handleDeleteProject}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Kanban Board */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <span className="text-xs text-muted-foreground ml-auto">{colTasks.length}</span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                ))}
                {colTasks.length === 0 && (
                  <div className="border border-dashed border-border rounded-xl p-6 text-center text-xs text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={load} projectId={projectId} projectName={project.name} />
      <TaskDetailDialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)} task={selectedTask} onUpdated={load} isAdmin={isAdmin} />
    </div>
  );
}