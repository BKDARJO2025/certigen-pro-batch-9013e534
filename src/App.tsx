
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/templates" element={
            <AppLayout>
              <TemplatesPage />
            </AppLayout>
          } />
          <Route path="/data-input" element={
            <AppLayout>
              <DataInputPage />
            </AppLayout>
          } />
          <Route path="/text-settings" element={
            <AppLayout>
              <TextSettingsPage />
            </AppLayout>
          } />
          <Route path="/export" element={
            <AppLayout>
              <ExportPage />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
