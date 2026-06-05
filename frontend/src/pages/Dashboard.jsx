import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/ui/PostCard';
import CreatePostModal from '../components/ui/CreatePostModal';
import ToastNotification from '../components/ui/ToastNotification';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/posts');
      setPosts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSuccess = () => {
    setIsModalOpen(false);
    setToast({ type: 'success', message: 'Announcement posted successfully' });
    fetchPosts();
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
    setToast({ type: 'success', message: 'Post deleted successfully' });
  };

  const canPost = user?.role === 'Admin' || user?.role === 'Moderator' || user?.role === 'Member';

  return (
    <div className="max-w-[1000px] mx-auto py-6 px-4 md:px-6 w-full pb-20">
      
      {/* Classroom Banner */}
      <div className="h-48 md:h-64 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 mb-6 flex flex-col justify-end p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-white relative z-10 drop-shadow-sm">Welcome to Club Platform</h1>
        <p className="text-blue-100 mt-2 text-sm md:text-base relative z-10">Stay updated with the latest announcements</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Upcoming / Info */}
        <div className="w-full lg:w-48 shrink-0 flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-sm font-medium text-gray-800">Upcoming</h2>
            <p className="text-xs text-gray-500 mt-3 mb-2">Woohoo, no work due soon!</p>
            <a href="#" className="text-xs font-medium text-blue-600 hover:underline inline-block mt-2">View all</a>
          </div>
        </div>

        {/* Right Column - Feed */}
        <div className="flex-1 flex flex-col gap-6">
          {canPost && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setIsModalOpen(true)}>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.avatarUrl ? <img src={user?.avatarUrl} className="w-full h-full object-cover" alt="avatar" /> : <User size={20} />}
              </div>
              <div className="text-sm text-gray-500 font-medium group-hover:text-blue-600 transition-colors">
                Announce something to your class
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Loading stream...</div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4"><User size={32} /></div>
              <h3 className="text-lg font-medium text-gray-800">No posts yet</h3>
              <p className="text-sm text-gray-500 mt-1">When someone posts in this class, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handlePostSuccess} />
      {toast && <ToastNotification type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}