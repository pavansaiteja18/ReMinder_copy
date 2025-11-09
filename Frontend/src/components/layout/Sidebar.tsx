import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Brain, 
  MessageSquareText,
  Settings,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/extract", icon: Brain, label: "AI Extract" },
  { to: "/recall", icon: MessageSquareText, label: "Recall" },
  { to: "/teams", icon: MessageSquareText, label: "Teams" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">reMindr</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-4 w-4", isActive && "text-primary-foreground")} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="rounded-lg bg-gradient-hero p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground">Teams Integration</p>
          <p className="text-xs text-muted-foreground">
            Connect Microsoft Teams for notifications
          </p>
        </div>
      </div>
    </aside>
  );
};
