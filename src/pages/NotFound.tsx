
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="mx-auto w-24 h-24 bg-certigen-gray rounded-full flex items-center justify-center mb-6">
          <FileQuestion className="h-12 w-12 text-certigen-blue" />
        </div>
        <h1 className="text-5xl font-bold mb-4 font-montserrat text-certigen-dark">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
        <Button asChild size="lg">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
