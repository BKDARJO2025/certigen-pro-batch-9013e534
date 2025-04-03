
import { FileImage, UploadCloud, Type, Users, Download, Settings, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const navItems = [
    {
      name: "Templates",
      icon: <FileImage className="w-5 h-5" />,
      path: "/templates",
    },
    {
      name: "Data Input",
      icon: <Users className="w-5 h-5" />,
      path: "/data-input",
    },
    {
      name: "Text Settings",
      icon: <Type className="w-5 h-5" />,
      path: "/text-settings",
    },
    {
      name: "Export",
      icon: <Download className="w-5 h-5" />,
      path: "/export",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  return (
    <Sidebar defaultCollapsed={false} collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center px-4 py-2">
          <UploadCloud className="h-6 w-6 text-certigen-blue" />
          <span className="ml-2 text-xl font-semibold tracking-tight font-montserrat">CertiGen Pro</span>
        </div>
        <SidebarTrigger asChild>
          <button className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </button>
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <nav className="flex flex-col gap-1 px-2 pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-certigen-blue text-white"
                  : "hover:bg-certigen-gray"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-muted-foreground">Bulk Certificate Automation</span>
          <span className="text-xs font-medium">v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
