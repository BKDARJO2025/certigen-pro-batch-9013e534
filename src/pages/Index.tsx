
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <AppLayout>
      <HomePage />
    </AppLayout>
  );
};

export default Index;
