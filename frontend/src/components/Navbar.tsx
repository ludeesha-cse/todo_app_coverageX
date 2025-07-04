import { useAuth } from "../services/auth";


const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl">Todo App</h1>
        <span>{user?.name || 'Guest'}</span>
      </div>
    </nav>
  );
};

export default Navbar;