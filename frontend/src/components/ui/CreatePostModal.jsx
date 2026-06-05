import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import api from '../../services/api';
import FileUploader from './FileUploader';
import ToastNotification from './ToastNotification';
import { useAuth } from '../../context/AuthContext';

export default function CreatePostModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    files.forEach(file => formData.append('files', file));

    try {
      await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTitle('');
      setContent('');
      setFiles([]);
      onSuccess();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to create post' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">Announce something to your class</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition rounded-full p-1 hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden p-6">
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-t-md border-b-gray-300 focus:outline-none focus:border-b-blue-600 focus:bg-gray-100 transition-colors font-medium text-gray-800" />
            
            <textarea placeholder="Write your announcement..." value={content} onChange={e => setContent(e.target.value)} required
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-t-md border-b-gray-300 focus:outline-none focus:border-b-blue-600 focus:bg-gray-100 transition-colors resize-none h-32 text-gray-700" />
            
            <div className="pt-2">
              <FileUploader files={files} setFiles={setFiles} />
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition mr-2">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !title || !content} className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium text-sm disabled:opacity-50 transition shadow-sm">
              {isSubmitting ? 'Posting...' : <><Send size={16} className="mr-2" /> Post</>}
            </button>
          </div>
        </form>
      </div>
      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}