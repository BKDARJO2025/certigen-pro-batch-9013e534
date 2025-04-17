
import { FileImage, Users, Type, Download, Settings, Menu, UploadCloud, File } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const adminNavItems = [
    {
      name: "Dashboard",
      icon: <Menu className="w-5 h-5" />,
      path: "/admin",
    },
    {
      name: "Kelola Data Penerima",
      icon: <Users className="w-5 h-5" />,
      path: "/data-input",
    },
    {
      name: "Kelola Template Sertifikat",
      icon: <FileImage className="w-5 h-5" />,
      path: "/template-management",
    },
    {
      name: "Atur Teks Sertifikat",
      icon: <Type className="w-5 h-5" />,
      path: "/text-settings",
    },
    {
      name: "Generate Sertifikat",
      icon: <UploadCloud className="w-5 h-5" />,
      path: "/certificate-preview",
    },
    {
      name: "Export Sertifikat",
      icon: <Download className="w-5 h-5" />,
      path: "/certificates",
    },
    {
      name: "Website Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/website-settings",
    },
  ];

  const appNavItems = [
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
  ];

  const navItems = isAdmin ? adminNavItems : appNavItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center px-4 py-2">
          <UploadCloud className="h-6 w-6 text-certigen-blue" />
          <span className="ml-2 text-xl font-semibold tracking-tight font-montserrat">CertiGen Pro</span>
        </div>
        <SidebarTrigger>
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
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
