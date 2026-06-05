import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfileCard from '../components/ui/UserProfileCard';
import { Settings, ShieldCheck, KeyRound } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 w-full">
      
      {/* Abstract Background Banner to mimic Classroom settings header */}
      <div className="h-40 rounded-t-xl bg-gradient-to-r from-gray-700 to-gray-900 shadow-sm w-full relative z-0 mt-4 md:mt-0"></div>
      
      {/* Extracted card component lifted over the background banner */}
      <div className="-mt-16 relative">
        <UserProfileCard user={user} setUser={setUser} />
      </div>

      <div className="mt-8 mx-4 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4 text-gray-800">
            <Settings className="text-gray-500" />
            <h3 className="text-lg font-semibold">Account Preferences</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">Manage your account settings and profile details below.</p>
          <button disabled className="w-full py-2.5 bg-gray-50 text-gray-400 font-medium rounded-lg border border-gray-200 cursor-not-allowed">Edit Profile Details</button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4 text-gray-800">
            <KeyRound className="text-gray-500" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">Ensure your account is using a long, random password.</p>
          <button disabled className="w-full py-2.5 bg-gray-50 text-gray-400 font-medium rounded-lg border border-gray-200 cursor-not-allowed">Change Password</button>
        </div>
      </div>
    </div>
  );
}