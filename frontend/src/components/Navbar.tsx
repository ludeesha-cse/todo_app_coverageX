import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          Todo App
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-300">Hello, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-x-2">
              <Link
                to="/signin"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
