
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AdminLayout() {
  const { isAuthenticated, isAdmin, user } = useAuth();

  useEffect(() => {
    // Show a message when accessing the admin page
    if (isAuthenticated && !isAdmin) {
      toast.error("You don't have permission to access the admin area");
    }
  }, [isAuthenticated, isAdmin]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect if authenticated but not admin
  if (!isAdmin) {
    console.log("User is not admin:", user);
    return <Navigate to="/app" replace />;
  }

  return (
    <AppLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <Outlet />
      </div>
    </AppLayout>
  );
}
