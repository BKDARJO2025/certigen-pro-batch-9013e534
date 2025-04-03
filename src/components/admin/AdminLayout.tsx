
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";

export default function AdminLayout() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
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
