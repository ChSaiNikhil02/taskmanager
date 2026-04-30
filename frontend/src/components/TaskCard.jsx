import { Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

const priorityStyles = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
};

const statusStyles = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-100 text-blue-700",
  in_review: "bg-violet-100 text-violet-700",
  done: "bg-emerald-100 text-emerald-700",
};

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

export default function TaskCard({ task, onClick }) {
  const isOverdue = task.due_date && moment(task.due_date).isBefore(moment(), "day") && task.status !== "done";

  return (
    <div
      onClick={() => onClick?.(task)}
      className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {task.title}
        </h4>
        <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 shrink-0 ${priorityStyles[task.priority] || ""}`}>
          {task.priority || "medium"}
        </Badge>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 ${statusStyles[task.status] || ""}`}>
          {statusLabels[task.status] || task.status}
        </Badge>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.due_date && (
            <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500 font-medium" : ""}`}>
              <Calendar className="w-3 h-3" />
              {moment(task.due_date).format("MMM D")}
            </span>
          )}
          {task.assigned_to_name && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {task.assigned_to_name.split(" ")[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}