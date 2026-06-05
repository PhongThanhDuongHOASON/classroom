import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  
  const linkClass = ({ isActive }) => 
    `flex items-center px-6 py-3 text-sm rounded-r-full font-medium mb-1 transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-[64px] pt-4 overflow-y-auto hidden md:block flex-shrink-0 shadow-sm z-20">
      <nav className="pr-4">
        <NavLink to="/dashboard" className={linkClass}>
          <Home size={20} className="mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <User size={20} className="mr-3" /> Profile
        </NavLink>
        {user?.role === 'Admin' && (
          <NavLink to="/admin" className={linkClass}>
            <Settings size={20} className="mr-3" /> Admin Dashboard
          </NavLink>
        )}
      </nav>
    </aside>
  );
}