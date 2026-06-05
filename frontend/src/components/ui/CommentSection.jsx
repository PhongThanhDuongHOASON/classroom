import React, { useState } from 'react';
import api from '../../services/api';
import { Send, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CommentSection({ postId, comments: initialComments }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.post(`/comments`, { postId, content });
      if (res.data.success) {
        setComments([...comments, res.data.data.comment]);
        setContent('');
      }
    } catch (err) {
      console.error("Comment failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 pt-4">
      {comments.length > 0 && (
        <div className="space-y-4 mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{comments.length} class comment{comments.length !== 1 ? 's' : ''}</h4>
        {comments.map((c, idx) => (
            <div key={c.id || idx} className="flex gap-3 items-start group/comment">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                 {c.avatar_url ? <img src={c.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : <User size={16} className="text-gray-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm text-gray-800">{c.first_name} {c.last_name}</span>
                  <span className="text-[11px] text-gray-400">{new Date(c.created_at || Date.now()).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-sm text-gray-700 mt-0.5 leading-snug">{c.content}</p>
              </div>
          </div>
        ))}
      </div>
      )}
      
      <form onSubmit={handleComment} className="flex items-center gap-3 mt-4 pt-2 border-t border-gray-100">
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
           {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <User size={16} />}
        </div>
        <div className="flex-1 relative flex items-center">
          <input 
            type="text" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Add class comment..." 
            className="w-full bg-white border border-gray-300 rounded-full pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" 
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            disabled={!content.trim() || isSubmitting}
            className="absolute right-2 p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors bg-white"
          >
            <Send size={18} className={content.trim() ? "text-blue-600" : ""} />
          </button>
        </div>
      </form>
    </div>
  );
}