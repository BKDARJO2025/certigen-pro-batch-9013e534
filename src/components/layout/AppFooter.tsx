import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-8">
      <div className="container mx-auto flex justify-center items-center">
        <Link to="/" className="text-sm text-certigen-blue font-semibold hover:underline">
          &copy; {new Date().getFullYear()} CertiGen Pro
        </Link>
      </div>
    </footer>
  );
}
