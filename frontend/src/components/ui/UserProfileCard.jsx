import React, { useRef, useState } from 'react';
import { User, Upload, Mail, Shield } from 'lucide-react';
import api from '../../services/api';
import ToastNotification from './ToastNotification';

export default function UserProfileCard({ user, setUser }) {
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.put('/users/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const updatedUser = { ...user, avatarUrl: res.data.data.avatarUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setToast({ type: 'success', message: 'Avatar updated successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to upload avatar' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row items-center md:items-start p-8 gap-8 relative z-10 mx-4 md:mx-0">
      <div className="relative w-32 h-32 group flex-shrink-0">
        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden shadow-inner ring-4 ring-white">
          {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <User size={64} />}
        </div>
        <button onClick={() => fileInputRef.current.click()} disabled={isUploading} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 shadow-md transition-transform hover:scale-105 disabled:opacity-50">
          <Upload size={16} />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
      </div>
      <div className="flex flex-col text-center md:text-left flex-1 w-full mt-2">
        <h2 className="text-3xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mt-4 text-gray-600">
          <span className="flex items-center text-sm bg-gray-100 px-3 py-1.5 rounded-md"><Mail size={16} className="mr-2 text-gray-500" /> {user?.email}</span>
          <span className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-medium border border-blue-100"><Shield size={16} className="mr-2 text-blue-600" /> {user?.role} Role</span>
        </div>
      </div>
      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}