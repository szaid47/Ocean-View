
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-sea-dark text-white">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 bg-sea-blue/40 backdrop-blur-sm rounded-lg border border-blue-800/30 max-w-md">
          <h1 className="text-5xl font-bold mb-4 text-blue-400">404</h1>
          <p className="text-xl text-gray-300 mb-6">Oops! This ocean path doesn't exist</p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Home size={18} />
              Return to Shore
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
