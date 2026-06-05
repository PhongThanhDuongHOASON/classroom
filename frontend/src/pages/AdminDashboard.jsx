import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import StatisticsCard from '../components/ui/StatisticsCard';
import { Users, FileText, MessageSquare, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Admin Console</h1>
        <p className="text-gray-500 mt-2">Manage users, posts, and view platform statistics.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatisticsCard title="Total Users" value="--" icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <StatisticsCard title="Total Posts" value="--" icon={FileText} colorClass="bg-indigo-100 text-indigo-600" />
        <StatisticsCard title="Total Comments" value="--" icon={MessageSquare} colorClass="bg-emerald-100 text-emerald-600" />
        <StatisticsCard title="Active Sessions" value="--" icon={Activity} colorClass="bg-purple-100 text-purple-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">User Management</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Users size={32} className="mx-auto mb-3 text-gray-400" />
          <p>User list and role modification APIs pending implementation.</p>
        </div>
      </div>
    </div>
  );
}