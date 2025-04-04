
import { Link } from "react-router-dom";
import { FileImage } from "lucide-react";
import UserMenu from "./UserMenu";
import { useAuth } from "@/hooks/useAuth";

export default function AppHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FileImage className="h-6 w-6 text-certigen-blue" />
          <span className="text-xl font-semibold tracking-tight font-montserrat">CertiGen Pro</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-certigen-blue px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/templates" className="text-gray-600 hover:text-certigen-blue px-3 py-2 text-sm font-medium">
                Templates
              </Link>
              <Link to="/data-input" className="text-gray-600 hover:text-certigen-blue px-3 py-2 text-sm font-medium">
                Data
              </Link>
              <Link to="/text-settings" className="text-gray-600 hover:text-certigen-blue px-3 py-2 text-sm font-medium">
                Text
              </Link>
              <Link to="/export" className="text-gray-600 hover:text-certigen-blue px-3 py-2 text-sm font-medium">
                Export
              </Link>
            </nav>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
