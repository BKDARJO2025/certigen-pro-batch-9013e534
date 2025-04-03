
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import { useAuth } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <AppHeader />
        <div className="flex flex-1">
          {isAuthenticated && <AppSidebar />}
          <main className="flex-1 p-5 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
