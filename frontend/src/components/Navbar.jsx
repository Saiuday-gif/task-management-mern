import { useContext } from 'react';
import { LogOut, CheckSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
        <CheckSquare className="w-6 h-6" />
        <span>TaskFlow</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 font-medium">Hi, {user?.name}</span>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};