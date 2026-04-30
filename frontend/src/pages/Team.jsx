import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Mail, Shield, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function Team() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // All users in DB for invite search
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [inviting, setInviting] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [t, me] = await Promise.all([
        base44.entities.Task.list("-created_date", 500),
        base44.auth.me(),
      ]);
      setCurrentUser(me);
      setTasks(t);
      
      const u = await base44.entities.User.list();
      setUsers(u);
      setAllUsers(u);
    } catch (err) {
      console.error("Error loading team data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const isAdmin = currentUser?.role === "admin";

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    await base44.users.inviteUser(inviteEmail, inviteRole);
    setInviting(false);
    setInviteEmail("");
    setInviteOpen(false);
    load();
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">{users.length} member{users.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setInviteOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" /> Invite Member
          </Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((member) => {
          const initials = member.full_name
            ? member.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
            : "U";
          const memberTasks = tasks.filter((t) => t.assigned_to === member.email);
          const doneTasks = memberTasks.filter((t) => t.status === "done").length;
          return (
            <div key={member.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Avatar className="w-11 h-11">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate">{member.full_name || "Unnamed"}</h3>
                    {member.role === "admin" && (
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                        <Shield className="w-2.5 h-2.5 mr-0.5" /> Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {member.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{memberTasks.length} tasks</span>
                <span>{doneTasks} completed</span>
                <span>{memberTasks.length - doneTasks} open</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <Label>Email Address</Label>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between mt-1.5"
                  >
                    {inviteEmail || "Select email..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-0">
                  <Command>
                    <CommandInput placeholder="Search email..." />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {allUsers.map((user) => (
                          <CommandItem
                            key={user.email}
                            value={user.email}
                            onSelect={(currentValue) => {
                              setInviteEmail(currentValue);
                              setPopoverOpen(false);
                            }}
                          >
                            {user.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={inviting || !inviteEmail.trim()}>
                {inviting ? "Inviting..." : "Send Invite"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}