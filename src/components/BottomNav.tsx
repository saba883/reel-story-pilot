import { useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t md:hidden">
      <div className="grid grid-cols-3 gap-1 p-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Button
            key={path}
            variant="ghost"
            size="sm"
            className={`flex flex-col gap-1 h-auto py-2 px-1 ${
              location.pathname === path 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground"
            }`}
            onClick={() => navigate(path)}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};