import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FolderKanban, CheckSquare, AlertTriangle, Clock, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import TaskDetailDialog from "../components/TaskDetailDialog";
import CreateTaskDialog from "../components/CreateTaskDialog";
import moment from "moment";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [t, p, u] = await Promise.all([
        base44.entities.Task.list("-created_date", 100),
        base44.entities.Project.list("-created_date", 50),
        base44.auth.me(),
      ]);
      console.log("Dashboard Data:", { t, p, u });
      setTasks(t);
      setProjects(p);
      setUser(u);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const isAdmin = user?.role === "admin";
  const myTasks = tasks.filter((t) => t.assigned_to === user?.email);
  const overdue = tasks.filter((t) => t.due_date && moment(t.due_date).isBefore(moment(), "day") && t.status !== "done");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.full_name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your projects.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} label="Active Projects" value={projects.filter((p) => p.status === "active").length} color="primary" />
        <StatCard icon={Clock} label="In Progress" value={inProgress.length} color="amber" />
        <StatCard icon={CheckSquare} label="Completed" value={doneTasks.length} color="green" />
        <StatCard icon={AlertTriangle} label="Overdue" value={overdue.length} color="red" />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* My Tasks */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <CheckSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No tasks assigned to you yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.slice(0, 6).map((task) => (
                <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <FolderKanban className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => {
                const projectTasks = tasks.filter((t) => t.project_id === project.id);
                const done = projectTasks.filter((t) => t.status === "done").length;
                const total = projectTasks.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold truncate">{project.name}</h3>
                      <span className="text-xs text-muted-foreground capitalize">{project.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{done}/{total} tasks done</p>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Overdue */}
          {overdue.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2 pt-2">
                <AlertTriangle className="w-4 h-4" /> Overdue Tasks
              </h2>
              <div className="space-y-3">
                {overdue.slice(0, 3).map((task) => (
                  <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <TaskDetailDialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)} task={selectedTask} onUpdated={load} isAdmin={isAdmin} />
      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={load} />
    </div>
  );
}