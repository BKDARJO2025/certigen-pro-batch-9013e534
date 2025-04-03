
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = (userData: any) => {
    login(userData);
    onClose();
    toast.success(`Welcome${userData.name ? `, ${userData.name}` : ''}!`);
    navigate("/");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Log in to your account" : "Create an account"}
          </DialogTitle>
        </DialogHeader>

        {mode === "login" ? (
          <LoginForm 
            onSuccess={handleSuccess} 
            onSwitchMode={() => setMode("signup")} 
          />
        ) : (
          <SignupForm 
            onSuccess={handleSuccess} 
            onSwitchMode={() => setMode("login")} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
