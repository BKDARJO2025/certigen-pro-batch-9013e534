
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function UserMenu() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleLoginClick = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleLoginClick}>Log In</Button>
          <Button onClick={handleSignupClick}>Sign Up</Button>
        </div>
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode} 
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative h-8 w-8 rounded-full">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {isAdmin && (
            <>
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/admin/users">User Management</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/templates">Template Management</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">App Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
