import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TemplatesPage from "./pages/TemplatesPage";
import DataInputPage from "./pages/DataInputPage";
import TextSettingsPage from "./pages/TextSettingsPage";
import ExportPage from "./pages/ExportPage";
import SettingsPage from "./pages/SettingsPage";
import AppLayout from "./components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import UserManagementPage from "./pages/admin/UserManagementPage";
import TemplateManagementPage from "./pages/admin/TemplateManagementPage";
import AppSettingsPage from "./pages/admin/AppSettingsPage";
import RecipientManagementPage from "./pages/admin/RecipientManagementPage";
import AddRecipientPage from "./pages/admin/AddRecipientPage";
import FontInitializer from "@/components/FontInitializer";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <FontInitializer />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/templates" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TemplatesPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/data-input" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DataInputPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/text-settings" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TextSettingsPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/export" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ExportPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SettingsPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="templates" element={<TemplateManagementPage />} />
                  <Route path="settings" element={<AppSettingsPage />} />
                  <Route path="recipients" element={<RecipientManagementPage />} />
                  <Route path="recipients/add" element={<AddRecipientPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
