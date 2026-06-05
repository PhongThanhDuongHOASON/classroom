import React from 'react';
import { User, FileText, Trash2, MoreVertical } from 'lucide-react';
import CommentSection from './CommentSection';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const canDelete = user?.id === post.user_id || user?.role === 'Admin' || user?.role === 'Moderator';

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${post.id}`);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-0 border border-gray-200 overflow-hidden group">
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
            {post.avatar_url ? <img src={post.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : <User size={20} />}
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-800 tracking-tight">{post.first_name} {post.last_name}</h3>
            <p className="text-xs text-gray-500 font-medium">{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex items-center">
          {canDelete && (
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-gray-100 mr-1 opacity-0 group-hover:opacity-100" title="Delete post">
              <Trash2 size={18} />
            </button>
          )}
          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      <div className="px-5">
        <h4 className="font-semibold text-gray-800 mb-1">{post.title}</h4>
        <div className="mb-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</div>
        
        {post.attachments && post.attachments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {post.attachments.map(att => (
              <a key={att.id} href={att.file_url} target="_blank" rel="noreferrer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group/att">
                <div className="w-10 h-10 rounded bg-red-50 text-red-500 flex items-center justify-center mr-3 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-sm text-gray-800 font-medium truncate group-hover/att:text-blue-600 transition-colors">{att.file_name}</span>
                  <span className="block text-xs text-gray-500 uppercase mt-0.5">{(att.file_size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50/50">
        <CommentSection postId={post.id} comments={post.comments} />
      </div>
    </div>
  );
}