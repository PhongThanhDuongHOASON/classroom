import React from 'react';
import { LogOut, Menu, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between sticky top-0 z-30 shadow-sm h-16">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600 hidden md:block">
          <Menu size={24} />
        </button>
        <div className="flex items-center text-gray-700 font-medium text-xl gap-2 tracking-tight">
          <img src="/vite.svg" alt="Logo" className="w-8 h-8" /> Club Classroom
        </div>
      </div>
      <div className="flex items-center">
        <span className="hidden sm:block text-sm font-medium text-gray-600 mr-4">Hi, {user?.firstName}</span>
        <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600" title="Sign out">
          {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200 object-cover" /> : <UserCircle size={28} className="text-gray-500" />}
        </button>
      </div>
    </nav>
  );
}